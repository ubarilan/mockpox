import { AxiosResponseHeaders, Method } from 'axios';

export interface RecordStructure {
    meta: Omit<RecordConf, 'output'>;
    endpoints: { [key: string]: Partial<EndpointData> };
}

export interface EndpointRecord {
    statusCode: number;
    headers: AxiosResponseHeaders;
    responseBody: string;
}

export interface RecordConf {
    address: string;
    output: string;
    port: number;
    ssl: boolean;
    maxResponsesPerEndpoint: number;
}

export type EndpointData = {
    [key in Method]: EndpointRecord[];
};

// Example record structure
/*
{
    meta: {
        address: '0.0.0.0',
        port: 8080,
        ssl: true,
    },
    endpoints: {
        '/': {
            GET: {
                statusCode: 200,
                headers: {
                    'X-Powered-By': 'mockpox',
                },
                responseBody: {
                    message: 'hello world',
                },
            },
        },
    },
};
*/
