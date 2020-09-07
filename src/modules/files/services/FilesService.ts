import AppError from '@shared/errors/AppError';
import File from '@modules/files/infra/typeorm/entities/File';

import IFilesRepository from '@modules/files/interfaces/repositories/IFilesRepository';
import { inject, injectable } from 'tsyringe';

interface Request {
  name: string;
  path: string;
}

@injectable()
class FilesService {
  private filesRepository: IFilesRepository;

  constructor(@inject('FilesRepository') filesRepository: IFilesRepository) {
    this.filesRepository = filesRepository;
  }

  private getRepository() {
    return this.filesRepository;
  }

  public async store({ name, path }: Request): Promise<File> {
    const repository = this.getRepository();

    const file = await repository.save({
      name,
      path,
    });

    return file;
  }

  public async find(id: string): Promise<File> {
    const repository = this.getRepository();

    const file = await repository.getOne(id);

    if (!file) {
      throw new AppError('File not found');
    }

    return file;
  }
}

export default FilesService;
