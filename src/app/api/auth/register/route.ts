import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Не все поля заполнены.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return NextResponse.json({ message: 'Некорректный формат email.' }, { status: 400 });
    }

    if (password.length < 6) {
        return NextResponse.json({ message: 'Пароль должен быть не менее 6 символов.' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Пользователь с таким email уже существует.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: 'Пользователь успешно создан.', userId: user.id }, { status: 201 });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    let errorMessage = 'Внутренняя ошибка сервера.';
    if (error instanceof Error) {
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}