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

    private initServer() {
        if (!this.conf.ssl) {
            this.server = createHttpServer();
        } else {
            this.server = createHttpsServer();
            throw new Error('Not implemented');
        }

        try {
            this.server.listen(this.conf.port, this.conf.address, () => {
                this.logger.info(
                    `Listening on ${this.conf.address}:${this.conf.port}`
                );
            });
        } catch (error) {
            throw new Error(`An error occured: ${error}`);
        }

        this.server.on('request', this.handler.bind(this));
    }
}
