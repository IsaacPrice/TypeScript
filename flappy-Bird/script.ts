class Pipe {
    private Speed: number;
    private Fps: number;

    public Position: [number, number];
    public TopBound: HTMLElement;
    public BottomBound: HTMLElement;
    public id: number;

    constructor(speed: number, pipeVariance: number, pipeSpace: number, fps: number, id: number) {
        this.Speed = speed;
        this.Fps = fps;
        this.id = id;
        
        // Calculate the center 
        const clientHeight: number = window.innerHeight;
        const Difference = clientHeight * pipeVariance; // the center of the pipes is within this
        let Center = Math.random() * Difference; // get a random float 0-1 and multiply it by the difference

        // Create top boundary
        this.TopBound = document.createElement("div");
        this.TopBound.classList.add("pipe-top");
        this.TopBound.style.position = "fixed";
        this.TopBound.style.height = `${clientHeight - (Center + (clientHeight * pipeSpace / 2))}px`;
        this.TopBound.style.top = "0px";
        this.TopBound.style.right = "-100px";
        this.TopBound.id = `${this.id}`;

        // Create the botom boundary
        this.BottomBound = document.createElement("div");
        this.BottomBound.classList.add("bottom-pipe");
        this.BottomBound.style.position = "fixed";
        this.BottomBound.style.height = `${Center - (pipeSpace / 2)}px`;
        this.BottomBound.style.bottom = "0px";
        this.BottomBound.style.right = "-100px";
        this.BottomBound.id = `-${this.id}`;

        // Add the elements to the document
        document.querySelectorAll(".game")[0].appendChild(this.TopBound);
        document.querySelectorAll(".game")[0].appendChild(this.BottomBound);

        // Update the position
        this.Position = [-100, Center];
    }

    // TODO: create a resize function for when the window get resized. This can be mostly taked from the constructor

    // Move the pipe
    Update() {
        this.Position[0] += (1000 / this.Fps) * this.Speed;
        let element = document.getElementById(this.id.toString());
        if (element !== null) {
            element.style.right = `${this.Position[0]}px`;
        }
        element = document.getElementById(`-${this.id}`);
        if (element !== null) {
            element.style.right = `${this.Position[0]}px`
        }

    }
}

class Bird {
    private Fps: number;
    private Speed: number;
    private Gravity: number;
    private Velocity: number;
    private IsPlaying: boolean;
    private MaxVeloctiy: number; 
    private FlapStrength: number;

    public Width: number;
    public Height: number;
    public Position: [number, number];

    constructor(flapStrength: number, gravity: number, maxVelocity: number, speed: number, startingPosition: [number, number], fps: number) {
        this.Fps = fps;
        this.Velocity = 0;
        this.Speed = speed;
        this.IsPlaying = true
        this.Gravity = gravity;
        this.Width = this.Height;
        this.MaxVeloctiy = maxVelocity;
        this.FlapStrength = flapStrength;
        this.Height = window.innerHeight / 15;
        this.Position = [window.innerWidth * startingPosition[0], window.innerHeight * startingPosition[1]];

        // Create the html element of the flappy bird
        let temp = document.createElement("div");
        temp.classList.add("bird");
        temp.id = "bird";
        temp.style.position = "absolute";
        temp.style.top = `${window.innerHeight - this.Position[1]}px`;
        temp.style.left = `${this.Position[0]}px`;
        temp.style.height = `${this.Height}px`;
        temp.style.width = `${this.Width}px`;

        // Add the bird to the document
        document.querySelectorAll(".game")[0].appendChild(temp);
    }

