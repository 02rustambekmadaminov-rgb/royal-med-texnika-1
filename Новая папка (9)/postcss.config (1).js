import {db} from '@/lib/db';import {isAdmin,deny} from '@/lib/auth';
export const dynamic='force-dynamic';
export async function GET(req){if(!isAdmin(req))return deny();
const orders=await db.order.findMany({include:{items:{include:{product:true}}},orderBy:{id:'desc'}});
const top=await db.orderItem.groupBy({by:['productId'],_sum:{qty:true},orderBy:{_sum:{qty:'desc'}},take:5});
return Response.json({orders,sold:orders.reduce((s,o)=>s+o.total,0),top})}
export async function PATCH(req){if(!isAdmin(req))return deny();const {id,status}=await req.json();
return Response.json(await db.order.update({where:{id},data:{status}}))}
