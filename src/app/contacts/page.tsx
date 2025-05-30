"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, Linkedin, Github, ArrowLeft, MapPin, Building, UserCircle, Home, Users2 } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { useState } from "react";

const primaryColorTextClass = "text-[#143c80]";
const primaryColorBorderClass = "border-[#143c80]";
const primaryColorBgClass = "bg-[#143c80]";
const accentColorTextClass = "text-[#0d2d62]";
const accentColorBgClass = "bg-[#0d2d62]";
const secondaryTextColorClass = "text-[#143c80]/80";
const lightBorderColorClass = "border-[#143c80]/20";
const veryLightBgColorClass = "bg-[#143c80]/5";
const lightestBgColorClass = "bg-[#143c80]/10";


interface ContactPerson {
  name: string; role: string; avatarUrl?: string; email?: string; phone?: string;
  linkedin?: string; github?: string; bio?: string;
}

const teamMembers: ContactPerson[] = [
  { name: "Владислав Качалов", role: "Дизайнер", email: "VLADJJJSSS7@GMAIL.COM", phone: "+7 707 637 5900", linkedin: "https://linkedin.com/in/KellyHarvestOS", github: "https://github.com/KellyHarvestOS", bio: "Отвечает за дизайн и визуализацию приложения. Специализируется на создании удобных и красивых интерфейсов." },
  { name: "Калиев Аблайхан", role: "Бэкенд-разработчик", email: "kalievv01@gmail.com", phone: "+7 707 379 5390", linkedin: "https://linkedin.com/in/Atrofos-kaliev", github: "https://github.com/Atrofos-kaliev", bio: "Отвечает за разработку и поддержку серверной части приложения. Специализируется на создании надежных и масштабируемых решений." },
  { name: "Жаншугуров Тамерлан", role: "Frontend-разработчик", email: "zanshugurov07@gmail.com", phone: "+7 707 379 5390", github: "https://github.com/TamerlanWebd", linkedin: "https://linkedin.com/in/TamerlanWebd", bio: "Отвечает за фронтенд и пользовательский интерфейс. Имеет опыт в создании интерактивных и удобных веб-приложений." },
];

const projectContact = {
  projectName: "Career AI Kazakhstan Talent Trent",
  generalEmail: "AtvAlience@gmail.com",
  officeAddress: "г. Астана, ул. Политех, 123, офис 45",
};

interface ContactAvatarProps { src?: string; alt: string; name: string; size?: number; }
const DEFAULT_AVATAR_SRC = "/images/avatars/default.png";

const ContactAvatar: React.FC<ContactAvatarProps> = ({ src, alt, name, size = 128 }) => {
  const [currentSrc, setCurrentSrc] = useState(src || DEFAULT_AVATAR_SRC);
  const [error, setError] = useState(!src);

  const handleError = () => {
    if (currentSrc !== DEFAULT_AVATAR_SRC) { setCurrentSrc(DEFAULT_AVATAR_SRC); }
    else { setError(true); }
  };

  if (error && currentSrc === DEFAULT_AVATAR_SRC) {
    return (
      <div className={`rounded-full mb-5 border-4 ${lightBorderColorClass} ${lightestBgColorClass} flex items-center justify-center shadow-md`} style={{ width: size, height: size }} title={name}>
        <UserCircle className={`${primaryColorTextClass}/60`} style={{ width: size * 0.7, height: size * 0.7 }} />
      </div>
    );
  }
  return ( <Image src={currentSrc} alt={alt} width={size} height={size} className={`rounded-full mb-5 border-4 ${lightBorderColorClass} shadow-md object-cover bg-gray-100`} onError={handleError} priority={false} /> );
};

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

