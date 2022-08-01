import { AxiosResponse, Method } from 'axios';
import { writeFileSync } from 'fs';
import { Logger } from 'winston';
import { EndpointData, RecordConf, RecordStructure } from './types/recordTypes';

export default class Writeconfig {
    private recordedEndpoints: RecordStructure['endpoints'];

    constructor(private conf: RecordConf, private logger: Logger) {
        this.recordedEndpoints = {};
    }

    public addEndpointData(
        formatedUrl: string,
        method: Method,
        res: AxiosResponse
    ): void {
        // Type represents an element in the responses array
        type responseRawData =
            EndpointData[keyof EndpointData][keyof EndpointData[keyof EndpointData]];

        const endpoint: responseRawData = {
            statusCode: res.status,
            headers: res.headers,
            responseBody: res.data,
        };

        if (!this.recordedEndpoints[formatedUrl]) {
            this.recordedEndpoints[formatedUrl] = {
                [method]: [endpoint],
            };
            return;
        }

        if (!this.recordedEndpoints[formatedUrl][method]) {
            this.recordedEndpoints[formatedUrl][method] = [endpoint];
            return;
        }

        if (
            this.recordedEndpoints[formatedUrl][method].length >=
            this.conf.maxResponsesPerEndpoint
        ) {
            // Decided to remove from the end as it makes more sense
            this.recordedEndpoints[formatedUrl][method].pop();
            return;
        }

        this.recordedEndpoints[formatedUrl][method].push(endpoint);
    }

    public writeToFile(): void {
        this.logger.info('Writing to file...');
        const file = this.conf.output;
        delete this.conf.output;
        const data: RecordStructure = {
            meta: this.conf,
            endpoints: this.recordedEndpoints,
        };
        const json = JSON.stringify(data);
        writeFileSync(file, json);
        process.exit();
    }
}
