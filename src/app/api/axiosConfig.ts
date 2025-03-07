import axios from "axios";

// Base URL for your API
const API_BASE_URL = "http://localhost:3001";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to get the access token (replace with your actual token retrieval logic)
const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

// Function to get the refresh token (replace with your actual token retrieval logic)
const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

// Function to refresh the access token (replace with your actual token refresh logic)
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
      refreshToken,
    });
    const { accessToken } = response.data;

    // Save the new access token
    localStorage.setItem("accessToken", accessToken);

    return accessToken;
  } catch (error) {
    // Clear tokens if refresh fails
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    throw error;
  }
};

// Add a request interceptor to attach the access token
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh and retry logic
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is due to an expired token (401 status code)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request as retried

      try {
        // Refresh the access token
        const newAccessToken = await refreshAccessToken();

        // Update the Authorization header with the new access token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry the original request with the new access token
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Redirect to login or handle token refresh failure
        console.error("Token refresh failed:", refreshError);
        window.location.href = "/login"; // Redirect to login page
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

export default axiosInstance;
