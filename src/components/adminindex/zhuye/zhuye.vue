<template>
    <div class="bigbox">
        <div style="width: 96%;margin-left: 2%;background-color: white;height: 20vh;margin-top: 3vh;display: flex;flex-direction: row;align-items: center;">
            <div style="width: 100px;height: 100px;overflow: hidden;border-radius: 100px;margin-left: 3%;">
                <img src="../../../assets/preview.jpg" alt="" style="width: 100px;height: 100px;">
            </div>
            <view style="display: flex;flex-direction: column;height: 100px;justify-content: space-between;margin-left: 3vh;">
                <view style="margin-top: 3vh;"><text style="font-weight: bold;font-size: 1rem;">你好管理员 {{ adminname }} 祝你天天开心</text></view>
                <view style="margin-bottom: 2vh;color: rgb(148, 147, 147);font-size: 0.8rem;" ><text>作者寄语:真的勇士，敢于直面惨淡的人生，敢于正视淋漓的鲜血。</text></view>
            </view>
        </div>

        <div style="width: 96%;margin-left: 2%;height: 15vh;margin-top: 3vh;display: flex;flex-direction: row;justify-content: space-between;">
            <view class="itembox">
                <view style="height: 100%;width: 45%;display: flex;justify-content: center;align-items: center;">
                    <svg style="width: 50px;height: 50px;" t="1704527841171" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4231" width="200" height="200"><path d="M727.04 931.84c-20.48 0-40.96-15.36-40.96-40.96v-87.04c0-35.84-15.36-66.56-40.96-92.16s-56.32-40.96-92.16-40.96H215.04c-35.84 0-66.56 15.36-92.16 40.96s-40.96 56.32-40.96 92.16v87.04c0 20.48-15.36 40.96-40.96 40.96s-40.96-15.36-40.96-40.96v-87.04c0-56.32 20.48-107.52 61.44-148.48 40.96-40.96 92.16-61.44 148.48-61.44h343.04c56.32 0 107.52 20.48 148.48 61.44 40.96 40.96 61.44 92.16 61.44 148.48v87.04c0 25.6-15.36 40.96-35.84 40.96zM384 506.88c-117.76 0-209.92-92.16-209.92-209.92s92.16-209.92 209.92-209.92 209.92 92.16 209.92 209.92-92.16 209.92-209.92 209.92z m0-343.04c-71.68 0-133.12 61.44-133.12 133.12s61.44 133.12 133.12 133.12 133.12-61.44 133.12-133.12-61.44-133.12-133.12-133.12zM983.04 931.84c-20.48 0-40.96-15.36-40.96-40.96v-87.04c0-30.72-10.24-56.32-25.6-81.92s-40.96-40.96-71.68-46.08c-20.48-5.12-30.72-25.6-25.6-46.08s25.6-30.72 46.08-25.6c46.08 10.24 87.04 35.84 112.64 76.8 30.72 35.84 46.08 81.92 46.08 128v87.04c-5.12 20.48-20.48 35.84-40.96 35.84zM680.96 501.76c-15.36 0-30.72-10.24-35.84-30.72-5.12-20.48 5.12-40.96 25.6-46.08 30.72-5.12 56.32-25.6 71.68-46.08 20.48-25.6 25.6-51.2 25.6-81.92s-10.24-56.32-25.6-81.92-40.96-40.96-71.68-46.08c-20.48-5.12-30.72-25.6-25.6-46.08s25.6-30.72 46.08-25.6c46.08 10.24 87.04 35.84 112.64 76.8 30.72 35.84 46.08 81.92 46.08 128s-15.36 92.16-46.08 128-66.56 61.44-112.64 76.8c0-5.12-5.12-5.12-10.24-5.12z" fill="#A69364" p-id="4232"></path></svg>
                </view>
                <view style="display: flex;height: 100%;width: 55%;flex-direction: column;justify-content: center;">
                    <text style="font-weight: bold;margin-bottom: 2vh;font-size: 0.8rem;">用户数</text>
                    <text style="font-size: 1.5rem;">{{ users }}</text>
                </view>
            </view>
            <view class="itembox">
                <view style="height: 100%;width: 45%;display: flex;justify-content: center;align-items: center;">
                    <svg style="width: 50px;height: 50px;" t="1704528573689" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6157" width="200" height="200"><path d="M602.112 172.8H282.88A134.4 134.4 0 0 0 148.48 307.2v409.6c0 74.24 60.16 134.4 134.4 134.4h490.624l1.024-64-4.3776-0.128c-18.4064-1.152-33.6384-17.3056-33.6384-36.864V307.2c0-74.24-60.16-134.4-134.4-134.4z m0 64A70.4 70.4 0 0 1 672.512 307.2v443.008l0.128 5.12c0.512 10.24 2.56 20.0448 5.888 29.2608l0.9984 2.6112H282.88A70.4 70.4 0 0 1 212.48 716.8V307.2a70.4 70.4 0 0 1 70.4-70.4h319.232z" fill="#FB553C" p-id="6158"></path><path d="M874.2656 403.2v345.984a102.016 102.016 0 0 1-96.9216 101.888l-5.0944 0.128v-64c19.7632 0 36.0192-15.0784 37.8368-34.3552l0.1792-3.6608V467.2h-38.016v-64h102.016zM582.4 348.7744v64h-268.8v-64z" fill="#FB553C" p-id="6159"></path><path d="M315.8016 479.9488h113.9712v206.464h-113.9712z" fill="#FB553C" p-id="6160"></path><path d="M582.4 485.12v64h-102.4v-64zM582.4 621.4656v64h-102.4v-64z" fill="#FB553C" p-id="6161"></path></svg>
                </view>
                <view style="display: flex;height: 100%;width: 55%;flex-direction: column;justify-content: center;">
                    <text style="font-weight: bold;margin-bottom: 2vh;font-size: 0.8rem;">新闻数</text>
                    <text style="font-size: 1.5rem;">{{ newscount }}</text>
                </view>
            </view>
            <view class="itembox">
                <view style="height: 100%;width: 45%;display: flex;justify-content: center;align-items: center;">
                    <svg style="width: 50px;height: 50px;" t="1704528774322" class="icon" viewBox="0 0 1033 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7136" width="200" height="200"><path d="M516.644571 146.285714c150.893714 0 278.930286 67.401143 384 178.578286a775.497143 775.497143 0 0 1 116.297143 160.621714c4.022857 7.460571 6.765714 12.946286 8.265143 16.128l8.045714 17.225143-9.472 16.493714c-1.718857 2.998857-4.900571 8.265143-9.435428 15.36a907.154286 907.154286 0 0 1-125.915429 154.550858C778.825143 812.617143 654.226286 877.714286 516.644571 877.714286c-137.581714 0-262.180571-65.097143-371.785142-172.470857A907.154286 907.154286 0 0 1 18.944 550.765714a418.852571 418.852571 0 0 1-9.435429-15.36l-9.508571-16.530285 8.082286-17.188572c5.485714-11.739429 15.981714-31.341714 31.561143-56.173714A775.497143 775.497143 0 0 1 132.644571 324.864C237.714286 213.686857 365.750857 146.285714 516.644571 146.285714z m415.049143 338.029715a703.012571 703.012571 0 0 0-84.224-109.202286C755.090286 277.394286 645.010286 219.428571 516.644571 219.428571c-128.365714 0-238.445714 57.965714-330.825142 155.684572a703.012571 703.012571 0 0 0-102.546286 140.361143 834.706286 834.706286 0 0 0 112.786286 137.508571C293.193143 748.214857 401.152 804.571429 516.644571 804.571429c115.492571 0 223.451429-56.393143 320.585143-151.552a834.706286 834.706286 0 0 0 112.786286-137.545143c-5.229714-9.508571-11.337143-20.004571-18.322286-31.158857zM516.644571 329.142857c100.242286 0 182.857143 82.614857 182.857143 182.857143 0 101.083429-80.713143 182.857143-182.857143 182.857143-101.083429 0-182.857143-80.713143-182.857142-182.857143 0-101.083429 80.713143-182.857143 182.857142-182.857143z m0 73.142857c-61.549714 0-109.714286 48.786286-109.714285 109.714286 0 61.549714 48.786286 109.714286 109.714285 109.714286 61.549714 0 109.714286-48.786286 109.714286-109.714286 0-59.830857-49.883429-109.714286-109.714286-109.714286z" fill="#4C92E3" p-id="7137"></path></svg>
                </view>
                <view style="display: flex;height: 100%;width: 55%;flex-direction: column;justify-content: center;">
                    <text style="font-weight: bold;margin-bottom: 2vh;font-size: 0.8rem;">阅读量</text>
                    <text style="font-size: 1.5rem;">{{ sumreadship }}</text>
                </view>
            </view>
            <view class="itembox">
                <view style="height: 100%;width: 45%;display: flex;justify-content: center;align-items: center;">
                    <svg  style="width: 50px;height: 50px;" t="1704529038125" class="icon" viewBox="0 0 1029 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10636" width="200" height="200"><path d="M857.79 190.625l17.009 17.097-459.347 458.07-54.39 6-6.08-6 6.08-54.518 459.347-458.07 16.927 16.968 20.454 20.453zM727.238 877.609H272.91c-71.998 0-130.552-58.473-130.552-130.383V292.81c0-71.91 58.554-130.423 130.552-130.423h304.986c12.88 0 23.259 10.42 23.259 23.219 0 12.804-10.38 23.177-23.259 23.177H272.91c-46.436 0-84.156 37.72-84.156 84.068v454.335c0 46.347 37.72 84.07 84.156 84.07h454.328c46.354 0 84.076-37.723 84.076-84.07V447.518c0-12.885 10.371-23.266 23.17-23.266a23.22 23.22 0 0 1 23.266 23.266v299.668c-0.05 71.95-58.602 130.423-130.512 130.423z m0 0" fill="#5198B9" p-id="10637"></path></svg>
                </view>
                <view style="display: flex;height: 100%;width: 55%;flex-direction: column;justify-content: center;">
                    <text style="font-weight: bold;margin-bottom: 2vh;font-size: 0.8rem;">评论数</text>
                    <text style="font-size: 1.5rem;">{{ countreview }}</text>
                </view>
            </view>
        </div>
        <!-- 图标 -->
        <div style="width: 100%;background-color: rgb(239, 237, 237);display: flex;flex-direction: row;margin-top: 5vh;">
            <div ref="one" style="width: 60vw;height: 50vh;background-color: white;margin-left: 2%;padding-top: 2vh;"></div>
            <div style="background-color: white;width: 20vw;margin-left: 1vw;height: 50vh;padding-top: 2vh;display: flex;flex-direction: column;overflow-y: scroll;" >
                <div style="height: 5vh;text-align: center;margin-bottom: 2vh;color: #a90000;">最受欢迎前10用户</div>
                <view v-for="(item,index) in qian10s" :key="index" style="height: 4vh;margin-bottom: 2vh;display: flex;align-items: center;justify-content: center;">
                   {{ index+1 }}: <view  style="display:inline-block;width: 4vh;height: 4vh;overflow: hidden;border-radius: 4vh;">
                        <img :src="item.avatarimage"   mode="scaleToFill" style="width: 4vh;height: 4vh;"/>
                   </view> {{ item.username }}
                </view>
            </div>
        </div>
    </div>
