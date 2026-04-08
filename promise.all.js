Promise.myall = (promises) =>{
    if(!(typeof promises === 'object' && promises !== null))
        throw new TypeError('type error!');
    promises = [...promises]
    return new Promise((resolve, reject)=>{
        const results = [];
        let resolveCnt = 0;
        if (promises.length === 0)
            resolve([])
        promises.forEach((promise, index)=>{
            Promise.resolve(promise).then(
                (value)=>{
                    resolveCnt ++;
                    results[index] = value;
                    if (resolveCnt == promises.length){
                        resolve(results);
                    }
                }
            )
            .catch(reject);
        })
    })
}

// 验证:
function test(){
    try{
        Promise.myall(null).then(res=>console.log(res), rej=>console.log(rej)); 
        // throw err: null is not iterable
    }catch(e){
        console.log(e)
    }

    try{
        Promise.myall({}).then(res=>console.log(res), rej=>console.log(rej)); 
        // throw err: [object object] is not iterable
    }catch(e){
        console.log(e)
    }    
    
    Promise.myall([]).then(res=>console.log(res), rej=>console.log(rej)); 
    // []
    
    Promise.myall(new Set()).then(res=>console.log(res), rej=>console.log(rej)); 
    // []
    
    Promise.myall(new Map()).then(res=>console.log(res), rej=>console.log(rej)); 
    // []
    
    Promise.myall([
        Promise.resolve(1),
        Promise.resolve(2),
        Promise.resolve(3),
        4,
      ]).then(res=>console.log(res), rej=>console.log(rej))
    
    // [1, 2, 3, 4]
    
    Promise.myall([
        Promise.reject(1),
        Promise.resolve(2),
        Promise.resolve(3),
        4,
      ]).then(res=>console.log(res), rej=>console.log(rej))
    // 1
}
test();