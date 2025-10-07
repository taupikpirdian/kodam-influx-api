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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfluxController = void 0;
const common_1 = require("@nestjs/common");
const influx_service_1 = require("./influx.service");
const write_influx_dto_1 = require("./dto/write-influx.dto");
const query_influx_dto_1 = require("./dto/query-influx.dto");
let InfluxController = class InfluxController {
    influxService;
    constructor(influxService) {
        this.influxService = influxService;
    }
    async write(dto) {
        await this.influxService.writeData(dto.measurement, dto.fields, dto.tags);
        return { status: 'ok' };
    }
    async query(queryDto) {
        const result = await this.influxService.queryData(queryDto.q);
        return { data: result };
    }
};
exports.InfluxController = InfluxController;
__decorate([
    (0, common_1.Post)('write'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [write_influx_dto_1.WriteInfluxDto]),
    __metadata("design:returntype", Promise)
], InfluxController.prototype, "write", null);
__decorate([
    (0, common_1.Get)('query'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_influx_dto_1.QueryInfluxDto]),
    __metadata("design:returntype", Promise)
], InfluxController.prototype, "query", null);
exports.InfluxController = InfluxController = __decorate([
    (0, common_1.Controller)('influx'),
    __metadata("design:paramtypes", [influx_service_1.InfluxService])
], InfluxController);
//# sourceMappingURL=influx.controller.js.map