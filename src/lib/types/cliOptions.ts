export interface RecordOptions {
    address: string;
    output: string;
    port: string; // Will be turned into number
    ssl: boolean;
    maxResponses: number;
}

export interface MockOptions {
    address: string;
    port: string; // Will be turned into number
    ssl: boolean;
    file: string;
}
