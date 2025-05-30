'use client';

import { useSession, SessionProvider } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect, FormEvent, useCallback, useTransition, Suspense } from 'react';
import { updateProfileName, updateProfileEmail, updateProfileImage } from './actions';
import Spinner from '@/components/spinner';
import { User, Mail, ImageIcon as ProfileImageIcon, Save, AlertCircle, CheckCircle2, ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';

const primaryColorTextClass = "text-[#143c80]";
const primaryColorBorderClass = "border-[#143c80]";
const primaryColorBgClass = "bg-[#143c80]";
const accentColorTextClass = "text-[#0d2d62]";
const accentColorBgClass = "bg-[#0d2d62]";
const secondaryTextColorClass = "text-[#143c80]/80";
const lightBorderColorClass = "border-[#143c80]/20";
const lightestBgColorClass = "bg-[#143c80]/10";

interface ActionResult {
  success: boolean; message: string; field?: 'name' | 'email' | 'imageUrl';
  updatedUser?: { name?: string | null; email?: string | null; image?: string | null; };
}

const DEFAULT_AVATAR_PLACEHOLDER_DATA_URL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNjQiIGN5PSI2NCIgcj0iNjQiIGZpbGw9IiNlYWViZjEiLz48cGF0aCBkPSJNNjQgODBWMTA0TTY0IDgwQzU0LjA1ODkgODAgNDYgODguMDU4OSA0NiAxMDhDNDYgMTI3Ljk0MSA1NC4wNTg5IDEzNiA2NCAxMzZDNzMuOTQxMSAxMzYgODIgMTI3Ljk0MSA4MiAxMDhDODIgODguMDU4OSA3My45NDExIDgwIDY0IDgwWiIgZmlsbD0id2hpdGUiIHN0cm9rZT0iI2M2ZDFlMyIgc3Ryb2tlLXdpZHRoPSI0Ii8+PGNpcmNsZSBjeD0iNjQiIGN5PSI1MiIgcj0iMTYiIGZpbGw9IndoaXRlIiBzdHJva2U9IiNjNmQxZTMiIHN0cm9rZT13aWR0aD0iNCIvPjwvc3ZnPg==";

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

function ProfileFormComponent() {
  const { data: session, status, update: updateClientSession } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [displayAvatarUrl, setDisplayAvatarUrl] = useState<string | null>(null);

  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [generalMessage, setGeneralMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setNameInput(session.user.name || '');
      setEmailInput(session.user.email || '');
      const userImage = session.user.image;
      setImageUrlInput(userImage || '');
      setDisplayAvatarUrl(userImage && userImage.trim() !== '' ? userImage : DEFAULT_AVATAR_PLACEHOLDER_DATA_URL);
    } else if (status === 'unauthenticated') {
      if (typeof window !== 'undefined') router.push('/auth/signin?callbackUrl=/profile');
    }
  }, [session, status, router]);

  const showGeneralMessage = (type: 'success' | 'error', text: string) => {
    setGeneralMessage({ type, text });
    setTimeout(() => setGeneralMessage(null), 4000);
  };

  const handleActionResult = useCallback(async (result: ActionResult, fieldInvoked?: 'name' | 'email' | 'imageUrl') => {
    if (result.success) {
      showGeneralMessage('success', result.message);
      if (result.updatedUser) {
        await updateClientSession({ user: { ...session?.user, ...result.updatedUser } });
        if (result.updatedUser.name !== undefined) setNameInput(result.updatedUser.name || '');
        if (result.updatedUser.email !== undefined) setEmailInput(result.updatedUser.email || '');
        if (result.updatedUser.image !== undefined) {
            const newImage = result.updatedUser.image;
            setImageUrlInput(newImage || '');
            setDisplayAvatarUrl(newImage && newImage.trim() !== '' ? newImage : DEFAULT_AVATAR_PLACEHOLDER_DATA_URL);
        }
      } else { await updateClientSession(); }
    } else {
      if (result.field === 'name' && fieldInvoked === 'name') setNameError(result.message);
      else if (result.field === 'email' && fieldInvoked === 'email') setEmailError(result.message);
      else if (result.field === 'imageUrl' && fieldInvoked === 'imageUrl') setImageError(result.message);
      else showGeneralMessage('error', result.message);
    }
  }, [updateClientSession, session?.user]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>, action: (formData: FormData) => Promise<ActionResult>, fieldName: 'name' | 'email' | 'imageUrl') => {
    e.preventDefault();
    if (fieldName === 'name') setNameError(null);
    if (fieldName === 'email') setEmailError(null);
    if (fieldName === 'imageUrl') setImageError(null);
    setGeneralMessage(null);
    const formData = new FormData(e.currentTarget);
    if (fieldName === 'imageUrl') { formData.set('imageUrl', imageUrlInput); }
    startTransition(async () => { const result = await action(formData); await handleActionResult(result, fieldName); });
  };

  const inputClasses = `mt-1 block w-full px-4 py-3 border ${lightBorderColorClass} rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0d2d62] focus:border-[#0d2d62] sm:text-sm transition-colors duration-150 bg-white ${primaryColorTextClass} placeholder:text-[#143c80]/50`;
  const buttonClasses = `w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white ${primaryColorBgClass} hover:${accentColorBgClass} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-[#0d2d62] disabled:opacity-60 transition-colors duration-150`;
  const labelClasses = `block text-sm font-medium ${primaryColorTextClass}`;


  if (status === 'loading') return <div className={`flex justify-center items-center min-h-screen bg-white`}><Spinner text="Загрузка профиля..." size="large"/></div>;
  if (!session?.user) return (
    <div className="relative min-h-screen bg-white">
        <AnimatedBackground />
        <div className="relative z-10 flex flex-col justify-center items-center min-h-screen p-4">
            <div className={`p-8 rounded-xl bg-white/90 backdrop-blur-md shadow-2xl border ${lightBorderColorClass} text-center`}>
                <User size={48} className={`${accentColorTextClass} mx-auto mb-4`}/>
                <p className={`text-lg ${primaryColorTextClass} mb-6`}>Пожалуйста, войдите для доступа к профилю.</p>
                <Link href="/auth/signin?callbackUrl=/profile" className={buttonClasses}>
                    Войти
                </Link>
            </div>
        </div>
    </div>
  );

  const user = session.user;
  const userId = (user as any).id;

  return (
    <div className="relative min-h-screen bg-white">
        <AnimatedBackground />
        <div className={`relative z-10 font-sans ${primaryColorTextClass} py-12 px-4 sm:px-6 lg:px-8 pt-20 md:pt-24`}>
            <div className="max-w-3xl mx-auto">
                <h1 className={`text-4xl font-extrabold text-center ${accentColorTextClass} mb-10 tracking-tight flex items-center justify-center`}>
                    <User size={40} className="mr-3 opacity-90"/> Мой Профиль
                </h1>

                {generalMessage && (
                <div className={`flex items-start p-4 mb-6 rounded-lg shadow border ${generalMessage.type === 'success' ? 'bg-green-50 border-green-300 text-green-700' : 'bg-red-50 border-red-300 text-red-700'}`}>
                    {generalMessage.type === 'success' ? <CheckCircle2 size={20} className="mr-2 flex-shrink-0 text-green-500"/> : <AlertCircle size={20} className="mr-2 flex-shrink-0 text-red-500"/>}
                    {generalMessage.text}
                </div>
                )}

                <div className={`bg-white/90 backdrop-blur-md shadow-2xl rounded-xl p-6 sm:p-10 space-y-10 border ${lightBorderColorClass}`}>
                    <div className="flex flex-col items-center border-b border-gray-200/60 pb-8">
                        {displayAvatarUrl ? (
                        <Image
                            src={displayAvatarUrl} alt={nameInput || "Аватар"} width={144} height={144}
                            className={`rounded-full border-4 border-[#0d2d62]/30 object-cover bg-gray-100 shadow-md`}
                            priority key={displayAvatarUrl}
                            onError={() => { setDisplayAvatarUrl(DEFAULT_AVATAR_PLACEHOLDER_DATA_URL); setImageError("Не удалось загрузить изображение по URL."); }}
                        />
                        ) : (
                        <Image src={DEFAULT_AVATAR_PLACEHOLDER_DATA_URL} alt="Аватар по умолчанию" width={144} height={144} className={`rounded-full bg-gray-200 border-4 border-gray-300/70 shadow-md`} />
                        )}
                        <form onSubmit={(e) => handleSubmit(e, updateProfileImage, 'imageUrl')} className="mt-6 w-full max-w-md">
                        <label htmlFor="imageUrlInput" className={`${labelClasses} mb-1.5 flex items-center`}><ProfileImageIcon size={16} className="mr-2 opacity-70"/>URL фото (пусто для удаления)</label>
                        <input type="url" id="imageUrlInput" name="imageUrl" value={imageUrlInput}
                                onChange={(e) => { setImageUrlInput(e.target.value); setImageError(null); }}
                                placeholder="https://example.com/avatar.jpg"
                                className={inputClasses} />
                        {imageError && <p className="text-xs text-red-600 mt-1.5 flex items-center"><AlertCircle size={14} className="mr-1"/>{imageError}</p>}
                        <button type="submit" disabled={isPending} className={`${buttonClasses} mt-4 w-full`}>
                            {isPending ? <Spinner text='' size='small'/> : 'Обновить фото'}
                        </button>
                        </form>
                    </div>

                    <div className="space-y-8">
                        <form onSubmit={(e) => handleSubmit(e, updateProfileName, 'name')} className="space-y-4">
                        <div>
                            <label htmlFor="name" className={`${labelClasses} flex items-center`}><User size={16} className="mr-2 opacity-70"/>Имя</label>
                            <input type="text" id="name" name="name" value={nameInput}
                                    onChange={(e) => { setNameInput(e.target.value); setNameError(null); }} required
                                    className={inputClasses}/>
                            {nameError && <p className="text-xs text-red-600 mt-1.5 flex items-center"><AlertCircle size={14} className="mr-1"/>{nameError}</p>}
                        </div>
                        <button type="submit" disabled={isPending} className={`${buttonClasses} flex items-center justify-center`}>
                           <Save size={18} className="mr-2"/> {isPending ? <Spinner text='' size='small'/> : 'Сохранить имя'}
                        </button>
                        </form>

                        <form onSubmit={(e) => handleSubmit(e, updateProfileEmail, 'email')} className="space-y-4">
                        <div>
                            <label htmlFor="email" className={`${labelClasses} flex items-center`}><Mail size={16} className="mr-2 opacity-70"/>Email</label>
                            <input type="email" id="email" name="email" value={emailInput}
                                    onChange={(e) => { setEmailInput(e.target.value); setEmailError(null); }} required
                                    className={inputClasses}/>
                            {emailError && <p className="text-xs text-red-600 mt-1.5 flex items-center"><AlertCircle size={14} className="mr-1"/>{emailError}</p>}
                        </div>
                        <button type="submit" disabled={isPending} className={`${buttonClasses} flex items-center justify-center`}>
                            <Save size={18} className="mr-2"/> {isPending ? <Spinner text='' size='small'/> : 'Сохранить Email'}
                        </button>
                        <p className={`text-xs ${secondaryTextColorClass} mt-1.5`}>После смены Email может потребоваться повторный вход.</p>
                        </form>
                    </div>
                    <div className={`border-t ${lightBorderColorClass} pt-6 mt-8 text-sm ${secondaryTextColorClass}`}>
                        <p>ID Пользователя: <span className={`font-medium ${primaryColorTextClass}`}>{userId}</span></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <SessionProvider>
      <Suspense fallback={<div className={`flex justify-center items-center min-h-screen bg-white`}><Spinner text="Загрузка профиля..." size="large"/></div>}>
        <ProfileFormComponent />
      </Suspense>
    </SessionProvider>
  );
}