import { getCustomRepository } from 'typeorm';

import File from '../models/File';
import FilesRepository from '../repositories/FilesRepository';

import AppError from '../errors/AppError';

interface Request {
  name: string;
  path: string;
}

interface Response {
  file: File;
  url: string;
}

class FilesService {
  private getRepository() {
    return getCustomRepository(FilesRepository);
  }

  private build(file: File): Response {
    return { file, url: file.path };
  }

  public async store({ name, path }: Request): Promise<Response> {
    const repository = this.getRepository();

    const file = repository.create({
      name,
      path,
    });

    await repository.save(file);

    return this.build(file);
  }

  public async find(id: string): Promise<Response> {
    const repository = this.getRepository();

    const file = await repository.findOne(id);

    if (!file) {
      throw new AppError('File not found');
    }

    return this.build(file);
  }
}

export default FilesService;
