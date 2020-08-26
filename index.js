// import the emscripten glue code
import emscripten from './build/module.js';
import landingPage from './src/landingPage';

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    let response;
    if (request.method === "POST" && request.headers.get("Content-Type") === "application/json") {
        let sudokuArray = await request.json();
        response = await solve(sudokuArray)
    } else {
        response = new Response(landingPage, { headers: { "Content-Type": "text/html" } })
        //response = new Response("Expected POST?", { status: 405 });
    }
    return response;
}

let emscripten_module = new Promise((resolve, reject) => {
    emscripten({
        instantiateWasm(info, receive) {
            let instance = new WebAssembly.Instance(wasm, info)
            receive(instance)
            return instance.exports
        },  
    }).then(module => {
        resolve(module)
    })
})


let instance = null;
const solve = async sudokuArray => {
    if(!instance) {
        instance = await emscripten_module;
    }
    const I32_SIZE = 4;
    const sudokuPtr = instance._malloc(sudokuArray.length * I32_SIZE);
    instance.HEAP32.set(sudokuArray, sudokuPtr / I32_SIZE);
    instance.solve(sudokuPtr);

    for (let v = 0; v < sudokuArray.length * I32_SIZE; v += I32_SIZE) {
        sudokuArray[v/I32_SIZE] = instance.getValue(sudokuPtr + v, 'i32')
    } 
    instance._free(sudokuPtr);  
    return new Response(JSON.stringify(sudokuArray), { 'status': 200, 'content-type': 'application/json' });
}
