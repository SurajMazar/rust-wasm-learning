// import init, {greet} from 'snake_game'

async function init(){
    const data = await fetch('sum.wasm');
    const buffer = await data.arrayBuffer();
    const wasm = await WebAssembly.instantiate(buffer);
    const sumFunction = wasm.instance.exports.sum;
    const wasmMemory = wasm.instance.exports.memory;
    const uint8Array = new Uint8Array(wasmMemory.buffer,0,13);
    const text = new TextDecoder().decode(uint8Array.buffer)
    console.log(text)
    const result = sumFunction(10, 100);
    console.log(result)
}
init();


// init().then(() => {
//     greet('suraj')
//     console.log('hello')
// })