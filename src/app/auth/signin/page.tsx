'use client';

import { useState, FormEvent, useEffect, Suspense } from 'react';
import { signIn, getProviders, ClientSafeProvider, LiteralUnion } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BuiltInProviderType } from 'next-auth/providers/index';
import Spinner from '@/components/spinner';
import { LogIn, AlertCircle, ArrowLeft, Home, UserPlus } from 'lucide-react';

const primaryColorTextClass = "text-[#143c80]";
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

function SignInFormComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const authError = searchParams.get('error');

  const [providers, setProviders] = useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    fetchProviders();
  }, []);

  useEffect(() => {
    if (authError) {
      switch (authError) {
        case 'CredentialsSignin': setError('Неверный email или пароль.'); break;
        case 'OAuthSignin': case 'OAuthCallback': case 'OAuthCreateAccount':
        case 'EmailCreateAccount': case 'Callback':
          setError('Ошибка входа через OAuth. Попробуйте еще раз.'); break;
        default: setError('Произошла ошибка входа. Попробуйте еще раз.');
      }
    }
  }, [authError]);


  const handleCredentialsSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signIn('credentials', { redirect: false, email, password, callbackUrl });
    setLoading(false);
    if (result?.error) {
      router.push(`/auth/signin?error=${result.error}&callbackUrl=${encodeURIComponent(callbackUrl)}`);
    } else if (result?.ok) {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  const handleOAuthSignIn = (providerId: string) => {
    setLoading(true);
    setOauthLoading(providerId);
    signIn(providerId, { callbackUrl });
  };

  const inputClasses = `mt-1 block w-full rounded-lg border ${lightBorderColorClass} p-3 shadow-sm focus:border-[#0d2d62] focus:ring-1 focus:ring-[#0d2d62] sm:text-sm bg-white ${primaryColorTextClass} placeholder:text-[#143c80]/50`;
  const labelClasses = `block text-sm font-medium ${primaryColorTextClass}`;
  const buttonPrimaryClassesStyles = `w-full flex justify-center items-center rounded-md ${primaryColorBgClass} px-4 py-3 text-sm font-semibold text-white shadow-sm hover:${accentColorBgClass} focus:outline-none focus:ring-2 focus:ring-[#0d2d62] focus:ring-offset-2 focus:ring-offset-white disabled:opacity-60 transition-colors duration-150`;
  const buttonOAuthClasses = `w-full flex justify-center items-center rounded-md border ${lightBorderColorClass} bg-white px-4 py-3 text-sm font-medium ${primaryColorTextClass} shadow-sm hover:bg-[#143c80]/5 focus:outline-none focus:ring-2 focus:ring-[#0d2d62] focus:ring-offset-2 focus:ring-offset-white disabled:opacity-60 transition-colors duration-150`;


  return (
    <div className="relative min-h-screen bg-white">
      <AnimatedBackground />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className={`w-full max-w-md rounded-xl bg-white/90 backdrop-blur-md p-8 shadow-2xl border ${lightBorderColorClass}`}>
          <div className="text-center mb-8">
            <LogIn size={48} className={`${accentColorTextClass} mx-auto mb-3`} />
            <h1 className={`text-3xl font-bold ${accentColorTextClass}`}>Вход</h1>
          </div>

          {error && (
            <div className={`mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200 flex items-start`}>
                <AlertCircle size={20} className="mr-2 flex-shrink-0 text-red-500" />
                <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleCredentialsSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className={labelClasses}>Email</label>
              <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClasses} disabled={loading}/>
            </div>
            <div>
              <label htmlFor="password" className={labelClasses}>Пароль</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClasses} disabled={loading}/>
            </div>
            <button type="submit" disabled={loading} className={buttonPrimaryClassesStyles}>
              {loading && !oauthLoading ? <Spinner text="" size="small" /> : 'Войти с Email'}
            </button>
          </form>

          {providers && Object.values(providers).some(p => p.id !== 'credentials') && (
            <>
              <div className="my-6 flex items-center">
                <div className={`flex-grow border-t ${lightBorderColorClass}`}></div>
                <span className={`mx-4 flex-shrink text-sm ${secondaryTextColorClass}`}>Или войдите через</span>
                <div className={`flex-grow border-t ${lightBorderColorClass}`}></div>
              </div>
              <div className="space-y-3">
                {Object.values(providers).map((provider) => {
                  if (provider.id === 'credentials') return null;
                  return (
                    <div key={provider.name}>
                      <button onClick={() => handleOAuthSignIn(provider.id)} disabled={loading} className={buttonOAuthClasses}>
                        {loading && oauthLoading === provider.id ? <Spinner text="" size="small" /> : `Войти через ${provider.name}`}
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          <p className={`mt-8 text-center text-sm ${secondaryTextColorClass}`}>
            Нет аккаунта?{' '}
            <Link href="/auth/register" className={`font-medium ${accentColorTextClass} hover:underline`}>
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className={`flex justify-center items-center min-h-screen bg-white ${primaryColorTextClass}`}><Spinner text="Загрузка..." size="large"/></div>}>
      <SignInFormComponent />
    </Suspense>
  );
}
