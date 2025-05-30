import { NextRequest, NextResponse } from "next/server";
import { getProfessionRoadmap } from "@/lib/googleAi";
import { z } from "zod";

const roadmapRequestSchema = z.object({
  professionName: z.string().min(1, "Profession name is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = roadmapRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { professionName } = validationResult.data;

    const roadmap = await getProfessionRoadmap(professionName);
    return NextResponse.json({ roadmap });
  } catch (error: any) {
    console.error("[AI_ROADMAP_ERROR_ROUTE]", error);
    return NextResponse.json(
      { error: error.message || "Failed to get roadmap" },
      { status: 500 }
    );
  }
}