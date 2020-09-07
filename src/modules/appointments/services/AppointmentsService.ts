import { startOfHour, parseISO } from 'date-fns';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import IAppointmentsRepository from '@modules/appointments/interfaces/repositories/IAppointmentsRepository';

import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';

interface IRequest {
  date: string;
  providerId: string;
}

@injectable()
class AppointmentsService {
  private appointmentsRepository: IAppointmentsRepository;

  constructor(
    @inject('AppointmentsRepository')
    appointmentsRepository: IAppointmentsRepository,
  ) {
    this.appointmentsRepository = appointmentsRepository;
  }

  private getRepository() {
    return this.appointmentsRepository;
  }

  public async store({ date, providerId }: IRequest): Promise<Appointment> {
    const repository = this.getRepository();

    const parsedDate = startOfHour(parseISO(date));

    const findAppointmentInSameDate = await repository.findByDate(parsedDate);

    if (!findAppointmentInSameDate) {
      const appointment = await repository.save({
        date: parsedDate,
        providerId,
      });
      return appointment;
    }

    throw new AppError('Já existe um horário marcado nessa data');
  }

  public async list(): Promise<Appointment[]> {
    const appointments = await this.getRepository().list();
    return appointments;
  }
}

export default AppointmentsService;
