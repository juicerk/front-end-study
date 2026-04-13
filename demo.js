function sum() {
    let sum = 0;
    for (let i = 0;i < arguments.length;i ++) {
        sum += arguments[i];
    }
    return sum;
}

const sum1 = function() {
    let sum = 0;
    for (let i = 0;i < arguments.length;i ++) {
        sum += arguments[i];
    }
    return sum;
}

// console.log(sum1(1,2,3,4))

function unique(arr) {
    return arr.filter((item,index,arr)=>{
        if (arr.indexOf(item) === index) {
            return true;
        }
    })
}

// var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
//         console.log(unique(arr))


let input = [
    {
        id: 1, val: '学校', parentId: null
    }, {
        id: 2, val: '班级1', parentId: 1
    }, {
        id: 3, val: '班级2', parentId: 1
    }, {
        id: 4, val: '学生1', parentId: 2
    }, {
        id: 5, val: '学生2', parentId: 2
    }, {
        id: 6, val: '学生3', parentId: 3
    }
]

const sourceData = [{
  "id": 1,
  "parentId": 0,
  "name": "测试1",
}, {
  "id": 2,
  "parentId": 1,
  "name": "测试2",
}, {
  "id": 3,
  "parentId": 1,
  "name": "测试3",
}, {
  "id": 4,
  "parentId": 2,
  "name": "测试4",
}, {
  "id": 5,
  "parentId": 2,
  "name": "测试5",
}, {
  "id": 6,
  "parentId": 3,
  "name": "测试6",
}, {
  "id": 7,
  "parentId": 0,
  "name": "测试7",
}, {
  "id": 8,
  "parentId": 7,
  "name": "测试8",
}];

function arrToTree(input) {
    const map = new Map();
    input.forEach((node)=>{
        map.set(node.id,{...node,children:[]});
    });
    const root = [];
    input.forEach((node)=>{
        let curnode = map.get(node.id);
        let parentId = curnode.parentId;
        if (parentId === null) {
            root.push(curnode);
        } else {
            map.get(parentId).children.push(curnode);
        }
    })
    return root;
}


const tree = arrToTree(input);
// console.log(tree[0].children[0].children)

async function async1() {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}

async function async2() {
  console.log('async2')
}

console.log('script start')
setTimeout(function () {
  console.log('settimeout')
})
async1()
new Promise(function (resolve) {
  console.log('promise1')
  resolve()
}).then(function () {
  console.log('promise2')
})
console.log('script end')

// res
/*
script start
async1 start
async2
promise1
script end
async1 end
promise2
settimeout
*/



// start
// 3
// 4
// 6
// 8
// 1
// 2
// 7