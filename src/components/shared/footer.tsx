'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaGithub, FaTelegramPlane, FaYoutube, FaInstagram } from 'react-icons/fa';
import {
  FiHome,
  FiInfo,
  FiGrid, 
  FiTrendingUp,
  FiBriefcase,
  FiVolume2, 
  FiUsers,
  FiTerminal, 
  FiMail, 
  FiHelpCircle,
  FiMenu,
  FiX,
  FiCpu,
  FiList,
  FiBarChart2,
  FiAward,
  FiBookOpen
} from 'react-icons/fi'; 

const footerSectionsData = [
  {
    title: 'Навигация',
    links: [
      { name: 'Главная', href: '/', icon: <FiHome className="mr-2 shrink-0" /> },
      { name: 'AI Подбор', href: '/survey', icon: <FiCpu className="mr-2 shrink-0" /> },
      { name: 'Каталог', href: '/professions', icon: <FiGrid className="mr-2 shrink-0" /> },
      { name: 'Обзор', href: '/market-overview', icon: <FiBarChart2 className="mr-2 shrink-0" /> },
    ],
  },
  {
    title: 'Ресурсы',
    links: [
      { name: 'Истории успеха', href: '/success-stories', icon: <FiAward  className="mr-2 shrink-0" /> },
      { name: 'Ресурсы', href: '/learning-resources', icon: <FiBookOpen className="mr-2 shrink-0" /> },
      { name: 'Партнеры', href: '/partners', icon: <FiUsers className="mr-2 shrink-0" /> },
      { name: 'Документация API', href: '/api-docs', icon: <FiTerminal className="mr-2 shrink-0" /> },
    ],
  },
  {
    title: 'Связаться',
    links: [
      { name: 'Контакты', href: '/contacts', icon: <FiMail className="mr-2 shrink-0" /> },
    ],
  },
];

const socialLinksData = [
  { name: 'Telegram', icon: FaTelegramPlane, href: '#' },
  { name: 'YouTube', icon: FaYoutube, href: '#' },
  { name: 'Instagram', icon: FaInstagram, href: '#' },
  { name: 'GitHub', icon: FaGithub, href: 'https://github.com/' },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const primaryTextColor = "text-[#143c80]";
  const secondaryTextColor = "text-[#143c80]/80";
  const hoverTextColor = "hover:text-[#0d2d62]";
  const borderColor = "border-[#143c80]/20";

  const footerBaseClasses = `bg-white/80 backdrop-blur-md shadow-lg ${primaryTextColor} border-t ${borderColor} pt-16 pb-8 px-4 sm:px-6 lg:px-10`;
  const linkItemClasses = `flex items-center ${secondaryTextColor} ${hoverTextColor} hover:underline transition-colors duration-300 text-sm`;
  const socialIconClasses = `${secondaryTextColor} ${hoverTextColor} transition-colors duration-300`;
  const sectionTitleClasses = `font-heading text-lg ${primaryTextColor} mb-4`;

  const motionViewport = { once: true, amount: 0.1 };

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={motionViewport}
      transition={{ duration: 0.8 }}
      className={footerBaseClasses}
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={motionViewport}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
            className="md:col-span-4 lg:col-span-5 text-center md:text-left"
          >
            <Link href="/" className="inline-block mb-4">
              <h2 className={`font-heading text-3xl lg:text-4xl ${primaryTextColor} font-bold hover:opacity-80 transition-opacity`}>
                Talent <span className={primaryTextColor}>Track</span>
              </h2>
            </Link>
            <p className={`text-sm lg:text-base max-w-sm mx-auto md:mx-0 ${secondaryTextColor}`}>
              Открывая новые горизонты: найди профессию, которая тебя вдохновляет.
Будущее — за теми, кто выбирает осознанно. Мы подскажем, в какой сфере ты сможешь реализовать себя, развиваться и добиваться успеха.
            </p>
          </motion.div>

          <div className="md:col-span-8 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footerSectionsData.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={motionViewport}
                transition={{ duration: 0.5, delay: 0.15 * (index + 1) + 0.2 }}
              >
                <h3 className={sectionTitleClasses}>{section.title}</h3>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className={linkItemClasses}>
                        {link.icon}
                        <span>{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        <div className={`border-t ${borderColor} pt-8 mt-10 flex flex-col md:flex-row justify-between items-center text-sm`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={motionViewport}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex space-x-5 mb-6 md:mb-0"
          >
            {socialLinksData.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className={socialIconClasses}
              >
                <social.icon size={22} />
              </a>
            ))}
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={motionViewport}
            transition={{ duration: 0.5, delay: 0.8 }}
            className={`text-center md:text-right ${secondaryTextColor}`}
          >
            © {currentYear} TalentTrack KZ. Все права защищены.
            <br className="sm:hidden"/> Разработано с ❤️ в Казахстане.
          </motion.p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;