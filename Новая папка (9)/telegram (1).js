import {db,withStatus} from '@/lib/db';import {isAdmin,deny} from '@/lib/auth';
export async function POST(req){if(!isAdmin(req))return deny();const d=await req.json();
return Response.json(withStatus(await db.product.create({data:{name:d.name,description:d.description||'',price:+d.price,stock:+d.stock||0,images:d.images||[]}})))}
export async function PATCH(req){if(!isAdmin(req))return deny();const {id,...d}=await req.json();
if(d.price!=null)d.price=+d.price;if(d.stock!=null)d.stock=+d.stock;
return Response.json(withStatus(await db.product.update({where:{id},data:d})))}
export async function DELETE(req){if(!isAdmin(req))return deny();const {id}=await req.json();
await db.product.delete({where:{id}}).catch(()=>{});return Response.json({ok:true})}
