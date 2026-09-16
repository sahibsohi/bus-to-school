// Emulator only: no credentials, no production writes.
import {initializeApp} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';
import {getFirestore} from 'firebase-admin/firestore';
import {seed,accounts} from '../src/demo';
if(process.env.FIRESTORE_EMULATOR_HOST!=='127.0.0.1:8080'||process.env.FIREBASE_AUTH_EMULATOR_HOST!=='127.0.0.1:9099')throw new Error('Set both localhost emulator variables as documented.');
initializeApp({projectId:'demo-bts-connect'});
async function main(){
 for(const a of Object.values(accounts)){
 try{await getAuth().createUser({uid:a.uid,email:a.role+'@bts.test',password:'DemoOnly123!'});}catch(e:any){if(e.code!=='auth/uid-already-exists'&&e.code!=='auth/email-already-exists')throw e;}
 await getAuth().setCustomUserClaims(a.uid,{role:a.role});
 }
 const data=seed();const batch=getFirestore().batch();
 for(const [collection,rows] of Object.entries(data))for(const row of rows)batch.set(getFirestore().doc(collection+'/'+row.id),row);
 await batch.commit();console.log('Fictional demo accounts and current-day trip seeded.');
}main().catch(e=>{console.error(e);process.exitCode=1;});
