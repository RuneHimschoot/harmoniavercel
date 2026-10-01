// Deterministic demo content. Never real reviews, transactions or revenue.
export const CITIES = ['Gent','Leuven','Antwerpen'];
export const EVENT_CREDIT_COST = 10;
export const CREDIT_PACKS = [
  {id:'starter',name:'Eerste klik',credits:50,cents:900,caption:'Voor 5 evenementen'},
  {id:'social',name:'Campus favoriet',credits:150,cents:2400,caption:'Voor 15 evenementen'},
  {id:'city',name:'De hele stad',credits:400,cents:5900,caption:'Voor 40 evenementen'}
];
export const dayKey = date => new Date(date).toISOString().slice(0,10);
export function addRegions(s) {
  const students=s.users.filter(u=>u.role==='student').slice(6,36);
  const places={Leuven:['Café Komma','Bar De Aula','Studio Vaart','Koffie Tussenuren','De Klimkamer','Atelier Letter','Bordspel Bureau','Keuken Cirkel'],Antwerpen:['Café Aanloop','Bar Linkeroever','Studio Schelde','Koffie District','De Sportloods','Atelier Haven','Pixel Station','Keuken Noord']};
  for(const [index,city] of ['Leuven','Antwerpen'].entries()){
    students.forEach((u,i)=>s.users.push({...u,id:'s'+(61+index*30+i),name:(index?['Lio','Imane','Seppe','Tess','Ravi','Fenna']:['Hanne','Bilal','Wout','Naomi','Julian','Esra'])[i%6]+(i>=18?' '+['Louise','Noa','Alex','Bo','Jules','Eden'][i%6]:'')+' '+u.name.split(' ').slice(1).join(' '),city,school:(city==='Leuven'?['KU Leuven','UCLL','LUCA School of Arts']:['Universiteit Antwerpen','AP Hogeschool','Karel de Grote Hogeschool'])[i%3],bio:u.bio.replaceAll('Gent',city),intent:u.intent.replaceAll('Gent',city)}));
    places[city].forEach((name,i)=>s.users.push({id:'b'+(21+index*8+i),role:'business',name,city,category:['Koffie','Muziek','Sport','Koffie','Sport','Cultuur','Gaming','Eten'][i],description:`Een fictieve ontmoetingsplek in ${city}. Voor een kleine pauze, een nieuwe ervaring en fijne connecties.`,address:`Fictieve locatie · ${city}`,active:true,verified:true}));
  }
  for(const b of s.users.filter(u=>u.role==='business')){b.city??='Gent';b.color??=['#7b6d53','#5d7771','#796985'][Number(b.id.slice(1))%3];b.tags??=(b.category.includes('quiz')?['Quiz','Muziek']:b.category.includes('muziek')?['Koffie','Muziek']:b.category.includes('activiteiten')?['Sport','Buiten']:[b.category]);}
  const now=new Date();
  s.users.filter(u=>u.role==='business'&&u.city!=='Gent').forEach((b,i)=>{for(let j=0;j<2;j++){
    const d=new Date(now.getTime()+(2+i+j*7)*86400000);
    s.events.push({id:'e'+(41+i*2+j),owner:b.id,title:[`Meet & mingle bij ${b.name}`,`Samen ${b.category.toLowerCase()} ontdekken`][j],date:dayKey(d),time:j?'19:00':'15:30',category:b.category,description:`Ontmoet studenten in ${b.city}. Kom alleen of neem je Harmony mee. Deze activiteit is volledig fictief.`,price:j?'€ 5 per persoon':'Gratis toegang',published:true});
  }});
  return s;
}
export function addCommerce(s,{examples=true}={}){
  s.version=3;
  s.reviews??=[];s.creditLedger??=[];s.activity??=[];s.bookings??=[];
  const now=Date.now(),businesses=s.users.filter(u=>u.role==='business');
  for(const b of businesses){
    b.city??='Gent'; b.tags??=[b.category];
    if(!s.creditLedger.some(t=>t.business===b.id))s.creditLedger.push({id:'welcome-'+b.id,business:b.id,amount:50,kind:'welcome',cents:0,at:new Date(now).toISOString(),label:'50 startcredits · demo'});
  }
  for(const e of s.events){
    e.city??=s.users.find(u=>u.id===e.owner)?.city||'Gent';
    e.ticketCents??=e.price?.includes('€')?Math.round(Number(e.price.match(/[\d,.]+/)?.[0]?.replace(',','.')||0)*100):0;
    if(e.published&&!e.creditCharged){e.creditCharged=true;s.creditLedger.push({id:'initial-'+e.id,business:e.owner,event:e.id,amount:-10,kind:'publish',cents:0,at:new Date(now).toISOString(),label:'Publicatie '+e.title});}
  }
  if(examples){
    const comments=['Fijne sfeer om andere studenten te ontmoeten. Ik kom graag terug.','Leuke plek en een vriendelijke ontvangst. Handig voor een pauze na de les.','Goede activiteit, alleen iets drukker dan verwacht.','Gezellige avond. Ook alleen binnenkomen voelde heel laagdrempelig.'];
    businesses.forEach((b,bi)=>{
      const local=s.users.filter(u=>u.role==='student'&&u.city===b.city&&Number(u.id.slice(1))>6);
      for(let n=0;n<3;n++){const u=local[(bi+n)%local.length];s.reviews.push({id:'demo-review-'+b.id+'-'+n,business:b.id,student:u.id,rating:3+((bi+n*n)%3),text:comments[(bi+n)%4],at:new Date(now-(n+2)*86400000).toISOString(),helpful:[],demo:true});}
    });
    s.events.filter(e=>e.published).forEach((e,ei)=>{
      const local=s.users.filter(u=>u.role==='student'&&u.city===e.city&&Number(u.id.slice(1))>6);
      for(let n=0;n<20;n++){
        const u=local[(n+ei)%local.length],at=new Date(now-(n%27)*86400000-3600000).toISOString();
        s.activity.push({id:'demo-view-'+e.id+'-'+n,business:e.owner,event:e.id,student:u.id,type:'event-view',at,demo:true});
        if(n%4===0)s.activity.push({id:'demo-save-'+e.id+'-'+n,business:e.owner,event:e.id,student:u.id,type:'save',at,demo:true});
        if(n<3+(ei%4))s.bookings.push({id:'demo-booking-'+e.id+'-'+n,business:e.owner,event:e.id,student:u.id,cents:e.ticketCents,at,demo:true});
      }
    });
  }
  return s;
}
