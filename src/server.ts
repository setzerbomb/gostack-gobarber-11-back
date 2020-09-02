import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';
import routes from './routes';

import AppError from './app/errors/AppError';

import uploadConfig from './config/multer';

import './database';
import message from './app/common/message';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return message(response, err.status, err.message);
    }
    console.log(err);

    return message(response, 500, 'Internal Server Error');
  },
);

app.listen(3333);
