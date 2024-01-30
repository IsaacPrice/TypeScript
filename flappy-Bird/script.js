var Pipe = /** @class */ (function () {
    function Pipe(speed, pipeVariance, pipeSpace, fps, id) {
        this.Speed = speed;
        this.Fps = fps;
        this.id = id;
        // Calculate the center 
        var clientHeight = window.innerHeight;
        var Difference = clientHeight * pipeVariance; // the center of the pipes is within this
        var Center = Math.random() * Difference; // get a random float 0-1 and multiply it by the difference
        //Center += ((clientHeight * (1 - pipeVariance)) / 2); // Add padding to the center
        // Create top boundary
        this.TopBound = document.createElement("div");
        this.TopBound.classList.add("pipe-top");
        this.TopBound.style.position = "fixed";
        this.TopBound.style.height = "".concat(clientHeight - (Center + (clientHeight * pipeSpace / 2)), "px");
        this.TopBound.style.top = "0px";
        this.TopBound.style.right = "-100px";
        this.TopBound.id = "".concat(this.id);
        // Create the botom boundary
        this.BottomBound = document.createElement("div");
        this.BottomBound.classList.add("bottom-pipe");
        this.BottomBound.style.position = "fixed";
        this.BottomBound.style.height = "".concat(Center - (pipeSpace / 2), "px");
        this.BottomBound.style.bottom = "0px";
        this.BottomBound.style.right = "-100px";
        this.BottomBound.id = "-".concat(this.id);
        // Add the elements to the document
        document.querySelectorAll(".game")[0].appendChild(this.TopBound);
        document.querySelectorAll(".game")[0].appendChild(this.BottomBound);
        // Update the position
        this.Position = [-100, Center];
    }
    // TODO: create a resize function for when the window get resized. This can be mostly taked from the constructor
    // Move the pipe
    Pipe.prototype.Update = function () {
        this.Position[0] += (1000 / this.Fps) * this.Speed;
        var element = document.getElementById(this.id.toString());
        if (element !== null) {
            element.style.right = "".concat(this.Position[0], "px");
        }
        element = document.getElementById("-".concat(this.id));
        if (element !== null) {
            element.style.right = "".concat(this.Position[0], "px");
        }
    };
    return Pipe;
}());
var Bird = /** @class */ (function () {
    function Bird(flapStrength, gravity, maxVelocity, speed, startingPosition, fps) {
        this.Fps = fps;
        this.Velocity = 0;
        this.Speed = speed;
        this.IsPlaying = true;
        this.Gravity = gravity;
        this.Width = this.Height;
        this.MaxVeloctiy = maxVelocity;
        this.FlapStrength = flapStrength;
        this.Height = window.innerHeight / 15;
        this.Position = [window.innerWidth * startingPosition[0], window.innerHeight * startingPosition[1]];
        // Create the html element of the flappy bird
        var temp = document.createElement("div");
        temp.classList.add("bird");
        temp.id = "bird";
        temp.style.position = "absolute";
        temp.style.top = "".concat(window.innerHeight - this.Position[1], "px");
        temp.style.left = "".concat(this.Position[0], "px");
        temp.style.height = "".concat(this.Height, "px");
        temp.style.width = "".concat(this.Width, "px");
        // Add the bird to the document
        document.querySelectorAll(".game")[0].appendChild(temp);
    }
    // Takes all of the pipes, and also if the user jumped
    // Returns 1 for getting a point, 0 if nothing happend, and -1 if the bird crashes
    Bird.prototype.Update = function (pipes) {
        var _this = this;
        // Update position
        this.Velocity = (Math.abs(this.Velocity) < this.MaxVeloctiy) ? this.Velocity - ((1 / this.Fps) * this.Gravity) : -1 * this.MaxVeloctiy;
        this.Position[1] += this.Velocity;
        var birdy = document.getElementById("bird");
        if (birdy !== null) {
            birdy.style.top = "".concat(window.innerHeight - this.Position[1], "px");
        }
        // Check for collisions with both the ground and pipes, along with if the user has earned a point
        var distance = this.Speed * 5;
        var tempPoints = 0;
        pipes.forEach(function (element) {
            if (_this.CheckCollision(element.BottomBound) || _this.CheckCollision(element.TopBound)) {
                _this.IsPlaying = false;
            }
            else if (_this.Xdistance(element.TopBound) < distance) {
                tempPoints += 1;
            }
        });
        // Return the events the happened
        if (!this.IsPlaying) {
            return -1;
        }
        else if (tempPoints > 0) {
            return 1;
        }
        return 0;
    };
    // Function to check if two objects are colliding
    Bird.prototype.CheckCollision = function (object) {
        // Get the object borders
        var obj = document.getElementById("bird");
        var rect2 = object.getBoundingClientRect();
        // Check if they are colliding
        if (obj !== null) {
            var rect1 = obj.getBoundingClientRect();
            return !(rect2.left > rect1.right ||
                rect2.right < rect1.left ||
                rect2.top > rect1.bottom ||
                rect2.bottom < rect1.top);
        }
        else {
            return false;
        }
    };
    Bird.prototype.Xdistance = function (object) {
        // Get the object borders
        var obj = document.getElementById("bird");
        var rect2 = object.getBoundingClientRect();
        // Return the difference of the x values
        if (obj !== null) {
            var rect1 = obj.getBoundingClientRect();
            var center1 = (rect1.left + rect1.right) / 2;
            var center2 = (rect2.left + rect2.right) / 2;
            return Math.abs(center1 - center2);
        }
        else {
            return -1;
        }
    };
    Bird.prototype.jump = function () {
        this.Velocity = this.FlapStrength;
    };
    return Bird;
}());
var Game = /** @class */ (function () {
    function Game(speed, spawnRate, pipeVariance, pipeSpace, flapStrength, gravity, maxVelocity, birdStartPercentage, fps) {
        if (speed === void 0) { speed = .75; }
        if (spawnRate === void 0) { spawnRate = 100; }
        if (pipeVariance === void 0) { pipeVariance = .75; }
        if (pipeSpace === void 0) { pipeSpace = .5; }
        if (flapStrength === void 0) { flapStrength = 7.5; }
        if (gravity === void 0) { gravity = 30; }
        if (maxVelocity === void 0) { maxVelocity = 30; }
        if (birdStartPercentage === void 0) { birdStartPercentage = [.15, .50]; }
        if (fps === void 0) { fps = 120; }
        this.Score = 0;
        this.Fps = fps;
        this.Speed = speed;
        this.TotalPipes = 1;
        this.ElaspedFrames = 0;
        this.SpawnRate = spawnRate;
        this.PipeSpace = pipeSpace;
        this.PipeVariance = pipeVariance;
        // Create the flappy bird, using flapStength, gravity, and birdStartPercentage
        this.FlappyBird = new Bird(flapStrength, gravity, maxVelocity, speed, birdStartPercentage, fps);
        // Create the first pipe
        this.Pipes = Array();
        //const startingPipe = new Pipe(speed, pipeVariance, pipeSpace, fps, 0);
        //this.Pipes.push(startingPipe);
        // Setup the inputs
        var jumper = this.FlappyBird.jump.bind(this.FlappyBird);
        window.addEventListener('keydown', jumper);
        // Begin game loop
        this.GameLoop(fps);
    }
    // This calls the tick function, depending on the fps
    Game.prototype.GameLoop = function (fps) {
        var _this = this;
        var interval = 1000 / fps;
        var running = true;
        setInterval(function () {
            if (running) {
                running = _this.update();
            }
        }, interval);
    };
    // Checks for inputs, moves the pipe, bird and checks for collisions
    Game.prototype.update = function () {
        var result = this.FlappyBird.Update(this.Pipes);
        if (result !== -1) {
            // Spawn in a new pipe if its time
            if (this.ElaspedFrames % this.SpawnRate == 0) {
                var tempPipe = new Pipe(this.Speed, this.PipeVariance, this.PipeSpace, this.Fps, this.TotalPipes);
                this.TotalPipes++;
                this.Pipes.push(tempPipe);
            }
            // Move all of the pipes
            this.Pipes.forEach(function (element) {
                element.Update();
            });
            // Add to the counters
            this.ElaspedFrames += 1;
            this.Score += (result === 1) ? 1 : 0;
            // Update the Score counter
            var display = document.getElementById("score-display");
            if (display !== null) {
                display.textContent = "".concat(this.Score);
            }
            return true;
        }
        else {
            return false;
        }
    };
    return Game;
}());
var videojuegos = new Game();
