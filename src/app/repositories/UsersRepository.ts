import { EntityRepository, Repository } from 'typeorm';
import User from '../models/User';

@EntityRepository(User)
class UsersRepository extends Repository<User> {
  public async findByEmail(email: string): Promise<User | null> {
    const foundUser = await this.findOne({ where: { email } });

    return foundUser || null;
  }
}

export default UsersRepository;
