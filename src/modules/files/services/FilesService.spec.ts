import 'reflect-metadata';
import FakeFilesRepository from '@modules/files/interfaces/repositories/fakes/FakeFilesRepository';
import FilesService from './FilesService';

describe('Files', () => {
  it('Should be able to create an file', async () => {
    const filesService = new FilesService(new FakeFilesRepository());

    const file = await filesService.store({
      name: 'file',
      path: 'path',
    });

    return expect(file).toHaveProperty('id');
  });

  it('Should be able to find a file', async () => {
    const filesService = new FilesService(new FakeFilesRepository());

    const file = await filesService.store({
      name: 'file',
      path: 'path',
    });

    return expect(filesService.find(file.id)).resolves.toHaveProperty('id');
  });
});
