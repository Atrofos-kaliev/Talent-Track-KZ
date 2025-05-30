"use client";

import Link from "next/link";
import {
  Code2, Network, BrainCircuit, Server, Settings2, FileJson, Image as ImageIcon,
  ExternalLink, ArrowLeft, KeyRound, ShieldAlert, Home, ChevronDown
} from "lucide-react";

const primaryColorTextClass = "text-[#143c80]";
const primaryColorBorderClass = "border-[#143c80]";
const accentColorTextClass = "text-[#0d2d62]";
const secondaryTextColorClass = "text-[#143c80]/80";
const lightBorderColorClass = "border-[#143c80]/20";
const veryLightBgColorClass = "bg-[#143c80]/5";
const lightestBgColorClass = "bg-[#143c80]/10";

interface ApiEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE"; path: string; description: string;
  requestType?: string; responseType?: string; auth?: string;
  exampleRequest?: string; exampleResponse?: string; notes?: string[];
}
interface ApiSectionData {
  id: string; title: string; icon: React.ElementType; description: string;
  endpoints?: ApiEndpoint[]; isExternal?: boolean; externalLink?: string;
  keyManagement?: string; rateLimits?: string;
}

const apiSectionsData: ApiSectionData[] = [
  {
    id: "google-ai", title: "Google Generative AI (Gemini)", icon: BrainCircuit, isExternal: true, externalLink: "https://ai.google.dev/docs",
    description: "Используется для генерации персонализированных рекомендаций по профессиям и создания карьерных дорожных карт. Взаимодействие происходит через SDK @google/generative-ai.",
    keyManagement: "Требуется GOOGLE_API_KEY, настроенный в переменных окружения сервера (`.env.local`).",
    rateLimits: "Подчиняется стандартным квотам и лимитам Google AI (например, Gemini 1.5 Flash имеет лимиты на запросы в минуту). См. официальную документацию Google для деталей.",
    endpoints: [
      { method: "POST", path: "lib/googleAi.ts -> getProfessionRecommendations()", description: "Генерирует JSON-массив с рекомендациями профессий на основе навыков, интересов и предпочтений пользователя.", requestType: "Входные параметры: skills (string), interests (string), workStyle ('team' | 'solo' | 'any'), problemApproach ('creative' | 'analytical' | 'any')", responseType: "Promise<string> (JSON-строка)", exampleResponse: `[{"professionName": "Веб-разработчик", "matchScore": 90, "justification": "...", "matchingFactors": {"skills": ["JavaScript"], "interests": ["Разработка"], "preferences": ["Аналитический подход"]}}]`, notes: ["Модель: gemini-1.5-flash-latest.", "Настройки безопасности: BLOCK_MEDIUM_AND_ABOVE для Harm Categories.", "GenerationConfig: temperature: 0.6, topK: 40, topP: 0.95, maxOutputTokens: 2048.", "Для этого эндпоинта используется responseMimeType: 'application/json'."] },
      { method: "POST", path: "lib/googleAi.ts -> getProfessionRoadmap()", description: "Генерирует текстовый пошаговый план развития для выбранной профессии.", requestType: "Входной параметр: professionName (string)", responseType: "Promise<string> (текстовая строка)", exampleResponse: `1. Изучите основы HTML, CSS и JavaScript...\n2. Освойте фреймворк React или Vue...\n...`},
    ],
  },
  {
    id: "hh-api", title: "HeadHunter API", icon: Network, isExternal: true, externalLink: "https://api.hh.ru/openapi/redoc",
    description: "Используется для получения списка профессиональных ролей и категорий с портала hh.ru. Взаимодействие происходит через HTTP GET запросы.",
    rateLimits: "Публичные методы обычно имеют ограничения на количество запросов от одного IP-адреса (например, несколько запросов в секунду). Для более высоких лимитов требуется аутентификация приложения.",
    endpoints: [
      { method: "GET", path: "https://api.hh.ru/professional_roles", description: "Возвращает структурированный список профессиональных ролей, сгруппированных по категориям.", responseType: "JSON (HHCategory[])", exampleResponse: `{"categories": [{"id": "1", "name": "Информационные технологии, интернет, телеком", "roles": [{ "id": "1.25", "name": " Аналитик", "roles": [...] }, { "id": "1.475", "name": "Арт-директор", "roles": [...] }]}]}`, notes: ["Используется в `lib/hhApi.ts` функцией `getProfessionalRolesWithCategories()`.", "Аутентификация для данного эндпоинта не требуется."] },
    ],
  },
  {
    id: "unsplash-proxy", title: "Unsplash API (через прокси)", icon: ImageIcon, isExternal: false,
    description: "Внутренний API-эндпоинт, который действует как прокси для Unsplash API. Используется для поиска и получения изображений для иллюстрации контента, связанного с профессиями. Это помогает скрыть API ключ Unsplash от клиента.",
    keyManagement: "Требуется UNSPLASH_ACCESS_KEY, настроенный в переменных окружения сервера (`.env.local`).",
    rateLimits: "Подчиняется лимитам Unsplash API (стандартно 50 запросов в час для демо-ключа, 5000 для продакшн-ключа).",
    endpoints: [
      { method: "GET", path: "/api/images/search", description: "Ищет и возвращает URL одного изображения с Unsplash по заданному запросу.", requestType: "Query параметры: query (string, required), id (string, optional, для логгирования)", responseType: "JSON ({ imageUrl: string | null })", exampleRequest: "/api/images/search?query=software+developer&id=dev001", exampleResponse: `{ "imageUrl": "https://images.unsplash.com/..." }`, notes: ["Реализован в `app/api/images/search/route.ts`.", "Использует `axios` для запроса к `https://api.unsplash.com/search/photos`.", "Выбирает случайную страницу (1-5) для разнообразия результатов.", "Запрашивает 1 изображение (per_page: 1) с альбомной ориентацией.", "В случае ошибки или отсутствия ключа API возвращает соответствующий JSON с ошибкой и статусом.", "Валидация query параметров через Zod."] },
    ],
  },
];

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

