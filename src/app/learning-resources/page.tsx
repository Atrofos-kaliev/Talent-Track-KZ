"use client";

import Link from "next/link";
import resourcesData from "@/lib/data/learningResources.json";
import { ArrowLeft, Home, BookOpenText, Sparkles, ExternalLink, Tag as TagIcon, Layers3, AlertCircle } from "lucide-react"; 

const primaryColorTextClass = "text-[#143c80]";
const primaryColorBorderClass = "border-[#143c80]";
const primaryColorBgClass = "bg-[#143c80]";
const accentColorTextClass = "text-[#0d2d62]";
const accentColorBgClass = "bg-[#0d2d62]";
const secondaryTextColorClass = "text-[#143c80]/80";
const lightBorderColorClass = "border-[#143c80]/20";
const veryLightBgColorClass = "bg-[#143c80]/5";
const lightestBgColorClass = "bg-[#143c80]/10";

interface Resource {
  name: string; description_ru: string; description_kz: string;
  link: string; tags: string[];
}
interface ResourceCategory {
  category_ru: string; category_kz: string; resources: Resource[];
}
const typedResourcesData: ResourceCategory[] = resourcesData as ResourceCategory[];

const getTagColorClasses = (tag: string): { bg: string; text: string } => {
  const defaultClasses = { bg: `${lightestBgColorClass}`, text: `${primaryColorTextClass}` };
  switch (tag.toLowerCase()) {
    case "kazakhstan": return { bg: "bg-blue-100", text: "text-blue-800" };
    case "russian": return { bg: "bg-sky-100", text: "text-sky-800" };
    case "international": return { bg: "bg-indigo-100", text: "text-indigo-800" };
    case "free": return { bg: "bg-green-100", text: "text-green-800" };
    case "paid": return { bg: "bg-red-100", text: "text-red-800" };
    case "free_options": return { bg: "bg-emerald-100", text: "text-emerald-800" };
    case "trial": return { bg: "bg-yellow-100", text: "text-yellow-800" };
    case "programming": return { bg: "bg-purple-100", text: "text-purple-800" };
    case "design": return { bg: "bg-pink-100", text: "text-pink-800" };
    case "marketing": return { bg: "bg-orange-100", text: "text-orange-800" };
    default: return defaultClasses;
  }
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

export default function LearningResourcesPage() {
  const buttonPrimaryClasses = `inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg shadow-md ${primaryColorBgClass} text-white hover:${accentColorBgClass} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-[#0d2d62] transition-all duration-300 group hover:scale-105`;

  return (
    <div className="relative min-h-screen bg-white">
      <AnimatedBackground />
      <div className={`relative z-10 font-sans ${primaryColorTextClass} p-4 sm:p-6 md:p-8 pt-20 md:pt-24`}>
        <div className="max-w-5xl mx-auto">
          <header className="mb-12 pt-8 sm:pt-12">
            <div className="mb-6 text-left">
            </div>
            <div className="text-center">
                <h1 className={`text-4xl sm:text-5xl font-bold ${accentColorTextClass} inline-flex items-center`}>
                    <BookOpenText size={40} className="mr-3 text-green-500" />
                    Ресурсы для Обучения и Развития
                </h1>
                <p className={`mt-3 text-base ${secondaryTextColorClass} max-w-2xl mx-auto`}>
                    Полезные ссылки на курсы, платформы и сообщества для студентов в Казахстане.
                </p>
            </div>
          </header>

          {typedResourcesData.length > 0 ? (
            <div className="space-y-10">
              {typedResourcesData.map((category) => (
                <section
                  key={category.category_ru}
                  className={`bg-white p-6 rounded-xl shadow-xl border ${lightBorderColorClass}`}
                >
                  <h2 className={`text-2xl font-semibold ${accentColorTextClass} mb-6 border-b ${lightBorderColorClass} pb-4 flex items-center`}>
                    <Layers3 size={28} className="mr-3 opacity-80"/>
                    {category.category_ru} / {category.category_kz}
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.resources.map((resource) => {
                      const tagColorClasses = getTagColorClasses(resource.tags[0] || ""); 
                      return (
                        <a
                          key={resource.name}
                          href={resource.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`block p-5 bg-white rounded-lg shadow-lg hover:shadow-xl border ${lightBorderColorClass} hover:border-[#143c80]/30 transition-all duration-300 group flex flex-col`}
                        >
                          <h3 className={`font-semibold ${primaryColorTextClass} group-hover:${accentColorTextClass} text-lg mb-1.5 flex items-center`}>
                            {resource.name}
                            <ExternalLink size={14} className="ml-2 opacity-50 group-hover:opacity-80 transition-opacity"/>
                          </h3>
                          <p className={`text-sm ${secondaryTextColorClass} mt-1 leading-relaxed flex-grow`}>
                            {resource.description_ru}
                          </p>
                          <p className={`text-xs ${secondaryTextColorClass}/80 mt-1 leading-relaxed`}>
                            {resource.description_kz}
                          </p>
                          <div className="mt-4 pt-3 border-t border-dashed border-gray-200/70 flex flex-wrap gap-1.5">
                            {resource.tags.map((tag) => {
                              const colors = getTagColorClasses(tag);
                              return (
                                <span
                                  key={tag}
                                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${colors.bg} ${colors.text} inline-flex items-center`}
                                >
                                  <TagIcon size={12} className="mr-1 opacity-70" />
                                  {tag.replace(/_/g, " ")}
                                </span>
                              );
                            })}
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className={`text-center py-16 ${veryLightBgColorClass} rounded-xl border ${lightBorderColorClass}`}>
                <BookOpenText size={48} className={`mx-auto ${secondaryTextColorClass} mb-4`} />
                <p className={`${primaryColorTextClass} text-lg`}>
                    Ресурсы пока не добавлены.
                </p>
                <p className={`${secondaryTextColorClass} mt-2 text-sm`}>Загляните позже, мы постоянно обновляем список!</p>
            </div>
          )}

          <div className="mt-16 text-center">
            <Link
              href="/survey"
              className={`${buttonPrimaryClasses} sm:w-auto`}
            >
              <Sparkles size={20} className="mr-2"/>
              Получить персональные AI-рекомендации
            </Link>
          </div>
          <div className="mt-10 text-center">
            <p className={`text-xs ${secondaryTextColorClass}/70 flex items-center justify-center`}>
              <AlertCircle size={14} className="mr-1.5 flex-shrink-0"/>
              Список ресурсов не является исчерпывающим и предоставлен в
              ознакомительных целях. Мы не несем ответственности за содержание и
              качество услуг сторонних платформ.
            </p>
          </div>
           <div className="mt-8 text-center">
          </div>
        </div>
      </div>
    </div>
  );
}