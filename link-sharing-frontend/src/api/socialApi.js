import { API_BASE_URL } from "./config.js";

export async function fetchSocialProfiles({
  youtubeId,
  githubUser,
  telegramUser,
  instagram,
  twitter,
  linkedin,
  tiktok,
}) {
  const params = new URLSearchParams();

  if (youtubeId) params.append("youtube", youtubeId);
  if (githubUser) params.append("github", githubUser);
  if (telegramUser) params.append("telegram", telegramUser);
  if (instagram) params.append("instagram", instagram);
  if (twitter) params.append("twitter", twitter);
  if (linkedin) params.append("linkedin", linkedin);
  if (tiktok) params.append("tiktok", tiktok);

  const url = `${API_BASE_URL}/api/socials?${params.toString()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("fetchSocialProfiles error:", error);
    throw error;
  }
}
