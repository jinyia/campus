<script setup>
import {useRouter} from 'vue-router'
const router=useRouter();
router.push({name:'login'})
import axios  from 'axios';
axios.defaults.baseURL = "http://localhost:3000/";
</script>
<template>
  <router-view></router-view>
</template>
<style>
*{
  margin: 0;
  padding: 0;
}
</style>