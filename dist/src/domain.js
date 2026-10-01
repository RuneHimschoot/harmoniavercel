import {seed, EVENT_TYPES} from './data.js';
import {addCommerce,CITIES,EVENT_CREDIT_COST} from './demo.js';
import {balance} from './marketplace.js';

export const user = (s,id) => s.users.find(u => u.id === id);
export const pair = (a,b) => [a,b].sort().join(':');
export const blocked = (s,a,b) => s.blocks.some(x => (x.from===a&&x.to===b)||(x.from===b&&x.to===a));
export const canChat = (s,a,b) => Boolean(user(s,a)?.role==='student' && user(s,b)?.role==='student' && user(s,a)?.active && user(s,b)?.active && !blocked(s,a,b) && s.matches.some(m=>m.id===pair(a,b)));
export const discover = (s,id,interest='',city='') => s.users.filter(u=>u.role==='student'&&u.active&&u.id!==id&&(!city||u.city===city)&&!blocked(s,id,u.id)&&!s.swipes.some(x=>x.from===id&&x.to===u.id)&&(!interest||u.interests.some(x=>x.toLowerCase()===interest.toLowerCase())));
export function swipe(s,from,to,liked) {
  if(typeof liked!=='boolean'||from===to||user(s,from)?.role!=='student'||!user(s,from)?.active||user(s,to)?.role!=='student'||!user(s,to)?.active||blocked(s,from,to)) throw Error('Deze swipe is niet mogelijk.');
  if(s.swipes.some(x=>x.from===from&&x.to===to)) throw Error('Je hebt dit profiel al beoordeeld.');
  s.swipes.push({from,to,liked});
  if(liked&&s.swipes.some(x=>x.from===to&&x.to===from&&x.liked)) {
    const id=pair(from,to);
    if(!s.matches.some(x=>x.id===id)) s.matches.push({id,members:[from,to],seenBy:[],at:new Date().toISOString()});
    return true;
  }
  return false;
}
export function send(s,from,to,text,eventId='') {
  if(!canChat(s,from,to)) throw Error('Dit gesprek is niet beschikbaar.');
  text=String(text).trim();
  if(!text||text.length>2000) throw Error('Schrijf een bericht van 1 tot 2000 tekens.');
  if(eventId&&!visibleEvents(s).some(e=>e.id===eventId)) throw Error('Dit evenement is niet meer beschikbaar.');
  const message={id:crypto.randomUUID(),from,to,text,at:new Date().toISOString(),readBy:[from]};
  if(eventId)message.eventId=eventId;
  s.messages.push(message);
}
export function markRead(s,actor,other) {
  if(!canChat(s,actor,other))return false;
  let changed=false;
  const m=s.matches.find(x=>x.id===pair(actor,other));
  m.seenBy??=[];
  if(!m.seenBy.includes(actor)){m.seenBy.push(actor);changed=true;}
  s.messages.filter(x=>x.from===other&&x.to===actor).forEach(x=>{x.readBy??=[];if(!x.readBy.includes(actor)){x.readBy.push(actor);changed=true;}});
  return changed;
}
export function notifications(s,id) {
  const matches=s.matches.filter(m=>m.members.includes(id)&&!(m.seenBy||[]).includes(id)&&canChat(s,id,m.members.find(x=>x!==id)));
  const messages=s.messages.filter(m=>m.to===id&&!(m.readBy||[]).includes(id)&&canChat(s,id,m.from));
  return {matches:matches.length,messages:messages.length,total:matches.length+messages.length};
}
export function visibleEvents(s,category='',savedOnlyFor='',city='') {
  return s.events.filter(e=>e.published&&(!city||e.city===city)&&user(s,e.owner)?.active&&user(s,e.owner)?.verified&&(!category||e.category===category)&&(!savedOnlyFor||s.saved.some(x=>x.user===savedOnlyFor&&x.event===e.id))).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
}
export function moderate(s,actor,target) {
  if(user(s,actor)?.role!=='admin')throw Error('Alleen de admin kan dit aanpassen.');
  const u=user(s,target);
  if(!u||u.role==='admin')throw Error('Ongeldig account.');
  u.active=!u.active;
}
export function resetDemo(s,actor,mode) {
  if(user(s,actor)?.role!=='admin')throw Error('Alleen de admin kan resetten.');
  if(mode==='all')return seed();
  if(mode!=='interactions')throw Error('Ongeldige reset.');
  return {...s,swipes:[],matches:[],messages:[],reports:[],blocks:[],saved:[],reviews:[],activity:[],bookings:[]};
}
export function eventSave(s,actor,event) {
  const u=user(s,actor);
  if(!u?.active||!['business','admin'].includes(u.role))throw Error('Geen toegang.');
  const old=s.events.find(e=>e.id===event.id);
  if(old?.archived)throw Error('Dit evenement is verwijderd.');
  if(old&&u.role!=='admin'&&old.owner!==actor)throw Error('Dit evenement is van een ander bedrijf.');
  if(!event.title?.trim()||event.title.trim().length>120||!/^\d{4}-\d{2}-\d{2}$/.test(event.date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(event.time))throw Error('Vul een geldige titel, datum en tijd in.');
  if(new Date(event.date+'T12:00:00Z').toISOString().slice(0,10)!==event.date)throw Error('Deze datum bestaat niet.');
  if(event.category&&!EVENT_TYPES.includes(event.category))throw Error('Kies een evenementsoort.');
  const owner=old?.owner||actor;
  if(user(s,owner)?.role!=='business')throw Error('Een evenement hoort bij een bedrijf.');
  const ticketCents=event.ticketEuros!==undefined?Math.round(Number(event.ticketEuros)*100):(event.ticketCents??old?.ticketCents??0);
  if(!Number.isSafeInteger(ticketCents)||ticketCents<0||ticketCents>1000000)throw Error('Kies een ticketprijs van € 0 tot € 10.000.');
  const city=event.city||old?.city||user(s,owner).city||'Gent';
  if(!CITIES.includes(city))throw Error('Kies een geldige regio.');
  const published=!!user(s,owner).verified&&event.status!=='draft';
  const charge=published&&!old?.creditCharged;
  if(charge&&balance(s,owner)<EVENT_CREDIT_COST)throw Error('Onvoldoende credits. Koop een demopakket of bewaar als concept.');
  const value={...event,title:event.title.trim(),owner,id:old?.id||crypto.randomUUID(),published,city,ticketCents,price:ticketCents?new Intl.NumberFormat('nl-BE',{style:'currency',currency:'EUR'}).format(ticketCents/100)+' per persoon':'Gratis toegang',creditCharged:!!old?.creditCharged||charge};
  if(charge)s.creditLedger.push({id:crypto.randomUUID(),business:owner,event:value.id,amount:-EVENT_CREDIT_COST,kind:'publish',cents:0,at:new Date().toISOString(),label:'Publicatie '+value.title});
  if(old)Object.assign(old,value);else s.events.push(value);
}
export function migrate(old) {
  if(old?.version===3&&Array.isArray(old.users)&&Array.isArray(old.events))return old;
  const fresh=seed();
  if(!old||![1,2].includes(old.version)||!Array.isArray(old.users)||!Array.isArray(old.events))return fresh;
  const result={...fresh,...old,version:3};
  result.users=[...old.users.map(u=>({...fresh.users.find(x=>x.id===u.id),...u,city:u.city||'Gent'})),...fresh.users.filter(u=>!old.users.some(x=>x.id===u.id))];
  result.events=[...old.events.map(e=>({...e,creditCharged:!!e.published})),...fresh.events.filter(e=>!old.events.some(x=>x.id===e.id))];
  for(const key of ['swipes','matches','messages','blocks','reports','saved'])result[key]=Array.isArray(old[key])?old[key]:[];
  // Existing published content is grandfathered: migrating never spends credits.
  result.creditLedger=fresh.creditLedger.filter(t=>t.kind!=='publish'||!old.events.some(e=>e.id===t.event));
  return addCommerce(result,{examples:false});
}

export function eventDelete(s,actor,id){
  const e=s.events.find(e=>e.id===id);
  if(user(s,actor)?.role!=='business'||!user(s,actor)?.active||!e||e.owner!==actor)throw Error('Geen toegang.');
  e.archived=true;e.published=false;
}