export default function ApiDocsPage() {
  return (
    <div className="relative min-h-screen bg-white">
      <AnimatedBackground />
      <div className={`relative z-10 font-sans ${primaryColorTextClass} p-4 sm:p-6 md:p-8 pt-20 md:pt-24`}>
        <div className="max-w-5xl mx-auto">
          <header className="mb-12 pt-8 sm:pt-12">
            <div className="text-center">
                <h1 className={`text-4xl sm:text-5xl font-extrabold mb-3 inline-flex items-center ${accentColorTextClass}`}>
                    <Code2 size={40} className="mr-3 opacity-90" />
                    API Документация
                </h1>
                <p className={`text-center ${secondaryTextColorClass} mt-2 text-base sm:text-lg max-w-2xl mx-auto`}>
                    Обзор API, используемых и предоставляемых нашим проектом.
                </p>
            </div>
          </header>

          <div className="space-y-12">
            {apiSectionsData.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className={`bg-white p-6 rounded-xl shadow-xl scroll-mt-20 border ${lightBorderColorClass}`}
              >
                <div className={`flex flex-col sm:flex-row items-start sm:items-center mb-6 border-b ${lightBorderColorClass} pb-4`}>
                  <div className="flex-shrink-0 mr-4 mb-3 sm:mb-0">
                    <div className={`flex items-center justify-center w-12 h-12 ${lightestBgColorClass} rounded-lg border ${lightBorderColorClass}`}>
                      <section.icon size={28} className={`${primaryColorTextClass}`} />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h2 className={`text-2xl sm:text-3xl font-bold ${accentColorTextClass}`}>
                      {section.title}
                    </h2>
                    {section.isExternal && section.externalLink && (
                      <a href={section.externalLink} target="_blank" rel="noopener noreferrer" className={`text-sm ${primaryColorTextClass} hover:${accentColorTextClass} hover:underline inline-flex items-center mt-1`}>
                        Официальная документация <ExternalLink size={14} className="ml-1.5" />
                      </a>
                    )}
                  </div>
                </div>
                <p className={`${secondaryTextColorClass} leading-relaxed mb-5 text-sm`}>
                  {section.description}
                </p>

                {section.keyManagement && (
                  <div className={`mb-4 p-3.5 ${veryLightBgColorClass} rounded-md border ${lightBorderColorClass}`}>
                    <h4 className={`text-sm font-semibold ${primaryColorTextClass} mb-1 inline-flex items-center`}>
                      <KeyRound size={16} className="mr-2 text-yellow-500" /> Управление ключами:
                    </h4>
                    <p className={`text-xs ${secondaryTextColorClass}`}>{section.keyManagement}</p>
                  </div>
                )}

                {section.rateLimits && (
                  <div className={`mb-6 p-3.5 ${veryLightBgColorClass} rounded-md border ${lightBorderColorClass}`}>
                    <h4 className={`text-sm font-semibold ${primaryColorTextClass} mb-1 inline-flex items-center`}>
                      <Settings2 size={16} className="mr-2 text-cyan-500" /> Лимиты запросов:
                    </h4>
                    <p className={`text-xs ${secondaryTextColorClass}`}>{section.rateLimits}</p>
                  </div>
                )}

                {section.endpoints && section.endpoints.length > 0 && (
                  <div className="space-y-6">
                    <h3 className={`text-xl font-semibold ${primaryColorTextClass} mb-1 mt-2`}>
                      Ключевые эндпоинты / функции:
                    </h3>
                    {section.endpoints.map((endpoint, idx) => (
                      <div key={idx} className={`p-4 ${veryLightBgColorClass} rounded-lg border ${lightBorderColorClass}`}>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-2.5">
                          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${endpoint.method === "GET" ? "bg-sky-100 text-sky-700" : "bg-green-100 text-green-700"}`}>
                            {endpoint.method}
                          </span>
                          <code className={`text-sm ${accentColorTextClass} bg-gray-100 px-2 py-1 rounded-md font-mono`}>{endpoint.path}</code>
                        </div>
                        <p className={`text-sm ${secondaryTextColorClass} mb-2`}>{endpoint.description}</p>
                        {endpoint.requestType && (<p className={`text-xs ${secondaryTextColorClass} mb-1`}><strong className={`${primaryColorTextClass}`}>Запрос:</strong> {endpoint.requestType}</p>)}
                        {endpoint.responseType && (<p className={`text-xs ${secondaryTextColorClass} mb-1`}><strong className={`${primaryColorTextClass}`}>Ответ:</strong> {endpoint.responseType}</p>)}
                        {endpoint.auth && (<p className={`text-xs ${secondaryTextColorClass} mb-1`}><strong className={`${primaryColorTextClass}`}>Аутентификация:</strong> {endpoint.auth}</p>)}

                        {endpoint.exampleRequest && (
                          <details className="mt-2.5 group">
                            <summary className={`text-xs ${primaryColorTextClass}/80 hover:${primaryColorTextClass} cursor-pointer font-medium flex items-center`}>Пример запроса <ChevronDown size={16} className="ml-1 group-open:rotate-180 transition-transform"/> </summary>
                            <pre className={`mt-1 p-3 bg-gray-50 text-xs ${secondaryTextColorClass} rounded-md overflow-x-auto border ${lightBorderColorClass}`}><code>{endpoint.exampleRequest}</code></pre>
                          </details>
                        )}
                        {endpoint.exampleResponse && (
                          <details className="mt-2 group">
                            <summary className={`text-xs ${primaryColorTextClass}/80 hover:${primaryColorTextClass} cursor-pointer font-medium flex items-center`}>Пример ответа <ChevronDown size={16} className="ml-1 group-open:rotate-180 transition-transform"/> </summary>
                            <pre className={`mt-1 p-3 bg-gray-50 text-xs ${secondaryTextColorClass} rounded-md overflow-x-auto border ${lightBorderColorClass}`}><code>{endpoint.exampleResponse}</code></pre>
                          </details>
                        )}
                        {endpoint.notes && endpoint.notes.length > 0 && (
                          <div className={`mt-3 pt-2 border-t ${lightBorderColorClass}`}>
                            <h5 className={`text-xs font-semibold ${primaryColorTextClass} mb-1.5`}>Примечания:</h5>
                            <ul className="list-disc list-inside space-y-1 pl-1">
                              {endpoint.notes.map((note, noteIdx) => (<li key={noteIdx} className={`text-xs ${secondaryTextColorClass}`}>{note}</li>))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {!section.endpoints && !section.isExternal && (
                  <div className={`mt-4 p-4 ${veryLightBgColorClass} rounded-md border ${lightBorderColorClass} text-center`}>
                    <ShieldAlert size={24} className={`mx-auto mb-2 ${accentColorTextClass} opacity-70`} />
                    <p className={`text-sm ${secondaryTextColorClass}`}>Информация о конкретных эндпоинтах для этого внутреннего API не детализирована.</p>
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}