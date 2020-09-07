import { getRepository, Repository } from 'typeorm';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import IAppointmentsRepository from '@modules/appointments/interfaces/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/interfaces/dtos/ICreateAppointmentDTO';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const foundAppointment = await this.ormRepository.findOne({
      where: { date },
    });

    return foundAppointment || undefined;
  }

  public async save({
    providerId,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = await this.ormRepository.save(
      this.ormRepository.create({ providerId, date }),
    );

    return appointment;
  }

  public async list(): Promise<Appointment[]> {
    return this.ormRepository.find();
  }
}

export default AppointmentsRepository;
