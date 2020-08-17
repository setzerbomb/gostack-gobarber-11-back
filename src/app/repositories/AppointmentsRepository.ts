import { isEqual } from 'date-fns';
import Appointment from '../model/Appointment';

class AppointmentsRepository {
  private appointments: Array<Appointment> = [];

  public store({ date, provider }: Appointment): Appointment {
    const appointment = new Appointment({ date, provider });

    this.appointments.push(appointment);

    return appointment;
  }

  public list(): Array<Appointment> {
    return this.appointments;
  }

  public findByDate(date: Date): Appointment | null {
    const foundAppointment = this.appointments.find(appointment =>
      isEqual(date, appointment.date),
    );

    return foundAppointment || null;
  }
}

export default AppointmentsRepository;
