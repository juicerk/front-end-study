<template>
  <div>
    <h1>组件测试页面</h1>
    <p>如果你能看到这行文字，说明 Vue 正常工作</p>
    <ParentComponent />
    <nextTickTest />
  </div>
</template>

<script setup>
import ParentComponent from './Components/ParentComponent.vue'
import nextTickTest from './Components/nextTickTest.vue';
console.log('test-componets.vue 已加载')
</script>