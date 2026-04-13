let str = 'hello-world'

function solve(str) {
    return str.replace(/-([a-z])/g,(_, match)=>{
        return match.toUpperCase();
    })
}

console.log(solve(str));

function solveCamel(str) {
    return str.replace(/[A-Z]/g, (sub) =>{
        return '-' + sub.toLowerCase();
    })
}

let str1 = 'helloWorldGo'
console.log(solveCamel(str1));