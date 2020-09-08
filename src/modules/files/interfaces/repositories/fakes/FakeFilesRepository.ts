import { uuid } from 'uuidv4';

import File from '@modules/files/infra/typeorm/entities/File';

import IFilesRepository from '@modules/files/interfaces/repositories/IFilesRepository';
import ICreateFileDTO from '@modules/files/interfaces/dtos/ICreateFileDTO';

class FilesRepository implements IFilesRepository {
  private files: File[] = [] as File[];

  private toServerPath(path: string): string {
    return `http://localhost:3333/files/${path}`;
  }

  public async save({ name, path }: ICreateFileDTO): Promise<File> {
    const file: File = {
      name,
      path,
      serverPath: this.toServerPath(path),
      id: uuid(),
    } as File;

    this.files.push(file);

    return file;
  }

  public async getOne(id: string): Promise<File | undefined> {
    return this.files.find(file => file.id === id);
  }

  public async delete(id: string): Promise<void> {
    this.files = this.files.filter(file => file.id !== id);
  }
}

export default FilesRepository;
