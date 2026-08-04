import { prisma } from '../../../utils/prisma';

export default defineEventHandler(async (event) => {
  const currentUser = event.context.user;
  if (!currentUser) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  if (event.node.req.method === 'GET') {
    const whereClause: any = {};
    if (currentUser.role === 'Admin') {
      // Normal Admins cannot list SuperAdmins
      whereClause.role = { not: 'SuperAdmin' };
    }

    const users = await prisma.users.findMany({
      where: whereClause,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        created_at: true,
        image: true
      }
    });
    return users;
  }
  
  if (event.node.req.method === 'POST') {
    const body = await readBody(event);
    const { username, email, password, role } = body;
    
    if (!username || !email || !password || !role) {
      throw createError({ statusCode: 400, statusMessage: 'All fields are required' });
    }

    // Input length validations matching database schema limits
    if (email.length > 55 || username.length > 50 || password.length > 72) {
      throw createError({ statusCode: 400, statusMessage: 'Input length exceeds limit' });
    }

    if (password.length < 8) {
      throw createError({ statusCode: 400, statusMessage: 'Password must be at least 8 characters long' });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid email address format' });
    }

    // Role validation
    if (role !== 'Admin' && role !== 'SuperAdmin') {
      throw createError({ statusCode: 400, statusMessage: 'Invalid role specified' });
    }

    // Admins cannot create SuperAdmin accounts
    if (role === 'SuperAdmin' && currentUser.role !== 'SuperAdmin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden - Admins cannot create Super Admin accounts'
      });
    }

    // Hash password
    const bcrypt = await import('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
      data: {
        username: sanitizePlainText(username),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        role,
      }
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
});
