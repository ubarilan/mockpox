import { Method } from 'axios';
import { IncomingMessage, ServerResponse } from 'http';
import {
    getUrlWithoutOrigin,
    sortUrlQueryStrings,
} from '../lib/utils/utilities';
import Mock from './mock';

export default async function handler(
    this: Mock,
    req: IncomingMessage,
    res: ServerResponse
) {
    // I have no idea why this is necessary, but it is.
    const sortedUrl = sortUrlQueryStrings(`http://example.com${req.url}`);

    const sortedPathAndSearch = getUrlWithoutOrigin(sortedUrl);

    const mockRes = this.readConfig.getEndpointRecord(
        sortedPathAndSearch,
        req.method as Method
    );

    if (mockRes) {
        res.writeHead(mockRes.statusCode, mockRes.headers);
        res.end(mockRes.responseBody);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
    }
}
