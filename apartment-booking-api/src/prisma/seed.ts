import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/hash';
import { apartmentData } from './apartment-data';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const ownerPassword = await hashPassword('password');

  const user = await prisma.user.upsert({
    where: { email: 'abdelrhmanammar.cs@gmail.com' },
    update: {},
    create: {
      name: 'Apdelrhman Ammar',
      email: 'abdelrhmanammar.cs@gmail.com',
      phone: '01122285075',
      password: ownerPassword,
      role: 'USER',
    },
  });

  console.log('Seeding apartments...');
  for (let i = 0; i < apartmentData.length; i++) {
    const apartmentId = i + 1;
    const apartmentInfo = apartmentData[i];

    await prisma.apartment.upsert({
      where: { id: apartmentId },
      update: {},
      create: {
        ...apartmentInfo,
        owner: { connect: { id: user.id } }
      },
    });
  }

  console.log('Database seeding completed.');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
