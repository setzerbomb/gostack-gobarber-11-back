import { startOfHour, parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface AppointmentDTO {
  date: string;
  provider: string;
}

class AppointmentsService {
  private getRepository() {
    return getCustomRepository(AppointmentsRepository);
  }

  public async store({ date, provider }: AppointmentDTO): Promise<Appointment> {
    const repository = this.getRepository();

    const parsedDate = startOfHour(parseISO(date));

    const findAppointmentInSameDate = await repository.findByDate(parsedDate);

    if (!findAppointmentInSameDate) {
      const appointment = await repository.create({
        date: parsedDate,
        provider,
      });
      await repository.save(appointment);
      return appointment;
    }

    throw new Error('Já existe um horário marcado nessa data');
  }

  public async list(): Promise<Appointment[]> {
    const appointments = await this.getRepository().find();
    return appointments;
  }
}

export default AppointmentsService;
