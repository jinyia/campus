<script setup>
import {adminrouters} from "../../router/adminpage-router";
import {ref,onMounted} from 'vue';
import {useRouter} from 'vue-router';
import { ArrowDown } from '@element-plus/icons-vue';
let routerlist=ref({
    '0':[],
    '1':[]
})
let zhuye=ref()
let titlelist=['用户管理','新闻管理']
const router=useRouter();
let navitem=ref()
let tuichu=ref()
function tuichus(){
    router.push({path:'/login'})
    zhuye.value.classList.remove('action')
    Object.entries(navitem.value).forEach((k,index)=>{//将所有组件的action样式清楚
        Object.entries(k[1].children).forEach((k1,index1)=>{
            navitem.value[index].children[index1].classList.remove('selecttwo')
            navitem.value[index].children[index1].classList.remove('action')
            navitem.value[index].children[index1].classList.remove('selectthree')
        })
    })
    localStorage.removeItem("token")
    localStorage.removeItem("adminname")
}
function zhuyes(){
    router.push({path:'/zhuye'})
    zhuye.value.classList.add('action')
    Object.entries(navitem.value).forEach((k,index)=>{//将所有组件的action样式清楚
        Object.entries(k[1].children).forEach((k1,index1)=>{
            navitem.value[index].children[index1].classList.remove('selecttwo')
            navitem.value[index].children[index1].classList.remove('action')
            navitem.value[index].children[index1].classList.remove('selectthree')
        })
    })
}
function active(index,item){
    zhuye.value.classList.remove('action')
    Object.entries(navitem.value).forEach((k,index)=>{//将所有组件的action样式清楚
        Object.entries(k[1].children).forEach((k1,index1)=>{
            navitem.value[index].children[index1].classList.remove('selecttwo')
            navitem.value[index].children[index1].classList.remove('action')
            navitem.value[index].children[index1].classList.remove('selectthree')
        })
    })
    navitem.value[index].children[0].classList.add('action')
    Object.entries(navitem.value[index].children).forEach((item,k)=>{
        if(k!=0){
            navitem.value[index].children[k].classList.add('selecttwo')
        }
    })
}
function switchto(item2,index,index2){
    // zhuye.value.classList.remove('action')
    Object.entries(navitem.value[index].children).forEach((item,k)=>{
        if(k!=0){
            navitem.value[index].children[k].classList.remove('selectthree')
        }
    })
    navitem.value[index].children[index2+1].classList.add('selectthree')
    router.push({path:item2.path})
}
onMounted(()=>{
        Object.entries(adminrouters.children).forEach((item2)=>{
            if(item2[1].title=='用户管理'){
                routerlist.value['0'].push(item2[1])
            }else if(item2[1].title=='新闻管理'){
                routerlist.value['1'].push(item2[1])
            }
        })
    console.log(routerlist.value)
    router.push({path:'/zhuye'})
})
</script>

<template>
<div class="adminbox">
    <div class="adminleft">
        <div style="text-align: center;width: 100%;height: 10vh;line-height: 10vh;border-bottom: 1px solid rgb(144, 142, 142);color:#3780CE;text-shadow: 0 0 10px #3780CE,0 0 20px #3780CE;margin-bottom: 3vh;">
            校园新闻管理系统
        </div>
        <div class="indexone action" @click="zhuyes()" ref="zhuye">主页</div>
        <div v-for="(item,index) in routerlist" :key="index" class="selectitem" ref="navitem">
            <div class="indexone" @click="active(index,item)" >{{titlelist[index]}}</div>
            <div v-for="(item2,index2) in item" :key="index2" class="selecttwoitem" @click="switchto(item2,index,index2)">{{item2.name}}</div>
        </div>
        <div class="indexone" @click="tuichus()" ref="tuichu">退出</div>
    </div>
    <div class="adminright">
    <router-view></router-view>
    </div>
</div>
</template>
<style scoped>
.adminbox{
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: row;
}
.adminleft{
    width: 15vw;
    height: 100vh;
    background-color: rgb(47, 47, 47);
}
.adminright{
    width: 85vw;
    height: 100vh;
}
.selectitem{
    width: 100%;
    display: flex;
    flex-direction:column;
}
.indexone{
    margin-top:1vh;
    margin-left:10%;
    width:80%;
    height:5vh;
    display:flex;
    justify-content:center;
    align-items:center;
    cursor:pointer;
    color:white;
    border-radius:1vh;
}
.indexone:hover{
    background-color:rgb(143, 141, 141) ;
}
.action{
    background-color: #3780CE;
    pointer-events: none;/*防止hover冲突 */
}
.selecttwoitem{
    margin-top:1vh;
    display:none;
    width:80%;
    margin-left:10%;
    height:6vh;
    color:white;
    align-items:center;
    justify-content:center;
    font-size:0.8rem;
    /* background-color:rgba(143, 141, 141,0.3); */
    cursor:pointer;
}
.selecttwo{
    display:flex;
}
.selectthree{
    color: #3780CE;
}
</style>