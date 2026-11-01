import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { FastifyInstance } from 'fastify';

import { TracingService } from '../../tracing/tracing.service';
import { UtilsService } from '../../../utils/utils.service';
import { registerTracingHooks } from './fastify.tracing';

@Injectable()
export class FastifyTracingProvider implements OnModuleInit {
  constructor(
    private readonly adapterHost: HttpAdapterHost,
    private readonly tracingService: TracingService,
    private readonly utilsService: UtilsService,
  ) {}

  onModuleInit(): void {
    const fastify =
      this.adapterHost.httpAdapter.getInstance() as FastifyInstance;

    registerTracingHooks(fastify, this.tracingService, this.utilsService);
  }
}
