'use client';
export default function T(){return <button className="rounded-lg border border-white/20 px-3 py-1" onClick={()=>{const d=document.documentElement.classList.toggle('dark');localStorage.theme=d?'dark':'light'}}>🌓</button>}
