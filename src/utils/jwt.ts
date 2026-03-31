export interface JWTPayload {
  exp: number;
  iat?: number;
  userId?: string;
  role?: string;
  [key: string]: any;
}

export const decodeJWT = (token: string | null): JWTPayload | null => {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload)) as JWTPayload;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};