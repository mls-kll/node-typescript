import express from 'express';

const postPig = (schema: any, validationPath: any) => (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (validationPath === 'params') {
    const { value, error } = schema.validate((req as any)[validationPath].id);
    if (error) res.status(422).send(error.message);
    next();
  }

  if (validationPath === 'body') {
    const { value, error } = schema.validate((req as any)[validationPath]);
    if (error) res.status(422).send(error.message);
    next();
  }
};

export default postPig;
