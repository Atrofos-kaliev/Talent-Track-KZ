"use client";

import Link from "next/link";
import professionsData from "@/lib/data/professions.json";
import { useEffect, useState, useMemo } from "react";
import Spinner from "@/components/spinner";
import {
  ArrowLeft, BarChart3, TrendingUp, Briefcase, ListChecks, Info, Home, AlertTriangle,
} from "lucide-react";

const primaryColorTextClass = "text-[#143c80]";
const primaryColorBorderClass = "border-[#143c80]";
const primaryColorBgClass = "bg-[#143c80]";
const accentColorTextClass = "text-[#0d2d62]";
const accentColorBgClass = "bg-[#0d2d62]";
const secondaryTextColorClass = "text-[#143c80]/80";
const lightBorderColorClass = "border-[#143c80]/20";
const veryLightBgColorClass = "bg-[#143c80]/5";
const lightestBgColorClass = "bg-[#143c80]/10";

interface Profession {
  id: string; name_ru: string; name_kz: string; description_ru: string; description_kz: string;
  requiredSkills: string[]; relatedInterests: string[]; demand_kz: "high" | "medium" | "low";
  salary_range_kz?: string; education_paths_kz?: string[];
}
const typedProfessionsData: Profession[] = professionsData as Profession[];
interface SkillCount { name: string; count: number; }
interface MarketOverviewData {
  topSkills: SkillCount[]; topHighDemandProfessions: Profession[];
  highDemandCount: number; mediumDemandCount: number; totalProfessions: number;
}
const TOP_SKILLS_COUNT = 25;
const TOP_HIGH_DEMAND_PROFESSIONS_COUNT = 3;

function formatSkillName(skillName: string): string {
  if (!skillName) return "";
  return skillName.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}
function pluralize(number: number, one: string, few: string, many: string): string {
  const mod10 = number % 10; const mod100 = number % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}
function getMarketOverviewData(
  professions: Profession[], topSkillsCount: number, topProfessionsCount: number, isDemoModeSkills: boolean = false
): MarketOverviewData {
  const skillCounts: { [key: string]: number } = {};
  const highDemandProfessions: Profession[] = []; const mediumDemandProfessions: Profession[] = [];
  professions.forEach((prof) => {
    if (prof.requiredSkills) { prof.requiredSkills.forEach((skill) => { skillCounts[skill] = (skillCounts[skill] || 0) + 1; }); }
    if (prof.demand_kz === "high") highDemandProfessions.push(prof);
    else if (prof.demand_kz === "medium") mediumDemandProfessions.push(prof);
  });
  let sortedSkills: SkillCount[] = Object.entries(skillCounts)
    .map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, topSkillsCount);
  if (isDemoModeSkills && sortedSkills.length > 0) {
    const minDemoCount = 20; const maxDemoCount = 100;
    const demoCounts = Array.from({ length: sortedSkills.length }, () => Math.floor(Math.random() * (maxDemoCount - minDemoCount + 1)) + minDemoCount).sort((a, b) => b - a);
    sortedSkills = sortedSkills.map((skill, index) => ({ ...skill, count: demoCounts[index] !== undefined ? demoCounts[index] : skill.count, }));
  }
  const shuffledHighDemand = [...highDemandProfessions].sort(() => 0.5 - Math.random());
  const topHighDemandProfessions = shuffledHighDemand.slice(0, topProfessionsCount);
  return { topSkills: sortedSkills, topHighDemandProfessions, highDemandCount: highDemandProfessions.length, mediumDemandCount: mediumDemandProfessions.length, totalProfessions: professions.length, };
}

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

interface PageHeaderProps { title: string; subtitle: string; }
const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => (
  <header className="mb-10 pt-8 sm:pt-12">
    <div className="mb-6 text-left">
    
    </div>
    <div className="text-center">
        <h1 className={`text-4xl sm:text-5xl font-bold ${accentColorTextClass} inline-flex items-center`}>
            <BarChart3 size={40} className="mr-3 opacity-90" />
            {title}
        </h1>
        <p className={`mt-3 text-base ${secondaryTextColorClass} max-w-2xl mx-auto`}>
            {subtitle}
        </p>
    </div>
  </header>
);

interface StatCardProps { value: number | string; label: string; icon?: React.ReactNode; colorClass?: string; }
const StatCard: React.FC<StatCardProps> = ({ value, label, icon, colorClass = primaryColorTextClass }) => (
  <div className={`bg-white p-6 rounded-xl shadow-lg text-center border ${lightBorderColorClass} hover:shadow-xl transition-shadow duration-300`}>
    {icon && <div className={`mx-auto mb-3 w-10 h-10 ${colorClass} opacity-80`}>{icon}</div>}
    <h3 className={`text-4xl font-bold ${colorClass}`}>{value}</h3>
    <p className={`${secondaryTextColorClass} mt-1 text-sm`}>{label}</p>
  </div>
);

