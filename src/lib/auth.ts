// my-auth-app/lib/auth.ts
import { NextAuthOptions, User as NextAuthUser, Account, Profile } from 'next-auth';
// import { AdapterUser } from "next-auth/adapters"; // AdapterUser не используется напрямую здесь
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Логи переменных окружения (оставьте для отладки, если нужно)
console.log("ENV: GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("ENV: GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "SET" : "NOT SET");
console.log("ENV: NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
console.log("ENV: NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET ? "SET" : "NOT SET");

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'john.doe@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Пожалуйста, введите email и пароль.');
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) {
          throw new Error('Пользователь с таким email не найден.');
        }
        if (!user.password) {
            throw new Error('Этот аккаунт был зарегистрирован через социальную сеть.');
        }
        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (!isValidPassword) {
          throw new Error('Неверный пароль.');
        }
        return { id: user.id, name: user.name, email: user.email, image: user.image };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, trigger, session: sessionFromUpdateTrigger }) {
      console.log('[Auth Callback JWT] Trigger:', trigger, '- User present:', !!user);
      // При первом входе (user объект передается)
      if (user) {
        console.log('[Auth Callback JWT] Initial sign in or account link. Populating token from user object. User ID:', user.id);
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image; // Используем 'picture' как стандартное поле для изображения в JWT
      }

      // Если был вызов update() из useSession() на клиенте
      if (trigger === "update" && sessionFromUpdateTrigger) {
        console.log('[Auth Callback JWT] "update" trigger. New data from client:', sessionFromUpdateTrigger);
        // Обновляем токен данными, переданными в update()
        // Это позволит следующему вызову session() получить актуальные данные
        if (sessionFromUpdateTrigger.user) {
            token.id = sessionFromUpdateTrigger.user.id || token.id; // Обновляем id, если есть
            token.name = sessionFromUpdateTrigger.user.name;
            token.email = sessionFromUpdateTrigger.user.email;
            token.picture = sessionFromUpdateTrigger.user.image;
        }
        // Можно также обновить другие кастомные поля токена, если они есть
        console.log('[Auth Callback JWT] Token updated via "update" trigger:', token);
      }
      // ВАЖНО: Не делаем здесь лишних запросов к БД, если это не специальный сценарий.
      // `revalidatePath` должен заботиться об обновлении данных на страницах,
      // а `updateSession` - об обновлении данных в самой сессии.
      return token;
    },
    async session({ session, token }) {
      console.log('[Auth Callback Session] Populating session from token. Token received:', token);
      // Передаем данные из токена в объект сессии, который будет доступен на клиенте
      if (token && session.user) {
        (session.user as any).id = token.id; // Убедитесь, что ваш тип SessionUser имеет id
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture; // Используем token.picture
      } else if (token) { // Если session.user не был инициализирован
        session.user = {
            id: token.id as string,
            name: token.name,
            email: token.email,
            image: token.picture,
        };
      }
      console.log('[Auth Callback Session] Session to be returned to client:', session);
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};