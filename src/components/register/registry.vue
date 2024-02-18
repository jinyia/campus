<script setup>
import { onMounted, ref,reactive,computed } from "vue";
import axios from 'axios';
import router from '../../router';
let admin=ref()
let adminnametext=ref()
let adminpasswordtext=ref()
let currimageurl=ref()//当前路径的url
function backtod(){//返回上一级
  router.back(-1)
}
function registryadmin(){//管理员注册
  let adminname=adminnametext.value
  let password=adminpasswordtext.value
  axios.post('/admin/register',{adminname,password})
  .then(res=>{
    router.push({path:'/login'})
  })
}
</script>

<template>
<div class="registerbigbox">
     <el-button plain style="margin-top: 5vh;margin-left: 1vw;" @click="backtod">返回</el-button>
    <div class="register">
        <div class="gititle">
            <div ref="admin">管理员注册</div>
        </div>
        <div class="admin">
            <div><strong>管理员账号</strong><input type="text" v-model="adminnametext"></div>
            <div><strong>管理员密码</strong><input type="text" v-model="adminpasswordtext"></div>
            <div><el-button plain  @click="registryadmin">注册</el-button></div>
        </div>
    </div>
</div>  
</template>
<style scoped>
.registerbigbox{
    width: 100vw;
    height: 100vh;
    position: relative;
    background-image: url("../../assets/R-C.jfif");
    background-size: 100% 100%;
}
.register{
    width: 30vw;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
.gititle{
    width: 100%;
    height: 6vh;
    display: flex;
    flex-direction: row;
}
.gititle div{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    cursor: pointer;
    border-bottom: 1px solid white;
}
.admin{
    width: 100%;
}
.admin div{
    width: 100%;
    height: 6vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}
.admin div button{
    width: 60%;
    border: none;
    height: 4vh;
    margin-top: 3vh;
    margin-bottom: 2vh;
    border-radius: 1vh;
}
.admin div input{
    border: none;
    outline: none;
    height: 4vh;
    margin-left: 1vw;
    width: 50%;
    border-radius: 1vh;
}
</style>