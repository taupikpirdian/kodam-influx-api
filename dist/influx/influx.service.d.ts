import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class InfluxService implements OnModuleInit {
    private readonly configService;
    private readonly logger;
    private client;
    private org;
    private bucket;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    writeData(measurement: string, fields: Record<string, any>, tags?: Record<string, any>): Promise<void>;
    queryData(query: string): Promise<any[]>;
}
