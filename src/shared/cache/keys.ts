export const AuthKeys = {
  userId: (id: string): string => `auth:userId:${id}`,
  accessToken: (userId: string): string => `auth:accessToken:${userId}`,
  refreshToken: (userId: string): string => `auth:refreshToken:${userId}`,
};
