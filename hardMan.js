hardMan('潘潘')
//> Hi! I am 潘潘.
hardMan('潘潘').study('敲码')
//> Hi! I am 潘潘.
//> I am studying 敲码.
hardMan('潘潘').rest(3).study('敲码')
//> Hi! I am 潘潘.
// 此时等待三秒钟
//> Wait 3 seconds.
//> I am studying 敲码.
hardMan('潘潘').restFirst(3).study('敲码')
// 此时等待三秒钟
//> Wait 3 seconds.
//> Hi! I am 潘潘.
//> I am studying 敲码.


function hardMan(name) {
    function sleep(d) {
        const start = Date.now();
        while ((Date.now()-start) < d*1000) { }
        console.log(`Wait ${d} seconds.`)
    }
    setTimeout(()=>{
        console.log(`Hi! I am ${name}.`)
    },0);
    this.study = function(things) {
        setTimeout(()=>{
            console.log(`I am studying ${things}.`);
        },0);
        return this;
    }
    this.rest = function(seconds) {
        setTimeout(()=>{
            sleep(seconds);
        },0);
        return this;
    }
    this.restFirst = function(seconds) {
        sleep(seconds);
        return this;
    }
    return this;
}

function hardMan(name) {    
    this.queue = [];
    const fn = () =>{
        setTimeout(()=>{
            console.log(`Hi! I am ${name}.`)
            this.next();
        },0)
    };
    this.queue.push(fn);
    this.study = function(things) {
        const fn = () => {
            setTimeout(()=>{
                console.log(`I am studying ${things}.`)
                this.next();
            },0)
        }
        this.queue.push(fn);
        return this;
    }
    this.rest = function(seconds) {
        const fn = () =>{
            setTimeout(()=>{
                console.log(`Wait ${seconds} seconds.`)
                this.next();
            },seconds * 1000);
        }
        this.queue.push(fn);
        return this;
    }
    this.restFirst = function(seconds) {
        const fn = () =>{
            setTimeout(()=>{
                console.log(`Wait ${seconds} seconds.`)
                this.next();
            },seconds * 1000);
        }
        this.queue.unshift(fn);
        return this;
    }
    this.next = () => {
        if (this.queue.length == 0) return;
        this.queue.shift()();
    }
    setTimeout(()=>{
        this.next();
    },0)
    return this;
}