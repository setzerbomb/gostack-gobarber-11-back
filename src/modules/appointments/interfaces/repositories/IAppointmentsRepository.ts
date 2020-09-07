import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/interfaces/dtos/ICreateAppointmentDTO';

interface IAppointmentsRepository {
  findByDate(date: Date): Promise<Appointment | undefined>;
  save(data: ICreateAppointmentDTO): Promise<Appointment>;
  list(): Promise<Appointment[]>;
}

export default IAppointmentsRepository;
