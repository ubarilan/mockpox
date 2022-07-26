import { IncomingMessage, ServerResponse } from 'http';
import {
    getUrlWithoutOrigin,
    rawHeadersToMap,
    sortUrlQueryStrings,
} from '../lib/utils/utilities';
import Record from './record';
import axios, { Method } from 'axios';

export default async function handler(
    this: Record,
    req: IncomingMessage,
    res: ServerResponse
) {
    const headerMap = rawHeadersToMap(req.rawHeaders);
    // Remove from headers because it's not part of the request
    headerMap.delete('Proxy-Connection');

    const host = headerMap.get('Host');
    if (!host) {
        res.writeHead(400, 'Host header is requierd');
        return res.end();
    }

    const sortedUrl = sortUrlQueryStrings(req.url);

    const rex = await axios.request({
        url: sortedUrl,
        method: req.method,
        headers: Object.fromEntries(headerMap),
        maxRedirects: 0,
        validateStatus: null,
    });

    res.writeHead(rex.status, rex.headers);
    res.end(rex.data);

    this.logger.info(`${req.method} - ${sortedUrl} - ${rex.status}`);

    this.writeConfig.addEndpointData(
        getUrlWithoutOrigin(sortedUrl),
        req.method as Method,
        rex
    );
}
