import morgan from './utils/logger';
import mongoConnect from './service/mongoConnect';
import { ContextType } from './types'

const createContext = async (): Promise<ContextType> => {
  const context: ContextType = {
    logger: morgan,
    startDb: await mongoConnect() || {}
  };
  return context;
};

export default createContext;