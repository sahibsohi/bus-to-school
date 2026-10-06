export type Role = 'dispatcher' | 'driver' | 'parent' | 'student';
export type Actor = {uid:string; role:Role};
export type Stop = {name:string; time:string; lat:number; lng:number; directionsQuery?:string};
export type Route = {id:string; name:string; area:string; bus:string; stops:Stop[]; memberUids:string[]};
export type Trip = {id:string; routeId:string; date:string; driverUid:string; status:'scheduled'|'active'|'completed'; memberUids:string[]};
export type Ride = {id:string; tripId:string; routeId:string; name:string; stopIndex:number; status:'waiting'|'onboard'|'arrived'|'absent'; pickupAt:number|null; dropoffAt:number|null; memberUids:string[]};
export type Notice = {id:string; routeId:string; kind:'delay'|'cancellation'|'notice'; message:string; from:string; until:string; createdAt:number; memberUids:string[]};
export type Data = {routes:Route[]; trips:Trip[]; rides:Ride[]; notices:Notice[]};
export function today(){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Toronto',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
export function authorized(actor:Actor,trip:Trip){if(actor.role!=='dispatcher' && !(actor.role==='driver' && actor.uid===trip.driverUid))throw new Error('Only the assigned driver or dispatcher can update this trip.');}
export function updateRide(actor:Actor,trip:Trip,ride:Ride,action:string,now:number):Ride{
 authorized(actor,trip);
 if(ride.tripId!==trip.id)throw new Error('Ride does not belong to this trip.');
 if(trip.status!=='active')throw new Error('Start the trip before recording attendance.');
 if(action==='pickup' && ride.status==='waiting')return {...ride,status:'onboard',pickupAt:now};
 if(action==='dropoff' && ride.status==='onboard')return {...ride,status:'arrived',dropoffAt:now};
 if(action==='absent' && ride.status==='waiting')return {...ride,status:'absent'};
 throw new Error('Invalid or duplicate attendance transition.');
}
export function updateTrip(actor:Actor,trip:Trip,rides:Ride[],action:string):Trip{
 authorized(actor,trip);
 if(action==='start' && trip.status==='scheduled')return {...trip,status:'active'};
 if(action==='complete' && trip.status==='active'){
 if(rides.some(r=>r.tripId===trip.id && (r.status==='waiting'||r.status==='onboard')))throw new Error('Resolve every rider before completing the trip.');
 return {...trip,status:'completed'};
 }throw new Error('Invalid trip transition.');
}
export function validateNotice(input:{message:string;from:string;until:string;kind:string}){
 const valid=(s:string)=>/^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s;
 if(typeof input.message!=='string'||input.message.trim().length<5||input.message.length>500)throw new Error('Message must contain 5–500 characters.');
 if(!['delay','cancellation','notice'].includes(input.kind))throw new Error('Invalid notice type.');
 if(!valid(input.from)||!valid(input.until)||input.until<input.from)throw new Error('Use valid YYYY-MM-DD dates; end date must follow start date.');
}
export function visible(data:Data,actor:Actor):Data{
 const can=(x:{memberUids:string[]})=>actor.role==='dispatcher'||x.memberUids.includes(actor.uid);
 return {routes:data.routes.filter(can),trips:data.trips.filter(can),rides:data.rides.filter(can),notices:data.notices.filter(can)};
}
export function csv(rides:Ride[]){
 const cell=(v:unknown)=>'"'+String(v??'').replace(/^[=+@-]/,"'").replaceAll('"','""')+'"';
 return [['ride_id','trip_id','status','pickup_utc','dropoff_utc'],...rides.map(r=>[r.id,r.tripId,r.status,r.pickupAt?new Date(r.pickupAt).toISOString():'',r.dropoffAt?new Date(r.dropoffAt).toISOString():''])].map(row=>row.map(cell).join(',')).join('\n');
}
