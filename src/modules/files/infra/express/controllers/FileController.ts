import { Request, Response, NextFunction } from 'express';

import message from '@shared/functions/message';

import FilesService from '@modules/files/services/FilesService';
import { container } from 'tsyringe';

const FileController = () => {
  const self = {
    store: async (req: Request, res: Response, next: NextFunction) => {
      const filesService: FilesService = container.resolve(FilesService);

      const { originalname: name, filename: path } = req.file;

      const { id } = await filesService.store({ name, path });

      req.fileId = id;

      return next();
    },
  };

  return self;
};

export default FileController();
