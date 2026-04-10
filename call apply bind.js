Function.prototype.myCall = function(thisArg, ...args) {
    let isValid = thisArg !== null || thisArg != undefined
    if (isValid) {
        thisArg = Object(thisArg);
    } else {
        // 无效（null 或 undefined）：默认指向全局对象
        if (typeof window !== undefined) {
            // 浏览器环境
            thisArg = window;
        } else {
            // Node.js环境
            thisArg = global;
        }
    }
    const fn = Symbol('temp');

    thisArg[fn] = this;

    const result = thisArg[fn](...args)

    delete thisArg[fn];

    return result;
}

Function.prototype.myApply = function (thisArg, args = []) {
    const isValid = thisArg !== null && thisArg != undefined
    if (isValid) {
        thisArg = Object(thisArg);
    } else {
        if (typeof window !== undefined) {
            thisArg = window;
        } else {
            thisArg = global;
        }
    }

    const fn = Symbol('temp');
    
    thisArg[fn] = this;

    const res = thisArg[fn](...args);

    delete thisArg[fn];
    
    return res;
}

Function.prototype.myBind(thisArg, ...args) {
    const fn = this;
    return function(...callArgs) {
        return fn.myCall(fn, ...args, ...callArgs);
    }
}