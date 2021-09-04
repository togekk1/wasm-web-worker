export interface wasm_request_type {
  url: string;
  instances?: number;
}

export interface wasm_type {
  [key: string]: number;
}
