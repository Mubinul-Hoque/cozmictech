import { prisma } from './server/utils/prisma';
import bcrypt from 'bcrypt';

async function main() {
  const email = 'superadmin@cozmic.com';
  const hashedPassword = await bcrypt.hash('superadmin123', 10);

  const existing = await prisma.user.findFirst({ where: { email } });
  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: { password: hashedPassword, role: 'Admin' }
    });
    console.log('Admin user updated successfully! You can now log in.');
  } else {
    await prisma.user.create({
      data: {
        username: 'SuperAdmin',
        email,
        password: hashedPassword,
        role: 'Admin',
      }
    });
    console.log('Admin user created successfully! You can now log in.');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // wait a moment before exit
  });
