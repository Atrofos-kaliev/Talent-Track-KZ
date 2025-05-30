'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signIn, signOut } from 'next-auth/react';
import {
  FiMenu,
  FiX,
  FiHome,
  FiCpu,
  FiList,
  FiBarChart2,
  FiAward,
  FiBookOpen,
  FiLogIn,
  FiUserPlus,
  FiUser,
  FiLogOut,
  FiSettings,
  FiChevronDown,
} from 'react-icons/fi';

interface NavLinkItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const Header = () => {
  const { data: session, status } = useSession();
  const loadingAuth = status === 'loading';

  const [hasMounted, setHasMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setHasMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!hasMounted) return null;

  const navLinks: NavLinkItem[] = [
    { href: '/', label: 'Главная', icon: <FiHome className="mr-2 shrink-0" /> },
    { href: '/survey', label: 'AI Подбор', icon: <FiCpu className="mr-2 shrink-0" /> },
    { href: '/professions', label: 'Каталог', icon: <FiList className="mr-2 shrink-0" /> },
    { href: '/market-overview', label: 'Обзор', icon: <FiBarChart2 className="mr-2 shrink-0" /> },
    { href: '/success-stories', label: 'Истории успеха', icon: <FiAward className="mr-2 shrink-0" /> },
    { href: '/learning-resources', label: 'Ресурсы', icon: <FiBookOpen className="mr-2 shrink-0" /> },
  ];

  const headerBaseClasses = "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out";
  const headerInitialClasses = "bg-[#143c80] text-white py-2 shadow-sm";
  const headerScrolledClasses = "bg-white/80 backdrop-blur-md shadow-lg py-1.5 text-[#143c80]";

  const desktopLinkBaseClasses = "font-medium relative group transition-all duration-500 ease-in-out px-2.5 py-1.5 rounded-md border-2 flex items-center text-sm";
  const desktopLinkClasses = (isScrolledState: boolean, isActive: boolean) => {
    let classes = desktopLinkBaseClasses;
    if (isActive) {
      classes += isScrolledState
        ? ' text-[#0d2d62] font-semibold border-[#0d2d62] bg-[#143c80]/10'
        : ' text-white font-semibold border-white/80 bg-white/15';
    } else {
      classes += isScrolledState
        ? ' text-[#143c80] border-transparent hover:border-[#143c80] hover:bg-[#143c80]/10'
        : ' text-gray-200 border-transparent hover:text-white hover:bg-white/10';
    }
    return classes;
  };

  const authButtonDesktopClasses = (isScrolledState: boolean, type: 'signin' | 'register') => {
    let base = `font-medium text-sm px-3 py-1.5 rounded-md transition-all duration-300 ease-in-out flex items-center`;
    if (isScrolledState) {
      base += type === 'signin'
        ? ' bg-[#143c80] text-white hover:bg-[#0d2d62]'
        : ' border-2 border-[#143c80] text-[#143c80] hover:bg-[#143c80]/10';
    } else {
      base += type === 'signin'
        ? ' bg-sky-500 hover:bg-sky-600 text-white'
        : ' border-2 border-white/80 text-white hover:bg-white/10';
    }
    return base;
  };

  const profileTriggerClasses = (isScrolledState: boolean) => {
    return `focus:outline-none flex items-center space-x-1 p-1 rounded-md cursor-pointer transition-colors duration-300
            ${isScrolledState ? 'text-[#143c80] hover:bg-[#143c80]/10' : 'text-white hover:bg-white/10'}`;
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut", delay: 0.2 } },
  };

