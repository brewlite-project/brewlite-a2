"""Build the SCRUM-105 UML sources and vector exports without a network service.

Install reportlab, then run: python docs/diagrams/render_domain.py
The declarations below are the canonical source. The .drawio export is editable;
changes made there must be ported back here before regenerating the exports.
"""

from __future__ import annotations

from dataclasses import dataclass
from html import escape
from pathlib import Path
import xml.etree.ElementTree as ET

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A3, landscape
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen.canvas import Canvas


OUT = Path(__file__).resolve().parent
WIDTH, HEIGHT = 1600, 1160
INK, MUTED, ACCENT, LINE = "#182B3A", "#455B6B", "#EAF2F7", "#536C7E"
PURPLE = "#F2ECFA"


@dataclass
class Box:
    name: str
    kind: str
    x: int
    y: int
    w: int
    attributes: list[str]
    note: str = ""

    @property
    def h(self):
        return 67 + len(self.attributes) * 24 + (27 if self.note else 0)


@dataclass
class Edge:
    source: str
    target: str
    points: list[tuple[int, int]]
    labels: list[tuple[str, int, int]]
    composition: bool = False
    derived: bool = False


CORE = [
    Box("Promotion", "entity / implemented as Coupon", 30, 85, 450, [
        "id: UUID", "code: String", "type: CouponType", "value: Integer",
        "minSubtotalVnd: MoneyVnd", "maxDiscountVnd: MoneyVnd [0..1]",
        "startsAt, expiresAt: DateTime", "usageLimit, perUserLimit: Integer",
        "activeUsageCount: Integer",
    ]),
    Box("User", "entity", 570, 85, 430, [
        "id: UUID", "email: String", "fullName: String [0..1]", "loyaltyPoints: Integer",
    ]),
    Box("LoyaltyTransaction", "derived concept / no separate ledger", 1110, 85, 460, [
        "/points: Integer", "/occurredAt: DateTime",
    ], "From Order.pointsEarned and paidAt"),
    Box("CouponRedemption", "entity / coupon reservation", 30, 530, 450, [
        "status: RedemptionStatus", "heldAt: DateTime",
        "consumedAt: DateTime [0..1]", "releasedAt: DateTime [0..1]",
    ]),
    Box("Order", "entity / checkout aggregate", 570, 365, 430, [
        "id: UUID", "status: OrderStatus", "subtotalVnd: MoneyVnd",
        "discountVnd: MoneyVnd", "totalVnd: MoneyVnd", "pointsEarned: Integer",
        "couponCodeSnapshot: String [0..1]", "createdAt, expiresAt: DateTime",
        "paidAt: DateTime [0..1]", "cancelledAt: DateTime [0..1]",
    ]),
    Box("Payment", "entity / one payment attempt", 1110, 365, 460, [
        "id: UUID", "amountVnd: MoneyVnd", "status: PaymentStatus",
        "provider: PaymentProvider", "method: PaymentMethod [0..1]",
        "reconciliationState:", "  PaymentReconciliationState",
        "hasFinancialException: Boolean", "createdAt: DateTime",
    ]),
    Box("Product", "entity / current catalog", 30, 835, 450, [
        "id: UUID", "name: String", "basePriceVnd: MoneyVnd",
        "stock: Integer", "sizePolicy: ProductSizePolicy",
    ]),
    Box("OrderItem", "owned entity / immutable price snapshot", 570, 805, 430, [
        "productNameSnapshot: String", "size: DrinkSize",
        "sizePercentSnapshot: Integer", "basePriceSnapshotVnd: MoneyVnd",
        "unitPriceVnd: MoneyVnd", "quantity: Integer", "lineTotalVnd: MoneyVnd",
        "toppings: ToppingSnapshot [0..3]",
    ]),
    Box("PaymentGatewayEvent", "entity / verified gateway evidence", 1110, 805, 460, [
        "source: PaymentGatewaySource", "outcome: PaymentGatewayOutcome",
        "disposition: PaymentGatewayDisposition", "amountVnd: MoneyVnd [0..1]",
        "gatewayPaidAt: DateTime [0..1]", "verifiedAt: DateTime",
    ]),
]

