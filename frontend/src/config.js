const getApiUrl = () => {
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

  // Fallback for tests
  return "http://localhost:5000";
};

const apiUrl = getApiUrl();

export const API_URL = apiUrl.replace(/\/$/, "");