export default function ContactsPage() {
  return (
    <div className="relative min-h-screen bg-white">
      <AnimatedBackground />
      <div className={`relative z-10 font-sans ${primaryColorTextClass} p-4 sm:p-6 md:p-8 pt-20 md:pt-24`}>
        <div className="max-w-5xl mx-auto">
          <header className="mb-12 pt-8 sm:pt-12">
            <div className="text-center">
                <h1 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold mb-3 ${primaryColorTextClass}`}>
                    <span className="block">Свяжитесь</span>
                    <span className={`block ${accentColorTextClass} py-1`}>
                        с Нами
                    </span>
                </h1>
                <p className={`text-center ${secondaryTextColorClass} mt-3 text-base sm:text-lg max-w-2xl mx-auto`}>
                    Мы всегда рады ответить на ваши вопросы, выслушать предложения или обсудить возможности сотрудничества.
                </p>
            </div>
          </header>

          <section id="team-contacts" className="mb-16">
            <h2 className={`text-3xl sm:text-4xl font-bold ${accentColorTextClass} mb-10 text-center flex items-center justify-center`}>
                <Users2 size={36} className="mr-3 opacity-90" />
                Наша Команда
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((person) => (
                <div
                  key={person.name}
                  className={`bg-white p-6 rounded-xl shadow-xl border ${lightBorderColorClass} flex flex-col items-center text-center hover:shadow-2xl hover:border-[#143c80]/30 transition-all duration-300`}
                >
                  <ContactAvatar src={person.avatarUrl} alt={`Фото ${person.name}`} name={person.name} size={120}/>
                  <h3 className={`text-xl font-semibold ${primaryColorTextClass} mb-1`}>{person.name}</h3>
                  <p className={`text-sm ${accentColorTextClass} font-medium mb-3`}>{person.role}</p>
                  {person.bio && (<p className={`text-xs ${secondaryTextColorClass} leading-relaxed mb-4 px-2`}>{person.bio}</p>)}
                  <div className="mt-auto space-y-2 w-full">
                    {person.email && (
                      <a href={`mailto:${person.email}`} className={`flex items-center justify-center text-sm ${secondaryTextColorClass} hover:${primaryColorTextClass} transition-colors p-2.5 ${veryLightBgColorClass} hover:${lightestBgColorClass} rounded-md w-full group border ${lightBorderColorClass}`}>
                        <Mail size={16} className={`mr-2.5 ${primaryColorTextClass}/80 group-hover:${primaryColorTextClass}`}/>{person.email}
                      </a>
                    )}
                    {person.phone && (
                      <a href={`tel:${person.phone.replace(/\s+/g, "")}`} className={`flex items-center justify-center text-sm ${secondaryTextColorClass} hover:${primaryColorTextClass} transition-colors p-2.5 ${veryLightBgColorClass} hover:${lightestBgColorClass} rounded-md w-full group border ${lightBorderColorClass}`}>
                        <Phone size={16} className={`mr-2.5 text-green-600 group-hover:text-green-700`}/>{person.phone}
                      </a>
                    )}
                    <div className="flex justify-center space-x-4 pt-2">
                      {person.linkedin && (
                        <a href={person.linkedin} target="_blank" rel="noopener noreferrer" title={`${person.name} on LinkedIn`} className={`${secondaryTextColorClass} hover:text-blue-600 transition-colors`}><Linkedin size={22} /><span className="sr-only">LinkedIn</span></a>
                      )}
                      {person.github && (
                        <a href={person.github} target="_blank" rel="noopener noreferrer" title={`${person.name} on GitHub`} className={`${secondaryTextColorClass} hover:text-gray-700 transition-colors`}><Github size={22} /><span className="sr-only">GitHub</span></a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="general-contact" className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className={`bg-white p-6 sm:p-8 rounded-xl shadow-xl border ${lightBorderColorClass}`}>
                <div className="flex items-center mb-5">
                  <Building size={28} className={`mr-3 ${accentColorTextClass}`} />
                  <h2 className={`text-2xl sm:text-3xl font-bold ${accentColorTextClass}`}>Общие Контакты</h2>
                </div>
                <p className={`${secondaryTextColorClass} mb-6 text-sm`}>
                  По общим вопросам, предложениям или если вы не уверены, к кому обратиться, используйте следующие контакты или форму справа.
                </p>
                {projectContact.projectName && (<p className={`text-lg font-semibold ${primaryColorTextClass} mb-1`}>{projectContact.projectName}</p>)}
                {projectContact.generalEmail && (
                  <div className="flex items-start mb-3">
                    <Mail size={20} className={`mr-3 mt-1 ${primaryColorTextClass}/80 flex-shrink-0`}/>
                    <div>
                      <span className={`block text-xs ${secondaryTextColorClass}`}>Email:</span>
                      <a href={`mailto:${projectContact.generalEmail}`} className={`${primaryColorTextClass} hover:${accentColorTextClass} transition-colors text-sm`}>{projectContact.generalEmail}</a>
                    </div>
                  </div>
                )}
                {projectContact.officeAddress && (
                  <div className="flex items-start">
                    <MapPin size={20} className={`mr-3 mt-1 text-green-600 flex-shrink-0`}/>
                    <div>
                      <span className={`block text-xs ${secondaryTextColorClass}`}>Адрес:</span>
                      <p className={`${primaryColorTextClass} text-sm`}>{projectContact.officeAddress}</p>
                    </div>
                  </div>
                )}
              </div>
              <ContactForm />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}