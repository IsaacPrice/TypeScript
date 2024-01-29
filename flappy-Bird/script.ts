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
        Center += ((clientHeight * (1 - pipeVariance)) / 2); // Add padding to the center

        // Create top boundary
        this.TopBound = document.createElement("div");
        this.TopBound.classList.add("pipe-top");
        this.TopBound.style.position = "fixed";
        this.TopBound.style.height = `${clientHeight - (Center + (clientHeight * pipeSpace / 2))}px`;
        this.TopBound.style.top = "0px";
        this.TopBound.style.right = "-100px";
        this.TopBound.style.transition = `all linear ${1000 / fps}ms`;
        this.TopBound.id = `${this.id}`;

        // Create the botom boundary
        this.BottomBound = document.createElement("div");
        this.BottomBound.classList.add("bottom-pipe");
        this.BottomBound.style.position = "fixed";
        this.BottomBound.style.height = `${Center - (pipeSpace / 2)}px`;
        this.BottomBound.style.bottom = "0px";
        this.BottomBound.style.right = "-100px";
        this.BottomBound.style.transition = `all linear ${1000 / fps}ms`
        this.BottomBound.id = `-${this.id}`;

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
    private Gravity: number;
    private Velocity: number;
    private FlapStrength: number;
    private Speed: number;
    private IsPlaying: boolean;
    private Fps: number;
    private htmlElement: HTMLElement;

    public Width: number;
    public Height: number;
    public Position: [number, number];

    constructor(flapStrength: number, gravity: number, speed: number, startingPosition: [number, number], fps: number) {
        this.FlapStrength = flapStrength;
        this.Gravity = gravity;
        this.Speed = speed;
        this.Position = startingPosition;
        this.Height = document.body.clientHeight / 10;
        this.Width = this.Height;
        this.Fps = fps;

        // Create the html element of the flappy bird
        let temp = document.createElement("div");
        temp.classList.add("bird");
        temp.style.height = `${this.Height}px`;
        temp.style.width = `${this.Width}px`;
        temp.id = "bird";
        temp.style.transition = `all linear ${1000 / fps}ms`;
        temp.style.bottom = `${startingPosition[1] * document.body.clientHeight}px`;
        temp.style.left = `${startingPosition[0] * document.body.clientWidth}px`;
        this.htmlElement = temp;

        // Add the bird to the document
        document.querySelectorAll(".game")[0].appendChild(this.htmlElement);
    }

    // This takes all of the pipes, and also if the user jumped
    // Returns 1 for getting a point, 0 if nothing happend, and -1 if the bird crashes
    public Update(pipes: Array<Pipe>): number {

        // Update position
        this.Velocity -= (1000 / this.Fps) * this.Gravity;
        this.Position[1] += this.Velocity;
        let birdy = document.getElementById("bird");
        if (birdy !== null) {
            birdy.style.bottom = `${this.Position[1]}px`;
        }

        // Check for collisions with both the ground and pipes, along with if the user has earned a point
        const distance: number = this.Speed / 2;
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
        const rect1 = document.querySelectorAll(".bird")[0].getBoundingClientRect();
        const rect2 = object.getBoundingClientRect();

        // Check if they are colliding
        return !(rect2.left > rect1.right || 
            rect2.right < rect1.left || 
            rect2.top > rect1.bottom ||
            rect2.bottom < rect1.top);
    }  

    private Xdistance(object: HTMLElement): number {
        // Get the object borders
        const rect1 = document.querySelectorAll("bird")[0].getBoundingClientRect();
        const rect2 = object.getBoundingClientRect();

        // Return the difference of the x values
        const center1 = (rect1.left + rect1.right) / 2;
        const center2 = (rect2.left + rect2.right) / 2;
        return Math.abs(center1 - center2);
    }

    public jump() {
        this.Velocity += this.FlapStrength;
    }
}


class Game {
    private Speed: number;
    private SpawnRate: number;
    private PipeVariance: number;
    private PipeSpace: number;
    private Gravity: number;
    private Score: number;
    private Fps: number;
    private ElaspedFrames: number; 

    private FlappyBird: Bird;
    private Pipes: Array<Pipe>;
    private TotalPipes: number;

    constructor(speed: number = .75, 
                spawnRate: number = 1, 
                pipeVariance: number = .75, 
                pipeSpace: number = .50,    
                flapStrength: number = 25, 
                gravity: number = 9.8, 
                birdStartPercentage: [number, number] = [.15, .50], 
                fps: number = 60) {

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
        this.Pipes = Array<Pipe>();
        const startingPipe = new Pipe(speed, pipeVariance, pipeSpace, fps, 0);
        this.Pipes.push(startingPipe);

        // Setup the inputs
        const jumper = this.FlappyBird.jump;
        window.addEventListener('keydown', jumper);

        // Begin game loop
        this.GameLoop(fps);
    }

    // This calls the tick function, depending on the fps
    private GameLoop(fps: number) {
        const interval = 1000 / fps;

        setInterval(() => {
            this.update();
        }, interval);
    }

    // Checks for inputs, moves the pipe, bird and checks for collisions
    private update() {
        this.FlappyBird.Update(this.Pipes);
        this.Pipes.forEach(element => {
            element.Update();
        });
    }
}

let videojuegos: Game = new Game();
