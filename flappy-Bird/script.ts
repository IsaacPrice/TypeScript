class Pipe {
    private Speed: number;

    public Position: number;
    public TopBound: HTMLElement;
    public BottomBount: HTMLElement;

    constructor(speed: number, pipeVariance: number) {
        this.Speed = speed;

        const Difference = (document.body.clientHeight / 100) * pipeVariance; // the center of the pipes is within this
        let Center = Math.random() * Difference; // get a random float 0-1 and multiply it by the difference
        Center += ((100 - pipeVariance) / 2); // Add padding to the center
        console.log(`Center of the pipes is at ${Center}px.`);

        // TODO: Create top boundary

        // TODO: Create bottom boundary

    }
}

class Bird {
    private Gravity: number;
    private htmlElement: HTMLElement;
    private FlapStrength: number;

    public Height: number;
    public Position: number;

    constructor(flapStrength: number, gravity: number, startingPosition: number) {
        this.FlapStrength = flapStrength;
        this.Gravity = gravity;
        this.Position = startingPosition;
        this.Height = document.body.clientHeight / 10;

        // Create the html element of the flappy bird
        let temp = document.createElement("div");
        temp.classList.add("bird");
        temp.style.height = `${this.Height}px`;
        this.htmlElement = document.querySelectorAll(".game")[0].appendChild(temp);
    }

    // This takes all of the pipes, and also if the user jumped, and returns 1 for getting a point, 0 if nothing happend, and -1 if the bird crashes
    Update(pipes: Array<Pipe>, jumped: boolean = false): number {
        // Create temporary new positions
        
        // Check for collisions with both the ground and pipes

        // Determine if the user has earned a point

        // Return the specified value
        return 0;
    }

}


class Game {
    private Speed: number;
    private SpawnRate: number;
    private PipeVariance: number;
    private PipeSpace: number;
    private Score: number;
    private height: number;
    private width: number;

    constructor(speed: number = 1, spawnRate: number = 1, pipeVariance: number = 75, pipeSpace: number = 20, flapStrength: number = 25, gravity: number = 9.8, birdStartPercentage: number = 50) {
        this.Speed = speed;
        this.SpawnRate = spawnRate;
        this.PipeVariance = pipeVariance;
        this.PipeSpace = pipeSpace;

        // Create the flappy bird, using flapStength, gravity, and birdStartPercentage
        // Create the first pipe
        // Begin game loop
    }
}