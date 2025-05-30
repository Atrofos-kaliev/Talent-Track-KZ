'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Spinner from '@/components/spinner';
import { UserPlus, AlertCircle, CheckCircle2, LogIn, ArrowLeft, Home } from 'lucide-react';

const primaryColorTextClass = "text-[#143c80]";
const primaryColorBorderClass = "border-[#143c80]";
const primaryColorBgClass = "bg-[#143c80]";
const accentColorTextClass = "text-[#0d2d62]";
const accentColorBgClass = "bg-[#0d2d62]";
const secondaryTextColorClass = "text-[#143c80]/80";
const lightBorderColorClass = "border-[#143c80]/20";

const AnimatedBackground = () => (
  <>
    <div className="bgSquaresUp" aria-hidden="true">
      {[...Array(10)].map((_, i) => <div key={`up-${i}`} className="squareUp"></div>)}
    </div>
    <div className="bgSquaresDown" aria-hidden="true">
      {[...Array(10)].map((_, i) => <div key={`down-${i}`} className="squareDown"></div>)}
    </div>
  </>
);

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (password.length < 6) {
        setError('Пароль должен быть не менее 6 символов.');
        setLoading(false);
        return;
    }

    try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || 'Произошла ошибка при регистрации.');
        } else {
          setSuccess('Регистрация успешна! Перенаправляем на страницу входа...');
          setName('');
          setEmail('');
          setPassword('');
          setTimeout(() => {
            router.push('/auth/signin');
          }, 2500);
        }
    } catch (e) {
        setError('Не удалось связаться с сервером. Попробуйте позже.');
        console.error("Registration error:", e);
    } finally {
        setLoading(false);
    }
  };

  const inputClasses = `mt-1 block w-full rounded-lg border ${lightBorderColorClass} p-3 shadow-sm focus:border-[#0d2d62] focus:ring-1 focus:ring-[#0d2d62] sm:text-sm bg-white ${primaryColorTextClass} placeholder:text-[#143c80]/50`;
  const labelClasses = `block text-sm font-medium ${primaryColorTextClass}`;
  const buttonClasses = `w-full flex justify-center items-center rounded-md ${primaryColorBgClass} px-4 py-3 text-sm font-semibold text-white shadow-sm hover:${accentColorBgClass} focus:outline-none focus:ring-2 focus:ring-[#0d2d62] focus:ring-offset-2 focus:ring-offset-white disabled:opacity-60 transition-colors duration-150`;

  return (
    <div className="relative min-h-screen bg-white">
      <AnimatedBackground />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className={`w-full max-w-md rounded-xl bg-white/90 backdrop-blur-md p-8 shadow-2xl border ${lightBorderColorClass}`}>
          <div className="text-center mb-8">
            <UserPlus size={48} className={`${accentColorTextClass} mx-auto mb-3`} />
            <h1 className={`text-3xl font-bold ${accentColorTextClass}`}>Регистрация</h1>
          </div>

          {error && (
            <div className={`mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200 flex items-start`}>
                <AlertCircle size={20} className="mr-2 flex-shrink-0 text-red-500" />
                <span>{error}</span>
            </div>
          )}
          {success && (
            <div className={`mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-200 flex items-start`}>
                <CheckCircle2 size={20} className="mr-2 flex-shrink-0 text-green-500" />
                <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className={labelClasses}>Имя</label>
              <input id="name" name="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className={inputClasses} disabled={loading || !!success}/>
            </div>
            <div>
              <label htmlFor="email" className={labelClasses}>Email</label>
              <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClasses} disabled={loading || !!success}/>
            </div>
            <div>
              <label htmlFor="password" className={labelClasses}>Пароль (минимум 6 символов)</label>
              <input id="password" name="password" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClasses} disabled={loading || !!success}/>
            </div>
            <button type="submit" disabled={loading || !!success} className={buttonClasses}>
              {loading ? <Spinner text="" size="small" /> : 'Зарегистрироваться'}
            </button>
          </form>
          <p className={`mt-8 text-center text-sm ${secondaryTextColorClass}`}>
            Уже есть аккаунт?{' '}
            <Link href="/auth/signin" className={`font-medium ${accentColorTextClass} hover:underline`}>
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
