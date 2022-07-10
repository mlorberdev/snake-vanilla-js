!(function () {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const colors = ["#bada55", "#0ff0ff"];
    const cw = canvas.width = canvas.height = 400;
    const w = cw / 20; // since the grid is square, it's dimensions are 20 x 20
    let score, mouse, mouseColor = "#0ff", snake, dir, mi, ll, movement, moving;

    // RANDOM POSITION
    function rand(cb) {
        cb = {
            x: w * (Math.floor(Math.random() * w)),
            y: w * (Math.floor(Math.random() * w))
        };
        return cb;
    }

    // GAME SETUP
    (function init() {
        ctx.clearRect(0, 0, cw, cw);
        mouse = { x: 280, y: 200 };
        snake = [[120, 200], [100, 200]];
        dir = "ArrowRight";
        mi = 200;
        ll = 2;
        score = 0;
        moving = false;
        ctx.shadowBlur = 15;
        drawMouse();
        drawSnake();
    })();
    function drawMouse() {
        ctx.fillStyle = ctx.shadowColor = colors[1];
        ctx.beginPath();
        ctx.arc(mouse.x + w / 2, mouse.y + w / 2, w / 2, 2 * Math.PI, false);
        ctx.fill();
    }
    function drawSnake() {
        ctx.fillStyle = ctx.shadowColor = colors[0];
        for (i = 0; i < ll; i++) {
            ctx.fillRect(snake[i][0], snake[i][1], w, w)
        }
    }

    // START GAME ON [ENTER], MOVE ON ARROW KEYS
    window.addEventListener("keydown", function (e) {
        if (e.code === "Enter") {
            if (!moving) {
                moving = true;
                movement = setInterval(move, mi);
            } else {
                moving = false;
                clearInterval(movement);
            }
        } else {
            move(e.code);
        }
    });

    // MOVING
    function move(e) {
        if (!moving || e === dir) { return; }
        if (e === undefined) { e = dir; }
        let dx = 0, dy = 0;

        // KEYS SWITCH DIRECTION
        switch (e) {
            case "ArrowLeft": dx = -20;
                if (dir === "ArrowRight") { return; }
                else { dir = "ArrowLeft" };
                break;
            case "ArrowUp": dy = -20;
                if (dir === "ArrowDown") { return; }
                else { dir = "ArrowUp" };
                break;
            case "ArrowRight": dx = 20;
                if (dir === "ArrowLeft") { return; }
                else { dir = "ArrowRight" };
                break;
            case "ArrowDown": dy = 20;
                if (dir === "ArrowUp") { return; }
                else { dir = "ArrowDown" };
                break;
            default: return;
        }

        // CHECK FOR COLLISIONS
        for (let i = 1; i < snake.length; i++) {
            if (snake[0][0] === snake[i][0] && snake[0][1] === snake[i][1]) { endgame(); return; }
            if (snake[0][0] < 0) snake[0][0] = 380;
            if (snake[0][0] > 380) snake[0][0] = 0;
            if (snake[0][1] < 0) snake[0][1] = 380;
            if (snake[0][1] > 380) snake[0][1] = 0;
        }
        snake.unshift([snake[0][0] + dx, snake[0][1] + dy]); // add new head to 0 on snake array
        snake.pop(); // remove snake last segment
        ctx.clearRect(0, 0, cw, cw);
        drawMouse();
        drawSnake();

        // SCORE
        if (snake[0][0] === mouse.x && snake[0][1] === mouse.y) {
            if (document.getElementById("motionbox").checked === false) jiggle(); // jiggle effect; note: css will account for prefers-reduced-motion
            score++;
            newmouse(); // new random mouse
            snake.push([snake[snake.length - 1][0], snake[snake.length - 1][1]]); // make snake longer by doubling last element
            mi -= 5; // decrement move interval
            ll++; // increment snake length
            clearInterval(movement);
            movement = setInterval(move, mi); // clear & reset movement interval
            writeToDom(); // update player view (score, length, interval)
        }
    }

    // UPDATE PLAYER VIEW
    function writeToDom() {
        document.getElementById("mice").innerHTML = score; // write new score
        document.getElementById("tt").innerHTML = mi;
        document.getElementById("ll").innerHTML = ll;
    }

    // NEW MOUSE
    function newmouse() {
        let newLoc = rand();
        for (let i = 0; i < ll; i++) {
            if (snake[i][0] === newLoc.x && snake[i][1] === newLoc.y) {
                newLoc = rand();
                i = 0;
            }
        }
        mouse.x = newLoc.x;
        mouse.y = newLoc.y;
        drawMouse();
    }

    // END GAME
    function endgame() {
        moving = false;
        clearInterval(movement);
    }

    // EATING EFFECT JIGGLE
    function jiggle() {
        canvas.classList.add("jiggly");
        const tmo = setTimeout(clr, 500);
        function clr() { canvas.classList.remove("jiggly"); clearTimeout(tmo); }
    }

})();