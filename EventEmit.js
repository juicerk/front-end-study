class EventEmit{
    constructor(){
        this.events = []
    }
    on(name, callback) {
        if (!this.events[name]) {
            this.events[name] = []
        }
        this.events[name].push(callback);
    }

    off(name, callback) {
        if (!this.events[name]) {
            return;
        }
        if (!callback) {
            this.events[name] = undefined;
        }
        this.events[name] = this.events[name].filter((item)=>{item !== callback})
    }

    emit(name, ...avgs) {
        if (!this.events[name]) return;
        this.events[name].forEach(cb => {
            cb(...avgs)
        });
    }
}

const e = new EventEmit();

function fn1(a, b) {
  console.log("fn1", a, b);
}
function fn2(a, b) {
  console.log("fn2", a, b);
}
function fn3(a, b) {
  console.log("fn3", a, b);
}

e.on("key1", fn1);
e.on("key1", fn2);
e.on("key2", fn3);

e.emit("key1", 10, 20); // 触发 fn1、fn2、fn3
e.emit("key1", 11, 22); // 触发 fn1、fn2

e.off("key1", fn1); // 解绑 fn1

e.emit("key1", 100, 200); // 触发 fn2