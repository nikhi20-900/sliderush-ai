const UNSPLASH_API_URL = "https://api.unsplash.com";

export interface UnsplashPhoto {
  id: string;
  width: number;
  height: number;
  description: string | null;
  alt_description: string | null;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  links: {
    download: string;
    download_location: string;
  };
  user: {
    name: string;
    username: string;
    links: {
      html: string;
    };
  };
}

export interface UnsplashSearchResult {
  total: number;
  total_pages: number;
  results: UnsplashPhoto[];
}

async function fetchUnsplash(endpoint: string, params: Record<string, string> = {}): Promise<any> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  
  if (!accessKey) {
    throw new Error("UNSPLASH_ACCESS_KEY is not configured");
  }

  const url = new URL(`${UNSPLASH_API_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.errors?.[0] || `Unsplash API error: ${response.status}`);
  }

  return response.json();
}

export async function searchPhotos(
  query: string,
  options: {
    page?: number;
    perPage?: number;
    orientation?: "landscape" | "portrait" | "squarish";
  } = {}
): Promise<UnsplashSearchResult> {
  const { page = 1, perPage = 10, orientation = "landscape" } = options;

  return fetchUnsplash("/search/photos", {
    query,
    page: page.toString(),
    per_page: perPage.toString(),
    orientation,
  });
}

export async function getRandomPhotos(
  options: {
    count?: number;
    query?: string;
  } = {}
): Promise<UnsplashPhoto[]> {
  const { count = 1, query } = options;

  const params: Record<string, string> = {
    count: count.toString(),
  };

  if (query) {
    params.query = query;
  }

  return fetchUnsplash("/photos/random", params);
}

export async function getPhoto(photoId: string): Promise<UnsplashPhoto> {
  return fetchUnsplash(`/photos/${photoId}`);
}

export async function trackDownload(downloadLocation: string): Promise<void> {
  await fetch(downloadLocation, {
    headers: {
      Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
    },
  });
}

export function getAttribution(photo: UnsplashPhoto): string {
  return `Photo by ${photo.user.name} on Unsplash`;
}

export function getPhotoUrl(photo: UnsplashPhoto, size: "small" | "regular" | "full" = "regular"): string {
  const sizes = {
    small: photo.urls.small,
    regular: photo.urls.regular,
    full: photo.urls.full,
  };
  return sizes[size];
}

export default {
  searchPhotos,
  getRandomPhotos,
  getPhoto,
  trackDownload,
  getAttribution,
  getPhotoUrl,
};
