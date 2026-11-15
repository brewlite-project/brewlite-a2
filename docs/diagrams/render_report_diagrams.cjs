// Reproduce report-only vector layouts. No network, database access or dependencies.
// Run from any directory: node docs/diagrams/render_report_diagrams.cjs
// Convert the generated SVGs with MuPDF; see docs/diagrams/README.md.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const write=(p,s)=>fs.writeFileSync(path.join(root,p),s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
// Report presentation copies: keep canonical reviewed domain assets unchanged.
// Only the internal draft/review banner is replaced, no classes or relations.
for(const [source,target] of [
  ['docs/diagrams/brewlite-domain-class.svg','docs/report/assets/domain-class-report.svg'],
  ['docs/diagrams/brewlite-domain-types.svg','docs/report/assets/domain-types-report.svg']]){
  const sourceText=read(source),banner='BrewLite | SCRUM-105 / A2-T2.3 | A1-final | DRAFT - pending review';
  if(!sourceText.includes(banner))throw Error('Review domain source banner before export');
  write(target,sourceText.replace(banner,'BrewLite — Mô hình miền và kiểu dữ liệu'));
}
const text=(x,y,s,size=22,weight='normal',anchor='start',color='#20354a')=>`<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" fill="${color}">${esc(s)}</text>`;
const svg=(w,h,body,description)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><title>BrewLite report diagram</title><desc>${esc(description)}</desc><rect width="100%" height="100%" fill="white"/>${body}</svg>\n`;
// Same 4 actors, 14 UC and 17 associations as the canonical PlantUML.
const ucSource=read('docs/requirements/diagrams/use-case-overview.puml');
const cases=[...ucSource.matchAll(/usecase "([^"\n]+)" as (U\d+)/g)].map(m=>({alias:m[2],lines:m[1].split('\\n')}));
const actors=[...ucSource.matchAll(/^actor "([^"]+)" as (\w+)/gm)].map(m=>({name:m[1],alias:m[2]}));
const associations=[...ucSource.matchAll(/^(\w+) -- (U\d+)$/gm)].map(m=>({actor:m[1],uc:m[2]}));
if(cases.length!==14||actors.length!==4||associations.length!==17)throw Error('UC source changed: review layout first');
let u=text(1000,33,'BrewLite — Use Case Diagram tổng quát',29,'bold','middle');
u+=`<rect x="350" y="70" width="1300" height="840" rx="12" fill="#f8fafc" stroke="#52677c" stroke-width="2"/>`;
u+=text(1000,103,'Ranh giới hệ thống BrewLite — mô hình yêu cầu',23,'normal','middle');
const pos=new Map(cases.map((r,i)=>[r.alias,{x:i<7?650:1320,y:155+(i%7)*112}]));
for(const r of associations){const q=pos.get(r.uc);let d;if(r.actor==='Guest')d=`M185 260 L410 ${q.y}`;else if(r.actor==='Customer')d=q.x===650?`M185 700 L410 ${q.y}`:`M190 700 H345 V550 H1000 V${q.y} H1080`;else if(r.actor==='Demo')d=`M1805 491 L1560 ${q.y}`;else d=`M1805 690 L1560 ${q.y}`;u+=`<path d="${d}" fill="none" stroke="#52677c" stroke-width="2"/>`;}
for(const r of cases){const q=pos.get(r.alias),deferred=['U9','U13'].includes(r.alias);u+=`<ellipse cx="${q.x}" cy="${q.y}" rx="240" ry="43" fill="${deferred?'#fff7ed':'#eff6ff'}" stroke="${deferred?'#a35516':'#2563eb'}" stroke-width="2"/>`;u+=text(q.x,q.y-6,r.lines[0],24,'bold','middle')+text(q.x,q.y+24,r.lines.slice(1).join(' '),24,'normal','middle');}
function actor(x,y,name){return `<g fill="white" stroke="#20354a" stroke-width="3"><circle cx="${x}" cy="${y-55}" r="18"/><path d="M${x} ${y-37} V${y+20} M${x-30} ${y-10} H${x+30} M${x} ${y+20} L${x-25} ${y+55} M${x} ${y+20} L${x+25} ${y+55}" fill="none"/></g>`+text(x,y+88,name,24,'normal','middle');}
u+=actor(150,260,'Guest')+actor(150,700,'Customer')+actor(1840,491,'Người vận hành demo')+actor(1840,690,'VNPay Sandbox');
u+=text(70,956,'UC-ORD-003 là hỗ trợ tự hết hạn; không mở Customer Cancel. Mock, ZERO_AMOUNT và scheduler là nội bộ.',23);
u+=text(70,994,'UC-PRO-002: xem trước coupon, yêu cầu tùy chọn trong đặc tả nguồn.',23);
u+=text(70,1032,'Đối soát QueryDR thuộc xử lý thanh toán. Nguồn: use-case-overview.puml, 14 UC / 17 associations.',23);
write('docs/requirements/diagrams/use-case-overview-report.svg',svg(2000,1060,u,`Derived layout only; canonical PUML SHA256 ${hash(ucSource)}; associations ${associations.map(r=>r.actor+'--'+r.uc).join(', ')}`));
// Actual storage ERD: inspect schema, preserve mapped SQL names and FK cardinality.
const schema=read('apps/api/prisma/schema.prisma');
const models=[...schema.matchAll(/^model (\w+) \{([\s\S]*?)^\}/gm)].map(m=>({model:m[1],body:m[2],table:(m[2].match(/@@map\("([^"]+)"\)/)||[])[1]}));
const modelMap=new Map(models.map(m=>[m.model,m]));
const relations=[];
for(const m of models)for(const r of m.body.matchAll(/^\s*(\w+)\s+(\w+)(\?)?\s+@relation\(fields: \[(\w+)\], references: \[(\w+)\], onDelete: (\w+)\)/gm)){
 const field=m.body.split('\n').find(l=>new RegExp('^\\s*'+r[4]+'\\s').test(l));
 relations.push({child:m.model,parent:r[2],field:r[4],column:(field.match(/@map\("([^"]+)"\)/)||[])[1]||r[4],optional:!!r[3],unique:/@unique\b/.test(field),onDelete:r[6]});
}
if(models.length!==13||relations.length!==15)throw Error('Schema topology changed: review ERD layout');
const layout={Category:[45,85,250,100],SeedExecution:[345,85,250,100],User:[655,85,260,100],Coupon:[1130,85,300,100],Product:[45,325,250,130],Order:[655,325,260,155],CouponRedemption:[1130,325,300,175],ProductTopping:[45,585,250,130],OrderItem:[655,585,260,155],Payment:[1130,585,300,130],Topping:[45,845,250,100],OrderItemTopping:[655,845,260,155],PaymentGatewayEvent:[1130,845,300,135]};
const routes={
 'Product.categoryId':[[170,185],[170,325]],
 'ProductTopping.productId':[[170,455],[170,585]],
 'ProductTopping.toppingId':[[170,845],[170,715]],
 'Order.userId':[[785,185],[785,325]],
 'Order.couponId':[[1130,135],[1040,135],[1040,405],[915,405]],
 'OrderItem.orderId':[[785,480],[785,585]],
 'OrderItem.productId':[[295,390],[450,390],[450,655],[655,655]],
 'OrderItemTopping.orderItemId':[[785,740],[785,845]],
 'OrderItemTopping.toppingId':[[295,895],[460,895],[460,950],[655,950]],
 'CouponRedemption.couponId':[[1280,185],[1280,325]],
 'CouponRedemption.orderId':[[915,360],[1060,360],[1060,425],[1130,425]],
 'CouponRedemption.userId':[[915,135],[985,135],[985,470],[1130,470]],
 'Payment.orderId':[[915,450],[960,450],[960,635],[1130,635]],
 'Payment.userId':[[865,85],[865,53],[1480,53],[1480,680],[1430,680]],
 'PaymentGatewayEvent.paymentId':[[1280,715],[1280,845]]
};
let d=text(750,30,'BrewLite — ERD lưu trữ theo Prisma và SQL migrations',27,'bold','middle');
for(const r of relations){const k=r.child+'.'+r.field,pts=routes[k];if(!pts)throw Error('Unrouted FK '+k);const color=['Product','Topping'].includes(r.parent)?'#296ca2':r.parent==='User'?'#8061a7':'#52677c';d+=`<polyline points="${pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="2.5"/>`;const first=pts[0],last=pts[pts.length-1];d+=`<rect x="${first[0]-5}" y="${first[1]-5}" width="10" height="10" fill="${color}"/>`;const before=pts[pts.length-2],dx=last[0]-before[0],dy=last[1]-before[1];let ax=last[0]-Math.sign(dx)*16,ay=last[1]-Math.sign(dy)*16;d+=`<path d="M${ax+(dy?8:0)} ${ay+(dx?8:0)} L${last[0]} ${last[1]} L${ax-(dy?8:0)} ${ay-(dx?8:0)}" fill="none" stroke="${color}" stroke-width="2.5"/>`;const cardinality=r.unique?'0..1':'0..N';const midIndex=Math.max(1,Math.floor(pts.length/2)),p0=pts[midIndex-1],p1=pts[midIndex],mx=(p0[0]+p1[0])/2,my=(p0[1]+p1[1])/2;d+=`<rect x="${mx-55}" y="${my-15}" width="110" height="30" rx="3" fill="white"/>`+text(mx,my+5,`${r.optional?'0..1':'1'} : ${cardinality}`,24,'normal','middle',color);}
for(const m of models){
 const [x,y,w,h]=layout[m.model];let fields=[];
 const composite=(m.body.match(/@@id\(\[([^\]]+)\]/)||[])[1]?.split(',').map(s=>s.trim())||[];
 for(const raw of m.body.split('\n')){
  const l=raw.trimEnd(),z=l.match(/^\s*(\w+)\s+([\w?]+)(.*)$/);if(!z)continue;
  const pk=/\s@id\b/.test(l)||composite.includes(z[1]),fk=relations.find(r=>r.child===m.model&&r.field===z[1]);
  if(pk||fk){const mapped=(l.match(/@map\("([^"]+)"\)/)||[])[1]||z[1];fields.push((pk?'PK ':'')+(fk?'FK ':'')+mapped+(/@unique\b/.test(l)?' [UQ]':'')+(z[2].endsWith('?')?' ?':''));}
 }
 if(!fields.length)throw Error('No key fields for '+m.model);
 const heading=m.model==='OrderItemTopping'?['order_item_','toppings']:m.model==='PaymentGatewayEvent'?['payment_gateway_','events']:[m.table];
 const headerHeight=heading.length===2?62:38,fieldBaseline=heading.length===2?86:66;
 d+=`<g data-table="${m.table}"><title>${m.table}</title><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="white" stroke="#20354a" stroke-width="2"/><path d="M${x} ${y+headerHeight} H${x+w}" stroke="#20354a" stroke-width="1.5"/>`;
 heading.forEach((line,i)=>d+=text(x+12,y+27+i*25,line,m.table.length>17&&heading.length===1?24:26,'bold'));
 fields.forEach((f,i)=>d+=text(x+12,y+fieldBaseline+i*29,f,28));d+='</g>';
}
d+=text(45,1040,'PK/FK/UQ: khóa chính/ngoại/duy nhất; ?: nullable. Đầu vuông: cha; mũi tên: bảng giữ FK.',22);
d+=text(45,1075,'Cardinality theo FK/unique; CHECK và partial indexes đọc từ SQL. Chỉ hiển thị khóa liên kết.',22);
write('docs/diagrams/brewlite-database-erd.svg',svg(1520,1100,d,`13 actual tables, 15 foreign keys. schema SHA256 ${hash(schema)}. Source app baseline 0e43bcb. No Promotion or LoyaltyTransaction table.`));
console.log(JSON.stringify({UC:{actors:actors.length,cases:cases.length,associations:associations.length,sha256:hash(ucSource)},ERD:{tables:models.length,FK:relations.length,schemaSHA256:hash(schema),relations}},null,2));
