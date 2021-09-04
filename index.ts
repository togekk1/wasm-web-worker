import { wasm_request_type } from './interface';
import loader, { ASUtil } from '@assemblyscript/loader';

export async function wasm_init(wasm_request: wasm_request_type | wasm_request_type[]): Promise<ASUtil> {
  const get_asc = () =>
    new Promise((resolve: (value: unknown) => void) => {
      const worker = new Worker(`/assets/web-worker/wasm/worker.js`);
      worker.postMessage(JSON.stringify(wasm_request));

      const message_handler = async (event: MessageEvent) => {
        // if (event.data[0] === url) {
        worker.removeEventListener('message', message_handler);

        //   const array_buffer: ArrayBuffer = event.data[1];
        //   //   const imports = {
        //   //     /* imports go here */
        //   //     // env: { memory },
        //   //     console: {
        //   //       'console.log': (ptr: number) => {
        //   //         const asc = (ascs as { [key: string]: any })[worker_name];
        //   //         asc && console.log(asc.__getString(ptr));
        //   //       },
        //   //       'console.logi': (i: number) => {
        //   //         console.log(i);
        //   //       },
        //   //       'console.logf': (f: number) => {
        //   //         console.log(f);
        //   //       },
        //   //       'console.logj': (ptr: number) => {
        //   //         try {
        //   //           const asc = (ascs as { [key: string]: any })[worker_name];
        //   //           asc && console.log(JSON.parse(asc.__getString(ptr)));
        //   //         } catch (err) {
        //   //           console.error(err);
        //   //         }
        //   //       }
        //   //     }
        //   //   };

        //   (ascs as { [key: string]: any })[worker_name] = {
        //     ...((await loader.instantiate(array_buffer)).exports as ASUtil),
        //     ...(ascs as { [key: string]: any })[worker_name]
        //   };
        resolve((await loader.instantiate(event.data[1])).exports as unknown as ASUtil);
        // }
      };
      worker.addEventListener('message', message_handler);
    });
  return (await (Array.isArray(wasm_request) ? Promise.all(wasm_request.map(get_asc)) : get_asc())) as ASUtil;
}
