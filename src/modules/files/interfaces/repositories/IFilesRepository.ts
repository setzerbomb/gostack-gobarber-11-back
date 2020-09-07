import File from '@modules/files/infra/typeorm/entities/File';
import ICreateFileDTO from '@modules/files/interfaces/dtos/ICreateFileDTO';

interface IFilesRepository {
  save(data: ICreateFileDTO): Promise<File>;
  getOne(id: string): Promise<File | undefined>;
  delete(id: string): Promise<void>;
}

export default IFilesRepository;
