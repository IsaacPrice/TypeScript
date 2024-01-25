interface Task {
    id: number,
    title: string,
    description: string,
    completed: boolean
}

interface UncompletedTask {
    title: string,
    description: string,
    completed: boolean
}

class TaskManager {
    public tasks: Array<Task>;

    // Constructor for a list of tasks
    constructor(items: UncompletedTask[]) {
        this.tasks = Array<Task>();

        // Loop through and add all of the items with their respecive IDs
        items.forEach((item) => {
            this.tasks.push(this.completeTask(item));
        });

        console.log(this.tasks.length)
    }

    // Adds another item to the list
    AppendTask(item: UncompletedTask): void {
        this.tasks.push(this.completeTask(item));
    }

    // Will print a single task onto the console
    private displayTask(item: Task): void {
        console.log(item.title + " (" + item.id + ")");
        console.log("--------------------");
        console.log("Completed: " + item.completed);
        console.log(item.description + '\n');
    }

    // Will take an uncompleted class, and add the id to make it a Task
    private completeTask(item: UncompletedTask): Task {
        let temp: Task = {
            id: this.tasks.length,
            title: item.title,
            description: item.description,
            completed: item.completed
        }
        return temp;
    }


    // Shows all of the tasks 
    DisplayTasks(): void {
        this.tasks.forEach((task) => this.displayTask(task))
    }

    // Delete a certain task
    DeleteTask(id: number): boolean {
        this.displayTask(this.tasks[id])
        return false;
    }
}

let tempTask: UncompletedTask = {
    title: "Sit Down",
    description: "Go and find a chair and sit in it for at least 10 seconds",
    completed: false
};

let todoList: TaskManager = new TaskManager([tempTask, tempTask, tempTask]);

todoList.DisplayTasks();