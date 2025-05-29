/**
 * Decodes a JWT token to extract the payload
 * @param {string} token - JWT token
 * @returns {object} - Decoded token payload
 */
export const decodeToken = (token) => {
  if (!token) return null;
  
  try {
    // JWT token is split into three parts: header, payload, and signature
    // We only need the payload part which is the second part
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};
