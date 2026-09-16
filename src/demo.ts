import {Data,Role,today} from '../functions/src/domain';
export const accounts:Record<Role,{uid:string;role:Role}>={dispatcher:{uid:'dispatch-demo',role:'dispatcher'},driver:{uid:'driver-demo',role:'driver'},parent:{uid:'parent-demo',role:'parent'},student:{uid:'student-demo',role:'student'}};
export function seed():Data{
 const members=['driver-demo','parent-demo','student-demo'];
 const route={id:'brampton-am',name:'Brampton · Regional Express',area:'Morning service · Fictional route',bus:'Bus 07',memberUids:members,stops:[{name:'Chinguacousy Park',time:'07:15',lat:43.731,lng:-79.722},{name:'Bramalea City Centre',time:'07:25',lat:43.715,lng:-79.721},{name:'Demo learning centre',time:'07:45',lat:43.698,lng:-79.752}]};
 return {routes:[route],trips:[{id:'brampton-'+today(),routeId:route.id,date:today(),driverUid:'driver-demo',status:'scheduled',memberUids:members}],rides:['Alex R.','Jordan M.','Taylor K.','Sam P.'].map((name,i)=>({id:'ride-'+today()+'-'+i,tripId:'brampton-'+today(),routeId:route.id,name,stopIndex:i%2,status:'waiting',pickupAt:null,dropoffAt:null,memberUids:i===0?members:['driver-demo']})),notices:[{id:'welcome',routeId:route.id,kind:'notice',message:'Morning service is scheduled. Please arrive at your stop five minutes early.',from:today(),until:today(),createdAt:Date.now(),memberUids:members}]};
}
