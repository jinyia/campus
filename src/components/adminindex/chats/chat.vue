<template>
    <div class="bigbox" >
        <!-- 添加信息模态框 -->
        <view class="create" v-if="createflag">
            <div style="height:10vh;display:flex;flex-direction:row;align-items:center;">
                    <el-button type="primary" style="margin-left:2vw;" @click="closecreate">关闭添加</el-button>
            </div>
            <div style="position:absolute;left:50%;top:50%;transform:translate(-70%,-50%)">
                    <div style="width:30vw;">
                        <el-form :model="form" label-width="120px">
                            <el-form-item label="发送者id">
                                <el-input v-model="form.sendid" />
                            </el-form-item>
                            <el-form-item label="接受者id">
                                <el-input v-model="form.receiveid" />
                            </el-form-item>
                            <el-form-item label="内容">
                                <el-input v-model="form.context" />
                            </el-form-item>
                            <el-button type="primary" plain style="margin-left: 8vw;" @click="createchats">新建</el-button>
                        </el-form>
                    </div>
            </div>
        </view>
        <!-- 编辑信息模态框 -->
        <view class="update" v-if="updateflag">
            <div style="height:10vh;display:flex;flex-direction:row;align-items:center;">
                    <el-button type="primary" style="margin-left:2vw;" @click="closeupdate">关闭编辑</el-button>
            </div>
            <div style="position:absolute;left:50%;top:50%;transform:translate(-70%,-50%)">
                    <div style="width:30vw;">
                        <el-form :model="form2" label-width="120px">
                            <el-form-item label="发送方id">
                                <el-input v-model="form2.sendid" />
                            </el-form-item>
                            <el-form-item label="接收方id">
                                <el-input v-model="form2.receiveid" />
                            </el-form-item>
                            <el-form-item label="内容">
                                <el-input v-model="form2.context" />
                            </el-form-item>
                            <el-button type="primary" plain style="margin-left: 8vw;" @click="updatechats">更新</el-button>
                        </el-form>
                    </div>
            </div>
        </view>
        <!-- 表格 -->
        <div style="width: 85vw;height: 100vh;overflow: hidden;transition: all 1s;" ref="chatBox">
            <div style="height:10vh;display:flex;flex-direction:row;align-items:center;">
                    <el-button type="primary" style="margin-left:2vw;" @click="opencreate">添加信息</el-button> 
                    <el-input v-model="Searchinput" placeholder="Please input" class="input-with-select" style="width: 60%;margin-left: 1vw;">
                        <template #prepend>
                        <el-button @click="searchnews">
                            搜索
                        </el-button>
                        </template>
                        <template #append>
                        <el-select v-model="Searchselect" placeholder="Select" style="width: 115px">
                            <el-option label="chatid" value="chatid" />
                            <el-option label="发送者id" value="sendid" />
                            <el-option label="接受者id" value="receiveid" />
                        </el-select>
                        </template>
                    </el-input>
            </div>
            <view>
                <el-table :data="tableData" :default-sort="sortrule" ref="multipleTableRef" style="width: 100%;height:60%;" :row-key="getRowKeys" ><!--@selection-change="handleSelectionChange" @selection-change="handleSelectionChange"-->
                    <el-table-column type="selection" width="50"  :reserve-selection="true"></el-table-column>
                    <el-table-column fixed   prop="chatid" sortable label="chatid" width="300" />
                    <el-table-column prop="sendid" sortable label="发送者id" width="300" />
                    <el-table-column prop="receiveid" sortable label="接受者id" width="300" />
                    <el-table-column prop="context" sortable label="内容" width="300" />
                    <el-table-column label="头像" prop="avatarimage">
                    <template #default="scope">
                        <el-image  :preview-src-list="[scope.row.avatarimage]" preview-teleported="true" fit="cover" :initial-index="0"  style="width: 50px; height: 50px" :src="scope.row.avatarimage" alt="无图片"></el-image>
                    </template>
                    </el-table-column> 
                    <el-table-column prop="createdAt" sortable label="创建日期" width="300" />
                    <el-table-column fixed="right"  label="Operations" width="300">
                        <template #default="scope"
                        ><!--scope 用来获取当前行的元素数据-->
                        <el-button link type="primary" size="small" @click="handleClick(scope.row.sendid,scope.row.receiveid,scope.row.context,scope.row.chatid)">编辑</el-button>
                        <el-button link type="primary" size="small" @click="deletechats(scope.row.chatid)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="demo-pagination-block">
                    <el-pagination v-model:current-page="currentPage4"
                                    v-model:page-size="pagesize"
                                    layout="total, prev, pager, next, jumper"
                                    :total="total"
                                    @current-change="handleCurrentChange"
                    />
                    <el-button @click="selectdelete" plain type="danger">删除选中</el-button>
                    <!-- <el-button @click="gotop" plain type="primary">图表统计</el-button> -->
                </div>
            </view>
        </div>
        <!-- 可视化 -->
        <div style="width: 85vw;height: 100vh;overflow: hidden;transition: all 1s;z-index: 999;" ref="tabledata">
            <div style="margin-bottom:5vh;margin-left:3vh;margin-top: 5vh;"><el-button type="primary" @click="backtop">返回</el-button></div>
            <div class="one" ref="one" style="width:80vw;height:80vh;"></div>
        </div>
    </div>
