import { Method } from 'axios';
import { readFileSync } from 'fs';
import { Logger } from 'winston';
import { EndpointRecord, RecordStructure } from './types/recordTypes';

export default class ReadConfig {
    private record: RecordStructure;
    private endpointDataRequests: Map<string, number>;

    constructor(file: string, private logger: Logger) {
        const rawData = readFileSync(file, 'utf8');
        try {
            const data: RecordStructure = JSON.parse(rawData);
            this.record = data;
        } catch (error) {
            this.logger.crit(`Could not parse JSON file (${file}): ${error}`);
            process.exit(1);
        }

        this.validateRecord();
        this.endpointDataRequests = new Map();
    }

    private validateRecord(): void {
        if (!this.record.meta.address) {
            this.logger.crit('No address specified');
            process.exit(1);
        }

        if (!this.record.meta.port) {
            this.logger.crit('No port specified');
            process.exit(1);
        }

        if (!this.record.endpoints) {
            this.logger.crit('No endpoints specified');
            process.exit(1);
        }

        this.logger.info('Record structure is valid');
    }

    public getEndpointRecord(url: string, method: Method): EndpointRecord {
        const endpoint = this.record.endpoints?.[url]?.[method];
        if (!Array.isArray(endpoint) || endpoint.length === 0) {
            return null;
        }

        const recordIndex =
            this.endpointDataRequests.get(`${method}_${url}`) || 0;

        // If we have reached the end of the endpoint array, get the last item
        const record =
            endpoint[recordIndex] !== undefined
                ? endpoint[recordIndex]
                : endpoint[endpoint.length - 1];

        // Increment the index
        this.endpointDataRequests.set(`${method}_${url}`, recordIndex + 1);

        return record;
    }
}
