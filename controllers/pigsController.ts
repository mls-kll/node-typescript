import { Pig } from '../models/pig';
import { IApiRequest } from '../types';
import express from 'express';
import { pigSchema, idSchema } from '../validationSchemas/';

export const getPigs = async (req: IApiRequest, res: express.Response) => {
  try {
    const pigs = await Pig.find();
    res.json(pigs);
  } catch (error) {
    req?.context?.logger;
    res.status(500).send(error);
  }
};

export const getPig = async (req: IApiRequest, res: express.Response) => {
  const _id = req.params.id;
  try {
    const pig = await Pig.findById({ _id });
    res.json(pig);
  } catch (error) {
    req?.context?.logger;
    res.status(500).send(error);
  }
};

export const postPigs = async (req: IApiRequest, res: express.Response) => {
  const { breed, description } = req.body;
  const img = req.file?.buffer?.toString('base64');
  const newPigData: object = {
    breed,
    description,
    img: img ? img : '',
  };
  const newPig = new Pig(newPigData);
  try {
    await newPig.save();
    res.send(newPig);
  } catch (error) {
    req?.context?.logger;
    res.status(500).send(error);
  }
};

export const updatePig = async (req: IApiRequest, res: express.Response) => {
  const _id = req.params.id;
  try {
    const pig = await Pig.findByIdAndUpdate(_id, req.body);
    res.send(pig);
  } catch (error) {
    req?.context?.logger;
    res.status(500).send(error);
  }
};

export const deletePig = async (req: IApiRequest, res: express.Response) => {
  const _id = req.params.id;
  try {
    const pig = await Pig.findByIdAndDelete(_id);
    if (pig) {
      try {
        const pigs = await Pig.find();
        res.json(pigs);
      } catch (error) {
        req?.context?.logger;
        res.status(500).send(error);
      }
    }
  } catch (error) {
    req?.context?.logger;
    res.status(500).send(error);
  }
};
