var Pipe = /** @class */ (function () {
    function Pipe(speed, pipeVariance, pipeSpace, fps, id) {
        this.Speed = speed;
        this.Fps = fps;
        this.id = id;
        // Calculate the center 
        var clientHeight = window.innerHeight;
        var Difference = clientHeight * pipeVariance; // the center of the pipes is within this
        var Center = Math.random() * Difference; // get a random float 0-1 and multiply it by the difference
        Center += ((clientHeight * (1 - pipeVariance)) / 2); // Add padding to the center
        // Create top boundary
        this.TopBound = document.createElement("div");
        this.TopBound.classList.add("pipe-top");
        this.TopBound.style.position = "fixed";
        this.TopBound.style.height = "".concat(clientHeight - (Center + (clientHeight * pipeSpace / 2)), "px");
        this.TopBound.style.top = "0px";
        this.TopBound.style.right = "-100px";
        this.TopBound.style.transition = "all linear ".concat(1000 / fps, "ms");
        this.TopBound.id = "".concat(this.id);
        // Create the botom boundary
        this.BottomBound = document.createElement("div");
        this.BottomBound.classList.add("bottom-pipe");
        this.BottomBound.style.position = "fixed";
        this.BottomBound.style.height = "".concat(Center - (pipeSpace / 2), "px");
        this.BottomBound.style.bottom = "0px";
        this.BottomBound.style.right = "-100px";
        this.BottomBound.style.transition = "all linear ".concat(1000 / fps, "ms");
        this.BottomBound.id = "-".concat(this.id);
        // debug stuff
        console.log(this.BottomBound.style.height);
        console.log(this.BottomBound.style.height);
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
    function Bird(flapStrength, gravity, speed, startingPosition, fps) {
        this.FlapStrength = flapStrength;
        this.Gravity = gravity;
        this.Speed = speed;
        this.Position = startingPosition;
        this.Height = document.body.clientHeight / 10;
        this.Width = this.Height;
        this.Fps = fps;
        // Create the html element of the flappy bird
        var temp = document.createElement("div");
        temp.classList.add("bird");
        temp.style.height = "".concat(this.Height, "px");
        temp.style.width = "".concat(this.Width, "px");
        temp.id = "bird";
        temp.style.transition = "all linear ".concat(1000 / fps, "ms");
        temp.style.bottom = "".concat(startingPosition[1] * document.body.clientHeight, "px");
        temp.style.left = "".concat(startingPosition[0] * document.body.clientWidth, "px");
        this.htmlElement = temp;
        // Add the bird to the document
        document.querySelectorAll(".game")[0].appendChild(this.htmlElement);
    }
    // This takes all of the pipes, and also if the user jumped
    // Returns 1 for getting a point, 0 if nothing happend, and -1 if the bird crashes
    Bird.prototype.Update = function (pipes) {
        var _this = this;
        // Update position
        this.Velocity -= (1000 / this.Fps) * this.Gravity;
        this.Position[1] += this.Velocity;
        var birdy = document.getElementById("bird");
        if (birdy !== null) {
            birdy.style.bottom = "".concat(this.Position[1], "px");
        }
        // Check for collisions with both the ground and pipes, along with if the user has earned a point
        var distance = this.Speed / 2;
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
        var rect1 = document.querySelectorAll(".bird")[0].getBoundingClientRect();
        var rect2 = object.getBoundingClientRect();
        // Check if they are colliding
        return !(rect2.left > rect1.right ||
            rect2.right < rect1.left ||
            rect2.top > rect1.bottom ||
            rect2.bottom < rect1.top);
    };
    Bird.prototype.Xdistance = function (object) {
        // Get the object borders
        var rect1 = document.querySelectorAll("bird")[0].getBoundingClientRect();
        var rect2 = object.getBoundingClientRect();
        // Return the difference of the x values
        var center1 = (rect1.left + rect1.right) / 2;
        var center2 = (rect2.left + rect2.right) / 2;
        return Math.abs(center1 - center2);
    };
    Bird.prototype.jump = function () {
        this.Velocity += this.FlapStrength;
    };
    return Bird;
}());
var Game = /** @class */ (function () {
    function Game(speed, spawnRate, pipeVariance, pipeSpace, flapStrength, gravity, birdStartPercentage, fps) {
        if (speed === void 0) { speed = .75; }
        if (spawnRate === void 0) { spawnRate = 1; }
        if (pipeVariance === void 0) { pipeVariance = .75; }
        if (pipeSpace === void 0) { pipeSpace = .50; }
        if (flapStrength === void 0) { flapStrength = 25; }
        if (gravity === void 0) { gravity = 9.8; }
        if (birdStartPercentage === void 0) { birdStartPercentage = [.15, .50]; }
        if (fps === void 0) { fps = 60; }
        this.Speed = speed;
        this.SpawnRate = spawnRate;
        this.PipeVariance = pipeVariance;
        this.PipeSpace = pipeSpace;
        this.Gravity = gravity;
        this.Score = 0;
        this.Fps = fps;
        this.ElaspedFrames = 0;
        this.TotalPipes = 1;
        // Create the flappy bird, using flapStength, gravity, and birdStartPercentage
        this.FlappyBird = new Bird(flapStrength, gravity, speed, birdStartPercentage, fps);
        // Create the first pipe
        this.Pipes = Array();
        var startingPipe = new Pipe(speed, pipeVariance, pipeSpace, fps, 0);
        this.Pipes.push(startingPipe);
        // Setup the inputs
        var jumper = this.FlappyBird.jump;
        window.addEventListener('keydown', jumper);
        // Begin game loop
        this.GameLoop(fps);
    }
    // This calls the tick function, depending on the fps
    Game.prototype.GameLoop = function (fps) {
        var _this = this;
        var interval = 1000 / fps;
        setInterval(function () {
            _this.update();
        }, interval);
    };
    // Checks for inputs, moves the pipe, bird and checks for collisions
    Game.prototype.update = function () {
        this.FlappyBird.Update(this.Pipes);
        this.Pipes.forEach(function (element) {
            element.Update();
        });
    };
    return Game;
}());
var videojuegos = new Game();
