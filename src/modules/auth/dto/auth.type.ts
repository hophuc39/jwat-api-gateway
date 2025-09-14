import { Observable } from 'rxjs';

export interface ValidateTokenRequest {
  token: string;
}

export interface ValidateTokenResponse {
  valid: boolean;
  userId?: string;
}

export interface AuthService {
  ValidateToken(data: ValidateTokenRequest): Observable<ValidateTokenResponse>;
}