    // Takes all of the pipes, and also if the user jumped
    // Returns 1 for getting a point, 0 if nothing happend, and -1 if the bird crashes
    public Update(pipes: Array<Pipe>): number {

        // Update position
        this.Velocity = (Math.abs(this.Velocity) < this.MaxVeloctiy) ? this.Velocity - ((1 / this.Fps) * this.Gravity) : -1 * this.MaxVeloctiy;
        this.Position[1] += this.Velocity;
        const birdy = document.getElementById("bird");
        if (birdy !== null) {
            birdy.style.top = `${window.innerHeight - this.Position[1]}px`;
        }

        // Check for collisions with both the ground and pipes, along with if the user has earned a point
        const distance: number = this.Speed * 5;
        let tempPoints: number = 0;
        pipes.forEach(element => {
            if (this.CheckCollision(element.BottomBound) || this.CheckCollision(element.TopBound)) {
                this.IsPlaying = false;
            }
            else if (this.Xdistance(element.TopBound) < distance) {
                tempPoints += 1;
            }
        })

        // Return the events the happened
        if (!this.IsPlaying) {
            return -1;
        }
        else if (tempPoints > 0) {
            return 1;
        }
        return 0;
    }


    // Function to check if two objects are colliding
    private CheckCollision(object: HTMLElement): boolean {
        // Get the object borders
        const obj = document.getElementById("bird");
        const rect2 = object.getBoundingClientRect();

        // Check if they are colliding
        if (obj !== null) {
            const rect1 = obj.getBoundingClientRect();
            return !(rect2.left > rect1.right || 
                    rect2.right < rect1.left || 
                    rect2.top > rect1.bottom ||
                    rect2.bottom < rect1.top);
        }
        else {
            return false;
        }
    }  

    private Xdistance(object: HTMLElement): number {
        // Get the object borders
        const obj = document.getElementById("bird");
        const rect2 = object.getBoundingClientRect();

        // Return the difference of the x values
        if (obj !== null) {
            const rect1 = obj.getBoundingClientRect();
            const center1 = (rect1.left + rect1.right) / 2;
            const center2 = (rect2.left + rect2.right) / 2;
            return Math.abs(center1 - center2);
        }
        else {
            return -1;
        }
    }

    public jump() {
        this.Velocity = this.FlapStrength;
    }
}

class Game {
    private Speed: number;
    private SpawnRate: number;
    private PipeVariance: number;
    private PipeSpace: number;
    private Score: number;
    private Fps: number;
    private ElaspedFrames: number; 

    private FlappyBird: Bird;
    private Pipes: Array<Pipe>;
    private TotalPipes: number;

    constructor(speed: number = .75, 
                spawnRate: number = 100, 
                pipeVariance: number = .75,  
                pipeSpace: number = .5,    
                flapStrength: number = 7.5, 
                gravity: number = 30,
                maxVelocity: number = 30, 
                birdStartPercentage: [number, number] = [.15, .50], 
                fps: number = 120) { 

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
        this.Pipes = Array<Pipe>();

        // Setup the inputs
        const jumper = this.FlappyBird.jump.bind(this.FlappyBird);
        window.addEventListener('keydown', jumper);

        // Begin game loop
        this.GameLoop(fps);
    }

    // This calls the tick function, depending on the fps
    private GameLoop(fps: number) { 
        const interval = 1000 / fps;
        let running = true;

        setInterval(() => {
            if (running) {
                running = this.update();
            }
        }, interval);
    }

    // Checks for inputs, moves the pipe, bird and checks for collisions
    private update(): boolean {
        let result: number = this.FlappyBird.Update(this.Pipes);

        if (result !== -1) {

            // Spawn in a new pipe if its time
            if (this.ElaspedFrames % this.SpawnRate == 0) {
                const tempPipe = new Pipe(this.Speed, this.PipeVariance, this.PipeSpace, this.Fps, this.TotalPipes);
                this.TotalPipes++;
                this.Pipes.push(tempPipe);
            }

            // Move all of the pipes
            this.Pipes.forEach(element => {
                element.Update();
            });

            // Add to the counters
            this.ElaspedFrames += 1;
            this.Score += (result === 1) ? 1 : 0;

            // Update the Score counter
            const display: HTMLElement | null = document.getElementById("score-display");
            if (display !== null) {
                display.textContent = `${this.Score}`;
            }

            return true;   
        } 
        else {
            return false;
        }
    }
}

let videojuegos: Game = new Game();
