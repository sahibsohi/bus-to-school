import React,{useEffect,useState} from 'react';
import {SafeAreaView,ScrollView,View,Text,Pressable,TextInput,StyleSheet,Linking,Share,Platform,useWindowDimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {onAuthStateChanged,signInWithEmailAndPassword,signOut} from 'firebase/auth';
import {collection,query,where,limit,onSnapshot} from 'firebase/firestore';
import {httpsCallable} from 'firebase/functions';
import {Actor,Data,Role,Ride,Notice,today,visible,updateRide,updateTrip,validateNotice,csv} from './functions/src/domain';
import {seed,accounts} from './src/demo';
import {live,services} from './src/firebase';
const empty:Data={routes:[],trips:[],rides:[],notices:[]};
const key='bts-demo-v1';
function Button({label,onPress,quiet=false,disabled=false}:{label:string;onPress:()=>void;quiet?:boolean;disabled?:boolean}){return <Pressable accessibilityRole="button" accessibilityLabel={label} disabled={disabled} onPress={onPress} style={[s.button,quiet&&s.quiet,disabled&&{opacity:.45}]}><Text style={{fontWeight:'700',color:quiet?'#24384a':'#142939'}}>{label}</Text></Pressable>}
function Pill({text}:{text:string}){return <Text style={s.pill}>{text.toUpperCase()}</Text>}
const time=(n:number|null)=>n?new Date(n).toLocaleTimeString('en-CA',{timeZone:'America/Toronto',hour:'2-digit',minute:'2-digit'}):'—';
export default function App(){
 const [data,setData]=useState<Data>(empty),[actor,setActor]=useState<Actor|null>(live?null:accounts.dispatcher);
 const [page,setPage]=useState('Overview'),[error,setError]=useState(''),[busy,setBusy]=useState(false),[ready,setReady]=useState(false);
 const [email,setEmail]=useState(''),[password,setPassword]=useState('');
 const [message,setMessage]=useState(''),[kind,setKind]=useState<Notice['kind']>('delay'),[from,setFrom]=useState(today()),[until,setUntil]=useState(today());
 const [selected,setSelected]=useState('');
 const wide=useWindowDimensions().width>850;
 useEffect(()=>{
 if(!live){AsyncStorage.getItem(key).then(raw=>{try{setData(raw?JSON.parse(raw):seed());}catch{setData(seed());}setReady(true);}).catch(()=>{setData(seed());setReady(true);});return;}
 try{return onAuthStateChanged(services().auth,async user=>{setData(empty);setActor(null);setReady(true);if(user){try{const t=await user.getIdTokenResult();const role=t.claims.role as Role;if(!['dispatcher','driver','parent','student'].includes(role))throw new Error('This account has no assigned role. Ask the administrator.');setActor({uid:user.uid,role});}catch(e:any){setError(e.message);}}});}catch(e:any){setError(e.message);setReady(true);}
 },[]);
 useEffect(()=>{if(!live&&ready)AsyncStorage.setItem(key,JSON.stringify(data)).catch(()=>setError('Could not save this demo on this device.'));},[data,ready]);
 useEffect(()=>{
 if(!live||!actor)return;
 const off=(Object.keys(empty) as (keyof Data)[]).map(name=>{
 const constraints=actor.role==='dispatcher'?[limit(200)]:[where('memberUids','array-contains',actor.uid),limit(200)];
 return onSnapshot(query(collection(services().db,name),...constraints),snap=>setData(prev=>({...prev,[name]:snap.docs.map(d=>d.data())})),e=>setError(e.message));
 });return ()=>off.forEach(fn=>fn());
 },[actor?.uid]);
 const view=actor?visible(data,actor):empty;
 const route=view.routes.find(r=>r.id===selected)||view.routes[0];
 const trip=view.trips.find(t=>t.routeId===route?.id&&t.date===today());
 const rides=view.rides.filter(r=>r.tripId===trip?.id);
 const staff=actor?.role==='dispatcher'||actor?.role==='driver';
 const notices=view.notices.filter(n=>n.from<=today()&&n.until>=today()).sort((a,b)=>b.createdAt-a.createdAt);
 async function run(action:()=>Promise<void>){setBusy(true);setError('');try{await action();}catch(e:any){setError(e.message||'Could not complete the action.');}finally{setBusy(false);}}
 async function command(action:string,rideId?:string){
 if(!actor||!trip)return;
 await run(async()=>{
 if(live){await httpsCallable(services().functions,'command')({action,tripId:trip.id,rideId});return;}
 if(action==='start'||action==='complete'){const next=updateTrip(actor,trip,rides,action);setData(prev=>({...prev,trips:prev.trips.map(t=>t.id===trip.id?next:t)}));}
 else {const ride=rides.find(r=>r.id===rideId)!;const next=updateRide(actor,trip,ride,action,Date.now());setData(prev=>({...prev,rides:prev.rides.map(r=>r.id===ride.id?next:r)}));}
 });
 }
 async function publish(){await run(async()=>{
 if(!route)throw new Error('Select a route first.');
 const body={action:'publish',routeId:route.id,message,kind,from,until};validateNotice(body);
 if(live)await httpsCallable(services().functions,'command')(body);
 else setData(prev=>({...prev,notices:[{...body,id:String(Date.now()),createdAt:Date.now(),memberUids:route.memberUids},...prev.notices]}));
 setMessage('');
 });}
 async function exportCsv(){await run(async()=>{const content=csv(view.rides);
 if(Platform.OS==='web'){const a=document.createElement('a');const url=URL.createObjectURL(new Blob([content],{type:'text/csv'}));a.href=url;a.download='bts-attendance.csv';a.click();URL.revokeObjectURL(url);}else await Share.share({message:content,title:'BTS attendance CSV'});
 });}
 const durations=view.rides.filter(r=>r.pickupAt&&r.dropoffAt).map(r=>(r.dropoffAt!-r.pickupAt!)/60000);
 const tabs=actor?.role==='dispatcher'?['Overview','Route & riders','Updates','Reports']:staff?['Overview','Route & riders','Updates']:['Overview','Updates'];
 const cards=[['Assigned routes',String(view.routes.length)],['On board',String(view.rides.filter(r=>r.status==='onboard').length)],['Arrived',String(view.rides.filter(r=>r.status==='arrived').length)],['Active updates',String(notices.length)]];
 const feed=<>{notices.length===0&&<Text style={s.muted}>No active service updates.</Text>}{notices.map(n=><View key={n.id} style={s.notice}><View style={s.row}><Pill text={n.kind}/><Text style={s.muted}>{view.routes.find(r=>r.id===n.routeId)?.bus}</Text></View><Text style={s.body}>{n.message}</Text><Text style={s.muted}>{n.from} through {n.until}</Text></View>)}</>;
 return <SafeAreaView style={s.safe}><ScrollView contentContainerStyle={s.shell} keyboardShouldPersistTaps="handled">
 <View style={s.header}><View><Text style={s.logo}>BTS<Text style={{color:'#cc9c27'}}> / </Text>CONNECT</Text><Text style={s.muted}>A clearer journey, together.</Text></View><Pill text={live?'Firebase connected mode':'Interactive portfolio demo'}/></View>
 <View style={s.banner}><Text style={s.bannerText}>Independent prototype · Fictional riders and routes · Not an official Bus to School service</Text></View>
 {!ready?<Text>Loading your workspace…</Text>:!actor?<View style={s.card}><Text style={s.h1}>Welcome back</Text><TextInput accessibilityLabel="Email" placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" style={s.input}/><TextInput accessibilityLabel="Password" placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={s.input}/><Button label="Sign in" disabled={busy} onPress={()=>run(async()=>{await signInWithEmailAndPassword(services().auth,email,password);})}/></View>:<>
 <View style={s.row}><Text style={s.muted}>WORKSPACE / {actor.role.toUpperCase()}</Text>{!live?<View style={s.wrap}>{(Object.keys(accounts) as Role[]).map(role=><Button key={role} label={role[0].toUpperCase()+role.slice(1)} quiet={actor.role!==role} onPress={()=>{setActor(accounts[role]);setPage('Overview');setError('');}}/>)}</View> :<Button quiet label="Sign out" onPress={()=>run(async()=>{await signOut(services().auth);})}/>}</View>
 <View style={[s.layout,!wide&&{flexDirection:'column'}]}>
 <View style={[s.nav,!wide&&{width:'100%',flexDirection:'row',flexWrap:'wrap'}]}>{tabs.map(t=><Pressable accessibilityRole="button" key={t} onPress={()=>setPage(t)} style={[s.navItem,page===t&&s.navActive]}><Text style={[s.navText,page===t&&{color:'#fff'}]}>{t}</Text></Pressable>)}{wide&&<Text style={[s.muted,{marginTop:32,lineHeight:22}]}>GREATER TORONTO AREA{ '\n'}{today()}{'\n'}Times shown in Toronto time</Text>}</View>
 <View style={s.main}>
 <Text style={s.eyebrow}>{staff?'OPERATIONS, IN ONE PLACE':'YOUR JOURNEY, IN ONE PLACE'}</Text>
 <Text style={s.h1}>{page==='Overview'?(staff?'Every stop. Every student.':'Stay close to the journey.'):page}</Text>
 <Text style={s.subtitle}>{staff?'Keep routes moving and families informed.':'See boarding confirmations and service changes here.'}</Text>
 {page==='Overview'&&<><View style={s.wrap}>{cards.map(([label,value])=><View key={label} style={s.metric}><Text style={s.number}>{value}</Text><Text style={s.muted}>{label}</Text></View>)}</View>
 <View style={s.card}><Text style={s.h2}>{staff?'Today’s service':'Your student’s trip'}</Text>{view.routes.length===0&&<Text style={s.muted}>No routes assigned. Your administrator must provision route membership.</Text>}{view.routes.map(r=><View key={r.id} style={s.service}><View style={{flex:1}}><Text style={s.h2}>{r.name}</Text><Text style={s.muted}>{r.bus} · {r.stops.length} scheduled stops</Text></View><Pill text={view.trips.find(t=>t.routeId===r.id&&t.date===today())?.status||'No trip today'}/>{staff&&<Button label="Open route" onPress={()=>{setSelected(r.id);setPage('Route & riders');}}/>}</View>)}
 {!staff&&rides.map(r=><View key={r.id} style={s.notice}><Text style={s.h2}>{r.name}</Text><Pill text={r.status}/><Text style={s.body}>Picked up: {time(r.pickupAt)}  ·  Dropped off: {time(r.dropoffAt)}</Text><Text style={s.muted}>These are driver-recorded confirmations, not GPS locations.</Text></View>)}</View><View style={s.card}><Text style={s.h2}>Service updates</Text>{feed}</View></>}
 {page==='Route & riders'&&<>
 <View style={s.wrap}>{view.routes.map(r=><Button key={r.id} quiet={route?.id!==r.id} label={r.bus} onPress={()=>setSelected(r.id)}/>)}</View>
 {!route?<Text>No route assigned.</Text>:<><View style={s.card}><View style={s.row}><View><Text style={s.h2}>{route.name}</Text><Text style={s.muted}>{route.area}</Text></View><Pill text={trip?.status||'No trip today'}/></View>
 <Text style={s.h3}>Your ordered stop list</Text>{route.stops.map((stop,i)=><View style={s.stop} key={stop.name}><Text style={s.stopNumber}>{i+1}</Text><View style={{flex:1}}><Text style={s.h3}>{stop.name}</Text><Text style={s.muted}>Scheduled {stop.time}</Text></View><Button quiet label={`Directions to stop ${i+1}`} onPress={()=>run(async()=>{await Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lng}&travelmode=driving`);})}/></View>)}
 <Text style={s.muted}>Open directions while parked. Demo stops are illustrative; routes require operator approval.</Text>
 {trip&&<View style={[s.wrap,{marginTop:20}]}><Button label="Start trip" disabled={busy||trip.status!=='scheduled'} onPress={()=>command('start')}/><Button quiet label="Complete trip" disabled={busy||trip.status!=='active'} onPress={()=>command('complete')}/></View>}</View>
 <View style={s.card}><Text style={s.h2}>Rider manifest</Text><Text style={s.muted}>Confirm each event only after it happens. Records are timestamped.</Text>{rides.map(r=><View key={r.id} style={s.rider}><View style={s.row}><View><Text style={s.h3}>{r.name}</Text><Text style={s.muted}>Stop {r.stopIndex+1} · Pickup {time(r.pickupAt)} · Arrival {time(r.dropoffAt)}</Text></View><Pill text={r.status}/></View><View style={s.wrap}><Button label={`Pick up ${r.name}`} disabled={busy||trip?.status!=='active'||r.status!=='waiting'} onPress={()=>command('pickup',r.id)}/><Button quiet label={`Drop off ${r.name}`} disabled={busy||trip?.status!=='active'||r.status!=='onboard'} onPress={()=>command('dropoff',r.id)}/><Button quiet label={`Absent ${r.name}`} disabled={busy||trip?.status!=='active'||r.status!=='waiting'} onPress={()=>command('absent',r.id)}/></View></View>)}</View></>}
 </>}
 {page==='Updates'&&<>{actor.role==='dispatcher'&&<View style={s.card}><Text style={s.h2}>Send a service update</Text><Text style={s.muted}>Appears in the assigned families’ and students’ in-app feed.</Text><View style={s.wrap}>{view.routes.map(r=><Button key={r.id} label={r.bus} quiet={route?.id!==r.id} onPress={()=>setSelected(r.id)}/>)}</View><View style={s.wrap}>{(['delay','cancellation','notice'] as const).map(k=><Button key={k} label={k} quiet={kind!==k} onPress={()=>setKind(k)}/>)}</View><TextInput accessibilityLabel="Service message" style={[s.input,{minHeight:90}]} multiline placeholder="What do families need to know?" maxLength={500} value={message} onChangeText={setMessage}/><Text style={s.muted}>Active from / through (YYYY-MM-DD)</Text><View style={s.wrap}><TextInput accessibilityLabel="Start date" style={[s.input,{flex:1}]} value={from} onChangeText={setFrom}/><TextInput accessibilityLabel="End date" style={[s.input,{flex:1}]} value={until} onChangeText={setUntil}/></View><Button label="Publish update" disabled={busy} onPress={publish}/><Text style={s.muted}>A cancellation notice informs riders; it does not alter trip attendance.</Text></View>}<View style={s.card}><Text style={s.h2}>Active notices</Text>{feed}</View></>}
 {page==='Reports'&&actor.role==='dispatcher'&&<View style={s.card}><Text style={s.h2}>Attendance insights</Text><Text style={s.body}>Loaded ride records: {view.rides.length}</Text><Text style={s.body}>Completed journeys: {durations.length}</Text><Text style={s.body}>Average recorded journey: {durations.length?(durations.reduce((a,b)=>a+b,0)/durations.length).toFixed(1)+' minutes':'Not enough completed trips'}</Text><Text style={s.body}>Marked absent: {view.rides.filter(r=>r.status==='absent').length}</Text><Button label="Export attendance CSV" onPress={exportCsv}/><Text style={s.muted}>Exports record IDs, statuses and timestamps. Summary covers loaded records only (up to 200 in Firebase mode); no invented performance metrics.</Text></View>}
 </View></View>
 {!live&&<Button quiet label="Reset fictional demo" onPress={()=>{setData(seed());setError('');}}/>}
 </>}
 {!!error&&<View accessibilityRole="alert" style={s.error}><Text style={{color:'#972f2f'}}>{error}</Text></View>}
 <Text style={s.footer}>BTS CONNECT / PORTFOLIO MVP · {live?'Live data connection configured':'Demo changes stay on this device'} · No push notifications in this version</Text>
 </ScrollView></SafeAreaView>;
}
const s=StyleSheet.create({safe:{flex:1,backgroundColor:'#f5f6f8'},shell:{padding:24,maxWidth:1350,width:'100%',alignSelf:'center'},header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:16,flexWrap:'wrap',paddingVertical:16},logo:{fontSize:25,fontWeight:'900',letterSpacing:1,color:'#182e40'},banner:{backgroundColor:'#fff5d9',padding:12,borderRadius:8,marginVertical:18},bannerText:{fontSize:12,color:'#705825'},row:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'},wrap:{flexDirection:'row',gap:10,flexWrap:'wrap',marginVertical:10},layout:{flexDirection:'row',gap:28,marginTop:26},nav:{width:185,gap:6},navItem:{padding:15,borderRadius:10},navActive:{backgroundColor:'#182e40'},navText:{fontSize:14,fontWeight:'600',color:'#586775'},main:{flex:1,minWidth:0},eyebrow:{color:'#788591',fontSize:11,fontWeight:'800',letterSpacing:1.8},h1:{fontSize:32,fontWeight:'800',color:'#182e40',marginVertical:10},h2:{fontSize:19,fontWeight:'700',color:'#182e40',marginBottom:10},h3:{fontSize:15,fontWeight:'700',color:'#24384a',marginVertical:8},subtitle:{color:'#687887',fontSize:15,marginBottom:18},body:{fontSize:15,color:'#344959',lineHeight:24,marginVertical:10},muted:{fontSize:12,color:'#6b7b89',lineHeight:19},metric:{flex:1,minWidth:135,padding:22,backgroundColor:'#fff',borderRadius:14,borderWidth:1,borderColor:'#e5e9ed'},number:{fontSize:34,color:'#182e40',fontWeight:'800',marginBottom:8},card:{backgroundColor:'#fff',padding:24,borderRadius:14,borderWidth:1,borderColor:'#e4e9ed',marginVertical:12,gap:8},button:{backgroundColor:'#f3c854',paddingHorizontal:15,paddingVertical:12,borderRadius:8,alignSelf:'flex-start'},quiet:{backgroundColor:'#edf1f4'},pill:{backgroundColor:'#e8f2ef',color:'#2e6e5b',fontSize:10,fontWeight:'800',letterSpacing:1,padding:9,borderRadius:7,overflow:'hidden',alignSelf:'flex-start'},service:{paddingVertical:15,borderBottomWidth:1,borderColor:'#eef1f4',flexDirection:'row',alignItems:'center',gap:12,flexWrap:'wrap'},notice:{borderLeftWidth:3,borderLeftColor:'#e6b744',padding:16,backgroundColor:'#fafbfd',marginVertical:7,borderRadius:6},stop:{flexDirection:'row',alignItems:'center',gap:14,paddingVertical:15,borderBottomWidth:1,borderColor:'#edf1f4',flexWrap:'wrap'},stopNumber:{fontSize:16,fontWeight:'700',backgroundColor:'#fff2cc',padding:12,borderRadius:30,color:'#7c6224'},rider:{paddingVertical:16,borderBottomWidth:1,borderColor:'#edf1f4'},input:{backgroundColor:'#f8fafc',borderWidth:1,borderColor:'#dce3e8',padding:13,borderRadius:8,color:'#182e40',marginVertical:8,minWidth:140},error:{backgroundColor:'#fff0ed',padding:16,marginTop:16,borderRadius:8},footer:{fontSize:10,color:'#7d8b96',marginTop:32,marginBottom:16,lineHeight:18}});
