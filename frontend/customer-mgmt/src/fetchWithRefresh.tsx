async function fetchWithRefresh(url: string, options: RequestInit = {}) {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  // Add Authorization header with access token
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  // First try the API call
  let response = await fetch(url, { ...options, headers });

  if (response.status === 401 && refreshToken) {
    // Access token expired, try refreshing it
    const refreshResponse = await fetch('http://127.0.0.1:8000/auth/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json();
      const newAccessToken = refreshData.access;

      // Save new access token
      localStorage.setItem('accessToken', newAccessToken);

      // Retry original request with new token
      const retryHeaders = {
        ...options.headers,
        Authorization: `Bearer ${newAccessToken}`,
      };

      response = await fetch(url, { ...options, headers: retryHeaders });
    } else {
      // Refresh token expired or invalid - logout or redirect
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login'; // or your login route
      return Promise.reject('Session expired. Please login again.');
    }
  }

  return response;
}


export default fetchWithRefresh