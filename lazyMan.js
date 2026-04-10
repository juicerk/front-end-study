// LazyMan('Hank”)输出:
// Hi! This is Hank!

// LazyMan('Hank”).sleep(10).eat('dinner”)输出
// Hi! This is Hank!
// //等待10秒..
// Wake up after 10
// Eat dinner~

// LazyMan('Hank”).eat('dinner”).eat('supper”)输出
// Hi This is Hank!
// Eat dinner~
// Eat supper~


function LazyMan(name) {
    this.queue = [];
    const fn = function() {
        setTimeout(()=>{
            console.log(`Hi This is ${name}!`);
            this.next();
        },0);
    }
    this.queue.push(fn);
    this.eat = function(food) {
        const fn = function() {
            setTimeout(()=>{
                console.log(`Eat ${food}!`);
                this.next();
            },0);
        }
        this.queue.push(fn);
        return this;
    }
    this.sleep = function(seconds) {
        const fn = function() {
            setTimeout(()=>{
                console.log(`Wake up after ${seconds}`);
                this.next();
            },seconds*1000);
        }
        this.queue.push(fn);
        return this;
    }
    this.sleepFirst = function(seconds) {
        const fn = function() {
            setTimeout(()=>{
                console.log(`Wake up after ${seconds}`);
                this.next();
            },seconds* 1000);
        }
        this.queue.unshift(fn);
        return this;
    }
    this.next = function() {
        if (this.queue.length === 0) return;
        this.queue.shift()();
        return this;
    }
    setTimeout(()=>{
        this.next();
    },0)
    return this;
}

// LazyMan('Hank').sleepFirst(3).eat('supper')
// //等待5秒
// Wake up after 5
// Hi This is Hank!
// Eat supper
// 以此类推
// LazyMan('Hank').eat('dinner').eat('supper')

LazyMan('Hank').sleep(10).eat('dinner')