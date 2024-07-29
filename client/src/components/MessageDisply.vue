<script setup lang="ts">
import { ref } from 'vue';

const msg = ref('Jai Shree Krishna')
</script>

<template>
    <h1>{{ msg ? msg: 'Har Har Mahadev'}}</h1>
    <input v-model="msg">
</template>