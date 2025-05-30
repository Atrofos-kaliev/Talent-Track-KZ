"use client";

import Link from "next/link";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import {
  getProfessionalRolesWithCategories,
  HHCategory,
  HHRole,
} from "@/lib/hhApi"; 
import Spinner from "@/components/spinner"; 
import { ListTree, Search, AlertTriangle, RotateCcw, ChevronRight, ExternalLink, Home, CheckCircle2, ArrowLeft, Sparkles } from "lucide-react"; // Иконки

// Цветовая палитра, как у HomePage
const primaryColorTextClass = "text-[#143c80]";
const primaryColorBorderClass = "border-[#143c80]";
const primaryColorBgClass = "bg-[#143c80]";
const accentColorTextClass = "text-[#0d2d62]";
const accentColorBgClass = "bg-[#0d2d62]";
const secondaryTextColorClass = "text-[#143c80]/80";
const lightBorderColorClass = "border-[#143c80]/20";
const veryLightBgColorClass = "bg-[#143c80]/5"; // Для ховеров и легких фонов
const lightestBgColorClass = "bg-[#143c80]/10";

const ITEMS_PER_PAGE = 7;


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


const filterRolesRecursive = (
  roles: HHRole[],
  searchTerm: string
): HHRole[] => {
  if (!searchTerm) return roles;
  const lowerSearchTerm = searchTerm.toLowerCase();
  const filtered: HHRole[] = [];

  for (const role of roles) {
    const nameMatches = role.name.toLowerCase().includes(lowerSearchTerm);
    const subRoles = role.roles
      ? filterRolesRecursive(role.roles, searchTerm)
      : [];

    if (nameMatches || subRoles.length > 0) {
      filtered.push({
        ...role,
        roles:
          nameMatches && role.roles && subRoles.length === 0
            ? role.roles
            : subRoles,
      });
    }
  }
  return filtered;
};

