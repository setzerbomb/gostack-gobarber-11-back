import { EntityRepository, Repository } from 'typeorm';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment> {
  public async findByDate(date: Date): Promise<Appointment | null> {
    const foundAppointment = await this.findOne({ where: { date } });

    return foundAppointment || null;
  }
}

export default AppointmentsRepository;