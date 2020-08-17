import { uuid } from 'uuidv4';
import ModelInterface from './interfaces/ModelInterface';

interface AppointmentInterface extends ModelInterface {
  provider: string;
  date: Date;
}

class Appointment {
  id: string;

  provider: string;

  date: Date;

  // Omit<Appointment, 'id'>
  constructor({ id, date, provider }: AppointmentInterface) {
    this.id = id || uuid();
    this.provider = provider;
    this.date = date;
  }
}

export default Appointment;
