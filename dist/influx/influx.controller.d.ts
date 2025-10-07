import { InfluxService } from './influx.service';
import { WriteInfluxDto } from './dto/write-influx.dto';
import { QueryInfluxDto } from './dto/query-influx.dto';
export declare class InfluxController {
    private readonly influxService;
    constructor(influxService: InfluxService);
    write(dto: WriteInfluxDto): Promise<{
        status: string;
    }>;
    query(queryDto: QueryInfluxDto): Promise<{
        data: any[];
    }>;
}
