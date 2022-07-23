import { Command } from 'commander';
import { RecordOptions } from './lib/types/cliOptions';

const program = new Command();

program
    .name('mock-proxy')
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
    //eslint-disable-next-line - will be removed when implemented
    .action((options: RecordOptions) => {
        throw new Error('Not implemented');
    });

program.parse();
