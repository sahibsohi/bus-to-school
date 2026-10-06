import {Data,Role,today} from '../functions/src/domain';
export const accounts:Record<Role,{uid:string;role:Role}>={dispatcher:{uid:'dispatch-demo',role:'dispatcher'},driver:{uid:'driver-demo',role:'driver'},parent:{uid:'parent-demo',role:'parent'},student:{uid:'student-demo',role:'student'}};
export function seed():Data{
 const members=['driver-demo','parent-demo','student-demo'];
 // Presentation route: pickup points and times require operator review.
 // Bluffmeadow is the home area; the first park entrance is not yet surveyed.
 const route={id:'central-peel-am',name:'Central Peel Secondary School',area:'Morning service · Brampton · CP-01',bus:'Bus 07',memberUids:members,stops:[
 {name:'Neighbourhood park · Bluffmeadow area',time:'07:15',lat:43.795,lng:-79.679,directionsQuery:'parks near 5 Bluffmeadow Street, Brampton, Ontario'},
 {name:'The Gore Road & Cottrelle Boulevard',time:'07:25',lat:43.781,lng:-79.671,directionsQuery:'The Gore Road and Cottrelle Boulevard, Brampton, Ontario'},
 {name:'Goreway Drive & Cottrelle Boulevard',time:'07:35',lat:43.772,lng:-79.701,directionsQuery:'Goreway Drive and Cottrelle Boulevard, Brampton, Ontario'},
 {name:'Bramalea Road & Queen Street East',time:'07:50',lat:43.715,lng:-79.706,directionsQuery:'Bramalea Road and Queen Street East, Brampton, Ontario'},
 {name:'Central Peel Secondary School',time:'08:10',lat:43.699,lng:-79.746,directionsQuery:'Central Peel Secondary School, 32 Kennedy Road North, Brampton, Ontario'}]};
 const names=['Alex R.','Jordan M.','Taylor K.','Sam P.','Avery S.','Riley D.','Morgan L.','Casey B.','Jamie N.','Quinn A.','Cameron T.','Drew H.','Reese W.','Parker C.','Skyler J.'];
 const tripId='central-peel-'+today();
 return {routes:[route],trips:[{id:tripId,routeId:route.id,date:today(),driverUid:'driver-demo',status:'scheduled',memberUids:members}],rides:names.map((name,i)=>({id:'ride-'+today()+'-'+i,tripId,routeId:route.id,name,stopIndex:Math.floor(i/4),status:'waiting',pickupAt:null,dropoffAt:null,memberUids:i===0?members:['driver-demo']})),notices:[{id:'welcome',routeId:route.id,kind:'notice',message:'Central Peel morning service begins at 7:15 AM. Please arrive at your assigned stop five minutes early.',from:today(),until:today(),createdAt:Date.now(),memberUids:members}]};
}
