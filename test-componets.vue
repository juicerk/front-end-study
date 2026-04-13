<template>
  <div>
    <h1>组件测试页面</h1>
    <p class="test-p">如果你能看到这行文字，说明 Vue 正常工作</p>
    <GrandParentComponent />
    <!-- <nextTickTest />
    <KeepAliveTest /> -->
    <!-- <keyTest /> -->
  </div>
</template>

<script setup>
import nextTickTest from './Components/nextTickTest.vue';
import GrandParentComponent from './Components/GrandParentComponent.vue';
import KeepAliveTest from './Components/testKeepAlive.vue';
import keyTest from './Components/keyTest.vue';
console.log('test-componets.vue 已加载')
</script>

<style lang="css">
.test-p:hover {
  color: red;
}
</style>