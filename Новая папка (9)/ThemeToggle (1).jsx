const {PrismaClient}=require('@prisma/client');const b=require('bcryptjs');const p=new PrismaClient();
(async()=>{const h=await b.hash(process.env.ADMIN_PASS,10);
await p.adminUser.upsert({where:{username:process.env.ADMIN_USER},update:{passwordHash:h},create:{username:process.env.ADMIN_USER,passwordHash:h}});
const c=await p.category.upsert({where:{name:'Diagnostika asboblari'},update:{},create:{name:'Diagnostika asboblari'}});
await p.product.create({data:{name:'Tonometr AND UA-888',description:'Avtomatik qon bosimi o‘lchagich',price:450000,stock:12,images:[],categoryId:c.id}});
console.log('OK')})();
