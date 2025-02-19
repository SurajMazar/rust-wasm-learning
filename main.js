import init, {World, Direction} from './pkg/snake_game.js'

// async function init(){
//     const data = await fetch('sum.wasm');
//     const buffer = await data.arrayBuffer();
//     const wasm = await WebAssembly.instantiate(buffer);
//     debugger
//     const sumFunction = wasm.instance.exports.sum;
//     const wasmMemory = wasm.instance.exports.memory;
//     const uint8Array = new Uint8Array(wasmMemory.buffer,0,13);
//     const text = new TextDecoder().decode(uint8Array.buffer)
//     console.log(text)
//     const result = sumFunction(10, 100);
//     console.log(result)
// }
// init();


init().then(() => {
    const CELL_SIZE = 22;
    const WORLD_WIDTH=16;
    const SNAKE_SPAWN_IDX = Date.now() % (WORLD_WIDTH * WORLD_WIDTH);
    const world = World.new(WORLD_WIDTH, SNAKE_SPAWN_IDX);
    const worldWidth = world.width();
    const canvas = document.getElementById('snake-canvas');
    const ctx = canvas.getContext('2d');
    canvas.height = worldWidth * CELL_SIZE
    canvas.width = worldWidth * CELL_SIZE

    function drawWorld() {
        ctx.beginPath();
        for (let x = 0; x < worldWidth + 1; x++) {
            ctx.moveTo(x * CELL_SIZE, 0);
            ctx.lineTo(x * CELL_SIZE, worldWidth * CELL_SIZE);
        }
        for (let y = 0; y < worldWidth + 1; y++) {
            ctx.moveTo(0, y * CELL_SIZE);
            ctx.lineTo(worldWidth * CELL_SIZE, y * CELL_SIZE);
        }
        ctx.stroke();
    }

    function drawSnake(){
        const snakeIdx = world.snake_head_idx();
        const col = snakeIdx % worldWidth;
        const row = Math.floor(snakeIdx / worldWidth);
        ctx.beginPath();
        ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        ctx.stroke();
    }

    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowLeft':
                world.update_direction(Direction.Left)
                break;
            case 'ArrowRight':
                world.update_direction(Direction.Right)
                break;
            case 'ArrowUp':
                world.update_direction(Direction.Up)
                break;
            case 'ArrowDown':
                world.update_direction(Direction.Down)
                break;
        }
    })

    function paint(){
        drawWorld()
        drawSnake()
    }

    function update(){
        const fps = 8;
        setTimeout(()=>{
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            world.update()
            paint()
            requestAnimationFrame(update)
        }, 1000/fps)
    }

    paint()
    update()
})