const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3002";

export async function fetchSocialProfiles({
  youtubeId,
  githubUser,
  telegramUser,
}) {
  const params = new URLSearchParams();

  if (youtubeId) params.append("youtubeId", youtubeId);
  if (githubUser) params.append("githubUser", githubUser);
  if (telegramUser) params.append("telegramUser", telegramUser);

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
