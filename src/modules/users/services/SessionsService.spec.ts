import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../interfaces/repositories/fakes/FakeUsersRepository';
import FakeFilesRepository from '../../files/interfaces/repositories/fakes/FakeFilesRepository';

import SessionsService from './SessionsService';
import UsersService from './UsersService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('Sessions', () => {
  it('should be able to authenticate', async () => {
    const fakeUsersRepository: FakeUsersRepository = new FakeUsersRepository();
    const fakeFilesRpository: FakeFilesRepository = new FakeFilesRepository();
    const fakeHashProvider: FakeHashProvider = new FakeHashProvider();
    const fakeStorageProvider: FakeStorageProvider = new FakeStorageProvider();

    const usersService = new UsersService(
      fakeUsersRepository,
      fakeFilesRpository,
      fakeHashProvider,
      fakeStorageProvider,
    );

    const sessionsService = new SessionsService(
      fakeUsersRepository,
      fakeFilesRpository,
      fakeHashProvider,
    );

    await usersService.store({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const response = await sessionsService.auth({
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
  });

  it('should not be able to authenticate with a invalid email', async () => {
    const fakeUsersRepository: FakeUsersRepository = new FakeUsersRepository();
    const fakeFilesRpository: FakeFilesRepository = new FakeFilesRepository();
    const fakeHashProvider: FakeHashProvider = new FakeHashProvider();
    const fakeStorageProvider: FakeStorageProvider = new FakeStorageProvider();

    const usersService = new UsersService(
      fakeUsersRepository,
      fakeFilesRpository,
      fakeHashProvider,
      fakeStorageProvider,
    );

    const sessionsService = new SessionsService(
      fakeUsersRepository,
      fakeFilesRpository,
      fakeHashProvider,
    );

    await usersService.store({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(
      sessionsService.auth({
        email: 'johndoe@example.com',
        password: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with a invalid password', async () => {
    const fakeUsersRepository: FakeUsersRepository = new FakeUsersRepository();
    const fakeFilesRpository: FakeFilesRepository = new FakeFilesRepository();
    const fakeHashProvider: FakeHashProvider = new FakeHashProvider();
    const fakeStorageProvider: FakeStorageProvider = new FakeStorageProvider();

    const usersService = new UsersService(
      fakeUsersRepository,
      fakeFilesRpository,
      fakeHashProvider,
      fakeStorageProvider,
    );

    const sessionsService = new SessionsService(
      fakeUsersRepository,
      fakeFilesRpository,
      fakeHashProvider,
    );

    await usersService.store({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(
      sessionsService.auth({
        email: 'johndoe2@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