  const renderAuthSection = () => {
    if (loadingAuth) {
      return (
        <div className="flex items-center space-x-2">
          <div className={`h-8 w-20 animate-pulse rounded-md ${isScrolled ? 'bg-slate-300' : 'bg-slate-600'}`}></div>
          <div className={`h-8 w-8 animate-pulse rounded-full ${isScrolled ? 'bg-slate-300' : 'bg-slate-600'}`}></div>
        </div>
      );
    }

    if (session?.user) {
      return (
        <div className="relative group">
          <div className={`${profileTriggerClasses(isScrolled)}`}>
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || 'Аватар'}
                width={28}
                height={28}
                className="rounded-full pointer-events-none"
              />
            ) : (
              <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold pointer-events-none
                                ${isScrolled ? 'bg-slate-300 text-[#143c80]' : 'bg-slate-600 text-white'}`}>
                {(session.user.name || session.user.email)?.charAt(0)?.toUpperCase() || <FiUser size={14} />}
              </span>
            )}
            <span className="hidden sm:inline text-xs ml-1 pointer-events-none">
              {session.user.name?.split(' ')[0] || session.user.email?.split('@')[0] || 'Профиль'}
            </span>
            <FiChevronDown size={16} className={`hidden sm:inline ml-0.5 transition-transform group-hover:rotate-180 pointer-events-none`} />
          </div>

          <div
            className={`absolute right-0 top-full mt-0 w-48 rounded-md shadow-xl py-1 z-30 origin-top-right 
                        opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                        transform scale-95 group-hover:scale-100 transition-all duration-150 ease-out
                        ${isScrolled ? 'bg-white ring-1 ring-black ring-opacity-5' : 'bg-gray-700 text-white ring-1 ring-gray-600'}`}
          >
            <Link
              href="/profile"
              className={`block px-4 py-2 text-sm flex items-center w-full
                          ${isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'hover:bg-gray-600'}`}
            >
              <FiSettings size={16} className="mr-2" />
              Профиль
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/' })}
              className={`block w-full px-4 py-2 text-left text-sm flex items-center
                          ${isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'hover:bg-gray-600'}`}
            >
              <FiLogOut size={16} className="mr-2" />
              Выйти
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => signIn()}
          className={authButtonDesktopClasses(isScrolled, 'signin')}
        >
          <FiLogIn className="mr-1.5" size={16}/>
          Войти
        </button>
        <Link
          href="/auth/register"
          className={authButtonDesktopClasses(isScrolled, 'register')}
        >
          <FiUserPlus className="mr-1.5" size={16}/>
          Регистрация
        </Link>
      </div>
    );
  };

  const renderMobileAuthMenuItems = () => {
    if (loadingAuth) {
      return <div className={`h-10 animate-pulse rounded-md w-full mx-auto mt-2 ${isScrolled ? 'bg-slate-300' : 'bg-slate-600'}`}></div>;
    }
    if (session?.user) {
      return (
        <>
          <Link
            href="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className={`font-medium text-base w-full py-2.5 px-3 mb-1 transition-all duration-300 ease-in-out rounded-md flex items-center justify-center
                        ${isScrolled ? 'text-[#143c80] hover:bg-[#143c80]/10' : 'text-gray-200 hover:text-white hover:bg-white/10'}`}
          >
            <FiSettings className="mr-2 shrink-0" /> Профиль
          </Link>
          <button
            type="button"
            onClick={() => { signOut({ callbackUrl: '/' }); setMobileMenuOpen(false); }}
            className={`font-medium text-base w-full py-2.5 px-3 transition-all duration-300 ease-in-out rounded-md flex items-center justify-center
                        ${isScrolled ? 'text-red-600 hover:bg-red-100' : 'text-red-400 hover:text-white hover:bg-red-500/50'}`}
          >
            <FiLogOut className="mr-2 shrink-0" /> Выйти
          </button>
        </>
      );
    }

    return (
      <>
        <button
          type="button"
          onClick={() => { signIn(); setMobileMenuOpen(false); }}
          className={`font-medium text-base w-full py-2.5 px-3 mb-1 transition-all duration-300 ease-in-out rounded-md flex items-center justify-center
                      ${isScrolled ? 'bg-[#143c80] text-white hover:bg-[#0d2d62]' : 'bg-sky-500 hover:bg-sky-600 text-white'}`}
        >
          <FiLogIn className="mr-2 shrink-0" /> Войти
        </button>
        <Link
          href="/auth/register"
          onClick={() => setMobileMenuOpen(false)}
          className={`font-medium text-base w-full py-2.5 px-3 transition-all duration-300 ease-in-out rounded-md flex items-center justify-center
                      ${isScrolled ? 'border-2 border-[#143c80] text-[#143c80] hover:bg-[#143c80]/10' : 'border-2 border-white/80 text-white hover:bg-white/10'}`}
        >
          <FiUserPlus className="mr-2 shrink-0" /> Регистрация
        </Link>
      </>
    );
  };


  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className={`${headerBaseClasses} ${isScrolled ? headerScrolledClasses : headerInitialClasses}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-14">
        <Link
          href="/"
          className={`text-xl sm:text-2xl font-bold transition-colors duration-500 ease-in-out
                      ${isScrolled ? 'text-[#143c80] hover:text-blue-700' : 'text-white hover:text-gray-300'}`}
        >
          <Image
            src="https://cdn.discordapp.com/attachments/1375097090924871800/1377767168791285791/logo.png?ex=683a292a&is=6838d7aa&hm=51ffe6da95f8ec380385d0808032473a48caf3f597f3c2a14afa8f3dc7e2586a&"
            alt="Talent Track Logo"
            width={80}
            height={15}
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center">
          <div className="flex space-x-1 items-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={desktopLinkClasses(isScrolled, isActive)}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
          <div className="ml-4">{renderAuthSection()}</div>
        </nav>

        <div className="md:hidden flex items-center space-x-2">
          {loadingAuth && (
            <div className={`h-7 w-7 animate-pulse rounded-full ${isScrolled ? 'bg-slate-300' : 'bg-slate-600'}`}></div>
          )}
          {!loadingAuth && session?.user && (
             <div className="relative">
                <div className={profileTriggerClasses(isScrolled)}> 
                    {session.user.image ? (
                    <Image src={session.user.image} alt="Аватар" width={28} height={28} className="rounded-full" />
                    ) : (
                    <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${isScrolled ? 'bg-slate-300 text-[#143c80]' : 'bg-slate-600 text-white'}`}>
                        {session.user.name?.charAt(0)?.toUpperCase() || <FiUser size={14} />}
                    </span>
                    )}
                </div>
             </div>
           )}
          {!loadingAuth && !session && (
            <div className="flex items-center space-x-0.5">
              <button
                type="button"
                onClick={() => signIn()}
                className={`p-1.5 rounded-md ${isScrolled ? 'text-[#143c80] hover:bg-[#143c80]/10' : 'text-white hover:bg-white/10'}`}
                aria-label="Войти"
              > <FiLogIn size={20} /> </button>
              <Link
                href="/auth/register"
                className={`p-1.5 rounded-md ${isScrolled ? 'text-[#143c80] hover:bg-[#143c80]/10' : 'text-white hover:bg-white/10'}`}
                aria-label="Регистрация"
              > <FiUserPlus size={20} /> </Link>
            </div>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className={`p-1.5 rounded-md focus:outline-none transition-all duration-300 ease-in-out border-2
                        ${isScrolled
                          ? 'text-[#143c80] border-transparent hover:border-[#143c80]/50 hover:bg-[#143c80]/10'
                          : 'text-gray-200 border-transparent hover:text-white hover:bg-white/10'
                        }`}
            aria-label={mobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Мобильное выпадающее меню */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, maxHeight: 0 }}
            animate={{ opacity: 1, maxHeight: "100vh" }}
            exit={{ opacity: 0, maxHeight: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`md:hidden absolute top-full left-0 right-0 overflow-y-auto 
                        ${isScrolled
                          ? 'bg-white/95 backdrop-blur-sm text-[#143c80] shadow-lg'
                          : 'bg-[#143c80] text-white shadow-md'
                        }`}
          >
            <nav className="flex flex-col items-center space-y-1 px-3 py-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                let activeMobileClasses = '';
                if (isActive) {
                  activeMobileClasses = isScrolled
                    ? 'text-[#0d2d62] font-semibold bg-[#143c80]/20'
                    : 'text-white font-semibold bg-white/20';
                } else {
                  activeMobileClasses = isScrolled
                    ? 'text-[#143c80] hover:bg-[#143c80]/10'
                    : 'text-gray-200 hover:text-white hover:bg-white/10';
                }
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`font-medium text-base w-full py-2.5 px-3 transition-all duration-300 ease-in-out rounded-md flex items-center justify-center
                                ${activeMobileClasses}`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              <div className={`w-full pt-3 mt-2 border-t ${isScrolled ? 'border-slate-300' : 'border-slate-600'}`}>
                {renderMobileAuthMenuItems()}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;