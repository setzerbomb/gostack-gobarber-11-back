import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUserDTO from '@modules/users/interfaces/dtos/ICreateUserDTO';

interface IUsersRepository {
  save(data: ICreateUserDTO): Promise<User>;
  getOne(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  count(id: string): Promise<number>;
  update(user: User): Promise<User | undefined>;
}

export default IUsersRepository;
