import { Prisma } from '@prisma/client';

export const ReturnUserObject: Prisma.UserSelect = {
  id: true,
  email: true,
  role: true,
  password: false,
  subordinates: true,
};
