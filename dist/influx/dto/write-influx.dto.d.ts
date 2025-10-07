export declare class WriteInfluxDto {
    measurement: string;
    fields: Record<string, any>;
    tags?: Record<string, any>;
}
