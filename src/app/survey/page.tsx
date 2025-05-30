// app/survey/page.tsx
"use client";

import React, { useCallback, FormEvent, JSX } from "react";
import Link from "next/link";
import Image from "next/image";
import Spinner from "@/components/spinner";
import {
  useSurveyStore,
  WorkStyle,
  ProblemApproach,
  ParsedRecommendation,
  EnrichedRecommendation,
  EnrichedRoadmapStep,
  RoadmapStepType,
  CustomInsight,
  SurveyHelperFunctions,
} from "@/stores/surveyStore";
import {
  ArrowLeft,
  Lightbulb,
  Sparkles,
  Settings2,
  Users,
  Briefcase,
  MessageSquareWarning,
  FileText,
  BookOpen,
  Code,
  Users2,
  Link2,
  Award,
  ChevronsUpDown,
  AlertTriangle,
  FileQuestion,
  BarChart3,
  HelpCircle,
  Type,
  ImageOff,
  Map,
  ChevronDown,
} from "lucide-react";


const primaryColorTextClass = "text-[#143c80]";
const primaryColorBorderClass = "border-[#143c80]";
const primaryColorBgClass = "bg-[#143c80]";
const accentColorTextClass = "text-[#0d2d62]";
const accentColorBgClass = "bg-[#0d2d62]";
const secondaryTextColorClass = "text-[#143c80]/80";
const lightBorderColorClass = "border-[#143c80]/20";
const lightBgColorClass = "bg-[#143c80]/5";
const veryLightBgColorClass = "bg-[#143c80]/10";

const PROFESSION_TYPE_KEYWORDS: Record<string, string[]> = {
  "Техническая / IT": ["разработчик", "инженер", "программист", "developer", "software engineer", "data scientist", "аналитик данных", "data analyst", "machine learning", "ai specialist", "devops", "тестировщик", "qa engineer", "системный администратор"],
  "Аналитическая / Бизнес": ["аналитик", "analyst", "бизнес-аналитик", "системный аналитик", "финансовый аналитик", "маркетинговый аналитик"],
  "Творческая / Медиа": ["дизайнер", "designer", "ui/ux", "graphic designer", "web designer", "художник", "иллюстратор", "писатель", "копирайтер", "редактор", "сценарист", "музыкант", "content creator", "animator", "фотограф", "видеограф"],
  "Управленческая / Организационная": ["менеджер", "manager", "product manager", "project manager", "руководитель", "директор", "координатор", "администратор", "team lead", "scrum master", "продюсер"],
  "Социальная / Сервисная / Консалтинг": ["учитель", "преподаватель", "тренер", "коуч", "врач", "доктор", "медсестра", "психолог", "консультант", "юрист", "адвокат", "hr", "human resources", "рекрутер", "customer support", "service", "специалист по работе с клиентами", "социальный работник", "event manager"],
  "Маркетинг / PR / Реклама": ["маркетолог", "marketing", "seo", "smm", "pr", "public relations", "таргетолог", "специалист по рекламе", "brand manager", "ppc"],
};
const ROADMAP_STEP_KEYWORDS: Record<RoadmapStepType, string[]> = {
  learning: ["изучить", "курс", "книг", "документац", "learn", "course", "book", "documentation", "tutorial", "освоить", "урок", "лекци", "семинар", "вебинар", "прочитать", "исследовать", "понять", "разобраться", "теория", "основы"],
  practice: ["практика", "проект", "задач", "создать", "practice", "project", "task", "build", "develop", "написать", "реализовать", "применить", "упражнени", "лабораторн", "кодить", "пет-проект"],
  portfolio_resume: ["портфолио", "github", "резюме", "cv", "portfolio", "resume", "профил", "проекты для резюме", "сопроводительное письмо", "cover letter"],
  networking: ["сообществ", "конференци", "митап", "networking", "community", "conference", "meetup", "связи", "знакомств", "форум", "общаться", "linkedin", "профессиональная сеть"],
  career_milestone: ["сертификац", "экзамен", "certification", "exam", "работ", "job", "фриланс", "freelance", "стажировк", "internship", "собеседован", "interview", "ваканси", "перв[ао][ея]", "устроитьс", "найти работу", "получить должность", "оффер"],
  general_tip: [],
  default: [],
};

