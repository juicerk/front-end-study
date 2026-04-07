<template>
  <div>
    <h1>{{remianTime}}</h1>
    <button @click = "handleTimer()"> {{timeStatus==false?'Start':'Stop'}} </button>
    <button @click = "reset()"> Reset </button>
  </div>
</template>

<script setup >
import { ref } from 'vue'
const remianTime = ref(0);
const initTime = 30;
const timeStatus = ref(false);
let timer = null;

function handleTimer() {
    if (timeStatus.value === false) {
        startTimer();
    } else {
        stopTimer();
    }
}

function startTimer() {
    timeStatus.value = true;
    if (timer === null) {
        if (remianTime.value <= 0) remianTime.value = initTime;
    }
    timer = setInterval(()=>{
        if (remianTime.value <= 0) {
            stopTimer();
        }
        remianTime.value --;
    },1000)
}

function stopTimer() {
    timeStatus.value = false;
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

function reset() {
    timeStatus.value = false;
    remianTime.value = 0;
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}
</script>