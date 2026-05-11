export type ApiEnv = {
  Bindings: {
    API_VERSION?: string;
    ENVIRONMENT?: string;
  };
  Variables: {
    requestId: string;
    startedAt: number;
    authUser?: string;
  };
};

export type ApiErrorCode =
  | 'AUTH_INVALID'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'TIMEOUT'
  | 'BACKEND_UNAVAILABLE'
  | 'INTEGRATION_ERROR'
  | 'INTERNAL_ERROR'
  | 'SCHEDULE_FULL'
  | 'SCHEDULE_CONFLICT';

export type SuccessEnvelope<T> = {
  success: true;
  requestId: string;
  timestamp: string;
  data: T;
  meta?: Record<string, unknown>;
};

export type ErrorEnvelope = {
  success: false;
  requestId: string;
  timestamp: string;
  error: {
    code: ApiErrorCode;
    message: string;
    details?: Record<string, unknown>;
  };
};

export type Channel = 'whatsapp' | 'sms' | 'email' | 'push' | 'chat' | 'voice' | 'zendesk' | 'aws-connect' | 'cognigy';
export type Scenario = 'success' | 'empty' | 'timeout' | 'unavailable' | 'error' | 'slow';
