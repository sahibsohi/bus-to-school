import {initializeApp,getApps} from 'firebase/app';
import {getAuth,connectAuthEmulator} from 'firebase/auth';
import {getFirestore,connectFirestoreEmulator} from 'firebase/firestore';
import {getFunctions,connectFunctionsEmulator} from 'firebase/functions';
export const live=process.env.EXPO_PUBLIC_DATA_MODE==='firebase';
export function services(){
 const app=getApps()[0]??initializeApp({apiKey:process.env.EXPO_PUBLIC_FIREBASE_API_KEY,authDomain:process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,projectId:process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,appId:process.env.EXPO_PUBLIC_FIREBASE_APP_ID});
 const auth=getAuth(app), db=getFirestore(app), functions=getFunctions(app,'us-central1');
 if(process.env.EXPO_PUBLIC_USE_EMULATORS==='true' && !(globalThis as any).__btsEmulators){
 const host=process.env.EXPO_PUBLIC_EMULATOR_HOST||'127.0.0.1';
 connectAuthEmulator(auth,`http://${host}:9099`,{disableWarnings:true});connectFirestoreEmulator(db,host,8080);connectFunctionsEmulator(functions,host,5001);(globalThis as any).__btsEmulators=true;
 }return {auth,db,functions};
}
