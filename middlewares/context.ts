import { Response, NextFunction } from 'express';
import { IApiRequest, ContextType } from '../types';

export default (context: ContextType) => (req: IApiRequest, res: Response, next: NextFunction) => {
  try {
    req.context = { ...context };
    next();
  } catch (e) {
    req.context = context;
    next(e)
  }
};