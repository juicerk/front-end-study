<template>
    <button @click="addTimer()">Add Timer</button>
    <div v-for="timer in timerQueue" :key="timer">
        <h1>{{ timer.remainingTime }}</h1>
        <button @click="handleTimer(timer)">{{ timer.status === false?'Start':'Stop' }}</button>
        <button @click="reset(timer)">Reset</button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Timer 接口定义
interface Timer {
    remainingTime: number,
    timer: any,
    status: boolean
};
const timerQueue = ref<Timer[]>([])
const initTime = 30

function addTimer() {
    const newTimer = {
        remainingTime: initTime,
        timer: null,
        status: false
    }
    timerQueue.value.push(newTimer)
}

function handleTimer(timer:Timer) {
    if (timer.status === false) {
        startTimer(timer)
    } else {
        stopTimer(timer)
    }
}

function startTimer(timer:Timer) {
    timer.status = true
    timer.timer = setInterval(()=>{
        if (timer.remainingTime > 0) {
            timer.remainingTime --;
        } else {
            stopTimer(timer);
        }
    }, 1000);
}

function stopTimer(timer:Timer) {
    timer.status = false;
    if (timer.timer) {
        clearInterval(timer.timer)
        timer.timer = null
    }
    if (timer.remainingTime <= 0) {
        const index = timerQueue.value.indexOf(timer)
        if (index > -1) {
            timerQueue.value.splice(index, 1)
        }
    }
    timer.timer = null
}

function reset(timer:Timer) {
    timer.status = false
    timer.remainingTime = initTime
    if (timer.timer) {
        clearInterval(timer.timer)
        timer.timer = null
    }
}
</script>