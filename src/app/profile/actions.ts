'use server';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const UpdateNameSchema = z.object({
  name: z.string().min(1, "Имя не может быть пустым.").max(100, "Имя слишком длинное (макс. 100 симв)."),
});
const UpdateEmailSchema = z.object({
  email: z.string().email("Некорректный формат email."),
});
const UpdateImageSchema = z.object({
  imageUrl: z.string().url("Некорректный URL изображения.").or(z.literal("")).optional().nullable(),
});

interface ActionResult {
  success: boolean;
  message: string;
  field?: 'name' | 'email' | 'imageUrl';
  updatedUser?: { name?: string | null; email?: string | null; image?: string | null };
}

async function performUserUpdate(
  userId: string,
  dataToUpdate: Record<string, any>,
  successMessage: string,
  errorField: 'name' | 'email' | 'imageUrl'
): Promise<ActionResult> {
  try {
    console.log(`[Action:performUserUpdate] User: ${userId}, Data:`, dataToUpdate);
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: { name: true, email: true, image: true },
    });
    console.log(`[Action:performUserUpdate] DB Update Success. User:`, updatedUser);

    revalidatePath('/profile');
    revalidatePath('/');
    console.log(`[Action:performUserUpdate] Paths revalidated.`);

    return { success: true, message: successMessage, updatedUser };
  } catch (error: any) {
    console.error(`[Action:performUserUpdate] Prisma Error:`, error);
    if (error.code === 'P2002' && error.meta?.target?.includes('email') && errorField === 'email') {
      return { success: false, message: 'Этот email уже используется.', field: 'email' };
    }
    return { success: false, message: `Ошибка сервера при обновлении ${errorField}.`, field: errorField };
  }
}

export async function updateProfileName(formData: FormData): Promise<ActionResult> {
  console.log('[Action:updateProfileName] Received FormData name:', formData.get('name'));
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, message: 'Не авторизован.' };

  const validation = UpdateNameSchema.safeParse({ name: formData.get('name') });
  if (!validation.success) {
    return { success: false, message: validation.error.errors[0].message, field: 'name' };
  }
  return performUserUpdate(session.user.id, { name: validation.data.name }, 'Имя успешно обновлено!', 'name');
}

export async function updateProfileEmail(formData: FormData): Promise<ActionResult> {
  console.log('[Action:updateProfileEmail] Received FormData email:', formData.get('email'));
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, message: 'Не авторизован.' };

  const validation = UpdateEmailSchema.safeParse({ email: formData.get('email') });
  if (!validation.success) {
    return { success: false, message: validation.error.errors[0].message, field: 'email' };
  }

  if (validation.data.email.toLowerCase() !== session.user.email?.toLowerCase()) {
    const existingUser = await prisma.user.findUnique({ where: { email: validation.data.email } });
    if (existingUser) {
      return { success: false, message: 'Этот email уже используется другим пользователем.', field: 'email' };
    }
  }
  return performUserUpdate(session.user.id, { email: validation.data.email }, 'Email успешно обновлен!', 'email');
}

export async function updateProfileImage(formData: FormData): Promise<ActionResult> {
  console.log('[Action:updateProfileImage] Received FormData imageUrl:', formData.get('imageUrl'));
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, message: 'Не авторизован.' };

  const validation = UpdateImageSchema.safeParse({ imageUrl: formData.get('imageUrl') });
  if (!validation.success) {
    return { success: false, message: validation.error.errors[0].message, field: 'imageUrl' };
  }

  const imageToSave = validation.data.imageUrl?.trim() ? validation.data.imageUrl.trim() : null;
  console.log('[Action:updateProfileImage] Image to save in DB:', imageToSave);
  return performUserUpdate(session.user.id, { image: imageToSave }, 'Фото профиля успешно обновлено!', 'imageUrl');
}