function cleanMarkdown(text: string | undefined | null): string {
  if (!text) return "";
  return text.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1").replace(/ Klikniдэ (\d+) sanyna basynda nemese qaz.\s*\[\d+\]/gi, "").replace(/```[\s\S]*?```/g, "").trim();
}
function generateUniqueId(prefix: string = "id"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
function parseAiJsonResponse(jsonString: string): ParsedRecommendation[] {
  let jsonDataToParse = jsonString.trim();
  const markdownJsonMatch = jsonDataToParse.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/m);
  if (markdownJsonMatch && markdownJsonMatch[1]) { jsonDataToParse = markdownJsonMatch[1].trim(); }
  if (!((jsonDataToParse.startsWith("[") && jsonDataToParse.endsWith("]")) || (jsonDataToParse.startsWith("{") && jsonDataToParse.endsWith("}")))) {
    let startIndex = -1; let openChar: "[" | "{" | "" = ""; let closeChar: "]" | "}" | "" = "";
    const firstBracket = jsonDataToParse.indexOf("["); const firstBrace = jsonDataToParse.indexOf("{");
    if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) { startIndex = firstBracket; openChar = "["; closeChar = "]"; }
    else if (firstBrace !== -1) { startIndex = firstBrace; openChar = "{"; closeChar = "}"; }
    if (startIndex !== -1 && openChar && closeChar) {
      let balance = 0; let endIndex = -1;
      for (let i = startIndex; i < jsonDataToParse.length; i++) {
        if (jsonDataToParse[i] === openChar) balance++; if (jsonDataToParse[i] === closeChar) balance--;
        if (balance === 0) { endIndex = i; break; }
      }
      if (endIndex !== -1) { jsonDataToParse = jsonDataToParse.substring(startIndex, endIndex + 1).trim(); }
      else { console.warn("Could not reliably extract JSON (unbalanced). Original:", jsonString.substring(0, 200)); }
    } else { console.warn("AI response does not appear to contain JSON. Original:", jsonString.substring(0, 200)); }
  }
  if (!jsonDataToParse) { console.warn("AI response string is empty after extraction."); return []; }
  try {
    const parsedData = JSON.parse(jsonDataToParse);
    if (!Array.isArray(parsedData)) { console.warn("AI response was not a JSON array. Parsed:", parsedData); return []; }
    return parsedData.filter((item): item is Record<string, any> => item && typeof item === "object" && item.professionName && item.justification)
      .map((item): ParsedRecommendation => ({
        professionName: cleanMarkdown(item.professionName as string),
        matchScore: typeof item.matchScore === "number" && item.matchScore >= 0 && item.matchScore <= 100 ? item.matchScore : undefined,
        justification: cleanMarkdown(item.justification as string),
        matchingFactors: item.matchingFactors && typeof item.matchingFactors === "object" && Array.isArray(item.matchingFactors.skills) && Array.isArray(item.matchingFactors.interests) && Array.isArray(item.matchingFactors.preferences)
          ? { skills: (item.matchingFactors.skills as any[]).map((s) => cleanMarkdown(String(s))), interests: (item.matchingFactors.interests as any[]).map((i) => cleanMarkdown(String(i))), preferences: (item.matchingFactors.preferences as any[]).map((p) => cleanMarkdown(String(p))) } : undefined,
      }));
  } catch (error) { console.error("Failed to parse AI JSON:", error, "\nOriginal:", jsonString.substring(0, 500), "\nAttempted:", jsonDataToParse.substring(0, 500)); return []; }
}
function parseRoadmapText(text: string | null): string[] {
  if (!text?.trim()) return [];
  return text.split("\n").map((line) => line.trim().replace(/^(\d+\.|[*\-•✓✔✖✗])\s*/, "")).map(cleanMarkdown).filter((line) => line.length > 3);
}
function applyHumanLogicToRecommendations(recommendationsFromAI: ParsedRecommendation[], criticalSkillInput: string): EnrichedRecommendation[] {
  const criticalSkill = cleanMarkdown(criticalSkillInput.trim().toLowerCase());
  return recommendationsFromAI.map((rec): EnrichedRecommendation => {
    const enrichedRec: EnrichedRecommendation = { ...rec, id: generateUniqueId("rec"), customInsights: [], adjustedMatchScore: rec.matchScore !== undefined ? rec.matchScore : 70, professionTypeGuess: undefined, imageUrl: undefined, };
    if (criticalSkill) {
      const hasCriticalSkill = rec.matchingFactors?.skills?.some((skill) => cleanMarkdown(skill).toLowerCase().includes(criticalSkill));
      if (hasCriticalSkill) { enrichedRec.customInsights.push({ type: "info", text: `Отлично! Эта профессия задействует ваш критически важный навык: ${criticalSkillInput.trim()}.` }); enrichedRec.adjustedMatchScore = Math.min(100, enrichedRec.adjustedMatchScore + 10); }
      else { enrichedRec.customInsights.push({ type: "warning", text: `Внимание: Не указано явное использование вашего критического навыка "${criticalSkillInput.trim()}".` }); enrichedRec.adjustedMatchScore = Math.max(0, enrichedRec.adjustedMatchScore - 15); }
    }
    const nameLower = rec.professionName.toLowerCase();
    for (const type in PROFESSION_TYPE_KEYWORDS) {
      if (PROFESSION_TYPE_KEYWORDS[type].some((kw) => nameLower.includes(kw))) {
        if (type === "Аналитическая / Бизнес" && PROFESSION_TYPE_KEYWORDS["Техническая / IT"].some((itKw) => nameLower.includes(itKw) && itKw.includes("аналитик данных"))) { }
        else { enrichedRec.professionTypeGuess = type; break; }
      }
    }
    if (enrichedRec.professionTypeGuess) { enrichedRec.customInsights.push({ type: "info", text: `Предполагаемый тип профессии: ${enrichedRec.professionTypeGuess}.` }); }
    else { enrichedRec.customInsights.push({ type: "info", text: `Тип этой профессии не удалось однозначно определить.` }); }
    const factors = rec.matchingFactors; const justificationLengthThreshold = 80; const totalFactorsThreshold = 2; let lowInfoWarning = false;
    if (factors) { const totalFactorItems = (factors.skills?.length || 0) + (factors.interests?.length || 0) + (factors.preferences?.length || 0); if (totalFactorItems < totalFactorsThreshold && rec.justification.length < justificationLengthThreshold) lowInfoWarning = true; }
    else if (rec.justification.length < justificationLengthThreshold) lowInfoWarning = true;
    if (lowInfoWarning) { enrichedRec.customInsights.push({ type: "warning", text: "AI предоставил ограниченные детали для этой рекомендации." }); if (enrichedRec.adjustedMatchScore > 40) enrichedRec.adjustedMatchScore = Math.max(0, enrichedRec.adjustedMatchScore - 7); }
    if (factors && (factors.skills?.length || 0) + (factors.interests?.length || 0) > 4) { enrichedRec.customInsights.push({ type: "info", text: "Множество ваших навыков и интересов совпадают с этой профессией!" }); enrichedRec.adjustedMatchScore = Math.min(100, enrichedRec.adjustedMatchScore + 5); }
    enrichedRec.adjustedMatchScore = Math.max(0, Math.min(100, Math.round(enrichedRec.adjustedMatchScore)));
    return enrichedRec;
  });
}
function applyHumanLogicToRoadmap(parsedSteps: string[]): EnrichedRoadmapStep[] {
  if (!parsedSteps?.length) return [];
  return parsedSteps.map((stepText, index): EnrichedRoadmapStep => {
    const stepLower = stepText.toLowerCase(); const step: EnrichedRoadmapStep = { id: generateUniqueId("roadmap-step"), text: stepText, insights: [], stepType: "default", isMajorMilestone: false, };
    for (const type in ROADMAP_STEP_KEYWORDS) { if (ROADMAP_STEP_KEYWORDS[type as RoadmapStepType].some((kw) => stepLower.includes(kw))) { step.stepType = type as RoadmapStepType; break; } }
    switch (step.stepType) {
      case "learning": step.insights.push({ type: "info", text: "Активное изучение новых знаний." }); break;
      case "practice": step.insights.push({ type: "info", text: "Применение знаний на практике." }); break;
      case "portfolio_resume": step.insights.push({ type: "tip", text: "Обновляйте портфолио/резюме." }); step.isMajorMilestone = true; break;
      case "networking": step.insights.push({ type: "tip", text: "Участвуйте в проф. сообществах." }); break;
      case "career_milestone": step.insights.push({ type: "info", text: "Важная карьерная веха." }); step.isMajorMilestone = true; break;
    }
    if (index === 0) { step.insights.unshift({ type: "tip", text: "Начните этот путь с энтузиазмом!" }); if (step.stepType === "default") step.stepType = "general_tip"; }
    if (index === parsedSteps.length - 1 && parsedSteps.length > 1) { step.insights.push({ type: "tip", text: "Отлично! Продолжайте развиваться." }); if (step.stepType === "default") step.stepType = "general_tip"; }
    if (stepText.length < 25 && step.stepType === "default" && !step.isMajorMilestone) { step.insights.push({ type: "warning", text: "Шаг описан кратко. Уточните детали." }); }
    if (step.stepType === "default" && step.insights.some((ins) => ins.type === "tip")) { step.stepType = "general_tip"; }
    return step;
  });
}

