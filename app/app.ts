import express from 'express';
import * as http from 'http';
import bodyParser from 'body-parser';
import multer from 'multer';

import postPig from '../middlewares/validatePOST';
import contextMiddleware from '../middlewares/context';

import { ContextType, IApiRequest } from '../types';
import { pigSchema, idSchema } from '../validationSchemas/';
import { Pig } from '../models/pig';

export default (context: ContextType) => {
  const app: express.Application = express();
  const server: http.Server = http.createServer(app);
  const port = 8080;
  const storage = multer.memoryStorage()
  const upload = multer({ storage: storage })

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(contextMiddleware(context));

  app.get('/pigs', async (req: IApiRequest, res: express.Response) => {
    try {
      const pigs = await Pig.find();
      res.json(pigs);
    } catch (error) {
      req?.context?.logger;
      res.status(500).send(error);
    }
  });

  app.get(
    '/pig/:id',
    postPig(idSchema, 'params'),
    async (req: IApiRequest, res: express.Response) => {
      const _id = req.params.id;
      try {
        const pig = await Pig.findById({ _id });
        res.json(pig);
      } catch (error) {
        req?.context?.logger;
        res.status(500).send(error);
      }
    }
  );

  app.post(
    '/pigs',
    postPig(pigSchema, 'body'),
    upload.single('img'),
    async (req: IApiRequest, res: express.Response) => {
      const { breed, description } = req.body;
      const img = req.file.buffer.toString("base64");
      const newPigData: object = {
        breed,
        description,
        img
      };
      const newPig = new Pig(newPigData);
      try {
        await newPig.save();
        res.send(newPig);
      } catch (error) {
        req?.context?.logger;
        res.status(500).send(error);
      }
    }
  );

  app.put(
    '/pig/:id',
    postPig(idSchema, 'params'),
    async (req: IApiRequest, res: express.Response) => {
      const _id = req.params.id;
      try {
        const pig = await Pig.findByIdAndUpdate(_id, req.body);
        res.send(pig);
      } catch (error) {
        req?.context?.logger;
        res.status(500).send(error);
      }
    }
  );

  app.delete(
    '/pig/:id',
    postPig(idSchema, 'params'),
    async (req: IApiRequest, res: express.Response) => {
      const _id = req.params.id;
      try {
        const pig = await Pig.findByIdAndDelete(_id);
        if (!pig) res.status(404).send('No item found');
        res.status(200).send();
      } catch (error) {
        req?.context?.logger;
        res.status(500).send(error);
      }
    }
  );

  server.listen(port, () => {
    console.log(`Server running at port ${port}`);
  });
};