EDGES = [
    Edge("User", "Order", [(785, 248), (785, 365)],
         [("1", 800, 270), ("places", 800, 305), ("0..*", 800, 350)]),
    Edge("User", "LoyaltyTransaction", [(1000, 155), (1110, 155)],
         [("1", 1010, 143), ("/earns", 1020, 184), ("0..*", 1065, 143)], derived=True),
    Edge("Order", "LoyaltyTransaction", [(1000, 390), (1045, 390), (1045, 285), (1340, 285), (1340, 227)],
         [("1", 1010, 415), ("/award", 1160, 274), ("0..1", 1352, 256)], derived=True),
    Edge("Promotion", "Order", [(480, 230), (520, 230), (520, 435), (570, 435)],
         [("0..1", 488, 218), ("applied", 528, 310), ("0..*", 525, 460)]),
    Edge("Promotion", "CouponRedemption", [(255, 368), (255, 530)],
         [("1", 268, 393), ("reserves", 268, 452), ("0..*", 268, 514)]),
    Edge("Order", "CouponRedemption", [(570, 625), (480, 625)],
         [("1", 548, 609), ("0..1", 487, 609), ("holds", 495, 651)]),
    Edge("Order", "Payment", [(1000, 530), (1110, 530)],
         [("1", 1010, 515), ("0..*", 1066, 515), ("attempts", 1010, 558)]),
    Edge("Order", "OrderItem", [(785, 672), (785, 805)],
         [("1", 800, 700), ("contains", 800, 744), ("1..20", 800, 790)], composition=True),
    Edge("Product", "OrderItem", [(480, 945), (570, 945)],
         [("1", 488, 930), ("0..*", 526, 930), ("ordered as", 483, 976)]),
    Edge("Payment", "PaymentGatewayEvent", [(1340, 648), (1340, 805)],
         [("1", 1354, 676), ("observations", 1354, 726), ("0..*", 1354, 790)]),
]

ENUMS = {
    "OrderStatus": ["PENDING", "PAYMENT_FAILED", "PAID", "PREPARING", "READY", "COMPLETED", "CANCELLED"],
    "PaymentStatus": ["PENDING", "SUCCESS", "FAILED"],
    "PaymentProvider": ["MOCK", "VNPAY", "ZERO_AMOUNT"],
    "PaymentReconciliationState": ["NONE", "SCHEDULED", "RESOLVED", "REQUIRES_REVIEW"],
    "PaymentGatewayDisposition": ["OBSERVED", "FINALIZED", "DUPLICATE", "CONFLICT", "FINANCIAL_EXCEPTION"],
    "RedemptionStatus": ["HELD", "CONSUMED", "RELEASED"],
    "CouponType": ["PERCENT", "FIXED"],
    "PaymentMethod": ["CARD", "WALLET"],
    "DrinkSize": ["S", "M", "L", "ONE_SIZE"],
    "ProductSizePolicy": ["STANDARD", "ONE_SIZE"],
    "PaymentGatewaySource": ["IPN", "QUERYDR"],
    "PaymentGatewayOutcome": ["UNKNOWN", "SUCCESS", "FAILED"],
}
TYPES = []
for i, (name, values) in enumerate(ENUMS.items()):
    row, col = divmod(i, 4)
    TYPES.append(Box(name, "enumeration", 30 + col * 395, 85 + row * 295, 365, values))
TYPES.append(Box("ToppingSnapshot", "value object / order-time values", 30, 970, 570, [
    "code: String", "name: String", "priceVnd: MoneyVnd",
]))
TYPE_HEIGHT = 1230