const AnimatedBackground = () => (
  <>
    <div className="bgSquaresUp" aria-hidden="true">
      <div className="squareUp"></div><div className="squareUp"></div><div className="squareUp"></div><div className="squareUp"></div><div className="squareUp"></div>
      <div className="squareUp"></div><div className="squareUp"></div><div className="squareUp"></div><div className="squareUp"></div><div className="squareUp"></div>
    </div>
    <div className="bgSquaresDown" aria-hidden="true">
      <div className="squareDown"></div><div className="squareDown"></div><div className="squareDown"></div><div className="squareDown"></div><div className="squareDown"></div>
      <div className="squareDown"></div><div className="squareDown"></div><div className="squareDown"></div><div className="squareDown"></div><div className="squareDown"></div>
    </div>
  </>
);

const IconMap: Record<RoadmapStepType | 'major_milestone', JSX.Element> = {
  learning: <BookOpen size={18} />,
  practice: <Code size={18} />,
  networking: <Users2 size={18} />,
  portfolio_resume: <FileText size={18} />,
  career_milestone: <Award size={18} />,
  general_tip: <Lightbulb size={18} />,
  default: <ChevronsUpDown size={18} className="text-gray-400" />,
  major_milestone: <Award size={18} className="text-amber-500" />
};


export default function SurveyPage() {
  const { skills, setSkills, interests, setInterests, workStyle, setWorkStyle, problemApproach, setProblemApproach, criticalSkillInput, setCriticalSkillInput, recommendationsText, parsedRecommendations, selectedProfessionForRoadmap, roadmapText, enrichedRoadmapSteps, isLoadingRecommendations, isLoadingImages, isLoadingRoadmap, error, clearError, showRawAiResponse, fetchRecommendations, fetchRoadmap, } = useSurveyStore();
  const fetchImageForProfession = useCallback(async (professionName: string, professionId: string): Promise<string | null> => {
    try {
      const searchQuery = `${cleanMarkdown(professionName)} workplace professional`;
      const response = await fetch(`/api/images/search?query=${encodeURIComponent(searchQuery)}&id=${encodeURIComponent(professionId)}`);
      if (!response.ok) { console.warn(`Image fetch failed for ${professionName}: ${response.status}`); return null; }
      const data = await response.json(); return data.imageUrl || null;
    } catch (err) { console.error(`Error fetching image for ${professionName}:`, err); return null; }
  }, []);
  const surveyHelpers: SurveyHelperFunctions = { cleanMarkdown, parseAiJsonResponse, parseRoadmapText, applyHumanLogicToRecommendations, applyHumanLogicToRoadmap, fetchImageForProfession, };
  const handleGetRecommendations = useCallback(async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); clearError(); fetchRecommendations(surveyHelpers); }, [fetchRecommendations, clearError, surveyHelpers]);
  const handleGetRoadmap = useCallback(async (professionName: string) => { if (!professionName) return; clearError(); fetchRoadmap(professionName, surveyHelpers); }, [fetchRoadmap, clearError, surveyHelpers]);

  const getStepIconElement = useCallback((stepType: RoadmapStepType, isMajorMilestone?: boolean): JSX.Element => {
    if (isMajorMilestone && (stepType === "career_milestone" || stepType === "portfolio_resume")) {
      return IconMap['major_milestone'];
    }
    return IconMap[stepType] || IconMap.default;
  }, []);

  const isLoading = isLoadingRecommendations || isLoadingImages || isLoadingRoadmap;

  const buttonPrimaryClasses = `inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg shadow-md ${primaryColorBgClass} text-white hover:${accentColorBgClass} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d2d62] transition-all duration-300 group hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed`;
  const buttonSecondaryClasses = `inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-lg shadow-sm ${secondaryTextColorClass} border ${primaryColorBorderClass} hover:${lightBgColorClass} focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#143c80] transition-all duration-300 group disabled:opacity-60 disabled:cursor-not-allowed`;


  return (
    <div className="relative min-h-screen bg-white">
      <AnimatedBackground />
      <div className={`relative z-10 font-sans ${primaryColorTextClass} p-4 md:p-6 lg:p-8 pt-20 md:pt-24`}>
        <div className="max-w-4xl mx-auto">
          <header className="mb-10 pt-8 sm:pt-12">
            <div className="mb-6 text-left">
            
            </div>
            <div className="text-center">
              <h1 className={`text-5xl sm:text-6xl font-bold ${accentColorTextClass} mt-2 inline-flex items-center`}>
                <Lightbulb size={48} className="mr-3 text-amber-400" />
                Карьерный Навигатор AI
              </h1>
              <p className={`mt-3 text-base ${secondaryTextColorClass} inline-flex items-center`}>
                <Sparkles size={18} className="mr-2 opacity-70"/>
                Откройте новые горизонты с помощью AI.
              </p>
            </div>
          </header>

         <form
            onSubmit={handleGetRecommendations}
            className={`space-y-6 p-6 sm:p-8 rounded-xl mb-12`}
            aria-labelledby="form-title"
          >
            <h2 id="form-title" className="sr-only">Форма для подбора карьерного пути</h2>
            {[
              { id: "skills", label: "Навыки и знания", placeholder: "JavaScript, Figma, Английский B2...", value: skills, setter: setSkills, rows: 3, required: true, icon: <Settings2 size={16} className="mr-2 opacity-70"/> },
              { id: "interests", label: "Интересы и хобби", placeholder: "Веб-разработка, дизайн, наука...", value: interests, setter: setInterests, rows: 3, required: true, icon: <Sparkles size={16} className="mr-2 opacity-70"/> },
              { id: "criticalSkill", label: "Критически важный навык/интерес (необязательно)", placeholder: "Python или работа с животными", value: criticalSkillInput, setter: setCriticalSkillInput, type: "text", required: false, hint: "Обязательно должно быть в профессии.", icon: <Briefcase size={16} className="mr-2 opacity-70"/> },
            ].map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className={`flex items-center text-sm font-medium leading-6 ${primaryColorTextClass} mb-1.5`}>
                  {field.icon} {field.label} {field.required && (<span className="text-red-500 ml-1" aria-hidden="true">*</span>)}
                </label>
                {field.type === "text" ? (
                  <input type="text" id={field.id} name={field.id} className="form-input bg-white" placeholder={field.placeholder} value={field.value} onChange={(e) => field.setter(e.target.value)} required={field.required} aria-describedby={field.hint ? `${field.id}-hint` : undefined}/>
                ) : (
                  <textarea id={field.id} name={field.id} rows={field.rows} className="form-textarea bg-white" placeholder={field.placeholder} value={field.value} onChange={(e) => field.setter(e.target.value)} required={field.required} aria-describedby={field.hint ? `${field.id}-hint` : undefined}/>
                )}
                {field.hint && (<p id={`${field.id}-hint`} className={`text-xs ${secondaryTextColorClass} mt-1.5 flex items-center`}><HelpCircle size={14} className="mr-1.5 opacity-70"/>{field.hint}</p>)}
              </div>
            ))}
            {[
              { id: "workStyle", label: "Стиль работы", value: workStyle, setter: setWorkStyle, options: [ { value: "", label: "-- Выберите --" }, { value: "team", label: "В команде" }, { value: "solo", label: "Самостоятельно" }, { value: "any", label: "Не важно" }, ], icon: <Users size={16} className="mr-2 opacity-70"/> },
              { id: "problemApproach", label: "Подход к проблемам", value: problemApproach, setter: setProblemApproach, options: [ { value: "", label: "-- Выберите --" }, { value: "creative", label: "Творческий" }, { value: "analytical", label: "Аналитический" }, { value: "any", label: "Комбинированный" }, ], icon: <Lightbulb size={16} className="mr-2 opacity-70"/> },
            ].map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className={`flex items-center text-sm font-medium leading-6 ${primaryColorTextClass} mb-1.5`}>
                 {field.icon} {field.label} <span className="text-red-500 ml-1" aria-hidden="true">*</span>
                </label>
                <select id={field.id} value={field.value} onChange={(e) => field.setter(e.target.value as any)} className="form-select bg-white" required>
                  {field.options.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                </select>
              </div>
            ))}
        
            <button type="submit" disabled={isLoading} className={`${buttonPrimaryClasses} w-full sm:w-auto`}>
              {isLoadingRecommendations || isLoadingImages ? (
                "Обработка..." 
              ) : (
                <><Sparkles size={20} className="mr-2" />Получить AI Рекомендации</>
              )}
            </button>
          </form>


          {error && (
            <div role="alert" className={`my-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg shadow-lg flex items-start`}>
              <AlertTriangle size={24} className="mr-3 text-red-600 flex-shrink-0"/>
              <div>
                <p className="font-semibold text-red-800">Произошла ошибка:</p> <p className="whitespace-pre-wrap text-sm mt-1.5">{error}</p>
              </div>
            </div>
          )}

          {(isLoadingRecommendations || isLoadingImages) && !error && (
            <div aria-live="polite" className={`text-center my-4 p-6 ${lightBgColorClass} rounded-lg shadow-md border ${lightBorderColorClass} flex flex-col items-center justify-center min-h-[200px]`}>
              <Spinner
                  text={
                      isLoadingRecommendations
                      ? "AI анализирует ваши данные..."
                      : isLoadingImages
                      ? "Подбираем красивые образы..."
                      : "Загрузка..."
                  }
                  size="large"
              />
            </div>
          )}

          {parsedRecommendations.length > 0 && !isLoadingRecommendations && (
            <section aria-labelledby="recommendations-title" className="my-12">
              <h2 id="recommendations-title" className={`text-2xl sm:text-3xl font-semibold ${accentColorTextClass} mb-6 text-center sm:text-left flex items-center`}>
                <BarChart3 size={30} className="mr-3" />
                Ваши персональные рекомендации:
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {parsedRecommendations.map((rec, idx) => (
                  <article key={rec.id} className={`bg-white p-5 rounded-xl shadow-xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:ring-1 hover:${primaryColorBorderClass} flex flex-col border ${lightBorderColorClass}`}>
                    <div className={`relative w-full h-48 mb-4 rounded-lg overflow-hidden ${lightBgColorClass} border ${lightBorderColorClass} flex items-center justify-center`}>
                      {isLoadingImages && !rec.imageUrl ? (<div className="w-full h-full animate-pulse bg-gray-200"></div>)
                       : rec.imageUrl ? (<Image src={rec.imageUrl} alt={`Для ${rec.professionName}`} layout="fill" objectFit="cover" priority={idx < 2} unoptimized={process.env.NODE_ENV === "development"}/>)
                       : (<ImageOff size={64} className={`${secondaryTextColorClass}/40`} />)}
                    </div>
                    <header className="flex flex-col sm:flex-row justify-between items-start mb-3">
                      <div className="mb-2 sm:mb-0">
                        <h3 className={`text-xl font-semibold ${primaryColorTextClass} hover:${accentColorTextClass} transition-colors`}>{rec.professionName}</h3>
                        {rec.professionTypeGuess && (<p className={`text-xs ${primaryColorTextClass}/80 font-medium mt-1 inline-flex items-center px-2 py-0.5 rounded ${veryLightBgColorClass}`}><Type size={14} className="mr-1.5 opacity-70"/>{rec.professionTypeGuess}</p>)}
                      </div>
                      {typeof rec.adjustedMatchScore === "number" && (
                        <div className="ml-0 sm:ml-auto flex-shrink-0 text-left sm:text-right pl-0 sm:pl-2">
                          <span title={`AI: ${rec.matchScore ?? "N/A"}% Скорр: ${rec.adjustedMatchScore}%`}
                                className={`cursor-help text-lg font-bold px-3 py-1 rounded-full text-white shadow-md transition-all ${rec.adjustedMatchScore >= 85 ? "bg-green-500 hover:bg-green-600" : rec.adjustedMatchScore >= 70 ? "bg-yellow-500 hover:bg-yellow-600 text-black" : rec.adjustedMatchScore >= 50 ? "bg-orange-500 hover:bg-orange-600" : "bg-red-500 hover:bg-red-600"}`}>
                            {rec.adjustedMatchScore}%
                          </span>
                          <p className={`text-xs ${secondaryTextColorClass} mt-1`}>совпадение</p>
                        </div>
                      )}
                    </header>
                    <p className={`${secondaryTextColorClass} mb-4 text-sm leading-relaxed flex-grow`}>{rec.justification}</p>
                    <div className="space-y-3 mb-4">
                      {rec.customInsights?.length > 0 && (
                        <div>{rec.customInsights.map((insight, i) => (
                          <p key={`insight-${rec.id}-${i}`} className={`text-xs p-2.5 rounded-md shadow-sm mt-1.5 border flex items-start ${insight.type === "warning" ? "bg-red-50/80 text-red-700 border-red-200" : insight.type === "tip" ? `${lightBgColorClass} ${primaryColorTextClass} ${lightBorderColorClass}` : `${veryLightBgColorClass} ${secondaryTextColorClass} ${lightBorderColorClass}`}`}>
                            {insight.type === "warning" && (<AlertTriangle size={16} className="mr-2 mt-0.5 text-red-600 flex-shrink-0"/>)} {insight.type === "tip" && (<Lightbulb size={16} className="mr-2 mt-0.5 text-blue-500 flex-shrink-0"/>)} {insight.type === "info" && (<HelpCircle size={16} className="mr-2 mt-0.5 opacity-70 flex-shrink-0"/>)}
                            <span>{insight.text}</span>
                          </p>))}
                        </div>
                      )}
                      {rec.matchingFactors && ((rec.matchingFactors.skills?.length || 0) > 0 || (rec.matchingFactors.interests?.length || 0) > 0 || (rec.matchingFactors.preferences?.length || 0) > 0) && (
                        <details className={`border-t ${lightBorderColorClass} pt-3 group`}>
                          <summary className={`text-xs font-semibold ${primaryColorTextClass} uppercase tracking-wider cursor-pointer list-none flex justify-between items-center hover:${accentColorTextClass}`}>
                            <span className="flex items-center"><Link2 size={14} className="mr-1.5"/>Ключевые факторы (от AI)</span>
                            <ChevronDown size={18} className="transform transition-transform group-open:rotate-180"/>
                          </summary>
                          <div className="mt-2 space-y-2.5 animate-fadeIn">
                            {rec.matchingFactors.skills?.length > 0 && (<div><p className={`text-xs ${secondaryTextColorClass} mb-0.5`}>Навыки:</p><div className="flex flex-wrap gap-1.5">{rec.matchingFactors.skills.map((s, i) => (<span key={`${rec.id}-s-${i}`} className={`text-xs px-2 py-0.5 rounded-full font-medium ${veryLightBgColorClass} ${primaryColorTextClass} inline-flex items-center`}><Settings2 size={12} className="mr-1 opacity-70"/>{s}</span>))}</div></div>)}
                            {rec.matchingFactors.interests?.length > 0 && (<div><p className={`text-xs ${secondaryTextColorClass} mb-0.5`}>Интересы:</p><div className="flex flex-wrap gap-1.5">{rec.matchingFactors.interests.map((item, i) => (<span key={`${rec.id}-i-${i}`} className={`text-xs px-2 py-0.5 rounded-full font-medium ${veryLightBgColorClass} ${primaryColorTextClass} inline-flex items-center`}><Sparkles size={12} className="mr-1 opacity-70"/>{item}</span>))}</div></div>)}
                            {rec.matchingFactors.preferences?.length > 0 && (<div><p className={`text-xs ${secondaryTextColorClass} mb-0.5`}>Предпочтения:</p><ul className="list-disc list-inside ml-1 space-y-0.5">{rec.matchingFactors.preferences.map((p, i) => (<li key={`${rec.id}-p-${i}`} className={`text-xs ${secondaryTextColorClass}`}>{p}</li>))}</ul></div>)}
                          </div>
                        </details>
                      )}
                    </div>
                    <button onClick={() => handleGetRoadmap(rec.professionName)} disabled={isLoading} className={`${buttonSecondaryClasses} !text-xs !py-2 !px-3 mt-auto w-full sm:w-auto`}>
                      {isLoadingRoadmap && selectedProfessionForRoadmap === rec.professionName ? (<Spinner size="small" />) : (<><Map size={16} className="mr-1.5"/>Показать Roadmap</>)}
                    </button>
                  </article>
                ))}
              </div>
            </section>
          )}

          {showRawAiResponse && recommendationsText && parsedRecommendations.length === 0 && !isLoadingRecommendations && (
            <details className={`my-8 p-4 ${lightBgColorClass} border ${lightBorderColorClass} ${secondaryTextColorClass} rounded-lg shadow-lg group`}>
              <summary className={`font-semibold ${accentColorTextClass} text-sm cursor-pointer list-none flex justify-between items-center hover:${primaryColorTextClass}`}>
                <span className="flex items-center"><FileQuestion size={18} className="mr-2"/>Ответ AI не удалось обработать. Показать детали?</span>
                <ChevronDown size={18} className="transform transition-transform group-open:rotate-180"/>
                </summary>
              <p className="text-xs mt-2 mb-2">Исходный текст от AI:</p>
              <pre className={`whitespace-pre-wrap text-xs bg-white p-3 rounded-md max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 animate-fadeIn border ${lightBorderColorClass}`}>{recommendationsText}</pre>
            </details>
          )}

          {isLoadingRoadmap && selectedProfessionForRoadmap && (
            <div aria-live="polite" className={`text-center my-10 p-6 ${lightBgColorClass} rounded-lg shadow-md border ${lightBorderColorClass} flex flex-col items-center justify-center min-h-[200px]`}> {/* <--- ДОБАВЛЯЕМ КЛАССЫ СЮДА */}
              <Spinner
                text={`AI генерирует Roadmap для "${cleanMarkdown(selectedProfessionForRoadmap)}"...`}
                size="large"
              />
            </div>
          )}

          {enrichedRoadmapSteps.length > 0 && selectedProfessionForRoadmap && !isLoadingRoadmap && (
            <section aria-labelledby={`roadmap-title-${selectedProfessionForRoadmap.replace(/\s+/g, "-")}`} className={`my-12 p-5 sm:p-6 bg-white rounded-xl shadow-xl border ${lightBorderColorClass}`}>
              <h2 id={`roadmap-title-${selectedProfessionForRoadmap.replace(/\s+/g, "-")}`} className={`text-xl sm:text-2xl font-semibold ${accentColorTextClass} mb-5 flex items-center`}><Map size={28} className="mr-3"/>Roadmap для "{cleanMarkdown(selectedProfessionForRoadmap)}":</h2>
              <ol className="space-y-3 list-none p-0">
                {enrichedRoadmapSteps.map((step, index) => (
                  <li key={step.id} className={`${veryLightBgColorClass} p-3 rounded-lg hover:${lightBgColorClass} transition-colors group border ${lightBorderColorClass}`}>
                    <details className="w-full" open={step.isMajorMilestone || index < 2}>
                      <summary className="list-none cursor-pointer flex items-center justify-between">
                        <div className="flex items-center">
                          <span className={`flex-shrink-0 flex items-center justify-center h-7 w-7 rounded-full text-white font-semibold text-sm shadow-md mr-3 ${step.isMajorMilestone ? "bg-amber-500 ring-1 ring-amber-300/50" : `${primaryColorBgClass} ring-1 ring-[#0d2d62]/50`}`}>
                            {getStepIconElement(step.stepType, step.isMajorMilestone)}
                          </span>
                          <p className={`text-sm font-medium ${primaryColorTextClass} ${step.isMajorMilestone ? "text-amber-600" : ""}`}>{step.text}</p>
                        </div>
                        <ChevronDown size={18} className={`w-4 h-4 ${secondaryTextColorClass} transform transition-transform group-open:rotate-180 flex-shrink-0`}/>
                      </summary>
                      {step.insights?.length > 0 && (
                        <div className="mt-2.5 pl-10 space-y-1.5 animate-fadeIn">
                          {step.insights.map((insight, i) => (
                            <p key={`roadmap-insight-${step.id}-${i}`} className={`text-xs p-2 rounded-md border flex items-start ${insight.type === "warning" ? "bg-red-50 text-red-700 border-red-200" : insight.type === "tip" ? `bg-blue-50 text-blue-700 border-blue-200` : `${veryLightBgColorClass} ${secondaryTextColorClass} ${lightBorderColorClass}`}`}>
                              {insight.type === "warning" && (<AlertTriangle size={16} className="mr-2 mt-0.5 text-red-500 flex-shrink-0"/>)}
                              {insight.type === "tip" && (<Lightbulb size={16} className="mr-2 mt-0.5 text-blue-500 flex-shrink-0"/>)}
                              {insight.type === "info" && (<HelpCircle size={16} className="mr-2 mt-0.5 opacity-70 flex-shrink-0"/>)}
                              <span>{insight.text}</span>
                            </p>
                          ))}
                        </div>
                      )}
                    </details>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {roadmapText && enrichedRoadmapSteps.length === 0 && selectedProfessionForRoadmap && !isLoadingRoadmap && (
             <details className={`my-8 p-4 ${lightBgColorClass} border ${lightBorderColorClass} ${secondaryTextColorClass} rounded-lg shadow-lg group`}>
              <summary className={`font-semibold ${accentColorTextClass} text-sm cursor-pointer list-none flex justify-between items-center hover:${primaryColorTextClass}`}>
                <span className="flex items-center"><FileQuestion size={18} className="mr-2"/>Roadmap для "{cleanMarkdown(selectedProfessionForRoadmap)}" не обработан или пуст. Показать сырой ответ?</span>
                <ChevronDown size={18} className="transform transition-transform group-open:rotate-180"/>
                </summary>
              <p className="text-xs mt-2 mb-2">Исходный текст от AI:</p>
              <pre className={`whitespace-pre-wrap text-sm leading-relaxed bg-white p-3 rounded-md max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 animate-fadeIn border ${lightBorderColorClass}`}>{roadmapText}</pre>
              <p className={`text-xs ${secondaryTextColorClass} mt-3`}>Возможно, ответ AI имеет нестандартный формат или не содержит шагов. Попробуйте другую профессию.</p>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}