import { getRepository, Repository } from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/interfaces/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/interfaces/dtos/ICreateUserDTO';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const foundUser = await this.ormRepository.findOne({ where: { email } });

    return foundUser || undefined;
  }

  public async save({ name, email, password }: ICreateUserDTO): Promise<User> {
    const user = await this.ormRepository.save(
      this.ormRepository.create({ name, email, password }),
    );

    return user;
  }

  public async update(user: User): Promise<User> {
    const updatedUser = await this.ormRepository.save(user);

    return updatedUser;
  }

  public async getOne(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);

    return user;
  }

  public async count(id: string): Promise<number> {
    const value = await this.ormRepository.count({ id });

    return value;
  }
}

export default UsersRepository;
