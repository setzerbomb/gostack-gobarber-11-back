/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import { container } from 'tsyringe';
import uploadConfig from '@config/multer';

import IStorageProvider from './models/IStorageProvider';

import DiskStorageProvider from './implementations/DiskStorageProvider';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
);
