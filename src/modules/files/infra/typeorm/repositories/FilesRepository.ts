import { EntityRepository, Repository } from 'typeorm';
import File from '@modules/files/infra/typeorm/entities/File';

@EntityRepository(File)
class FilesRepository extends Repository<File> {}

export default FilesRepository;
