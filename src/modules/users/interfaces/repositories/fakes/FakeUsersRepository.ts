import { uuid } from 'uuidv4';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/interfaces/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/interfaces/dtos/ICreateUserDTO';

class UsersRepository implements IUsersRepository {
  private users: User[] = [] as User[];

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  public async save({ name, email, password }: ICreateUserDTO): Promise<User> {
    const user: User = { id: uuid(), name, email, password } as User;

    this.users = [...this.users, user];

    return user;
  }

  public async update(user: User): Promise<User | undefined> {
    this.users = this.users.map(u => (user.id === u.id ? u : user));

    return this.users.find(u => u.id === user.id);
  }

  public async getOne(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  public async count(id: string): Promise<number> {
    return this.users.filter(user => user.id === id).length;
  }
}

export default UsersRepository;
