import { create } from "zustand";
import axios from "axios";

export type WorkStyle = "team" | "solo" | "any" | "";
export type ProblemApproach = "creative" | "analytical" | "any" | "";
export interface CustomInsight {
  type: "warning" | "info" | "tip";
  text: string;
}
export interface ParsedRecommendation {
  professionName: string;
  matchScore?: number;
  justification: string;
  matchingFactors?: {
    skills: string[];
    interests: string[];
    preferences: string[];
  };
}
export interface EnrichedRecommendation extends ParsedRecommendation {
  id: string;
  customInsights: CustomInsight[];
  adjustedMatchScore: number;
  professionTypeGuess?: string;
  imageUrl?: string | null;
}
export type RoadmapStepType =
  | "learning"
  | "practice"
  | "networking"
  | "portfolio_resume"
  | "career_milestone"
  | "general_tip"
  | "default";

export interface EnrichedRoadmapStep {
  id: string;
  text: string;
  insights: CustomInsight[];
  stepType: RoadmapStepType;
  isMajorMilestone?: boolean;
}

export interface SurveyHelperFunctions {
  cleanMarkdown: (text: string | undefined | null) => string;
  parseAiJsonResponse: (jsonString: string) => ParsedRecommendation[];
  parseRoadmapText: (text: string | null) => string[];
  applyHumanLogicToRecommendations: (
    recommendationsFromAI: ParsedRecommendation[],
    criticalSkillInput: string
  ) => EnrichedRecommendation[];
  applyHumanLogicToRoadmap: (parsedSteps: string[]) => EnrichedRoadmapStep[];
  fetchImageForProfession: (
    professionName: string,
    professionId: string
  ) => Promise<string | null>;
}

interface SurveyState {
  skills: string;
  interests: string;
  workStyle: WorkStyle;
  problemApproach: ProblemApproach;
  criticalSkillInput: string;
  recommendationsText: string | null;
  parsedRecommendations: EnrichedRecommendation[];
  selectedProfessionForRoadmap: string | null;
  roadmapText: string | null;
  enrichedRoadmapSteps: EnrichedRoadmapStep[];
  isLoadingRecommendations: boolean;
  isLoadingImages: boolean;
  isLoadingRoadmap: boolean;
  error: string | null;
  showRawAiResponse: boolean;

  setSkills: (skills: string) => void;
  setInterests: (interests: string) => void;
  setWorkStyle: (workStyle: WorkStyle) => void;
  setProblemApproach: (problemApproach: ProblemApproach) => void;
  setCriticalSkillInput: (criticalSkill: string) => void;
  fetchRecommendations: (helpers: SurveyHelperFunctions) => Promise<void>;
  fetchRoadmap: (
    professionName: string,
    helpers: SurveyHelperFunctions
  ) => Promise<void>;
  clearError: () => void;
  resetSurveyInputs: () => void;
}

const initialState = {
  skills: "",
  interests: "",
  workStyle: "" as WorkStyle,
  problemApproach: "" as ProblemApproach,
  criticalSkillInput: "",
  recommendationsText: null,
  parsedRecommendations: [],
  selectedProfessionForRoadmap: null,
  roadmapText: null,
  enrichedRoadmapSteps: [],
  isLoadingRecommendations: false,
  isLoadingImages: false,
  isLoadingRoadmap: false,
  error: null,
  showRawAiResponse: false,
};

