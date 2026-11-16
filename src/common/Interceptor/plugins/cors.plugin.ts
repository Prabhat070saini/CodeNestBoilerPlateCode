import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { config } from '../../../config/config';

export async function registerCors(fastify: FastifyInstance): Promise<void> {
  await fastify.register(cors, {
    origin: config.cors.origins.length ? config.cors.origins : false,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  });
}
