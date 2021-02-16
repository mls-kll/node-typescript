import startServer from './app';
import createContext from '../context';

createContext()
  .then(startServer)
  .catch((error) => console.log(error));