export const useSurveyStore = create<SurveyState>((set, get) => ({
  ...initialState,

  setSkills: (skills) => set({ skills }),
  setInterests: (interests) => set({ interests }),
  setWorkStyle: (workStyle) => set({ workStyle }),
  setProblemApproach: (problemApproach) => set({ problemApproach }),
  setCriticalSkillInput: (criticalSkill) =>
    set({ criticalSkillInput: criticalSkill }),
  clearError: () => set({ error: null }),

  resetSurveyInputs: () =>
    set({
      skills: "",
      interests: "",
      workStyle: "" as WorkStyle,
      problemApproach: "" as ProblemApproach,
      criticalSkillInput: "",
      recommendationsText: null,
      parsedRecommendations: [],
      selectedProfessionForRoadmap: null,
      roadmapText: null,
      enrichedRoadmapSteps: [],
      error: null,
      showRawAiResponse: false,
    }),

  fetchRecommendations: async (helpers) => {
    const {
      skills,
      interests,
      workStyle,
      problemApproach,
      criticalSkillInput,
    } = get();
    if (!skills.trim() || !interests.trim() || !workStyle || !problemApproach) {
      set({ error: "Пожалуйста, заполните все обязательные поля (*)." });
      return;
    }

    set({
      error: null,
      showRawAiResponse: false,
      isLoadingRecommendations: true,
      isLoadingImages: true,
      recommendationsText: null,
      parsedRecommendations: [],
      roadmapText: null,
      selectedProfessionForRoadmap: null,
      enrichedRoadmapSteps: [],
    });

    try {
      const response = await axios.post("/api/ai/recommend", {
        skills,
        interests,
        workStyle,
        problemApproach,
      });

      const aiResponseText = response.data.recommendations as
        | string
        | undefined;
      set({ recommendationsText: aiResponseText });

      if (!aiResponseText?.trim()) {
        set({
          error: "AI вернул пустой ответ.",
          isLoadingRecommendations: false,
          isLoadingImages: false,
        });
        return;
      }

      const initialRecommendations =
        helpers.parseAiJsonResponse(aiResponseText);
      if (initialRecommendations.length === 0 && aiResponseText) {
        set({
          error:
            "AI вернул данные, но их не удалось корректно обработать. Проверьте ответ AI ниже.",
          showRawAiResponse: true,
          isLoadingRecommendations: false,
          isLoadingImages: false,
        });
        return;
      }
      if (initialRecommendations.length === 0 && !aiResponseText) {
        set({
          error: "Не удалось получить структурированные рекомендации от AI.",
          isLoadingRecommendations: false,
          isLoadingImages: false,
        });
        return;
      }

      set({ isLoadingRecommendations: false });

      const enriched = helpers.applyHumanLogicToRecommendations(
        initialRecommendations,
        criticalSkillInput
      );

      const recommendationsWithImages = await Promise.all(
        enriched.map(async (rec) => ({
          ...rec,
          imageUrl: await helpers.fetchImageForProfession(
            rec.professionName,
            rec.id
          ),
        }))
      );
      set({
        parsedRecommendations: recommendationsWithImages,
        isLoadingImages: false,
      });
    } catch (err: any) {
      let errorMessage = "Не удалось получить рекомендации.";
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        errorMessage = err.response.data.error;
        if (err.response?.data?.details) {
          errorMessage += `: ${JSON.stringify(err.response.data.details)}`;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      set({
        error: errorMessage,
        isLoadingRecommendations: false,
        isLoadingImages: false,
        showRawAiResponse:
          !!get().recommendationsText &&
          get().parsedRecommendations.length === 0,
      });
    }
  },

  fetchRoadmap: async (professionName, helpers) => {
    if (!professionName) return;
    set({
      isLoadingRoadmap: true,
      roadmapText: null,
      enrichedRoadmapSteps: [],
      selectedProfessionForRoadmap: professionName,
      error: null,
    });

    try {
      const cleanName = helpers.cleanMarkdown(professionName);
      const response = await axios.post("/api/ai/roadmap", {
        professionName: cleanName,
      });

      const roadmapResponseText = response.data.roadmap as string | undefined;
      set({ roadmapText: roadmapResponseText });

      if (!roadmapResponseText?.trim()) {
        set({ error: `AI не предоставил Roadmap для "${cleanName}".` });
      } else {
        const parsedSteps = helpers.parseRoadmapText(roadmapResponseText);
        if (parsedSteps.length > 0) {
          const enrichedSteps = helpers.applyHumanLogicToRoadmap(parsedSteps);
          set({ enrichedRoadmapSteps: enrichedSteps });
        } else {
          set({ enrichedRoadmapSteps: [] });
        }
      }
    } catch (err: any) {
      let errorMessage = `Ошибка Roadmap для "${helpers.cleanMarkdown(
        professionName
      )}"`;
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        errorMessage = `${errorMessage}: ${err.response.data.error}`;
        if (err.response?.data?.details) {
          errorMessage += `: ${JSON.stringify(err.response.data.details)}`;
        }
      } else if (err.message) {
        errorMessage = `${errorMessage}: ${err.message}`;
      }
      set({ error: errorMessage });
    } finally {
      set({ isLoadingRoadmap: false });
    }
  },
}));