class Drawing:
    """Small shared drawing surface: the SVG and PDF use identical geometry."""

    def __init__(self, canvas, height):
        self.pdf, self.height = canvas, height
        self.svg = ET.Element("svg", {"xmlns": "http://www.w3.org/2000/svg", "width": str(WIDTH),
            "height": str(height), "viewBox": f"0 0 {WIDTH} {height}", "role": "img"})
        ET.SubElement(self.svg, "title").text = "BrewLite domain class diagram - SCRUM-105"
        ET.SubElement(self.svg, "desc").text = "UML classes, typed attributes and relationship multiplicities. See README.md for source mapping and limitations."
        self.rect(0, 0, WIDTH, height, "#FFFFFF", "#FFFFFF")

    def rect(self, x, y, w, h, fill, stroke=LINE):
        ET.SubElement(self.svg, "rect", {"x": str(x), "y": str(y), "width": str(w), "height": str(h),
            "fill": fill, "stroke": stroke, "stroke-width": "1.4"})
        self.pdf.setFillColor(HexColor(fill))
        self.pdf.setStrokeColor(HexColor(stroke))
        self.pdf.setLineWidth(1.4)
        self.pdf.rect(x, self.height - y - h, w, h, fill=1, stroke=1)

    def text(self, content, x, y, size=17, bold=False, color=INK, background=False):
        font = "Helvetica-Bold" if bold else "Helvetica"
        width = stringWidth(content, font, size)
        if background:
            self.rect(x - 3, y - size, width + 6, size + 5, "#FFFFFF", "#FFFFFF")
        attrs = {"x": str(x), "y": str(y), "font-family": "Arial, Helvetica, sans-serif",
            "font-size": str(size), "fill": color}
        if bold:
            attrs["font-weight"] = "bold"
        ET.SubElement(self.svg, "text", attrs).text = content
        self.pdf.setFont(font, size)
        self.pdf.setFillColor(HexColor(color))
        self.pdf.drawString(x, self.height - y, content)

    def line(self, points, dashed=False):
        ET.SubElement(self.svg, "polyline", {"points": " ".join(f"{x},{y}" for x, y in points),
            "fill": "none", "stroke": LINE, "stroke-width": "1.8",
            **({"stroke-dasharray": "7 5"} if dashed else {})})
        self.pdf.setStrokeColor(HexColor(LINE))
        self.pdf.setLineWidth(1.8)
        self.pdf.setDash([7, 5] if dashed else [])
        p = self.pdf.beginPath()
        p.moveTo(points[0][0], self.height - points[0][1])
        for x, y in points[1:]:
            p.lineTo(x, self.height - y)
        self.pdf.drawPath(p)
        self.pdf.setDash([])

    def diamond(self, x, y):
        pts = [(x, y), (x - 7, y + 11), (x, y + 22), (x + 7, y + 11)]
        ET.SubElement(self.svg, "polygon", {"points": " ".join(f"{a},{b}" for a, b in pts), "fill": INK})
        self.pdf.setFillColor(HexColor(INK))
        p = self.pdf.beginPath()
        p.moveTo(x, self.height - y)
        for a, b in pts[1:]:
            p.lineTo(a, self.height - b)
        p.close()
        self.pdf.drawPath(p, fill=1, stroke=0)

    def box(self, b):
        fill = PURPLE if "derived" in b.kind else ACCENT
        self.rect(b.x, b.y, b.w, b.h, "#FFFFFF")
        self.rect(b.x, b.y, b.w, 58, fill)
        # Fit long enum names without changing their spelling.
        size = 20
        while stringWidth(b.name, "Helvetica-Bold", size) > b.w - 24:
            size -= 1
        self.text(f"<<{b.kind}>>", b.x + 12, b.y + 20, 14, color=MUTED)
        self.text(b.name, b.x + 12, b.y + 45, size, bold=True)
        for i, attr in enumerate(b.attributes):
            assert stringWidth(attr, "Helvetica", 17) <= b.w - 24, (b.name, attr)
            self.text(attr, b.x + 12, b.y + 82 + i * 24)
        if b.note:
            self.text(b.note, b.x + 12, b.y + b.h - 12, 15, color=MUTED)