</template>
<script setup>
import axios from "axios";
import { onMounted, ref,reactive,computed } from "vue";
import * as echarts from 'echarts';
import { ElMessage,ElTable } from 'element-plus';
let chatBox=ref()
let tabledata=ref()
let createflag=ref(false)//新建模态框控制
let updateflag=ref(false)//编辑模态框控制
let tableData=ref([])//表格数据
let alltableData=ref([])//初始化时候获取的总数据
let multipleTableRef=ref()
let currentPage4=ref(1)//当前分页
let total=ref(0)//数量总数
let pagesize=10;//分页每页显示10条数据
let currentchatid=ref();//当前chatid
let Searchinput=ref()//搜索框
let Searchselect=ref('chatid')//选择框的值
let one=ref()
let sortrule={ //排序规则
  prop: 'chatid', order: 'descending',
  prop: 'sendid', order: 'descending',
  prop: 'receiveid', order: 'descending',
  prop: 'createdAt', order: 'descending',
}
const form = reactive({
    sendid:0,
    receiveid:0,
    context:0
})
const form2=reactive({
    sendid:0,
    receiveid:0,
    context:0,
})
function gotop(){
    chatBox.value.style.transform=`translateY(-100vh)`
    tabledata.value.style.transform=`translateY(-100vh)`
}
function backtop(){
    chatBox.value.style.transform=`translateY(0)`
    tabledata.value.style.transform=`translateY(0)`
}
function searchnews(){//搜索事件
    let chatid=0;
    let sendid=0;
    let receiveid=0;
    if(Searchselect.value=='chatid'){
        chatid=Searchinput.value
    }else if(Searchselect.value=='sendid'){
        sendid=Searchinput.value
    }else{
        receiveid=Searchinput.value
    }
    axios.post('/admin/searchsixin',{chatid,sendid,receiveid})
        .then((res)=>{
            console.log(res)
            alltableData.value=[]
            let i=0
            total.value=res.data.model.length
            Object.entries(res.data.model).forEach((item)=>{
                i++
                alltableData.value.push(item[1])
                if(i==res.data.model.length){
                    tableData.value=[]
                    currentPage4.value=1
                    tableData.value=alltableData.value.filter((currentValue,index)=>index<currentPage4.value*pagesize&&index>=(currentPage4.value-1)*pagesize)
                }
            })

    })
}
function deletechats(chatid){//删除信息
    axios.post("/admin/deletechats",{chatid:chatid})
    .then((res)=>{
        if(res.data.msg=='删除成功'){
            ElMessage('删除成功')
            start()
        }else{ElMessage('删除失败')}
    })
}
function updatechats(){//更新信息
    let chatid=currentchatid.value
    axios.post("/admin/updatechats",{chatid:chatid,sendid:form2.sendid,receiveid:form2.receiveid,context:form2.context})
    .then((res)=>{
        if(res.data.msg='更新成功'){
            ElMessage('更新成功')
            start()
            updateflag.value=false
        }else{
            ElMessage('更新成功')
        }
    })
}
function  closeupdate(){//关闭编辑
    updateflag.value=false
}
function handleClick(sendid,receiveid,context,chatid){//打开编辑界面
    updateflag.value=true
    form2.sendid=sendid
    form2.receiveid=receiveid
    form2.context=context
    currentchatid.value=chatid
}
function createchats(){//添加信息
    axios.post('/admin/addchats',{sendid:form.sendid,receiveid:form.receiveid,context:form.context})
    .then((res)=>{
        if(res.data.msg=='添加成功'){
            ElMessage('添加成功')
            createflag.value=false;
            start()
        }
        else{ElMessage('添加失败')}
    })
}
function closecreate(){//关闭新建收藏模态框
    createflag.value=false;
}
function opencreate(){//打开新建收藏模态框
    createflag.value=true;
}
function gettime(){//获取当前更新时间
    let times=new Date();
    let date=""
    date+=times.getFullYear()+"-"
    date+=times.getMonth()+"-"
    date+=times.getDate()+" "
    date+=times.getHours()+":"
    date+=times.getMinutes()+":"
    date+=times.getSeconds()
    return date;
}
function handleCurrentChange(e){//索引改变
    currentPage4.value=e
    tableData.value=alltableData.value.filter((currentValue,index)=>index<currentPage4.value*pagesize&&index>=(currentPage4.value-1)*pagesize)
}
const getRowKeys = (row) => {
      //记录每行的key值
      return row.chatid;
}
function start(){//初始化
    tableData.value=[]
    alltableData.value=[]
    let i=0
    axios.get('/admin/allchat').then((res)=>{
        Object.entries(res.data.model).forEach((item)=>{
            i++
            alltableData.value.push(item[1])
            if(i==res.data.model.length){
                total.value=res.data.model.length
                currentPage4.value=1
                tableData.value=alltableData.value.filter((currentValue,index)=>index<currentPage4.value*pagesize&&index>=(currentPage4.value-1)*pagesize)
            }
        })
    })
}
onMounted(()=>{
    start()
})
</script>
<style scoped>
.bigbox{
    width: 85vw;
    height: 100vh;
    overflow: hidden;
    position: relative;
}
.update{
    width:85vw;
    height:100vh;
    position:absolute;
    background-color:rgba(0,0,0,0.8);
    z-index:5;
    overflow:hidden;
}
.create{
    width:85vw;
    height:100vh;
    position:absolute;
    background-color:rgba(0,0,0,0.8);
    z-index:5;
    overflow:hidden;
}
.demo-pagination-block{
  display:flex;
  flex-direction:row;
  align-items:center;
  height:10vh;
}
.demo-pagination-block button{
  width:10vh;
  height:5vh;
  margin-left:3vh;
  border:none;
  cursor:pointer;
  font-size:1rem;
}
</style>