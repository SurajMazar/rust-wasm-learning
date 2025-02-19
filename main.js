import init, {World, Direction} from './pkg/snake_game.js'

init().then((wasm) => {
    const CELL_SIZE = 22;
    const WORLD_WIDTH = 16;
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

    function drawSnake() {
        const snake_cells = new Uint32Array(wasm.memory.buffer, world.snake_cells(), world.snake_length());
        snake_cells.forEach((cellIdx, idx) => {
            const col = cellIdx % worldWidth;
            const row = Math.floor(cellIdx / worldWidth);
            ctx.beginPath();
            ctx.fillStyle = idx === 0 ? '#7878db' : '#000000'
            ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            ctx.stroke();
        })
    }

    function drawRewardCell() {
        const rewardCell = world.reward_cell()
        const col = rewardCell % worldWidth;
        const row = Math.floor(rewardCell / worldWidth);
        ctx.beginPath();
        ctx.fillStyle = 'red'
        ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        ctx.stroke()
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

    function paint() {
        drawWorld()
        drawSnake()
        drawRewardCell()
    }

    function update() {
        const fps = 10;
        setTimeout(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            world.update()
            paint()
            requestAnimationFrame(update)
        }, 1000 / fps)
    }

    paint()
    update()
})