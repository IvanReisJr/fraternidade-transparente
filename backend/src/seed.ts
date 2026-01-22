import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Admin User
  const adminEmail = 'admin@fraternidade.org';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: hashedPassword,
        role: Role.ADMIN,
      },
    });
    console.log('Admin user created');
  } else {
    console.log('Admin user already exists');
  }

  // 2. Create Initial Units
  const units = [
    { name: 'Sede Administrativa', address: 'Rua Principal, 123', responsiblePerson: 'João Silva' },
    { name: 'Unidade Social Centro', address: 'Av. Central, 456', responsiblePerson: 'Maria Oliveira' },
  ];

  for (const unit of units) {
    const existing = await prisma.unit.findFirst({ where: { name: unit.name } });
    if (!existing) {
      await prisma.unit.create({ data: unit });
    }
  }
  console.log('Units seeded');

  // 3. Create Cost Centers
  const costCenters = [
    { code: 'CC-001', name: 'Despesas Administrativas', description: 'Gastos gerais de escritório' },
    { code: 'CC-002', name: 'Alimentação', description: 'Compras de alimentos para doação' },
    { code: 'CC-003', name: 'Manutenção Predial', description: 'Reparos e conservação' },
    { code: 'CC-004', name: 'Transporte', description: 'Combustível e manutenção de veículos' },
  ];

  for (const cc of costCenters) {
    const existing = await prisma.costCenter.findUnique({ where: { code: cc.code } });
    if (!existing) {
      await prisma.costCenter.create({ data: cc });
    }
  }
  console.log('Cost Centers seeded');

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
