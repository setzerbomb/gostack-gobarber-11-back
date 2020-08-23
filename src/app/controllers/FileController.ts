import { Request, Response, NextFunction } from 'express';

import message from '../common/message';

import FilesService from '../services/FilesService';

const FileController = () => {
  const filesService: FilesService = new FilesService();

  const self = {
    store: async (req: Request, res: Response, next: NextFunction) => {
      const { originalname: name, filename: path } = req.file;

      const {
        file: { id },
      } = await filesService.store({ name, path });

      req.fileId = id;

      return next();
    },
  };

  return self;
};

export default FileController();
