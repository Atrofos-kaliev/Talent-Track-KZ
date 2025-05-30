import axios from "axios";

export interface HHRole {
  id: string;
  name: string;
  accept_incomplete_resumes?: boolean;
  roles?: HHRole[];
}

export interface HHCategory {
  id: string;
  name: string;
  roles: HHRole[];
}

interface HHResponse {
  categories: HHCategory[];
}

export async function getProfessionalRolesWithCategories(): Promise<
  HHCategory[]
> {
  const HH_API_BASE_URL = "https://api.hh.ru";
  try {
    const response = await axios.get<HHResponse>(
      `${HH_API_BASE_URL}/professional_roles`
    );
    return response.data.categories;
  } catch (error) {
    console.error("Error fetching professional roles from HH:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        `HH API request failed with status ${
          error.response?.status || "unknown"
        }. ${error.message}`
      );
    }
    throw new Error(
      "Failed to fetch professional roles. Please try again later."
    );
  }
}