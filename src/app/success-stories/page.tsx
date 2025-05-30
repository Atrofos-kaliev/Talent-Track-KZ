"use client"; 

import Link from "next/link";
import Image from "next/image";
import storiesData from "@/lib/data/stories.json";
import { ArrowLeft, Home, Sparkles, Quote, Star, BookOpen, Briefcase } from "lucide-react";

const primaryColorTextClass = "text-[#143c80]";
const primaryColorBorderClass = "border-[#143c80]";
const primaryColorBgClass = "bg-[#143c80]";
const accentColorTextClass = "text-[#0d2d62]";
const accentColorBgClass = "bg-[#0d2d62]";
const secondaryTextColorClass = "text-[#143c80]/80";
const lightBorderColorClass = "border-[#143c80]/20";
const veryLightBgColorClass = "bg-[#143c80]/5";
const lightestBgColorClass = "bg-[#143c80]/10";

interface Story {
  id: string; name: string; photo_url: string; college: string;
  profession_ru: string; profession_kz: string;
  initial_interests_ru: string[]; initial_interests_kz: string[];
  quote_ru: string; quote_kz: string;
  path_summary_ru: string; path_summary_kz: string;
}

const typedStoriesData: Story[] = storiesData as Story[];

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


export default function SuccessStoriesPage() { 
  const buttonPrimaryClasses = `inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg shadow-md ${primaryColorBgClass} text-white hover:${accentColorBgClass} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-[#0d2d62] transition-all duration-300 group hover:scale-105`;

  return (
    <div className="relative min-h-screen bg-white">
      <AnimatedBackground />
      <div className={`relative z-10 font-sans ${primaryColorTextClass} p-4 sm:p-6 md:p-8 pt-20 md:pt-24`}>
        <div className="max-w-4xl mx-auto">
          <header className="mb-12 pt-8 sm:pt-12">
            <div className="mb-6 text-left">
            </div>
            <div className="text-center">
                <h1 className={`text-4xl sm:text-5xl font-bold ${accentColorTextClass} inline-flex items-center`}>
                    <Star size={40} className="mr-3 text-amber-400" />
                    Истории Успеха
                </h1>
                <p className={`mt-3 text-base ${secondaryTextColorClass} max-w-2xl mx-auto`}>
                    Вдохновляющие примеры карьерных путей выпускников колледжей Казахстана.
                </p>
            </div>
          </header>

          {typedStoriesData.length > 0 ? (
            <div className="space-y-12 lg:space-y-16">
              {typedStoriesData.map((story, index) => (
                <article
                  key={story.id}
                  className={`bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row border ${lightBorderColorClass} hover:shadow-xl transition-shadow duration-300`}
                >
                  <div className="md:w-1/3 relative h-72 md:h-auto min-h-[250px]">
                    <Image
                      src={story.photo_url}
                      alt={`Фото ${story.name}`}
                      layout="fill"
                      objectFit="cover"
                      className="opacity-90"
                      unoptimized={process.env.NODE_ENV === "development"}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-transparent 
                md:bg-gradient-to-r ${index % 2 !== 0 ? 'md:from-transparent md:via-transparent md:to-transparent' : 'md:from-transparent md:via-transparent md:to-transparent'}`}>
</div>

                  </div>
                  <div className={`md:w-2/3 p-6 md:p-8 flex flex-col justify-center ${index % 2 !== 0 ? 'md:order-first' : ''}`}>
                    <h2 className={`text-2xl font-semibold ${accentColorTextClass}`}>
                      {story.name}
                    </h2>
                    <p className={`text-sm ${secondaryTextColorClass} mt-1`}>{story.college}</p>
                    <p className={`text-lg font-medium ${primaryColorTextClass} mt-3`}>
                      {story.profession_ru} / {story.profession_kz}
                    </p>

                    <blockquote className={`mt-5 border-l-4 ${primaryColorBorderClass} pl-4 italic ${secondaryTextColorClass}`}>
                      <Quote size={20} className={`${primaryColorTextClass} opacity-30 -ml-1 mb-1 inline-block transform -scale-x-100`} />
                      <p>"{story.quote_ru}"</p>
                      <p className={`text-xs ${secondaryTextColorClass}/80 mt-1`}>
                        "{story.quote_kz}"
                      </p>
                    </blockquote>

                    <div className="mt-5">
                      <h4 className={`text-sm font-semibold ${primaryColorTextClass} flex items-center`}>
                        <Sparkles size={16} className="mr-2 opacity-70"/> Интересы, которые помогли:
                      </h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {story.initial_interests_ru.map((interest) => (
                          <span
                            key={interest}
                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${lightestBgColorClass} ${primaryColorTextClass}`}
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5">
                      <h4 className={`text-sm font-semibold ${primaryColorTextClass} flex items-center`}>
                        <BookOpen size={16} className="mr-2 opacity-70"/> Краткий путь:
                      </h4>
                      <p className={`text-sm ${secondaryTextColorClass} mt-1.5`}>
                        {story.path_summary_ru}
                      </p>
                      <p className={`text-xs ${secondaryTextColorClass}/80 mt-1`}>
                        {story.path_summary_kz}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={`text-center py-16 ${veryLightBgColorClass} rounded-xl border ${lightBorderColorClass}`}>
                <Briefcase size={48} className={`mx-auto ${secondaryTextColorClass} mb-4`} />
                <p className={`${primaryColorTextClass} text-lg`}>
                    Истории успеха пока не добавлены.
                </p>
                <p className={`${secondaryTextColorClass} mt-2 text-sm`}>Загляните позже!</p>
            </div>
          )}

          <div className="mt-16 text-center">
            <Link
              href="/survey"
              className={`${buttonPrimaryClasses} sm:w-auto`}
            >
              <Sparkles size={20} className="mr-2"/>
              Найти свой путь с AI
            </Link>
          </div>
          <div className="mt-10 text-center">
            <p className={`text-xs ${secondaryTextColorClass}/70`}>
              Все имена и детали в историях могут быть изменены или вымышлены для
              демонстрационных целей.
            </p>
          </div>
          <div className="mt-8 text-center">
          </div>
        </div>
      </div>
    </div>
  );
}