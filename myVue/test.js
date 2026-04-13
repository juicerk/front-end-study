import {effectWatch, reactivity} from './core/reactivity/index.js'

let user = reactivity({age:18,name:"bob"});

let double_age, nick_name;
effectWatch(()=>{
    double_age = user.age * 2;
    nick_name = "nick name:" + user.name;
    console.log(double_age);
    console.log(nick_name);
})

user.age = 20;
user.name = "john";