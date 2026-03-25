type UnsplashResponse = {
  urls?: {
    regular?: string;
    full?: string;
  };
  alt_description?: string | null;
  user?: {
    name?: string;
    links?: {
      html?: string;
    };
  };
};

export type UnsplashHeroImage = {
  imageUrl: string;
  alt: string;
  authorName: string;
  authorUrl: string;
};

const UNSPLASH_ENDPOINT = "https://api.unsplash.com/photos/random";

const normalizeText = (value: string) => {
  return value
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
};

export const fetchUnsplashHero = async (keyword: string): Promise<UnsplashHeroImage | null> => {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    return null;
  }

  const query = [
    "istanbul",
    "courier",
    "delivery",
    keyword,
  ].join(" ");

  const params = new URLSearchParams({
    query,
    orientation: "landscape",
    content_filter: "high",
  });

  try {
    const response = await fetch(`${UNSPLASH_ENDPOINT}?${params.toString()}`, {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
        "Accept-Version": "v1",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as UnsplashResponse;
    const imageUrl = data.urls?.regular || data.urls?.full;

    if (!imageUrl) {
      return null;
    }

    const authorName = normalizeText(data.user?.name || "Unsplash Fotograf");
    const rawAuthorUrl = data.user?.links?.html || "https://unsplash.com";
    const authorUrl = rawAuthorUrl.includes("?")
      ? `${rawAuthorUrl}&utm_source=34kurye&utm_medium=referral`
      : `${rawAuthorUrl}?utm_source=34kurye&utm_medium=referral`;

    return {
      imageUrl,
      alt: normalizeText(data.alt_description || `${keyword} teslimat fotografi`),
      authorName,
      authorUrl,
    };
  } catch {
    return null;
  }
};
