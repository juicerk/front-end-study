function myInstanceof(left, right) {
    let proto = Object.getPrototypeOf(left);
    let prototype = right.prototype;

    while (true) {
        if (!proto) return false;
        if (proto === prototype) return true;
        proto = Object.getPrototypeOf(proto);
    }
}

function Person() { };
var p = new Person();
console.log(myInstanceof(p, Object));
//所有函数的原型默认继承自 Object.prototype
// 因此返回true