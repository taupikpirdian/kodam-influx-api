import { Injectable, Logger, HttpException, HttpStatus, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InfluxDB, Point } from '@influxdata/influxdb-client';

@Injectable()
export class InfluxService implements OnModuleInit {
  private readonly logger = new Logger(InfluxService.name);
  private client: InfluxDB;
  private org: string;
  private bucket: string;

  constructor(private readonly configService: ConfigService) {
    const url = this.configService.get<string>('INFLUX_URL');
    const token = this.configService.get<string>('INFLUX_TOKEN');
    const org = this.configService.get<string>('INFLUX_ORG');
    const bucket = this.configService.get<string>('INFLUX_BUCKET');

    if (!url || !token || !org || !bucket) {
      this.logger.error(
        'InfluxDB environment variables are not fully configured. Please set INFLUX_URL, INFLUX_TOKEN, INFLUX_ORG, INFLUX_BUCKET.',
      );
      throw new Error(
        'Missing InfluxDB configuration in environment variables.',
      );
    }

    this.client = new InfluxDB({ url, token });
    this.org = org;
    this.bucket = bucket;
  }

  async onModuleInit(): Promise<void> {
    // Verify connectivity to InfluxDB by running a simple Flux query.
    const queryApi = this.client.getQueryApi(this.org);
    try {
      await queryApi.collectRows('buckets() |> limit(n:1)');
      this.logger.log('InfluxDB connection verified successfully.');
    } catch (err) {
      this.logger.error('InfluxDB connection check failed', err as Error);
      throw new HttpException(
        'InfluxDB connection failed during startup',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async writeData(
    measurement: string,
    fields: Record<string, any>,
    tags?: Record<string, any>,
  ): Promise<void> {
    const writeApi = this.client.getWriteApi(this.org, this.bucket);

    const point = new Point(measurement);

    // Add fields with type handling
    Object.entries(fields).forEach(([key, value]) => {
      if (typeof value === 'number') {
        // decide int vs float if needed; using float for general numbers
        point.floatField(key, value);
      } else if (typeof value === 'boolean') {
        point.booleanField(key, value);
      } else if (typeof value === 'string') {
        point.stringField(key, value);
      } else if (value === null || value === undefined) {
        // skip null/undefined values
      } else {
        // Fallback: store JSON string
        point.stringField(key, JSON.stringify(value));
      }
    });

    // Add tags
    if (tags) {
      Object.entries(tags).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          point.tag(key, String(value));
        }
      });
    }

    try {
      writeApi.writePoint(point);
      await writeApi.close(); // flush and close
      this.logger.log(
        `Wrote measurement '${measurement}' to bucket '${this.bucket}'.`,
      );
    } catch (err) {
      this.logger.error('Error writing to InfluxDB', err as Error);
      throw err;
    }
  }

  async queryData(query: string): Promise<any[]> {
    const queryApi = this.client.getQueryApi(this.org);
    try {
      const rows = await queryApi.collectRows(query);
      return rows as any[];
    } catch (err) {
      this.logger.error('Error querying InfluxDB', err as Error);
      throw err;
    }
  }
}