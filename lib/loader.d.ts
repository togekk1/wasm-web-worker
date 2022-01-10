import { wasm_request_type } from './interface';
import loader, { ASUtil } from '@assemblyscript/loader';
export declare function wasm_init(wasm_request: wasm_request_type | wasm_request_type[], memory?: WebAssembly.Memory, custom_imports?: loader.Imports, base_url?: string): Promise<ASUtil>;
