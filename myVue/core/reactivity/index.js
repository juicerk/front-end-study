let currentEffect = null;
class Dep {
    constructor(value) {
        this.effects = new Set();
        this._val = value;
    }

    get value(){
        this.depend();
        return this._val;
    }

    set value(newValue) {
        this._val = newValue
        this.notice();
    }

    // 收集依赖
    depend() {
        if (currentEffect) {
            this.effects.add(currentEffect);
        }
    }

    // 触发依赖
    notice() {
        this.effects.forEach(effect=>{
            effectWatch(effect);
        })
    }
}

// const dep = new Dep(10);

export function effectWatch(effect) {
    currentEffect = effect;
    effect();
    currentEffect = null;
}

// let b;

// effectWatch(()=>{
//     b = dep.value + 10;
//     console.log(b);
// })

// dep.value += 10;

function getDep(target, key) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }

    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Dep();
        depsMap.set(key, dep);
    }
    return dep;
}

let targetMap = new Map();

export function reactivity(raw) {
    return new Proxy(raw,{
        get(target, key) {
            let dep = getDep(target, key); 
            dep.depend();
            return Reflect.get(target, key);
        },
        set(target, key, value) {
            let dep = getDep(target,key);
            
            const result = Reflect.set(target,key,value);
            dep.notice();
            return result;
        }
    })
}

// const user = reactivity({
//     age:18,
// })

// let double;

// effectWatch(()=>{
//     double = user.age;
//     console.log(double);
// })

// user.age ++;