function ProfessionsPageContent() {
  const [allCategories, setAllCategories] = useState<HHCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [displayedItemsCount, setDisplayedItemsCount] =
    useState<number>(ITEMS_PER_PAGE);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const categoriesData = await getProfessionalRolesWithCategories();
        setAllCategories(categoriesData);
      } catch (e: any) {
        setError(e.message || "Не удалось загрузить список профессиональных ролей.");
        console.error("Error in fetchData:", e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const processedCategories = useMemo(() => {
    const trimmedSearchTerm = searchTerm.trim();
    if (!trimmedSearchTerm) return allCategories;
    const lowerSearchTerm = trimmedSearchTerm.toLowerCase();
    const filtered: HHCategory[] = [];
    for (const category of allCategories) {
      const categoryNameMatches = category.name.toLowerCase().includes(lowerSearchTerm);
      const filteredChildRoles = filterRolesRecursive(category.roles, trimmedSearchTerm);
      if (categoryNameMatches || filteredChildRoles.length > 0) {
        filtered.push({
          ...category,
          roles: categoryNameMatches && filteredChildRoles.length === 0 ? category.roles : filteredChildRoles,
        });
      }
    }
    return filtered;
  }, [allCategories, searchTerm]);

  const categoriesToDisplay = useMemo(() => {
    if (searchTerm.trim()) return processedCategories;
    return processedCategories.slice(0, displayedItemsCount);
  }, [processedCategories, displayedItemsCount, searchTerm]);

  const hasMoreToLoad = useMemo(() => {
    if (searchTerm.trim()) return false;
    return displayedItemsCount < processedCategories.length;
  }, [processedCategories, displayedItemsCount, searchTerm]);

  useEffect(() => {
    if (!searchTerm.trim()) setDisplayedItemsCount(ITEMS_PER_PAGE);
  }, [searchTerm]);

  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreTriggerRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || searchTerm.trim() || !hasMoreToLoad) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreToLoad) {
          setDisplayedItemsCount((prevCount) => prevCount + ITEMS_PER_PAGE);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, searchTerm, hasMoreToLoad]
  );

  const buttonPrimaryClasses = `inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium rounded-md shadow-sm ${primaryColorBgClass} text-white hover:${accentColorBgClass} focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#0d2d62] transition-all duration-300 group hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed`;
  const buttonGhostClasses = `inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium rounded-md ${primaryColorTextClass} border ${primaryColorBorderClass} hover:${veryLightBgColorClass} focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#143c80] transition-all duration-300 group disabled:opacity-60 disabled:cursor-not-allowed`;


  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center py-10 min-h-[300px] ${lightestBgColorClass} rounded-lg border ${lightBorderColorClass}`}>
        <Spinner text="Загрузка проф. ролей..." size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-10 bg-red-50 p-6 rounded-lg shadow-xl border border-red-200`}>
        <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-red-700 mb-3">Ошибка загрузки</h2>
        <p className="text-red-600 mb-6 text-sm">{error}</p>
        <button
          onClick={async () => {
            setIsLoading(true); setError(null);
            try {
              const categoriesData = await getProfessionalRolesWithCategories(); setAllCategories(categoriesData);
            } catch (e: any) { setError(e.message || "Не удалось загрузить список."); }
            finally { setIsLoading(false); }
          }}
          className={`${buttonPrimaryClasses} bg-red-600 hover:bg-red-700 focus:ring-red-500`}
        >
          <RotateCcw size={18} className="mr-2"/> Попробовать снова
        </button>
        <Link href="/" className={`mt-4 block ${primaryColorTextClass} hover:${accentColorTextClass} text-sm`}>
          <Home size={16} className="inline mr-1" /> На главную
        </Link>
      </div>
    );
  }

  const renderRoles = (roles: HHRole[], level: number = 0) => {
    if (!roles || roles.length === 0) {
      return level === 0 ? (<p className={`${secondaryTextColorClass} italic pl-1 text-sm`}>Нет подходящих ролей.</p>) : null;
    }
    return (
      <ul className={`space-y-1 ${level > 0 ? `ml-4 sm:ml-5 pl-3 ${lightBorderColorClass} border-l` : ""}`}>
        {roles.map((role) => (
          <li key={role.id} className="py-1.5 group/role">
            <div className="flex justify-between items-center gap-2">
              <Link
                href={`/hh-roles/${role.id}`} // Предполагаем, что такой роут будет
                className={`${primaryColorTextClass} hover:${accentColorTextClass} transition-colors group ${level === 0 ? "font-medium text-base" : "text-sm"}`}
                title={`Подробнее о роли "${role.name}"`}
              >
                {role.name}
                <ChevronRight size={16} className="inline ml-1 opacity-0 group-hover:opacity-70 transition-opacity transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href={`https://hh.kz/search/vacancy?area=160&professional_role=${role.id}&search_field=name&search_field=company_name&search_field=description`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-shrink-0 text-xs ${primaryColorTextClass} hover:${accentColorTextClass} ml-2 px-2.5 py-1 border ${primaryColorBorderClass} rounded-md hover:${veryLightBgColorClass} transition-colors flex items-center`}
                title={`Посмотреть вакансии для "${role.name}" на hh.kz`}
              >
                Вакансии <ExternalLink size={12} className="ml-1.5 opacity-80"/>
              </a>
            </div>
            {role.roles && role.roles.length > 0 && renderRoles(role.roles, level + 1)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <div className="mb-8 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={20} className={`${secondaryTextColorClass}`} />
        </div>
        <input
          type="text"
          placeholder="Поиск по профессиям и категориям..."
          className={`w-full p-3 pl-10 form-input bg-white`} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {categoriesToDisplay.length === 0 && !isLoading && (
        <div className={`text-center py-10 ${lightestBgColorClass} rounded-lg shadow-lg min-h-[200px] flex flex-col justify-center items-center border ${lightBorderColorClass}`}>
          <Search size={48} className={`${secondaryTextColorClass} mb-4`} />
          <p className={`${primaryColorTextClass} text-lg`}>
            {searchTerm.trim()
              ? "Ничего не найдено по вашему запросу."
              : "Профессиональные роли не загружены или отсутствуют."}
          </p>
          {searchTerm.trim() && (
            <button
              onClick={() => setSearchTerm("")}
              className={`mt-4 ${accentColorTextClass} hover:${primaryColorTextClass} underline text-sm`}
            >
              Сбросить поиск
            </button>
          )}
        </div>
      )}

      <div className="space-y-6">
        {categoriesToDisplay.map((category) => (
          <section
            key={category.id}
            className={`bg-white p-4 sm:p-6 rounded-xl shadow-xl border ${lightBorderColorClass}`}
          >
            <h2 className={`text-xl sm:text-2xl font-bold ${accentColorTextClass} mb-4 border-b ${lightBorderColorClass} pb-3 flex items-center`}>
              <ListTree size={24} className="mr-2.5"/>
              {category.name}
            </h2>
            {renderRoles(category.roles)}
          </section>
        ))}
      </div>

      {!searchTerm.trim() && hasMoreToLoad && (
        <div
          ref={loadMoreTriggerRef}
          className="flex flex-col items-center justify-center py-10"
        >
          <Spinner text="Загрузка еще..." size="medium"/>
        </div>
      )}
      {!searchTerm.trim() &&
        !hasMoreToLoad &&
        allCategories.length > 0 &&
        processedCategories.length > 0 &&
        displayedItemsCount >= processedCategories.length && (
          <div className="text-center py-10">
            <p className={`${secondaryTextColorClass} flex items-center justify-center`}>
              <CheckCircle2 size={20} className="mr-2 text-green-500"/>
              Все категории профессиональных ролей загружены.
            </p>
          </div>
        )}
    </>
  );
}

export default function ProfessionsPage() {
  const buttonPrimaryClasses = `inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium rounded-md shadow-sm ${primaryColorBgClass} text-white hover:${accentColorBgClass} focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#0d2d62] transition-all duration-300 group hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed`;

  return (
    <div className="relative min-h-screen bg-white">
      <AnimatedBackground />
      <div className={`relative z-10 font-sans ${primaryColorTextClass} p-4 sm:p-6 md:p-8 pt-20 md:pt-24`}>
        <div className="max-w-4xl mx-auto">
          <header className="mb-10 pt-8 sm:pt-12">
            <div className="mb-6 text-left">
            </div>
            <div className="text-center">
                <h1 className={`text-4xl sm:text-5xl font-bold ${accentColorTextClass} inline-flex items-center`}>
                    <ListTree size={40} className="mr-3 opacity-90" />
                    Каталог профессиональных ролей
                </h1>
                <p className={`mt-3 text-base ${secondaryTextColorClass} max-w-2xl mx-auto`}>
                Здесь представлен структурированный список профессиональных ролей с
                портала hh.kz. Вы можете ознакомиться с ними, выполнить поиск и
                посмотреть актуальные вакансии в Казахстане для каждой роли.
                </p>
            </div>
             <div className="mt-8 text-center">
                <Link href="/survey" className={`${buttonPrimaryClasses}`}>
                    <Sparkles size={18} className="mr-2" />
                    Пройти AI-опрос для подбора профессии
                </Link>
            </div>
          </header>
          <ProfessionsPageContent />
          <div className="mt-12 text-center">
            <Link href="/" className={`${primaryColorTextClass} hover:${accentColorTextClass} transition-colors text-sm inline-flex items-center group`}>
              <ArrowLeft size={16} className="mr-1.5 transition-transform group-hover:-translate-x-0.5"/>
              Вернуться на главную
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}