interface SectionProps { title: string; children: React.ReactNode; icon?: React.ReactNode; }
const Section: React.FC<SectionProps> = ({ title, children, icon }) => (
  <section className={`bg-white p-6 rounded-xl shadow-xl border ${lightBorderColorClass}`}>
    <h2 className={`text-2xl font-semibold ${accentColorTextClass} mb-6 border-b ${lightBorderColorClass} pb-4 flex items-center`}>
      {icon && <span className="mr-3 w-7 h-7 opacity-80">{icon}</span>}
      {title}
    </h2>
    {children}
  </section>
);

interface TopSkillsSectionProps { skills: SkillCount[]; isLoading: boolean; }
const TopSkillsSection: React.FC<TopSkillsSectionProps> = ({ skills, isLoading }) => {
  const maxCount = skills.length > 0 ? Math.max(...skills.map((s) => s.count), 1) : 1;
  const title = `Топ-${skills.length > 0 ? skills.length : TOP_SKILLS_COUNT} Востребованных Навыков`;
  const [skeletonWidths, setSkeletonWidths] = useState<number[]>([]);

  useEffect(() => {
    if (isLoading) {
      const widths = Array.from({ length: TOP_SKILLS_COUNT }, () => Math.random() * 70 + 20);
      setSkeletonWidths(widths);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <Section title={`Топ-${TOP_SKILLS_COUNT} Востребованных Навыков`} icon={<BarChart3 size={28} />}>
        <ul className="space-y-5">
          {(skeletonWidths.length > 0 ? skeletonWidths : Array(TOP_SKILLS_COUNT).fill(50)).map((width, index) => (
            <li key={`skeleton-${index}`} className="animate-pulse">
              <div className="flex justify-between items-center mb-1.5">
                <div className={`h-5 ${lightestBgColorClass} rounded w-3/4`}></div>
                <div className={`h-5 ${lightestBgColorClass} rounded w-1/5`}></div>
              </div>
              <div className={`w-full ${veryLightBgColorClass} rounded-full h-3 sm:h-3.5`}>
                <div className={`${lightestBgColorClass} h-full rounded-full`} style={{ width: `${width}%` }}></div>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    );
  }

  return (
    <Section title={title} icon={<BarChart3 size={28}/>}>
      {skills.length > 0 ? (
        <ul className="space-y-5">
          {skills.map((skill, index) => {
            const percentage = maxCount > 0 ? Math.max(5, (skill.count / maxCount) * 100) : 5;
            return (
              <li key={skill.name} className="group animate-fadeIn" style={{ animationDelay: `${index * 70}ms` }}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className={`text-sm sm:text-base font-medium ${primaryColorTextClass} group-hover:${accentColorTextClass} transition-colors`}>
                    <span className={`${secondaryTextColorClass} font-normal text-xs sm:text-sm mr-1.5`}>{index + 1}.</span>
                    {formatSkillName(skill.name)}
                  </span>
                  <span className={`text-xs sm:text-sm font-medium ${primaryColorTextClass} ${veryLightBgColorClass} px-2.5 py-1 rounded-md shadow`}>
                    {skill.count} {pluralize(skill.count, "упоминание", "упоминания", "упоминаний")}
                  </span>
                </div>
                <div className={`w-full ${veryLightBgColorClass} rounded-full h-3 sm:h-3.5 shadow-inner overflow-hidden`}>
                  <div
                    className={`bg-gradient-to-r ${primaryColorBgClass} from-[#143c80] via-[#10316b] to-[#0d2d62] group-hover:opacity-80 h-full rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${percentage}%` }}
                    role="progressbar" aria-valuenow={skill.count} aria-valuemin={0} aria-valuemax={maxCount}
                    aria-label={`Востребованность навыка ${formatSkillName(skill.name)}: ${skill.count} ${pluralize(skill.count, "упоминание", "упоминания", "упоминаний")}`}
                  ></div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className={`${secondaryTextColorClass}`}>Данные о навыках отсутствуют.</p>
      )}
    </Section>
  );
};

interface TagProps {  text: string;
  bgColorClass?: string; 
  textColorClass?: string;  }
const Tag: React.FC<TagProps> = ({
  text,
  bgColorClass = `${primaryColorBgClass}/70 hover:${primaryColorBgClass}/80`,
  textColorClass = "text-white"
}) => (
  <span className={`inline-block ${bgColorClass} ${textColorClass} text-xs font-medium mr-1.5 mb-1.5 px-2.5 py-1 rounded-full transition-colors duration-150`}>
    {formatSkillName(text)}
  </span>
);
interface ProfessionCardProps { profession: Profession; }
const ProfessionCard: React.FC<ProfessionCardProps> = ({ profession }) => {
  return (
    <li className={`flex flex-col bg-white p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border ${lightBorderColorClass} hover:border-[#143c80]/40`}>
      <Link href={`/professions/${profession.id}`} className="block group flex-grow">
        <h3 className={`text-lg font-semibold ${primaryColorTextClass} group-hover:${accentColorTextClass} group-hover:underline transition-colors`}>
          {profession.name_ru}
        </h3>
        <h4 className={`text-sm font-medium ${accentColorTextClass}/80 mb-2`}>{profession.name_kz}</h4>
        <p className={`text-xs ${secondaryTextColorClass} mt-1 mb-3 line-clamp-3 group-hover:${primaryColorTextClass} transition-colors`}>
          {profession.description_ru}
        </p>
      </Link>

      {profession.salary_range_kz && (
        <p className="text-sm text-green-600 font-semibold mt-1 mb-3">
          <span className={`${secondaryTextColorClass} font-normal text-xs`}>З/П: </span>
          {profession.salary_range_kz}
        </p>
      )}
      {profession.requiredSkills && profession.requiredSkills.length > 0 && (
        <div className={`mb-2 pt-2 border-t ${lightBorderColorClass}`}>
          <h5 className={`text-xs font-semibold ${secondaryTextColorClass} mb-1.5`}>Ключевые навыки:</h5>
          <div>
            {profession.requiredSkills.slice(0, 4).map((skill) => (
               <Tag
                key={skill}
                text={skill}
                bgColorClass={`${lightestBgColorClass} hover:${veryLightBgColorClass}`}
                textColorClass={primaryColorTextClass}
              />
            ))}
            {profession.requiredSkills.length > 4 && (<span className={`text-xs ${secondaryTextColorClass}/70 ml-1`}>и еще...</span>)}
          </div>
        </div>
      )}
      {profession.relatedInterests && profession.relatedInterests.length > 0 && (
        <div className={`mb-2 pt-2 border-t ${lightBorderColorClass}`}>
          <h5 className={`text-xs font-semibold ${secondaryTextColorClass} mb-1.5`}>Будет интересно, если вам нравится:</h5>
          <div>
            {profession.relatedInterests.slice(0, 3).map((interest) => (
               <Tag
                key={interest}
                text={interest}
                bgColorClass={`${lightestBgColorClass} hover:${veryLightBgColorClass}`}
                textColorClass={primaryColorTextClass}
              />
            ))}
            {profession.relatedInterests.length > 3 && (<span className={`text-xs ${secondaryTextColorClass}/70 ml-1`}>и еще...</span>)}
          </div>
        </div>
      )}
      {profession.education_paths_kz && profession.education_paths_kz.length > 0 && (
          <div className={`pt-2 border-t ${lightBorderColorClass} mt-auto`}>
            <h5 className={`text-xs font-semibold ${secondaryTextColorClass} mb-1.5`}>Где учиться:</h5>
            <ul className="list-disc list-inside space-y-0.5">
              {profession.education_paths_kz.slice(0, 2).map((path, index) => (
                <li key={index} className={`text-xs ${secondaryTextColorClass}`}>{path}</li>
              ))}
              {profession.education_paths_kz.length > 2 && (<li className={`text-xs ${secondaryTextColorClass}/70`}>и другие места...</li>)}
            </ul>
          </div>
        )}
    </li>
  );
};

interface TopProfessionsSectionProps { professions: Profession[]; isLoading: boolean; }
const TopProfessionsSection: React.FC<TopProfessionsSectionProps> = ({ professions, isLoading }) => {
  if (isLoading) {
    return (
      <Section title="Примеры Профессий с Высоким Спросом" icon={<Briefcase size={28}/>}>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
          {[...Array(TOP_HIGH_DEMAND_PROFESSIONS_COUNT)].map((_, index) => (
            <li key={index} className={`p-4 ${veryLightBgColorClass} rounded-lg shadow animate-pulse flex flex-col border ${lightBorderColorClass}`}>
              <div className={`h-6 ${lightestBgColorClass} rounded w-3/5 mb-2`}></div>
              <div className={`h-4 ${lightestBgColorClass} rounded w-4/5 mb-1`}></div>
              <div className={`h-10 ${lightestBgColorClass} rounded w-full mb-3`}></div>
              <div className={`h-4 ${lightestBgColorClass} rounded w-1/3 mb-4`}></div>
              <div className={`h-3 ${lightestBgColorClass} rounded w-1/4 mb-2`}></div>
              <div className="flex flex-wrap mb-3">{[...Array(3)].map((_, i) => (<div key={i} className={`h-6 w-20 ${lightestBgColorClass} rounded-full mr-2 mb-2`}></div>))}</div>
              <div className={`mt-auto pt-2 border-t ${lightBorderColorClass}`}><div className={`h-3 ${lightestBgColorClass} rounded w-1/4 mb-2`}></div><div className={`h-3 ${lightestBgColorClass} rounded w-full mb-1`}></div><div className={`h-3 ${lightestBgColorClass} rounded w-5/6`}></div></div>
            </li>
          ))}
        </ul>
      </Section>
    );
  }
  return (
    <Section title="Примеры Профессий с Высоким Спросом" icon={<Briefcase size={28}/>}>
      {professions.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
          {professions.map((prof) => (<ProfessionCard key={prof.id} profession={prof} />))}
        </ul>
      ) : (
        <p className={`${secondaryTextColorClass}`}>Профессии с высоким спросом не найдены в базе.</p>
      )}
      <div className="mt-8 text-center">
        <Link href="/professions" className={`text-base ${primaryColorTextClass} hover:${accentColorTextClass} font-semibold hover:underline`}>
          Смотреть все профессии из каталога →
        </Link>
      </div>
    </Section>
  );
};

const DisclaimerSection: React.FC = () => {
  const buttonPrimaryClasses = `inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md shadow-sm ${primaryColorBgClass} text-white hover:${accentColorBgClass} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-[#0d2d62] transition-colors`;
  return (
  <Section title="Важно Помнить" icon={<Info size={28}/>}>
    <p className={`${secondaryTextColorClass} leading-relaxed`}>
      Данный обзор основан на ограниченном наборе данных, используемых для демонстрации работы нашего сервиса. Реальный рынок труда динамичен и может отличаться. Мы рекомендуем также изучать актуальные вакансии на крупных порталах (например, hh.kz, enbek.kz) и следить за отраслевыми новостями.
    </p>
    <p className={`${secondaryTextColorClass} leading-relaxed mt-3`}>
      Наш AI-рекомендатель поможет вам сузить круг поиска и предложит направления на основе ваших уникальных навыков и интересов.
    </p>
    <div className="mt-6">
      <Link href="/survey" className={`${buttonPrimaryClasses} sm:w-auto`}>
        <ListChecks size={20} className="w-5 h-5 mr-2 -ml-1" />
        Пройти AI-опрос для персональных рекомендаций
      </Link>
    </div>
  </Section>
  );
};

export default function MarketOverviewPage() {
  const [marketData, setMarketData] = useState<MarketOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = getMarketOverviewData(typedProfessionsData, TOP_SKILLS_COUNT, TOP_HIGH_DEMAND_PROFESSIONS_COUNT, true );
    setMarketData(data);
    setIsLoading(false);
  }, []);

  return (
    <div className="relative min-h-screen bg-white">
      <AnimatedBackground />
      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; opacity: 0; }
      `}</style>
      <div className={`relative z-10 font-sans ${primaryColorTextClass} p-4 sm:p-6 md:p-8 pt-20 md:pt-24`}>
        <div className="max-w-4xl mx-auto">
          <PageHeader
            title="Обзор Рынка Труда Казахстана"
            subtitle="Ключевые тенденции и востребованные направления на основе наших данных."
          />
          <section className="grid md:grid-cols-3 gap-6 mb-12">
            {isLoading || !marketData ? (
              <>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`bg-white p-6 rounded-xl shadow-lg text-center animate-pulse border ${lightBorderColorClass}`}>
                    <div className={`h-10 ${lightestBgColorClass} rounded w-1/3 mx-auto mb-3`}></div>
                    <div className={`h-4 ${lightestBgColorClass} rounded w-2/3 mx-auto`}></div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <StatCard value={marketData.totalProfessions} label="Профессий в базе" icon={<BarChart3 size={36}/>} colorClass={primaryColorTextClass} />
                <StatCard value={marketData.highDemandCount} label="С высоким спросом" icon={<TrendingUp size={36}/>} colorClass="text-green-600" />
                <StatCard value={marketData.mediumDemandCount} label="Со средним спросом" icon={<TrendingUp size={36} className="opacity-70"/>} colorClass="text-yellow-500" />
              </>
            )}
          </section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <TopSkillsSection skills={marketData?.topSkills || []} isLoading={isLoading} />
            <TopProfessionsSection professions={marketData?.topHighDemandProfessions || []} isLoading={isLoading} />
          </div>
          <DisclaimerSection />

          <div className="mt-12 text-center">
          
          </div>
        </div>
      </div>
    </div>
  );
}