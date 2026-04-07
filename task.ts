type TaskFunction = () => Promise<any>

interface TaskItem {
    id: number
    task: TaskFunction
    status: 'pending' | 'running' | 'completed' | 'failed'
}

class TaskManager {
    maxTaskCount: number = 2
    nowTaskCount: number = 0
    taskQueue: TaskItem[] = []
    private nextId: number = 1

    constructor(maxConcurrency: number = 2) {
        this.maxTaskCount = maxConcurrency
    }

    addTask(task: TaskFunction): number {
        const taskItem: TaskItem = {
            id: this.nextId++,
            task,
            status: 'pending'
        }

        if (this.nowTaskCount < this.maxTaskCount) {
            this.nowTaskCount++
            this.processTask(taskItem)
        } else {
            this.taskQueue.push(taskItem)
        }

        return taskItem.id
    }

    private async processTask(taskItem: TaskItem): Promise<void> {
        taskItem.status = 'running'

        taskItem.task()
            .then(()=>{
                taskItem.status = 'completed'
            })
            .catch(()=>{
                taskItem.status = 'failed'
            })
            .finally(()=>{
                this.nowTaskCount --
                this.processNextTask()
            })
    }

    private processNextTask(): void {
        if (this.taskQueue.length > 0 && this.nowTaskCount < this.maxTaskCount) {
            const nextTask = this.taskQueue.shift()
            if (nextTask) {
                this.nowTaskCount++
                this.processTask(nextTask)
            }
        }
    }

    getStats() {
        return {
            maxTaskCount: this.maxTaskCount,
            nowTaskCount: this.nowTaskCount,
            queueLength: this.taskQueue.length
        }
    }
}

export default TaskManager