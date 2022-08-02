import { createServer as createHttpServer, Server as httpServer } from 'http';
import {
    createServer as createHttpsServer,
    Server as httpsServer,
} from 'https';
import { Logger } from 'winston';
import ReadConfig from '../lib/readconfig';
import { MockConf } from '../lib/types/mockTypes';
import { logger } from '../lib/utils/logger';
import handler from './handler';
import { createCertificate } from 'pem';

export default class Mock {
    private server: httpServer | httpsServer; // Implement HTTPS
    protected logger: Logger;

    protected readConfig: ReadConfig;

    private handler = handler;

    constructor(private conf: MockConf) {
        this.logger = logger;
        this.readConfig = new ReadConfig(conf.file, this.logger);
    }

    public start() {
        this.initServer();
    }

    private startWebServer() {
        try {
            this.server.listen(this.conf.port, this.conf.address, () => {
                this.logger.info(
                    `Mock server listening on ${this.conf.address}:${this.conf.port}`
                );
            });
        } catch (err: unknown) {
            if (err instanceof Error) {
                this.logger.crit(
                    `Error when trying to listen on port ${this.conf.port}: ${err.message}`
                );
            }
            process.exit(1);
        }
        this.server.on('request', this.handler.bind(this));
    }

    private initServer() {
        if (!this.conf.ssl) {
            this.server = createHttpServer();
            this.startWebServer();
        } else {
            createCertificate(
                {
                    days: 1,
                    selfSigned: true,
                },
                (err, keys) => {
                    if (err) {
                        throw err;
                    }
                    this.server = createHttpsServer({
                        key: keys.serviceKey,
                        cert: keys.certificate,
                    });
                    this.startWebServer();
                }
            );
        }
    }
}
