import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import ModelInterface from '../interfaces/ModelInterface';

interface AppointmentInterface extends ModelInterface {
  provider: string;
  date: Date;
}

@Entity('appointments')
class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  provider: string;

  @Column('timestamp with time zone')
  date: Date;
}

export default Appointment;
