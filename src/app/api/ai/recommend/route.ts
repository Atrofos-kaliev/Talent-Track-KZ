import { NextRequest, NextResponse } from "next/server";
import { getProfessionRecommendations } from "@/lib/googleAi";
import { z } from "zod";

const recommendRequestSchema = z.object({
  skills: z.string().min(1, "Skills are required"),
  interests: z.string().min(1, "Interests are required"),
  workStyle: z.enum(["team", "solo", "any"], {
    errorMap: () => ({ message: "Work style is required" }),
  }),
  problemApproach: z.enum(["creative", "analytical", "any"], {
    errorMap: () => ({ message: "Problem approach is required" }),
  }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = recommendRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { skills, interests, workStyle, problemApproach } =
      validationResult.data;

    const recommendations = await getProfessionRecommendations(
      skills,
      interests,
      workStyle,
      problemApproach
    );

    return NextResponse.json({ recommendations });
  } catch (error: any) {
    console.error("[AI_RECOMMEND_ERROR_ROUTE]", error);
    const errorMessage =
      error.message ||
      "Failed to get recommendations from server due to an unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}