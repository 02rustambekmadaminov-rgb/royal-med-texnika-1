'use client';import {useEffect,useState} from 'react';
const badge={bor:'bg-emerald-600','kam qoldi':'bg-amber-500',tugagan:'bg-red-600'};
export default function Shop(){
 const [data,setData]=useState({products:[],categories:[]});const [q,setQ]=useState('');const [cat,setCat]=useState('');const [avail,setAvail]=useState(false);
 const [cart,setCart]=useState({});const [f,setF]=useState({name:'',phone:'',address:'',note:''});const [msg,setMsg]=useState('');
 const load=()=>fetch('/api/products').then(r=>r.json()).then(setData);
 useEffect(()=>{load();const t=setInterval(load,15000);return()=>clearInterval(t)},[]); // ombor o‘zgarsa avtomatik yangilanadi
 const list=data.products.filter(p=>p.name.toLowerCase().includes(q.toLowerCase())&&(!cat||p.categoryId==cat)&&(!avail||p.stock>0));
 const items=Object.entries(cart).map(([id,qty])=>({p:data.products.find(x=>x.id==id),qty})).filter(x=>x.p);
 const total=items.reduce((s,x)=>s+x.p.price*x.qty,0);
 const add=p=>setCart(c=>({...c,[p.id]:Math.min((c[p.id]||0)+1,p.stock)}));
 async function order(){const r=await fetch('/api/orders',{method:'POST',body:JSON.stringify({...f,items:items.map(x=>({id:x.p.id,qty:x.qty}))})});const j=await r.json();
  if(j.ok){setMsg(`✅ Zakas #${j.id} qabul qilindi. Tez orada bog‘lanamiz.`);setCart({});load()}else setMsg('❌ '+j.error)}
 return(<div className="grid gap-6 lg:grid-cols-[1fr_320px]"><section>
  <div className="mb-4 flex flex-wrap gap-2"><input className="inp max-w-xs" placeholder="Qidirish..." value={q} onChange={e=>setQ(e.target.value)}/>
   <select className="inp max-w-[200px]" value={cat} onChange={e=>setCat(e.target.value)}><option value="">Barcha kategoriya</option>{data.categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
   <label className="flex items-center gap-2"><input type="checkbox" checked={avail} onChange={e=>setAvail(e.target.checked)}/>Mavjudlari</label></div>
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{list.map(p=><div key={p.id} className="card">
   <h3 className="font-semibold">{p.name}</h3><p className="text-sm opacity-70">{p.description}</p>
   <div className="mt-2 flex items-center justify-between"><b>{p.price.toLocaleString('ru-RU')} so‘m</b><span className={`rounded px-2 py-0.5 text-xs text-white ${badge[p.status]}`}>{p.status}</span></div>
   <button className="btn mt-3 w-full" disabled={p.stock<=0} onClick={()=>add(p)}>Savatga</button></div>)}</div></section>
  <aside className="card h-fit space-y-2"><h2 className="font-bold">Savat</h2>
   {items.map(x=><div key={x.p.id} className="flex justify-between text-sm"><span>{x.p.name} × {x.qty}</span><button onClick={()=>setCart(c=>{const n={...c};delete n[x.p.id];return n})}>✕</button></div>)}
   <div className="font-bold">Jami: {total.toLocaleString('ru-RU')} so‘m</div>
   {['name:Ism','phone:Telefon','address:Manzil / filial','note:Izoh'].map(s=>{const[k,l]=s.split(':');return <input key={k} className="inp" placeholder={l} value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})}/>})}
   <button className="btn w-full" disabled={!items.length||!f.name||!f.phone||!f.address} onClick={order}>Zakas berish</button>{msg&&<p className="text-sm">{msg}</p>}</aside></div>)}
