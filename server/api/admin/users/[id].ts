import { prisma } from '../../../utils/prisma';

export default defineEventHandler(async (event) => {
  const currentUser = event.context.user;
  if (!currentUser) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const id = parseInt(event.context.params?.id || '0');
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid ID' });

  // Fetch the target user details to check their role before performing any actions
  const targetUser = await prisma.user.findUnique({
    where: { id }
  });
  if (!targetUser) throw createError({ statusCode: 404, statusMessage: 'User not found' });

  // Guard: Regular Admins are not authorized to CRUD Super Admin users
  if (targetUser.role === 'SuperAdmin' && currentUser.role !== 'SuperAdmin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden - Admins are not authorized to view, edit, or delete Super Admin records'
    });
  }

  if (event.node.req.method === 'GET') {
    return {
      id: targetUser.id,
      username: targetUser.username,
      email: targetUser.email,
      role: targetUser.role,
      image: targetUser.image
    };
  }

  if (event.node.req.method === 'PUT') {
    const body = await readBody(event);
    const { username, email, role, password } = body;
    
    if (!username || !email || !role) {
      throw createError({ statusCode: 400, statusMessage: 'Username, email, and role are required' });
    }

    // Input length validations
    if (email.length > 55 || username.length > 50 || (password && password.length > 72)) {
      throw createError({ statusCode: 400, statusMessage: 'Input length exceeds limit' });
    }

    if (password && password.length < 8) {
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

    // Guard: Regular Admins cannot promote any user to SuperAdmin
    if (role === 'SuperAdmin' && currentUser.role !== 'SuperAdmin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden - Admins are not authorized to promote accounts to Super Admin'
      });
    }

    const updateData: any = { 
      username: sanitizePlainText(username), 
      email: email.trim().toLowerCase(), 
      role 
    };
    
    if (password) {
      const bcrypt = await import('bcrypt');
      updateData.password = await bcrypt.hash(password, 12); // Use 12 rounds for a balance of speed/security
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData
    });
    
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  if (event.node.req.method === 'DELETE') {
    await prisma.user.delete({ where: { id } });
    return { success: true };
  }
});
