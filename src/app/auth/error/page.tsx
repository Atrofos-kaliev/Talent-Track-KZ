'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  let errorMessage = "Произошла ошибка во время аутентификации.";
  let errorDetails = "";

  if (error) {
    switch (error) {
      case "Configuration":
        errorMessage = "Ошибка конфигурации сервера.";
        errorDetails = "Пожалуйста, свяжитесь с администратором.";
        break;
      case "AccessDenied":
        errorMessage = "Доступ запрещен.";
        errorDetails = "У вас нет прав для доступа к этой странице или действию.";
        break;
      case "Verification":
        errorMessage = "Ошибка верификации.";
        errorDetails = "Ссылка для верификации недействительна или истек ее срок действия.";
        break;
      case "CredentialsSignin":
        errorMessage = "Ошибка входа.";
        errorDetails = "Неверный email или пароль. Пожалуйста, попробуйте снова.";
        break;
      default:
        errorMessage = `Произошла ошибка: ${error}`;
        errorDetails = "Пожалуйста, попробуйте снова или свяжитесь с поддержкой.";
    }
  }


  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-xl">
        <h1 className="mb-4 text-3xl font-bold text-red-600">Ошибка аутентификации</h1>
        <p className="mb-2 text-gray-700">{errorMessage}</p>
        {errorDetails && <p className="mb-6 text-sm text-gray-500">{errorDetails}</p>}
        <Link
          href="/auth/signin"
          className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Вернуться на страницу входа
        </Link>
      </div>
    </div>
  );
}


export default function AuthErrorPage() {
    return (
      <Suspense fallback={<div>Загрузка страницы ошибки...</div>}>
        <ErrorContent />
      </Suspense>
    );
}