import express from 'express';
import * as http from 'http';
import bodyParser from 'body-parser';
import multer from 'multer';
import cors from 'cors';

import {
  getPigs,
  getPig,
  updatePig,
  deletePig,
  postPigs,
} from '../controllers/pigsController';
import postPig from '../middlewares/validatePOST';
import contextMiddleware from '../middlewares/context';

import { ContextType, IApiRequest } from '../types';
import { pigSchema, idSchema } from '../validationSchemas/';
import { Pig } from '../models/pig';

export default (context: ContextType) => {
  const app: express.Application = express();
  const server: http.Server = http.createServer(app);
  const port = 8080;
  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage });

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(contextMiddleware(context));
  app.use(cors());

  app.get('/pigs', async (req: IApiRequest, res: express.Response) => {
    await getPigs(req, res);
  });

  app.get(
    '/pig/:id',
    postPig(idSchema, 'params'),
    async (req: IApiRequest, res: express.Response) => {
      await getPig(req, res);
    }
  );

  app.post(
    '/pigs',
    postPig(pigSchema, 'body'),
    upload.single('img'),
    async (req: IApiRequest, res: express.Response) => {
      await postPigs(req, res);
    }
  );

  app.put(
    '/pig/:id',
    postPig(idSchema, 'params'),
    async (req: IApiRequest, res: express.Response) => {
      await updatePig(req, res);
    }
  );

  app.delete(
    '/pig/:id',
    postPig(idSchema, 'params'),
    async (req: IApiRequest, res: express.Response) => {
      await deletePig(req, res);
    }
  );

  server.listen(port, () => {
    console.log(`Server running at port ${port}`);
  });
};
