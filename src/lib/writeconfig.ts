import { AxiosResponse, Method } from 'axios';
import { EndpointData, RecordConf, RecordStructure } from './types/recordTypes';

export default class Writeconfig {
    private recordedEndpoints: RecordStructure['endpoints'];

    constructor(private conf: RecordConf) {
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
            responseBody: JSON.stringify(res.data),
        };

        if (!this.recordedEndpoints[formatedUrl]) {
            this.recordedEndpoints[formatedUrl] = {
                [method]: [endpoint],
            };
        }

        if (!this.recordedEndpoints[formatedUrl][method]) {
            this.recordedEndpoints[formatedUrl][method] = [endpoint];
        }

        if (
            this.recordedEndpoints[formatedUrl][method].length >=
            this.conf.maxResponsesPerEndpoint
        ) {
            // Decided to remove from the end as it makes more sense
            this.recordedEndpoints[formatedUrl][method].pop();
        }

        this.recordedEndpoints[formatedUrl][method].push(endpoint);
    }
}
