export interface RecordOptions {
    address: string;
    output: string;
    port: string; // Will be turned into number
    ssl: boolean;
}

export interface MockOptions {
    address: string;
    port: string; // Will be turned into number
    ssl: boolean;
}
