import { uuid } from 'uuidv4';
import { isEqual } from 'date-fns';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import IFakeAppointmentsRepository from '@modules/appointments/interfaces/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/interfaces/dtos/ICreateAppointmentDTO';

class FakeAppointmentsRepository implements IFakeAppointmentsRepository {
  private appointments: Appointment[] = [] as Appointment[];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    return this.appointments.find(appointment =>
      isEqual(appointment.date, date),
    );
  }

  public async save({
    providerId,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    // Object.assign(appointment, { id: uuid(), date, providerId })

    appointment.id = uuid();
    appointment.date = date;
    appointment.providerId = providerId;

    this.appointments.push(appointment);

    return appointment;
  }

  public async list(): Promise<Appointment[]> {
    return this.appointments;
  }
}

export default FakeAppointmentsRepository;