def drawio_page(root, title, boxes, edges, height, notes):
    diagram = ET.SubElement(root, "diagram", {"name": title, "id": title.replace(" ", "-")})
    model = ET.SubElement(diagram, "mxGraphModel", {"dx": str(WIDTH), "dy": str(height), "grid": "1",
        "gridSize": "10", "page": "1", "pageWidth": str(WIDTH), "pageHeight": str(height), "math": "0"})
    graph = ET.SubElement(model, "root")
    ET.SubElement(graph, "mxCell", {"id": "0"})
    ET.SubElement(graph, "mxCell", {"id": "1", "parent": "0"})

    def label(ident, value, x, y, w=240, h=25, size=17, bold=False):
        cell = ET.SubElement(graph, "mxCell", {"id": ident, "value": value, "vertex": "1", "parent": "1",
            "style": f"text;html=1;align=left;verticalAlign=middle;whiteSpace=wrap;overflow=hidden;fontFamily=Arial;fontSize={size};fontStyle={1 if bold else 0};fontColor={INK};fillColor=#FFFFFF;"})
        ET.SubElement(cell, "mxGeometry", {"x": str(x), "y": str(y - size), "width": str(w), "height": str(h), "as": "geometry"})

    label("title", title, 30, 38, 1400, 35, 26, True)
    label("subtitle", "BrewLite | SCRUM-105 / A2-T2.3 | A1-final | DRAFT - pending review", 30, 64, 1400, 25, 15)
    for b in boxes:
        fill = PURPLE if "derived" in b.kind else ACCENT
        body = "".join(f"<div>{escape(a)}</div>" for a in b.attributes)
        value = (f'<div style="font-size:14px;color:{MUTED}">&lt;&lt;{escape(b.kind)}&gt;&gt;</div>'
                 f'<div style="font-size:20px;font-weight:bold">{b.name}</div><hr>{body}')
        if b.note:
            value += f'<div style="font-size:15px;color:{MUTED}">{escape(b.note)}</div>'
        cell = ET.SubElement(graph, "mxCell", {"id": b.name, "value": value, "vertex": "1", "parent": "1",
            "style": f"rounded=0;html=1;whiteSpace=wrap;align=left;verticalAlign=top;spacing=12;fontFamily=Arial;fontSize=17;fillColor={fill};strokeColor={LINE};"})
        ET.SubElement(cell, "mxGeometry", {"x": str(b.x), "y": str(b.y), "width": str(b.w), "height": str(b.h), "as": "geometry"})
    by_name = {b.name: b for b in boxes}
    for i, e in enumerate(edges):
        a, b = by_name[e.source], by_name[e.target]
        sx, sy = e.points[0]
        tx, ty = e.points[-1]
        style = (f"edgeStyle=none;html=1;rounded=0;endArrow=none;strokeColor={LINE};strokeWidth=1.8;"
                 f"exitX={(sx-a.x)/a.w};exitY={(sy-a.y)/a.h};exitPerimeter=0;"
                 f"entryX={(tx-b.x)/b.w};entryY={(ty-b.y)/b.h};entryPerimeter=0;")
        if e.composition:
            style += "startArrow=diamond;startFill=1;startSize=14;"
        if e.derived:
            style += "dashed=1;"
        cell = ET.SubElement(graph, "mxCell", {"id": f"edge-{i}", "edge": "1", "parent": "1",
            "source": e.source, "target": e.target, "style": style})
        geo = ET.SubElement(cell, "mxGeometry", {"relative": "1", "as": "geometry"})
        if len(e.points) > 2:
            points = ET.SubElement(geo, "Array", {"as": "points"})
            for x, y in e.points[1:-1]:
                ET.SubElement(points, "mxPoint", {"x": str(x), "y": str(y)})
        for j, (value, x, y) in enumerate(e.labels):
            label(f"edge-{i}-label-{j}", value, x, y, max(40, int(stringWidth(value, "Helvetica", 17)) + 10))
    for i, (content, x, y, size) in enumerate(notes):
        label(f"note-{i}", content, x, y, 1500, 27, size)


