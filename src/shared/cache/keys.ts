export type CacheKey = string;
export const AuthKeys = {
  userId: (id: string): CacheKey => `auth:userId:${id}`,
  accessToken: (userId: string): CacheKey => `auth:accessToken:${userId}`,
  refreshToken: (userId: string): CacheKey => `auth:refreshToken:${userId}`,
};