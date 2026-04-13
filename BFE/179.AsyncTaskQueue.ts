class AsyncTaskQueue {
    max_size:number = 0;
    cur_size:number = 0;
    task_queue: (() => Promise<void>)[] = [];
    constructor(concurrency: number) {
        // Initialize the queue with the specified concurrency limit
        this.max_size = concurrency;
        this.task_queue = [];
    }
    queue(task: () => Promise<void>) {
        // Add an async task to the queue
        return new Promise(()=>{
            if (this.cur_size >= this.max_size) {
                this.task_queue.push(task);
            } else {
                this.runTask(task);
            }
        });
    }
    runTask(task: () =>Promise<void>) {
        this.cur_size += 1;
        task().then().catch().finally(()=>{
            this.cur_size --;
            this.runTaskFromQueue();
        })
    }
    runTaskFromQueue() {
        if (this.max_size > 0 && this.task_queue.length > 0) {
            const fist_task = this.task_queue.shift()
            this.runTask(fist_task)
        }
    }
}

const queue = new AsyncTaskQueue(2); // Allow up to 2 tasks to run concurrently
// Example async tasks
const task1 = () => new Promise((resolve) => setTimeout(() => resolve("Task 1 done"), 1000));
const task2 = () => new Promise((resolve, reject) => setTimeout(() => reject("Task 2 failed"), 500));
const task3 = () => new Promise((resolve) => setTimeout(() => resolve("Task 3 done"), 200));
// Queue tasks
queue.queue(task1); // Starts immediately
queue.queue(task2); // Starts immediately (concurrency = 2)
queue.queue(task3); // Waits until one of the first two tasks completes