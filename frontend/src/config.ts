const getApiUrl = (): string => {
  try {
    if (
      typeof import.meta !== "undefined" &&
      import.meta.env &&
      import.meta.env.VITE_API_URL
    ) {
      return import.meta.env.VITE_API_URL.trim();
    }
  } catch (error) {
    console.warn("Unable to read VITE_API_URL:", error);
  }

  // Fallback for Jest tests
  return "http://localhost:5000";
};

export const API_URL = getApiUrl().replace(/\/$/, "");