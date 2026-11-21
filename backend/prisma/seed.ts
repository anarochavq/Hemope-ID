import { PrismaClient, Role, QueueStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
async function main(){
 const existingUsers = await prisma.user.count();
 if (existingUsers > 0) { console.log('Seed ignorado: dados já existem no banco.'); return; }
 const passwordHash=await bcrypt.hash('Hemope@123',10);
 await prisma.user.createMany({data:[{name:'Administrador Demo',email:'admin@hemope.local',passwordHash,role:Role.ADMIN},{name:'Atendente Demo',email:'recepcao@hemope.local',passwordHash,role:Role.ATENDENTE},{name:'Profissional Demo',email:'saude@hemope.local',passwordHash,role:Role.SAUDE}]});
 const names=['Mariana Costa','João Pedro Lima','Ana Clara Souza','Rafael Oliveira','Beatriz Santos','Lucas Ferreira','Camila Alves','Pedro Henrique Melo','Isabela Rocha','Gabriel Nunes'];
 for(let i=0;i<10;i++){await prisma.donor.create({data:{code:`D${String(i+1).padStart(4,'0')}`,name:names[i],cpf:`000000000${String(i+1).padStart(2,'0')}`,phone:`(87) 9${String(80000000+i).slice(-8)}`,email:`doador${i+1}@exemplo.local`,nfcToken:`DEMO-NFC-${String(i+1).padStart(3,'0')}`}})}
 const today=new Date().toISOString().slice(0,10);
 await prisma.visit.createMany({data:[{donorId:(await prisma.donor.findUniqueOrThrow({where:{code:'D0001'}})).id,ticketDate:today,ticketNumber:1,status:QueueStatus.WAITING},{donorId:(await prisma.donor.findUniqueOrThrow({where:{code:'D0002'}})).id,ticketDate:today,ticketNumber:2,status:QueueStatus.WAITING}]});
 console.log('Seed concluído. Senha para todos: Hemope@123');
}
main().finally(()=>prisma.$disconnect());
