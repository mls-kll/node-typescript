import { Request } from 'express';

export type ContextType = {
  logger: Function;
  startDb: object;
}

export interface IApiRequest extends Request {
  context?: ContextType
}

export type PigType = {
  id: string;
  breed: string;
  description: string;
}