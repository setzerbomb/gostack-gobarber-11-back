import 'reflect-metadata';

import { uuid } from 'uuidv4';
import AppError from '@shared/errors/AppError';
import FakeAppointmentRepository from '../interfaces/repositories/fakes/FakeAppointmentRepository';
import AppointmentsService from './AppointmentsService';

describe('Appointments', () => {
  it('Should be able to create an appointment', async () => {
    const appointmentsService = new AppointmentsService(
      new FakeAppointmentRepository(),
    );

    const appointment = await appointmentsService.store({
      date: '2020-01-01 00:00:00',
      providerId: uuid(),
    });

    return expect(appointment).toHaveProperty('id');
  });

  it('Should not be able to create two appointments in the same date', async () => {
    const appointmentsService = new AppointmentsService(
      new FakeAppointmentRepository(),
    );

    await appointmentsService.store({
      date: '2020-01-01 00:00:00',
      providerId: uuid(),
    });

    return expect(
      appointmentsService.store({
        date: '2020-01-01 00:00:00',
        providerId: uuid(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able to list appointments', async () => {
    const appointmentsService = new AppointmentsService(
      new FakeAppointmentRepository(),
    );

    return expect(appointmentsService.list()).resolves.toBeInstanceOf(Array);
  });
});
