<template>
    <ChildrenComponent @sendEvent="needtosolve"/>
</template>

<script setup>
import ChildrenComponent from './ChildrenComponent.vue';

function needtosolve(p1,p2,p3) {
    console.log(p1,p2,p3);
}
</script>