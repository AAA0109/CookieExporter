<template>
  <div class="popupview">
    <p>Firebase Login Sample</p> 
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => { });
</script>

<style scoped>
.popupview {
  padding: 5px;
  background-color: white;
  font-size: 16px;
  color: black;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
}
</style>