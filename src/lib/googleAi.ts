// lib/googleAi.ts
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  GenerationConfig,
} from "@google/generative-ai";

const API_KEY = process.env.GOOGLE_API_KEY;

if (!API_KEY) {
  console.error(
    "SERVER FATAL ERROR: GOOGLE_API_KEY is not set in .env.local. AI features will not work."
  );
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

const model = genAI
  ? genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    })
  : null;

const generationConfig: GenerationConfig = {
  temperature: 0.6,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 2048,
};

const jsonGenerationConfig: GenerationConfig = {
  ...generationConfig,
  responseMimeType: "application/json",
};

export async function getProfessionRecommendations(
  skills: string,
  interests: string,
  workStyle: "team" | "solo" | "any",
  problemApproach: "creative" | "analytical" | "any"
): Promise<string> {
  if (!model) {
    throw new Error("Google AI Model is not initialized. Check API Key.");
  }

  let workStyleDescription = "";
  if (workStyle === "team")
    workStyleDescription = "предпочитает командную работу";
  else if (workStyle === "solo")
    workStyleDescription = "предпочитает самостоятельную работу";
  else
    workStyleDescription =
      "гибок в отношении стиля работы (командная/самостоятельная)";

  let problemApproachDescription = "";
  if (problemApproach === "creative")
    problemApproachDescription =
      "склонен к творческому подходу и поиску нестандартных решений проблем";
  else if (problemApproach === "analytical")
    problemApproachDescription =
      "предпочитает аналитический и структурированный подход к решению проблем";
  else
    problemApproachDescription =
      "гибок в подходе к решению проблем (творческий/аналитический)";

  const prompt = `
Ты — высококвалифицированный карьерный консультант из Казахстана. Твоя задача — помочь студенту колледжа выбрать профессию.
Информация о студенте:
- Навыки: "${skills}"
- Интересы: "${interests}"
- Стиль работы: Студент ${workStyleDescription}.
- Подход к проблемам: Студент ${problemApproachDescription}.

Проанализируй всю эту информацию комплексно.
Учитывая текущий рынок труда в Казахстане, порекомендуй 3-4 наиболее подходящих профессии.

Для каждой рекомендованной профессии предоставь следующую информацию СТРОГО в формате JSON-массива объектов. Каждый объект должен иметь поля:
- "professionName": (string) Название профессии.
- "matchScore": (number) Оценка соответствия по 100-балльной шкале (например, 85). Оценивай комплексно, насколько все факторы (навыки, интересы, предпочтения) соответствуют профессии.
- "justification": (string) Краткое общее объяснение, почему эта профессия подходит (1-2 предложения).
- "matchingFactors": (object) Объект с детализацией, какие именно аспекты профиля студента совпали с требованиями/характеристиками профессии:
    - "skills": (string[]) Массив из 1-3 ключевых навыков студента, которые особенно важны для этой профессии. Если подходящих навыков нет, верни пустой массив.
    - "interests": (string[]) Массив из 1-2 интересов студента, которые находят отражение в этой профессии. Если подходящих интересов нет, верни пустой массив.
    - "preferences": (string[]) Массив из 1-2 коротких фраз, описывающих, как стиль работы или подход к проблемам студента соответствует этой профессии. Если нет явного соответствия, верни пустой массив.

Пример одного объекта в JSON-массиве:
{
  "professionName": "Веб-разработчик",
  "matchScore": 90,
  "justification": "Ваши сильные навыки в программировании, интерес к созданию сайтов и аналитический подход к задачам делают эту профессию отличным выбором с высоким потенциалом в Казахстане.",
  "matchingFactors": {
    "skills": ["JavaScript", "Решение проблем"],
    "interests": ["Разработка веб-приложений"],
    "preferences": ["Подходит аналитический подход", "Возможность как командной, так и самостоятельной работы"]
  }
}

ВАЖНО: Твой ответ должен быть ИСКЛЮЧИТЕЛЬНО валидным JSON-массивом. Не добавляй никаких объяснений, комментариев, markdown-разметки (вроде \`\`\`json) или любого другого текста до или после JSON-массива. Только чистый JSON.
Отвечай на русском языке внутри JSON-строк.
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: jsonGenerationConfig,
    });
    const response = result.response;

    if (response.promptFeedback?.blockReason) {
      console.error(
        "AI Prompt was blocked. Reason:",
        response.promptFeedback.blockReason
      );
      console.error("Prompt Feedback Details:", response.promptFeedback);
      throw new Error(
        `AI prompt был заблокирован: ${response.promptFeedback.blockReason}. Пожалуйста, измените входные данные или обратитесь к администратору.`
      );
    }
    const responseText = response.text();
    return responseText;
  } catch (error: any) {
    console.error(
      "Error in getProfessionRecommendations from Google AI:",
      error
    );
    if (error.message?.includes("fetch failed")) {
      throw new Error(
        "Не удалось подключиться к сервису Google AI. Проверьте ваше интернет-соединение и настройки брандмауэра."
      );
    }
    if (error.message?.startsWith("AI prompt был заблокирован")) {
      throw error;
    }
    if (error.message?.includes("responseMimeType")) {
      console.warn(
        "Warning: responseMimeType: 'application/json' may not be fully supported or caused an issue. The model might not have returned pure JSON."
      );
      try {
        const fallbackResult = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: generationConfig,
        });
        return fallbackResult.response.text();
      } catch (fallbackError) {
        console.error(
          "Fallback attempt to get AI response also failed:",
          fallbackError
        );
      }
    }
    throw new Error(
      `Не удалось получить рекомендации от AI: ${
        error.message || "Внутренняя ошибка сервиса AI"
      }`
    );
  }
}

export async function getProfessionRoadmap(
  professionName: string
): Promise<string> {
  if (!model) {
    throw new Error("Google AI Model is not initialized. Check API Key.");
  }
  const prompt = `
    Создай примерный пошаговый roadmap (3-5 четких шагов) для студента колледжа в Казахстане, который хочет освоить профессию "${professionName}".
    Включи в roadmap:
    1. Ключевые навыки и знания для изучения (с примерами технологий/инструментов).
    2. Возможные первые шаги (стажировки, пет-проекты, онлайн-курсы).
    3. Полезные ресурсы или сообщества в Казахстане или на русском языке (если возможно).
    Представь результат в виде нумерованного списка шагов.
    Отвечай на русском языке. Будь максимально конкретным и практичным. Каждый шаг должен быть отдельным пунктом списка.
  `;
  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: generationConfig,
    });
    const response = result.response;
    if (response.promptFeedback?.blockReason) {
      console.error(
        "AI Prompt for roadmap was blocked. Reason:",
        response.promptFeedback.blockReason
      );
      throw new Error(
        `AI prompt для roadmap был заблокирован: ${response.promptFeedback.blockReason}.`
      );
    }
    return response.text();
  } catch (error: any) {
    console.error("Error getting profession roadmap from Google AI:", error);
    if (error.message?.includes("fetch failed")) {
      throw new Error(
        "Не удалось подключиться к сервису Google AI для генерации roadmap. Проверьте ваше интернет-соединение."
      );
    }
    if (error.message?.startsWith("AI prompt для roadmap был заблокирован")) {
      throw error;
    }
    throw new Error(
      `Не удалось получить roadmap от AI: ${
        error.message || "Внутренняя ошибка сервиса AI"
      }`
    );
  }
}