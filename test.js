// function useArray() {
//     return Array.prototype.filter.call(arguments, (item)=>{
//         return item>=3;
//     })
// }

// const res = useArray(1,2,3,4,5)


// const arr = [1,2,3,4]

// const res = Math.max.apply(null,arr)

// console.log(res)

var arr = [1, [2, [3, 4]]];

function flatten(arr) {
    let res = [];
    arr.forEach((item)=>{
        if (Array.isArray(item)) {
            res = res.concat(flatten(item));
        } else {
            res.push(item);
        }
    })
    return res;
}

console.log(flatten(arr));