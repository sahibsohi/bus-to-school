import {initializeApp} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';
import {onCall,HttpsError} from 'firebase-functions/v2/https';
import {Actor,Role,Ride,Trip,Route,updateRide,updateTrip,validateNotice} from './domain';
initializeApp();const db=getFirestore();
export const command=onCall({region:'us-central1',maxInstances:5},async request=>{
 if(!request.auth)throw new HttpsError('unauthenticated','Sign in first.');
 const role=request.auth.token.role as Role;
 if(!['dispatcher','driver'].includes(role))throw new HttpsError('permission-denied','Staff access required.');
 const actor:Actor={uid:request.auth.uid,role};
 const d=request.data;
 const id=(s:unknown):string=>{if(typeof s!=='string'||!/^[-a-zA-Z0-9_]{1,100}$/.test(s))throw new Error('Invalid document ID.');return s;};
 try{
 if(d.action==='publish'){
 if(role!=='dispatcher')throw new HttpsError('permission-denied','Dispatcher access required.');
 validateNotice(d);const route=(await db.doc('routes/'+id(d.routeId)).get()).data() as Route|undefined;
 if(!route)throw new Error('Route not found.');
 const ref=db.collection('notices').doc();await ref.set({id:ref.id,routeId:route.id,kind:d.kind,message:d.message.trim(),from:d.from,until:d.until,createdAt:Date.now(),memberUids:route.memberUids});return {ok:true};
 }
 await db.runTransaction(async tx=>{
 const tripRef=db.doc('trips/'+id(d.tripId));const trip=(await tx.get(tripRef)).data() as Trip|undefined;
 if(!trip)throw new Error('Trip not found.');
 if(['start','complete'].includes(d.action)){
 const rides=(await tx.get(db.collection('rides').where('tripId','==',trip.id))).docs.map(s=>s.data() as Ride);
 tx.set(tripRef,updateTrip(actor,trip,rides,d.action));
 }else{
 const rideRef=db.doc('rides/'+id(d.rideId));const ride=(await tx.get(rideRef)).data() as Ride|undefined;
 if(!ride)throw new Error('Ride not found.');
 const now=Date.now();const updated=updateRide(actor,trip,ride,d.action,now);
 tx.set(rideRef,updated);
 tx.create(db.doc(`events/${ride.id}_${d.action}`),{rideId:ride.id,tripId:trip.id,action:d.action,actorUid:actor.uid,recordedAt:now});
 }
 });return {ok:true};
 }catch(error){if(error instanceof HttpsError)throw error;throw new HttpsError('failed-precondition',error instanceof Error?error.message:'Request failed.');}
});
