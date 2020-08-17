import { Response } from 'express';
/**
 * Generic express message response
 *
 * @param {Response} res
 * @param {number} status
 * @param {string} message
 * @param {boolean} error
 */
export default function (
  res: Response,
  status = 401,
  message = 'Resource not found',
  error = true,
): Response {
  return !error
    ? res.status(status).json({ message })
    : res.status(status).json({ error: message });
}
