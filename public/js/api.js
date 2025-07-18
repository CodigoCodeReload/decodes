/**
 * API Service module for Pica Game Timer
 * Handles all HTTP requests to the backend
 * Follows Single Responsibility Principle by focusing only on API communication
 */
class ApiService {
  /**
   * Make a GET request
   * @param {string} url - API endpoint
   * @param {boolean} requiresAuth - Whether the request requires authentication
   * @returns {Promise<any>} - Response data
   */
  static async get(url, requiresAuth = false) {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (requiresAuth) {
      const token = localStorage.getItem(Config.storage.token);
      if (!token) {
        throw new Error('Authentication required');
      }
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }
  
  /**
   * Make a POST request
   * @param {string} url - API endpoint
   * @param {object} data - Request payload
   * @param {boolean} requiresAuth - Whether the request requires authentication
   * @returns {Promise<any>} - Response data
   */
  static async post(url, data = {}, requiresAuth = false) {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (requiresAuth) {
      const token = localStorage.getItem(Config.storage.token);
      if (!token) {
        throw new Error('Authentication required');
      }
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }
}
