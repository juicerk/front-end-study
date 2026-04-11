<template>
    <div>
        <button @click="sendData()">Send message</button>
    </div>
</template>

<script setup>
const emit = defineEmits(['sendEvent'])
function sendData() {
    emit('sendEvent','abc','bcd','efgggg');
}
</script>