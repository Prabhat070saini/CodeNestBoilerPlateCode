export interface ISignInResponse {
  accessToken: string;
  refreshToken: string;
  user_id: string;
}

export interface IGoogleOauthResponse {
  name: string;
  email: string;
  picture: string;
  isValid: boolean;
}

export interface ISendOtpResponse {
  cooldownRemaining?: number;
  attemptsLeft: number;
  identifier:string;
}
