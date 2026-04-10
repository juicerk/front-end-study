Array.prototype.map = function (callcal) {
    const res = [];
    for (let i = 0;i < this.length;i ++) {
        res.push(callcal(this[i], i, this));
    }
    return res;
}

const arr = [1, 2, 3];

const res = arr.map((ele, index, arr)=>{
    return ele * 2;
})

console.log(res);