import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

export async function createRandomUser() {
  const email = faker.internet.email();
  return {
    email,
    password: await argon2.hash('qwerty'),
    role: 'USER',
  };
}

async function main() {
  const prisma = new PrismaClient();

  //clean db
  await prisma.$transaction([prisma.user.deleteMany()]);

  //create admin
  await prisma.user.create({
    data: {
      email: 'admin@gmail.com',
      password: await argon2.hash('qwerty'),
      role: 'ADMIN',
    },
  });

  // crete boss
  const boss1 = await prisma.user.create({
    data: {
      email: 'boss@gmail.com',
      password: await argon2.hash('qwerty'),
      role: 'BOSS',
    },
  });

  const boss2 = await prisma.user.create({
    data: {
      email: 'boss2@gmail.com',
      password: await argon2.hash('qwerty'),
      role: 'BOSS',
    },
  });

  // create users
  for (let i = 0; i <= 5; ++i) {
    const userData = await createRandomUser();
    await prisma.user.create({
      data: {
        email: userData.email,
        password: userData.password,
        role: userData.role,
        bossId: boss1.id,
      },
    });
  }

  for (let i = 0; i <= 5; ++i) {
    const userData = await createRandomUser();
    await prisma.user.create({
      data: {
        email: userData.email,
        password: userData.password,
        role: userData.role,
        bossId: boss2.id,
      },
    });
  }
}

main();
