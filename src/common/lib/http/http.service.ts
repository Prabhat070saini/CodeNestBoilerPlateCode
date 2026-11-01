import { Injectable } from '@nestjs/common';
import axios, { AxiosHeaders, AxiosInstance, AxiosRequestConfig } from 'axios';
import { TracingService } from '../tracing/tracing.service';
import { CustomLoggerService } from '../logger/custom.logger';

interface HttpRequestOptions {
  body?: unknown;
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  skipTracing?: boolean;
}

@Injectable()
export class HttpService {
  private readonly axiosInstance: AxiosInstance;

  constructor(
    private readonly tracingService: TracingService,
    private readonly logger: CustomLoggerService,
  ) {
    this.axiosInstance = axios.create();

    // Global request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const headers = AxiosHeaders.from(config.headers);

        if (headers.get('skip-tracing') === 'true') {
          headers.delete('skip-tracing');
          config.headers = headers;
          return config;
        }

        const tracingId = this.tracingService.getTracingId();

        if (tracingId) {
          headers.set('x-request-id', tracingId);
        }

        config.headers = headers;

        return config;
      },
      (error) => {
        this.logger.error({
          log: 'HTTP Request Error',
          message: error.message,
          stack: error.stack,
        });

        return Promise.reject(error);
      },
    );

    // Global response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        this.logger.error({
          log: 'HTTP Response Error',
          message: error.message,
          stack: error.stack,
        });

        return Promise.reject(error);
      },
    );
  }

  private async request<T>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    { body, headers, params, skipTracing }: HttpRequestOptions = {},
  ): Promise<T> {
    const config: AxiosRequestConfig = {
      method,
      url,
      data: body,
      headers: AxiosHeaders.from(headers),
      params,
    };

    if (skipTracing) {
      const axiosHeaders = AxiosHeaders.from(config.headers);
      axiosHeaders.set('skip-tracing', 'true');
      config.headers = axiosHeaders;
    }

    const response = await this.axiosInstance.request<T>(config);
    return response.data;
  }

  get<T>(url: string, opts?: Omit<HttpRequestOptions, 'body'>): Promise<T> {
    return this.request<T>('get', url, opts);
  }

  post<T>(
    url: string,
    body?: unknown,
    opts?: Omit<HttpRequestOptions, 'body'>,
  ): Promise<T> {
    return this.request<T>('post', url, { ...opts, body });
  }

  put<T>(
    url: string,
    body?: unknown,
    opts?: Omit<HttpRequestOptions, 'body'>,
  ): Promise<T> {
    return this.request<T>('put', url, { ...opts, body });
  }

  patch<T>(
    url: string,
    body?: unknown,
    opts?: Omit<HttpRequestOptions, 'body'>,
  ): Promise<T> {
    return this.request<T>('patch', url, { ...opts, body });
  }

  delete<T>(url: string, opts?: Omit<HttpRequestOptions, 'body'>): Promise<T> {
    return this.request<T>('delete', url, opts);
  }
}
