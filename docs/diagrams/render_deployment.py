"""Export the deployment .drawio source to vector SVG/PDF.

The source deliberately uses plain mxGraph rectangles, text and orthogonal
edges. Fail on unsupported shapes rather than silently producing a bad export.
Requires reportlab; --preview additionally requires PyMuPDF.
"""

from __future__ import annotations

import argparse
from html import escape
from io import BytesIO
import math
from pathlib import Path
import xml.etree.ElementTree as ET

from reportlab.lib.colors import HexColor
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen.canvas import Canvas


HERE = Path(__file__).resolve().parent
SOURCE = HERE / "brewlite-deployment.drawio"
STEM = "brewlite-deployment"


def style_of(cell: ET.Element) -> dict[str, str]:
    parts = (part.partition("=") for part in cell.get("style", "").split(";") if part)
    return {key: value for key, _, value in parts}


def export(source: Path) -> tuple[bytes, bytes]:
    root = ET.parse(source).getroot()
    diagrams = root.findall("diagram")
    if len(diagrams) != 1:
        raise ValueError("Expected exactly one uncompressed draw.io page")
    model = diagrams[0].find("mxGraphModel")
    if model is None:
        raise ValueError("Save the source as uncompressed draw.io XML")
    width, height = (float(model.get(key, "0")) for key in ("pageWidth", "pageHeight"))
    cells = model.findall("./root/mxCell")
    by_id = {cell.get("id"): cell for cell in cells}
    svg = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width:g}" height="{height:g}" '
        f'viewBox="0 0 {width:g} {height:g}" role="img" aria-labelledby="title desc">',
        '<title id="title">BrewLite target deployment: Vercel and Render</title>',
        '<desc id="desc">Target design, not verified live. Next.js on Vercel proxies HTTPS '
        'to NestJS on Render. PostgreSQL uses private TCP. VNPay Return uses the browser; '
        'IPN calls the backend directly. Local and CI are isolated from the production target. '
        'Planned builds use Vercel prebuilt upload and Render Docker build with its managed '
        'private image registry, without a separate BrewLite registry.</desc>',
        f'<rect width="{width:g}" height="{height:g}" fill="#ffffff"/>',
    ]
    # A3 landscape, with a uniform scale so PDF and SVG have the same geometry.
    page_w, page_h = 1190.551181, 841.889764
    scale = min(page_w / width, page_h / height)
    margin_x, margin_y = (page_w - width * scale) / 2, (page_h - height * scale) / 2
    output = BytesIO()
    pdf = Canvas(output, pagesize=(page_w, page_h), invariant=1, pageCompression=1)
    pdf.setTitle("BrewLite - Target Deployment Diagram - A2-T3.2")
    pdf.setAuthor("BrewLite")
    pdf.setSubject("Target design; live deployment verification pending")
    pdf.translate(margin_x, margin_y)
    pdf.scale(scale, scale)

    def box(cell: ET.Element) -> tuple[float, float, float, float]:
        geometry = cell.find("mxGeometry")
        if geometry is None:
            raise ValueError(f"Missing geometry: {cell.get('id')}")
        values = tuple(float(geometry.get(key, "0")) for key in ("x", "y", "width", "height"))
        x, y, w, h = values
        if min(x, y, w, h) < 0 or x + w > width or y + h > height:
            raise ValueError(f"Out-of-page geometry: {cell.get('id')}")
        return values

    def stroke_settings(style: dict[str, str]) -> tuple[str, float, bool]:
        color = style.get("strokeColor", "#64748b")
        line_width = float(style.get("strokeWidth", "1.5"))
        dashed = style.get("dashed") == "1"
        pdf.setLineWidth(line_width)
        pdf.setDash([8, 5] if dashed else [])
        if color != "none":
            pdf.setStrokeColor(HexColor(color))
        return color, line_width, dashed

    for cell in cells:
        if cell.get("vertex") != "1":
            continue
        style = style_of(cell)
        if style.get("shape", "rectangle") not in {"rectangle", "text"} or style.get("html", "0") != "0":
            raise ValueError(f"Unsupported shape or HTML: {cell.get('id')}")
        x, y, w, h = box(cell)
        color, line_width, dashed = stroke_settings(style)
        fill = style.get("fillColor", "none")
        dash_attr = ' stroke-dasharray="8 5"' if dashed else ""
        svg.append(f'<g id="{escape(cell.get("id", ""))}">')
        if fill != "none" or color != "none":
            svg.append(f'<rect x="{x:g}" y="{y:g}" width="{w:g}" height="{h:g}" '
                       f'fill="{fill}" stroke="{color}" stroke-width="{line_width:g}"{dash_attr}/>')
            if fill != "none":
                pdf.setFillColor(HexColor(fill))
            pdf.rect(x, height - y - h, w, h, stroke=int(color != "none"), fill=int(fill != "none"))
        text = cell.get("value", "")
        font_size = float(style.get("fontSize", "17"))
        bold = int(style.get("fontStyle", "0")) & 1
        font = "Helvetica-Bold" if bold else "Helvetica"
        text_color = style.get("fontColor", "#15253b")
        spacing = float(style.get("spacing", "10"))
        lines = text.splitlines()
        leading = font_size * 1.25
        if lines and len(lines) * leading > h - 2 * spacing + 0.1:
            raise ValueError(f"Text too tall: {cell.get('id')}")
        pdf.setFont(font, font_size)
        pdf.setFillColor(HexColor(text_color))
        for index, line in enumerate(lines):
            line_w = stringWidth(line, font, font_size)
            if line_w > w - 2 * spacing + 0.1:
                raise ValueError(f"Text too wide: {cell.get('id')}: {line}")
            tx = x + (w - line_w) / 2 if style.get("align") == "center" else x + spacing
            ty = y + spacing + font_size + leading * index
            svg.append(f'<text x="{tx:g}" y="{ty:g}" font-family="Helvetica,Arial,sans-serif" '
                       f'font-size="{font_size:g}" font-weight="{"bold" if bold else "normal"}" '
                       f'fill="{text_color}">{escape(line)}</text>')
            pdf.drawString(tx, height - ty, line)
        svg.append("</g>")

    # All endpoints are anchored to source/target node coordinates. Edge labels
    # are separate text cells, so diagrams.net and the exports share the layout.
    for cell in cells:
        if cell.get("edge") != "1":
            continue
        style = style_of(cell)
        points = []
        for role, anchor in (("source", "exit"), ("target", "entry")):
            target = by_id.get(cell.get(role))
            if target is None:
                raise ValueError(f"Missing edge {role}: {cell.get('id')}")
            x, y, w, h = box(target)
            points.append((x + w * float(style.get(anchor + "X", "0.5")),
                           y + h * float(style.get(anchor + "Y", "0.5"))))
        waypoints = [(float(p.get("x", "0")), float(p.get("y", "0")))
                     for p in cell.findall('./mxGeometry/Array[@as="points"]/mxPoint')]
        points[1:1] = waypoints
        if any(not (0 <= x <= width and 0 <= y <= height) for x, y in points):
            raise ValueError(f"Out-of-page edge: {cell.get('id')}")
        if any(x1 != x2 and y1 != y2 for (x1, y1), (x2, y2) in zip(points, points[1:])):
            raise ValueError(f"Expected orthogonal edge: {cell.get('id')}")
        color, line_width, dashed = stroke_settings(style)
        coord = " ".join(f"{x:g},{y:g}" for x, y in points)
        svg.append(f'<g id="{escape(cell.get("id", ""))}">')
        # White halo distinguishes crossings from junctions.
        svg.append(f'<polyline points="{coord}" fill="none" stroke="#ffffff" stroke-width="6"/>')
        dash_attr = ' stroke-dasharray="8 5"' if dashed else ""
        svg.append(f'<polyline points="{coord}" fill="none" stroke="{color}" '
                   f'stroke-width="{line_width:g}"{dash_attr}/>')
        for halo in (True, False):
            pdf.setDash([] if halo or not dashed else [8, 5])
            pdf.setStrokeColor(HexColor("#ffffff" if halo else color))
            pdf.setLineWidth(6 if halo else line_width)
            path = pdf.beginPath()
            path.moveTo(points[0][0], height - points[0][1])
            for px, py in points[1:]:
                path.lineTo(px, height - py)
            pdf.drawPath(path)
        for key, tip, previous in (("endArrow", points[-1], points[-2]),
                                   ("startArrow", points[0], points[1])):
            if style.get(key, "none") == "none":
                continue
            angle = math.atan2(tip[1] - previous[1], tip[0] - previous[0])
            back = (tip[0] - 10 * math.cos(angle), tip[1] - 10 * math.sin(angle))
            triangle = [tip, (back[0] + 4 * math.sin(angle), back[1] - 4 * math.cos(angle)),
                        (back[0] - 4 * math.sin(angle), back[1] + 4 * math.cos(angle))]
            coords = " ".join(f"{x:g},{y:g}" for x, y in triangle)
            svg.append(f'<polygon points="{coords}" fill="{color}"/>')
            pdf.setFillColor(HexColor(color))
            arrow = pdf.beginPath()
            arrow.moveTo(triangle[0][0], height - triangle[0][1])
            for px, py in triangle[1:]:
                arrow.lineTo(px, height - py)
            arrow.close()
            pdf.drawPath(arrow, stroke=0, fill=1)
        svg.append("</g>")
    svg.append("</svg>\n")
    pdf.showPage()
    pdf.save()
    return "\n".join(svg).encode("utf-8"), output.getvalue()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Check committed exports without overwriting them")
    parser.add_argument("--preview", type=Path, help="Render PDF to this temporary PNG (requires PyMuPDF)")
    args = parser.parse_args()
    svg, pdf = export(SOURCE)
    for suffix, data in (("svg", svg), ("pdf", pdf)):
        path = HERE / f"{STEM}.{suffix}"
        if args.check:
            if not path.exists() or path.read_bytes() != data:
                raise SystemExit(f"Stale export: {path}. Regenerate with this ReportLab version.")
            print(f"OK: {path.name}")
        else:
            path.write_bytes(data)
            print(f"Exported: {path.name}")
    if args.preview:
        import pymupdf

        args.preview.parent.mkdir(parents=True, exist_ok=True)
        with pymupdf.open(stream=pdf, filetype="pdf") as document:
            page = document[0]
            if len(document) != 1 or not page.get_text().strip():
                raise SystemExit("Expected one PDF page with selectable text")
            page.get_pixmap(matrix=pymupdf.Matrix(1.5, 1.5)).save(args.preview)
            print(f"Preview: {args.preview}")


if __name__ == "__main__":
    main()
