import { wasm_request_type } from './interface';
onmessage = async (event: MessageEvent<string>) => {
  try {
    const wasm_request: wasm_request_type | wasm_request_type[] = JSON.parse(event.data);

    const array_buffer = Array.isArray(wasm_request)
      ? Promise.all(
          wasm_request.map(async ({ url, instances }: wasm_request_type) => {
            const fetch_wasm = async () => await (await fetch(url)).arrayBuffer();
            return instances ? Array(instances).map(fetch_wasm) : fetch_wasm;
          })
        )
      : await (await fetch(wasm_request.url)).arrayBuffer();
    // @ts-ignore
    postMessage(['main', array_buffer]);
  } catch (err) {
    console.error(err);
  } finally {
    close();
  }
};
