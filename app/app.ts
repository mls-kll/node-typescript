import express from 'express';
import * as http from 'http';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';

import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';

import { PigType } from '../types';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = 8080;
const db = new JsonDB(new Config('pigData', true, false, '/'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/pigs', (req: express.Request, res: express.Response) => {
  try {
    const data = db.getData('/');
    res.json(data);
  } catch {
    res.status(500);
  }
});

app.get('/pig/:id', (req: express.Request, res: express.Response) => {
  const id = req.params.id;
  try {
    const data = db.getData('/');
    console.log(data);
    const pig = data.pigs.filter((pig: PigType) => pig.id === id);
    res.json(pig);
  } catch {
    res.status(500);
  }
});

app.post('/pigs', (req: express.Request, res: express.Response) => {
  const { breed, description } = req.body;
  const newPig: object = {
    id: uuidv4(),
    breed,
    description,
  };

  try {
    db.push('/pigs[]', newPig, true);
    res.json({
      message: 'data recived',
    });
  } catch (error) {
    res.status(500);
  }
});

app.put('/pig/:id', (req: express.Request, res: express.Response) => {
  const id = req.params.id;
  const data = db.getData('/');
  const pigIndex = data.pigs.findIndex((pig: PigType) => pig.id === id);
  const pig = data.pigs[pigIndex];
  const { breed, description } = req.body;
  const newPig: object = {
    id,
    breed: breed ? breed : pig.breed,
    description: description ? description : pig.description,
  };
  try {
    db.push(`/pigs[${pigIndex}]`, newPig);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.delete('/pig/:id', (req: express.Request, res: express.Response) => {
  const id = req.params.id;
  try {
    const data = db.getData('/');
    const pigIndex = data.pigs.findIndex((pig: PigType) => pig.id === id);
    if (pigIndex < 0) return;
    db.delete(`/pigs[${pigIndex}]`);
    res.json({
      message: 'item removed from database',
    });
  } catch (error) {
    res.status(500);
  }
});

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
