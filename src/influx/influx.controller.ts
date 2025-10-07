import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { InfluxService } from './influx.service';
import { WriteInfluxDto } from './dto/write-influx.dto';
import { QueryInfluxDto } from './dto/query-influx.dto';

@Controller('influx')
export class InfluxController {
  constructor(private readonly influxService: InfluxService) {}

  @Post('write')
  async write(@Body() dto: WriteInfluxDto) {
    await this.influxService.writeData(dto.measurement, dto.fields, dto.tags);
    return { status: 'ok' };
  }

  @Get('query')
  async query(@Query() queryDto: QueryInfluxDto) {
    const result = await this.influxService.queryData(queryDto.q);
    return { data: result };
  }
}