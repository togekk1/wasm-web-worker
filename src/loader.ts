import { wasm_request_type } from './interface';
import loader, { ASUtil } from '@assemblyscript/loader';

export async function wasm_init(
  wasm_request: wasm_request_type | wasm_request_type[],
  memory?: WebAssembly.Memory,
  custom_imports?: loader.Imports,
  base_url?: string
): Promise<ASUtil> {
  const get_asc = () =>
    new Promise((resolve: (value: unknown) => void, reject: (reason?: any) => void) => {
      const worker = new Worker(`${base_url ?? ''}/assets/web-worker/wasm/worker.js`);
      worker.postMessage(JSON.stringify(wasm_request));

      const message_handler = async (event: MessageEvent) => {
        worker.removeEventListener('message', message_handler);
        let asc: ASUtil;

        const imports = {
          /* imports go here */
          ...(memory ? { env: { memory } } : {}),
          console: {
            'console.log': (ptr: number) => {
              asc && console.log(asc.__getString(ptr));
            },
            'console.logi': (i: number) => {
              console.log(i);
            },
            'console.logf': (f: number) => {
              console.log(f);
            },
            'console.logj': (ptr: number) => {
              try {
                asc && console.log(JSON.parse(asc.__getString(ptr)));
              } catch (err) {
                console.error(err);
              }
            }
          },
          ...custom_imports
        };

        try {
          asc = (await loader.instantiate(event.data[1], imports)).exports as unknown as ASUtil;
          resolve(asc);
        } catch (err) {
          console.error(err);
          reject();
        }
      };
      worker.addEventListener('message', message_handler);
    });
  return (await (Array.isArray(wasm_request) ? Promise.all(wasm_request.map(get_asc)) : get_asc())) as ASUtil;
}
