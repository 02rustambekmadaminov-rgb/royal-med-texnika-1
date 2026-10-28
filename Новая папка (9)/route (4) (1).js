'use client';import {useEffect,useState} from 'react';
export default function Admin(){
 const [tok,setTok]=useState('');const [cr,setCr]=useState({username:'',password:''});const [tab,setTab]=useState('products');
 const [prods,setProds]=useState([]);const [ords,setOrds]=useState({orders:[],sold:0});const [groups,setGroups]=useState([]);const [np,setNp]=useState({name:'',price:'',stock:'',description:'',img:''});
 const [bc,setBc]=useState({text:'',photo:''});const [res,setRes]=useState([]);const [g,setG]=useState({chatId:'',groupName:''});
 const H=()=>({Authorization:'Bearer '+tok,'Content-Type':'application/json'});
 const call=(u,m,b)=>fetch(u,{method:m,headers:H(),body:b&&JSON.stringify(b)}).then(r=>r.json());
 const load=async()=>{setProds((await fetch('/api/products').then(r=>r.json())).products);setOrds(await call('/api/admin/orders','GET'));setGroups(await call('/api/admin/broadcast','GET'))};
 useEffect(()=>{setTok(localStorage.tok||'')},[]);useEffect(()=>{if(tok)load()},[tok]);
 async function login(){const j=await fetch('/api/admin/login',{method:'POST',body:JSON.stringify(cr)}).then(r=>r.json());if(j.token){localStorage.tok=j.token;setTok(j.token)}else alert(j.error)}
 if(!tok)return(<div className="card mx-auto max-w-sm space-y-2"><h1 className="font-bold">Admin kirish</h1>
  <input className="inp" placeholder="Login" onChange={e=>setCr({...cr,username:e.target.value})}/><input className="inp" type="password" placeholder="Parol" onChange={e=>setCr({...cr,password:e.target.value})}/><button className="btn w-full" onClick={login}>Kirish</button></div>);
 return(<div className="space-y-4"><div className="flex gap-2">{['products','orders','telegram'].map(t=><button key={t} className={`btn ${tab!==t&&'!bg-slate-600'}`} onClick={()=>setTab(t)}>{{products:'Ombor',orders:'Buyurtmalar',telegram:'Telegram'}[t]}</button>)}</div>
 {tab==='products'&&<div className="space-y-3"><div className="card grid gap-2 sm:grid-cols-6">{['name:Nomi','price:Narxi','stock:Miqdor','description:Tavsif','img:Rasm URL'].map(s=>{const[k,l]=s.split(':');return <input key={k} className="inp" placeholder={l} value={np[k]} onChange={e=>setNp({...np,[k]:e.target.value})}/>})}
  <button className="btn" onClick={async()=>{await call('/api/admin/products','POST',{...np,images:np.img?[np.img]:[]});setNp({name:'',price:'',stock:'',description:'',img:''});load()}}>Qo‘shish</button></div>
  {prods.map(p=><div key={p.id} className="card flex items-center gap-3"><span className="flex-1">{p.name} — {p.price.toLocaleString('ru-RU')} <i className="opacity-60">({p.status})</i></span>
   <input className="inp !w-24" type="number" defaultValue={p.stock} onBlur={async e=>{await call('/api/admin/products','PATCH',{id:p.id,stock:e.target.value});load()}}/>
   <button onClick={async()=>{if(confirm('O‘chirilsinmi?')){await call('/api/admin/products','DELETE',{id:p.id});load()}}}>🗑</button></div>)}</div>}
 {tab==='orders'&&<div className="space-y-3"><div className="card">Jami sotuv: <b>{ords.sold?.toLocaleString('ru-RU')} so‘m</b> · Zakaslar: {ords.orders.length}</div>
  {ords.orders.map(o=><div key={o.id} className="card"><b>#{o.id} {o.customerName}</b> · {o.phone} · {o.address}<div className="text-sm opacity-70">{o.items.map(i=>`${i.product.name}×${i.qty}`).join(', ')} — {o.total.toLocaleString('ru-RU')}</div>
   <select className="inp mt-2 max-w-[220px]" value={o.status} onChange={async e=>{await call('/api/admin/orders','PATCH',{id:o.id,status:e.target.value});load()}}>{['yangi','tasdiqlangan','yetkazilmoqda','yakunlangan'].map(s=><option key={s}>{s}</option>)}</select></div>)}</div>}
 {tab==='telegram'&&<div className="space-y-3"><div className="card space-y-2"><h2 className="font-bold">Yangilik yuborish</h2>
  <textarea className="inp" rows={4} placeholder="Matn" onChange={e=>setBc({...bc,text:e.target.value})}/><input className="inp" placeholder="Rasm URL (ixtiyoriy)" onChange={e=>setBc({...bc,photo:e.target.value})}/>
  <button className="btn" onClick={async()=>{if(confirm(`${groups.filter(x=>x.isActive).length} ta guruhga yuborilsinmi?`))setRes((await call('/api/admin/broadcast','POST',bc)).results)}}>Hammasiga yuborish</button>
  {res.map((r,i)=><div key={i} className="text-sm">{r.ok?'✅':'❌'} {r.group} {r.error}</div>)}</div>
  <div className="card space-y-2"><h2 className="font-bold">Guruhlar ({groups.length})</h2>{groups.map(x=><div key={x.id} className="text-sm">{x.isActive?'🟢':'⚪'} {x.groupName} ({x.chatId})</div>)}
  <div className="flex gap-2"><input className="inp" placeholder="Chat ID (-100...)" onChange={e=>setG({...g,chatId:e.target.value})}/><input className="inp" placeholder="Guruh nomi" onChange={e=>setG({...g,groupName:e.target.value})}/><button className="btn" onClick={async()=>{await call('/api/admin/broadcast','PUT',g);load()}}>+</button></div></div></div>}</div>)}
