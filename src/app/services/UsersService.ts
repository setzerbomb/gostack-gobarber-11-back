import { getCustomRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '../models/User';
import UsersRepository from '../repositories/UsersRepository';

interface UserDTO {
  name: string;
  email: string;
  password: string;
}

class UsersService {
  private getRepository() {
    return getCustomRepository(UsersRepository);
  }

  public async store({ name, email, password }: UserDTO): Promise<User> {
    const repository = this.getRepository();

    const checkUserExists = await repository.findByEmail(email);

    if (checkUserExists) {
      throw new Error('Email address already used');
    }

    const hashedPassword = await hash(password, 8);

    const user = repository.create({
      name,
      email,
      password: hashedPassword,
    });

    await repository.save(user);

    delete user.password;

    return user;
  }
}

export default UsersService;
