#! /usr/bin/env node
import { Command } from 'commander';
import { MockOptions, RecordOptions } from './lib/types/cliOptions';
import { resolve } from 'path';
import { existsSync } from 'fs';
import Record from './record/record';

const program = new Command();

program
    .name('mockpox')
    .description('Record http requests and responses then mock them')
    .version('1.0.0', '-v');

program
    .command('record')
    .description('Record http requests and responses')
    .option('-p, --port <number>', 'Port for proxy to listen on', '8080')
    .option(
        '-a, --address <address>',
        'Address for proxy to listen on',
        '0.0.0.0'
    )
    .option('-o, --output <file>', 'Output file', 'req-res.json')
    .option('-s, --ssl', 'Use SSL', false)
    .option('-m, --max-responses <number>', 'Max responses per endpoint', '10')
    // will be removed when implemented
    //eslint-disable-next-line
    .action((options: RecordOptions) => {
        const record = new Record({
            ...options,
            port: Number(options.port),
            maxResponsesPerEndpoint: Number(options.maxResponses),
        });
        record.start();
    });

program
    .command('mock')
    .description('Mock http requests and responses')
    .argument('<file>', 'Input file')
    .option('-p, --port <number>', 'Port for proxy to listen on', '8080')
    .option('-a, --address <address>', 'Address for proxy to listen on', '8080')
    .option('-s, --ssl', 'Use SSL', false)
    // will be removed when implemented
    //eslint-disable-next-line
    .action((file: string, options: MockOptions) => {
        if (!existsSync(resolve(file))) throw new Error('File does not exist');

        throw new Error('Not implemented');
    });

program.parse();
