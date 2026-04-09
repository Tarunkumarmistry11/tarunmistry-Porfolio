/**
 * BASE URL (SAFE)
 */
const BASE_URL =
  typeof import.meta.env.VITE_API_URL === "string" &&
  import.meta.env.VITE_API_URL.trim() !== ""
    ? import.meta.env.VITE_API_URL
    : "http://localhost:5000/api";

/**
 * TIMEOUT CONFIG
 */
const TIMEOUT = 10000; // 10 seconds

/**
 * CORE REQUEST FUNCTION
 */
const request = async (endpoint, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(options.headers || {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    let data;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new Error(
        data?.message || `Request failed with status ${response.status}`
      );
    }

    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw error;
  }
};

/**
 * QUERY BUILDER
 */
const buildQuery = (params) => {
  const query = new URLSearchParams(params).toString();
  return query ? `?${query}` : "";
};

/**
 * API FUNCTIONS
 */

export const fetchProjects = async (type) => {
  const params =
    typeof type === "string" && type.trim() !== "" ? { type } : {};

  const query = buildQuery(params);

  return request(`/projects${query}`);
};

export const fetchProjectBySlug = async (slug) => {
  if (!slug || typeof slug !== "string") {
    throw new Error("Invalid slug provided");
  }

  const encodedSlug = encodeURIComponent(slug);

  return request(`/projects/${encodedSlug}`);
};

export const fetchFeaturedProjects = async () => {
  return request("/projects/featured");
};

export const fetchAbout = async () => {
  return request("/about");
};