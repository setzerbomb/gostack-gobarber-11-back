import { getRepository, Repository } from 'typeorm';
import File from '@modules/files/infra/typeorm/entities/File';
import IFilesRepository from '@modules/files/interfaces/repositories/IFilesRepository';

import ICreateFileDTO from '@modules/files/interfaces/dtos/ICreateFileDTO';

class FilesRepository implements IFilesRepository {
  private ormRepository: Repository<File>;

  private toServerPath(path: string): string {
    return `http://localhost:3333/files/${path}`;
  }

  constructor() {
    this.ormRepository = getRepository(File);
  }

  public async save({ name, path }: ICreateFileDTO): Promise<File> {
    const file = await this.ormRepository.save(
      this.ormRepository.create({ name, path }),
    );

    file.serverPath = this.toServerPath(file.path);

    return file;
  }

  public async getOne(id: string): Promise<File | undefined> {
    const file = await this.ormRepository.findOne(id);

    if (file) file.serverPath = this.toServerPath(file.path);

    return file;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}

export default FilesRepository;
