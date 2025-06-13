const API_BASE_URL = 'http://localhost:8080';

function getTokenFromCookie() {
  const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
  return match ? match[2] : null;
}

export const authService = {
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // ensures cookies are sent/received
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const result = await response.json();

        // OPTIONAL: If token is returned in body, store it manually
        // document.cookie = `token=${data.token}; path=/; Secure; SameSite=Strict`;

         const token = result.token;

        // ✅ Save the token in a cookie (valid for 7 days)
        document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; Secure; SameSite=Strict`;

        return { success: true, data: result };

      } else {
        
         const errorJson = await response.json();
      return { success: false, error: errorJson.message };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  },

  async register(name, email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      return response.ok
        ? { success: true }
        : { success: false, error: await response.text() };
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  },

  async checkAuthStatus() {
    try {
      const token = getTokenFromCookie();

      if (!token) return { success: false };

      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        return { success: false };
      }
    } catch (error) {
      return { success: false };
    }
  },

  async logout() {
    try {
      const token = getTokenFromCookie();

      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      // Optional: delete token cookie manually
       document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },
};
