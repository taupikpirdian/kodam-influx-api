"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var InfluxService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfluxService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const influxdb_client_1 = require("@influxdata/influxdb-client");
let InfluxService = InfluxService_1 = class InfluxService {
    configService;
    logger = new common_1.Logger(InfluxService_1.name);
    client;
    org;
    bucket;
    constructor(configService) {
        this.configService = configService;
        const url = this.configService.get('INFLUX_URL');
        const token = this.configService.get('INFLUX_TOKEN');
        const org = this.configService.get('INFLUX_ORG');
        const bucket = this.configService.get('INFLUX_BUCKET');
        if (!url || !token || !org || !bucket) {
            this.logger.error('InfluxDB environment variables are not fully configured. Please set INFLUX_URL, INFLUX_TOKEN, INFLUX_ORG, INFLUX_BUCKET.');
            throw new Error('Missing InfluxDB configuration in environment variables.');
        }
        this.client = new influxdb_client_1.InfluxDB({ url, token });
        this.org = org;
        this.bucket = bucket;
    }
    async writeData(measurement, fields, tags) {
        const writeApi = this.client.getWriteApi(this.org, this.bucket);
        const point = new influxdb_client_1.Point(measurement);
        Object.entries(fields).forEach(([key, value]) => {
            if (typeof value === 'number') {
                point.floatField(key, value);
            }
            else if (typeof value === 'boolean') {
                point.booleanField(key, value);
            }
            else if (typeof value === 'string') {
                point.stringField(key, value);
            }
            else if (value === null || value === undefined) {
            }
            else {
                point.stringField(key, JSON.stringify(value));
            }
        });
        if (tags) {
            Object.entries(tags).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    point.tag(key, String(value));
                }
            });
        }
        try {
            writeApi.writePoint(point);
            await writeApi.close();
            this.logger.log(`Wrote measurement '${measurement}' to bucket '${this.bucket}'.`);
        }
        catch (err) {
            this.logger.error('Error writing to InfluxDB', err);
            throw err;
        }
    }
    async queryData(query) {
        const queryApi = this.client.getQueryApi(this.org);
        try {
            const rows = await queryApi.collectRows(query);
            return rows;
        }
        catch (err) {
            this.logger.error('Error querying InfluxDB', err);
            throw err;
        }
    }
};
exports.InfluxService = InfluxService;
exports.InfluxService = InfluxService = InfluxService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], InfluxService);
//# sourceMappingURL=influx.service.js.map