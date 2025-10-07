import { ConfigService } from '@nestjs/config';
export declare class InfluxService {
    private readonly configService;
    private readonly logger;
    private client;
    private org;
    private bucket;
    constructor(configService: ConfigService);
    writeData(measurement: string, fields: Record<string, any>, tags?: Record<string, any>): Promise<void>;
    queryData(query: string): Promise<any[]>;
}
