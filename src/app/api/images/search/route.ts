import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { z } from "zod";

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

const searchParamsSchema = z.object({
  query: z.string().min(1, "Query parameter is required"),
  id: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());

  const validationResult = searchParamsSchema.safeParse(params);

  if (!validationResult.success) {
    return NextResponse.json(
      {
        error: "Invalid query parameters",
        details: validationResult.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { query, id: professionId } = validationResult.data;

  if (!UNSPLASH_ACCESS_KEY) {
    console.error(
      "SERVER ERROR: Unsplash API key (UNSPLASH_ACCESS_KEY) is not set in .env.local"
    );
    return NextResponse.json(
      { error: "Image service is not configured by the administrator." },
      { status: 503 }
    );
  }

  try {
    const randomPage = Math.floor(Math.random() * 5) + 1;
    const unsplashUrl = `https://api.unsplash.com/search/photos`;

    console.log(
      `Fetching image from Unsplash for query: ${query} (professionId: ${
        professionId || "N/A"
      })`
    );

    const response = await axios.get(unsplashUrl, {
      params: {
        query: query,
        per_page: 1,
        orientation: "landscape",
        page: randomPage,
      },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    const data = response.data;
    const imageUrl =
      data.results?.[0]?.urls?.small ||
      data.results?.[0]?.urls?.regular ||
      null;

    if (!imageUrl && data.results && data.results.length > 0) {
      console.warn(
        "Image found in Unsplash results, but 'small' or 'regular' URL is missing for query:",
        query,
        "Full result item:",
        data.results[0]
      );
    } else if (!imageUrl) {
      console.warn(
        "No image results found on Unsplash for query:",
        query,
        "Page:",
        randomPage
      );
    }

    return NextResponse.json({ imageUrl });
  } catch (error: any) {
    console.error("Error in /api/images/search route:", error);
    let errorMessage = "Failed to fetch image";
    let statusCode = 500;

    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error(
          "Unsplash API error response status:",
          error.response.status
        );
        console.error("Unsplash API error response data:", error.response.data);
        const errorData = error.response.data;
        if (errorData && errorData.errors && Array.isArray(errorData.errors)) {
          errorMessage = `Unsplash API error: ${errorData.errors.join(", ")}`;
        } else {
          errorMessage = `Unsplash API error: ${
            error.response.statusText || "Unknown Unsplash error"
          }`;
        }
        statusCode = error.response.status;
      } else if (error.request) {
        errorMessage = "No response received from Unsplash API.";
        statusCode = 504;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}