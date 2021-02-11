import express from 'express';
import * as http from 'http';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import { Pig } from '../models/pig';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const uri: string =
  'mongodb+srv://mlskll:jaystack@cluster0.b8okf.mongodb.net/pigShop';

mongoose
  .connect(uri, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Mongo DB connected!');
  })
  .catch((err) => {
    console.log(err);
    console.log('Could not connect to Mongo DB');
  });

app.get('/pigs', async (req: express.Request, res: express.Response) => {
  try {
    const pigs = await Pig.find({});
    res.json(pigs);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.get('/pig/:id', async (req: express.Request, res: express.Response) => {
  const _id = req.params.id;
  try {
    const pig = await Pig.findById({ _id });
    res.json(pig);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.post('/pigs', async (req: express.Request, res: express.Response) => {
  const { breed, description } = req.body;
  const newPigData: object = {
    breed,
    description,
  };
  const newPig = new Pig(newPigData);
  try {
    await newPig.save();
    res.send(newPig);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put('/pig/:id', async (req: express.Request, res: express.Response) => {
  const _id = req.params.id;
  try {
    const pig = await Pig.findByIdAndUpdate(_id, req.body);
    res.send(pig);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.delete('/pig/:id', async (req: express.Request, res: express.Response) => {
  const _id = req.params.id;
  try {
    const pig = await Pig.findByIdAndDelete(_id);
    if (!pig) res.status(404).send('No item found');
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
