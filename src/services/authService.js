import API_CONFIG from "../config/api";

export async function loginUser(username, password) {
  const response = await fetch(API_CONFIG.endpoints.auth.login, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "*/*",
    },
    body: JSON.stringify({ username, password }),
  });
 
  if (!response.ok) {
    // Try to extract a server error message, fallback to generic
    let errorMessage = "Invalid username or password.";
    try {
      const errorData = await response.json();
      if (errorData?.message) errorMessage = errorData.message;
    } catch (_) {}
    throw new Error(errorMessage);
  }
 
  const data = await response.json();
  return data; // Expected to contain token or session info
}