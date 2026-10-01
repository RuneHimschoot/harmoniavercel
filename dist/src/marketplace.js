import {CREDIT_PACKS} from './demo.js';
const person=(s,id)=>s.users.find(u=>u.id===id);
const stamp=()=>new Date().toISOString();
export const euro=cents=>new Intl.NumberFormat('nl-BE',{style:'currency',currency:'EUR'}).format(cents/100);
export const balance=(s,id)=>s.creditLedger.filter(t=>t.business===id).reduce((a,t)=>a+t.amount,0);
export function businesses(s,city='',category='',sort='rating'){
  return s.users.filter(u=>u.role==='business'&&u.active&&u.verified&&(!city||u.city===city)&&(!category||(u.tags||[]).includes(category)||u.category===category)).sort((a,b)=>sort==='name'?a.name.localeCompare(b.name):sort==='reviews'?rating(s,b.id).count-rating(s,a.id).count:rating(s,b.id).score-rating(s,a.id).score);
}
export function rating(s,id){const rows=s.reviews.filter(r=>r.business===id&&person(s,r.student)?.active),sum=rows.reduce((a,r)=>a+r.rating,0);return {count:rows.length,average:rows.length?sum/rows.length:0,score:(sum+20)/(rows.length+5),rows};}
function student(s,id){if(person(s,id)?.role!=='student'||!person(s,id).active)throw Error('Kies een actief studentenaccount.');}
function business(s,id){const b=person(s,id);if(b?.role!=='business'||!b.active)throw Error('Dit bedrijf is niet beschikbaar.');return b;}
export function reviewSave(s,actor,id,stars,text){student(s,actor);if(!business(s,id).verified)throw Error('Dit bedrijf is nog niet zichtbaar.');stars=Number(stars);text=String(text).trim();if(!Number.isInteger(stars)||stars<1||stars>5||text.length<3||text.length>800)throw Error('Kies 1 tot 5 sterren en schrijf 3 tot 800 tekens.');const old=s.reviews.find(r=>r.student===actor&&r.business===id);const value={business:id,student:actor,rating:stars,text,at:stamp(),demo:false};if(old)Object.assign(old,value,{helpful:[]});else s.reviews.push({...value,id:crypto.randomUUID(),helpful:[]});}
export function helpful(s,actor,id){student(s,actor);const r=s.reviews.find(r=>r.id===id);if(!r||r.student===actor)throw Error('Je kunt je eigen review niet beoordelen.');r.helpful??=[];r.helpful=r.helpful.includes(actor)?r.helpful.filter(x=>x!==actor):[...r.helpful,actor];}
export function replySave(s,actor,id,text){business(s,actor);const r=s.reviews.find(r=>r.id===id);if(!r||r.business!==actor)throw Error('Deze review hoort bij een ander bedrijf.');text=String(text).trim();if(!text||text.length>500)throw Error('Schrijf een antwoord van 1 tot 500 tekens.');r.reply=text;}
export function purchase(s,actor,packId,requestId){business(s,actor);const pack=CREDIT_PACKS.find(p=>p.id===packId);if(!pack||!requestId)throw Error('Kies een geldig pakket.');if(s.creditLedger.some(t=>t.id===requestId))return false;s.creditLedger.push({id:requestId,business:actor,kind:'purchase',amount:pack.credits,cents:pack.cents,at:stamp(),label:pack.name+' · demo-aankoop'});return true;}
export function track(s,actor,businessId,type,eventId=''){
  student(s,actor);if(!business(s,businessId).verified)throw Error('Dit bedrijf is nog niet zichtbaar.');
  if(!['event-view','business-view','save','share'].includes(type))throw Error('Onbekende activiteit.');
  if(eventId&&!s.events.some(e=>e.id===eventId&&e.owner===businessId&&e.published))throw Error('Deze activiteit is niet beschikbaar.');
  if(type.endsWith('view')&&s.activity.some(a=>a.student===actor&&a.business===businessId&&a.event===eventId&&a.type===type&&Date.now()-Date.parse(a.at)<30000))return;
  s.activity.push({id:crypto.randomUUID(),business:businessId,event:eventId,student:actor,type,at:stamp(),demo:false});
}
export function book(s,actor,eventId){student(s,actor);const e=s.events.find(e=>e.id===eventId);if(!e?.published||!business(s,e.owner).verified)throw Error('Deze activiteit is niet beschikbaar.');const old=s.bookings.findIndex(b=>b.student===actor&&b.event===eventId);if(old>=0){s.bookings.splice(old,1);return false;}s.bookings.push({id:crypto.randomUUID(),business:e.owner,event:eventId,student:actor,cents:e.ticketCents||0,at:stamp(),demo:false});return true;}
export function insights(s,id,{days=30,event='',own=false,now=Date.now()}={}){
 const start=now-days*86400000,inRange=x=>x.business===id&&(!event||x.event===event)&&(!own||!x.demo)&&Date.parse(x.at)>=start&&Date.parse(x.at)<=now;
 const activity=s.activity.filter(inRange),bookings=s.bookings.filter(inRange),views=activity.filter(x=>x.type.endsWith('view'));
 const visitors=new Set(views.map(x=>x.student)),joined=new Set(bookings.filter(x=>visitors.has(x.student)).map(x=>x.student));
 const students=new Set([...activity,...bookings].map(x=>x.student));
 return {views:views.length,unique:visitors.size,students:students.size,bookings:bookings.length,revenue:bookings.reduce((a,b)=>a+b.cents,0),saves:activity.filter(x=>x.type==='save').length,shares:activity.filter(x=>x.type==='share').length,conversion:visitors.size?Math.round(joined.size/visitors.size*100):0,activity,bookingRows:bookings,studentIds:[...students]};
}
