import { startOfHour, parseISO } from 'date-fns';

import Appointment from '../model/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface AppointmentDTO {
  date: string;
  provider: string;
}

interface AppointmentsServiceInterface {
  appointmentRepository: AppointmentsRepository;
}

class AppointmentsService {
  private appointmentRepository: AppointmentsRepository;

  constructor({ appointmentRepository }: AppointmentsServiceInterface) {
    this.appointmentRepository = appointmentRepository;
  }

  public store(data: AppointmentDTO): Appointment {
    const { date, provider } = data;

    const parsedDate = startOfHour(parseISO(date));

    const findAppointmentInSameDate = this.appointmentRepository.findByDate(
      parsedDate,
    );

    if (!findAppointmentInSameDate) {
      const appointment: Appointment = new Appointment({
        provider,
        date: parsedDate,
      });

      return this.appointmentRepository.store(appointment);
    }

    throw new Error('Já existe um horário marcado nessa data');
  }

  public list(): Array<Appointment> {
    return this.appointmentRepository.list();
  }
}

export default AppointmentsService;