</template>
<script setup>
import axios from "axios";
import { onMounted, ref,reactive,computed } from "vue";
import * as echarts from 'echarts';
import { ElMessage,ElTable } from 'element-plus';
let users=ref(0)
let newscount=ref(0)
let adminname=ref(localStorage.getItem("adminname"))
let sumreadship=ref(0)
let countreview=ref(0)
let one=ref()
let arr1=[]
let arr2=ref([])//接受返回当天发布评论的数据
let qian10s=ref([])
function gethotuser(){
    axios.get('/admin/qian10')
    .then((res)=>{qian10s.value=res.data.model,console.log(qian10s.value)})
}
function getfive(){//图表1获取近五天日期
    let myday=new Date()
    let year=myday.getFullYear()
    let month=myday.getMonth()+1
    let date=myday.getDate()
    arr1=[]
    let newdate=year+"-"+month+"-"+(date)
    let currentdate=year+"-"+month+"-"+(date+1)
    for(let i=0;i<7;i++){
        newdate=year+"-"+month+"-"+(date-i)
        arr1.push(newdate)
    }
    arr1.unshift(currentdate)
    console.log(arr1)
    axios.post('/admin/fivenewscount',{arr1,currentdate})
    .then((res)=>{
        arr2.value=[]
        arr2.value=(res.data.arr2)
        console.log(arr2.value)
        let myChartone = echarts.init(one.value);
    let option;
    option = {
        title:{
            text:'近期新闻发布数量图',
            left:'center'
        },
        xAxis: {
            type: 'category',
            data: [`${arr1[7]}`,`${arr1[6]}`,`${arr1[5]}`, `${arr1[4]}`, `${arr1[3]}`, `${arr1[2]}`, `${arr1[1]}`]
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
            data: [arr2.value[6],arr2.value[5],arr2.value[4],arr2.value[3],arr2.value[2],arr2.value[1],{value: arr2.value[0],itemStyle: {color: '#a90000'}}],
            type: 'bar'
            }
        ]
        };
    myChartone.setOption(option);
    })
}

function start(){//初始化
    axios.get('/admin/countusers')
    .then((res)=>{users.value=res.data.model})
    axios.get('/admin/countnews')
    .then((res)=>{newscount.value=res.data.model})
    axios.get('/admin/sumreadship')
    .then((res)=>{sumreadship.value=res.data.model})
    axios.get('/admin/countreview')
    .then((res)=>{countreview.value=res.data.model})
    getfive()
}
onMounted(()=>{
    start()
    gethotuser()
})
</script>
<style scoped>
.bigbox{
    width: 85vw;
    height: 100vh;
    overflow: hidden;
    position: relative;
    background-color: rgb(239, 237, 237);
}
.itembox{
    width: 24%;height: 15vh;
    background-color: white;
    display: flex;
    flex-direction: row;
}
</style>