CORE_NOTES = [
    ("UML: filled diamond = composition; dashed /association and /attribute = derived, not persisted separately.", 30, 1090, 16),
    ("MoneyVnd = non-negative integer VND. Multiplicities describe all history; guards limit active orders and accepted payments.", 30, 1112, 15),
]
TYPE_NOTES = [
    ("OrderItem owns 0..3 ToppingSnapshot values; names and prices remain unchanged after checkout.", 640, 1000, 17),
    ("Snapshot mapping: toppingCodeSnapshot, toppingNameSnapshot, toppingPriceSnapshotVnd.", 640, 1030, 17),
    ("MoneyVnd = integer VND (BigInt internally); DateTime = timezone-aware instant; [0..1] = optional.", 30, 1135, 17),
    ("GRACE is a time window. EXPIRED is a failure reason. Neither is an OrderStatus or PaymentStatus.", 30, 1160, 17),
    ("Payment resolution is derived presentation data; REQUIRES_REVIEW belongs to reconciliation, not PaymentStatus.", 30, 1185, 16),
]


def render():
    pdf_path = OUT / "brewlite-domain-class.pdf"
    # ReportLab's invariant mode removes timestamps/random IDs for reproducible output.
    page_width, page_height = landscape(A3)
    pdf = Canvas(str(pdf_path), pagesize=(page_width, page_height), invariant=1, pageCompression=1)
    pdf.setTitle("BrewLite domain class diagram - SCRUM-105")
    pdf.setAuthor("BrewLite project")
    root = ET.Element("mxfile", {"host": "app.diagrams.net", "version": "24.7.17", "type": "device"})
    for title, boxes, edges, height, stem, notes in [
        ("Domain class diagram", CORE, EDGES, HEIGHT, "brewlite-domain-class", CORE_NOTES),
        ("Domain types and enums", TYPES, [], TYPE_HEIGHT, "brewlite-domain-types", TYPE_NOTES),
    ]:
        pdf.saveState()
        scale = min(page_width / WIDTH, page_height / height)
        pdf.translate((page_width - WIDTH * scale) / 2, (page_height - height * scale) / 2)
        pdf.scale(scale, scale)
        drawing = Drawing(pdf, height)
        drawing.text(title, 30, 38, 26, bold=True)
        drawing.text("BrewLite | SCRUM-105 / A2-T2.3 | A1-final | DRAFT - pending review", 30, 64, 15, color=MUTED)
        for e in edges:
            drawing.line(e.points, e.derived)
        for b in boxes:
            drawing.box(b)
        for e in edges:
            if e.composition:
                drawing.diamond(*e.points[0])
            for content, x, y in e.labels:
                drawing.text(content, x, y, 17, background=True)
        for content, x, y, size in notes:
            drawing.text(content, x, y, size, color=MUTED)
        ET.indent(drawing.svg)
        ET.ElementTree(drawing.svg).write(OUT / f"{stem}.svg", encoding="utf-8", xml_declaration=True)
        drawio_page(root, title, boxes, edges, height, notes)
        pdf.restoreState()
        pdf.showPage()
    pdf.save()
    ET.indent(root)
    ET.ElementTree(root).write(OUT / "brewlite-domain-class.drawio", encoding="utf-8", xml_declaration=True)
    print("Generated editable drawio, two SVG sheets and a two-page vector PDF.")


if __name__ == "__main__":
    render()
