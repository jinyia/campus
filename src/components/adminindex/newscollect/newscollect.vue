<template>
    <div class="bigbox">
        <!-- 添加新闻收藏 -->
        <div class="create" v-if="createflag">
            <div style="height:10vh;display:flex;flex-direction:row;align-items:center;">
                <el-button type="primary" style="margin-left:2vw;" @click="closecreate">关闭添加</el-button>
            </div>
            <div style="position:absolute;left:50%;top:50%;transform:translate(-70%,-50%)">
                <div style="width:30vw;">
                    <el-form :model="form" label-width="120px">
                        <el-form-item label="用户id">
                            <el-input v-model="form.userid" />
                        </el-form-item>
                        <el-form-item label="新闻id">
                            <el-input v-model="form.newsid" />
                        </el-form-item>
                        <el-button type="primary" plain style="margin-left: 8vw;" @click="createuser">新建</el-button>
                    </el-form>
                </div>
            </div>
        </div>
        <!-- 编辑新闻收藏 -->
        <div class="update" v-if="updateflag">
            <div style="height:10vh;display:flex;flex-direction:row;align-items:center;">
                <el-button type="primary" style="margin-left:2vw;" @click="closeupdate">关闭编辑</el-button>
            </div>
            <div style="position:absolute;left:50%;top:50%;transform:translate(-70%,-50%)">
                <div style="width:30vw;">
                    <el-form :model="form2" label-width="120px">
                        <el-form-item label="用户id">
                            <el-input v-model="form2.userid" />
                        </el-form-item>
                        <el-form-item label="新闻id">
                            <el-input v-model="form2.newsid" />
                        </el-form-item>
                        <el-button type="primary" plain style="margin-left: 8vw;" @click="updatecollect">更新</el-button>
                    </el-form>
                </div>
            </div>
        </div>
        <!-- 收藏大盒子 -->
        <div class="datatablebox" ref="datatablebox">
            <div style="height:10vh;display:flex;flex-direction:row;align-items:center;">
                <el-button type="primary" style="margin-left:2vw;" @click="opencreate">添加收藏</el-button>
                <el-input v-model="Searchinput" placeholder="Please input" class="input-with-select" style="width: 60%;margin-left: 1vw;">
                    <template #prepend>
                    <el-button @click="searchnews">
                        搜索
                    </el-button>
                    </template>
                    <template #append>
                    <el-select v-model="Searchselect" placeholder="Select" style="width: 115px">
                        <el-option label="collectsid" value="collectsid" />
                        <el-option label="用户id" value="userid" />
                        <el-option label="新闻id" value="newsid" />
                    </el-select>
                    </template>
                </el-input>
            </div>
            <el-table :default-sort="sortrule" :data="tableData"  ref="multipleTableRef" style="width: 100%;height:60%;" :row-key="getRowKeys" @selection-change="handleSelectionChange" ><!--@selection-change="handleSelectionChange" @select="selecti"-->
                <el-table-column type="selection" width="50" :reserve-selection="true"></el-table-column>
                <el-table-column fixed  prop="collectsid" sortable label="collectsid" width="300" />
                <el-table-column prop="userid" sortable label="用户id" width="300" />
                <el-table-column prop="newsid" sortable label="新闻id" width="300" />
                <el-table-column prop="createdAt" sortable label="创建日期" width="300" />
                <el-table-column fixed="right"  label="Operations" width="300">
                    <template #default="scope"
                    ><!--scope 用来获取当前行的元素数据-->
                    <el-button link type="primary" size="small" @click="handleClick(scope.row.userid,scope.row.newsid,scope.row.collectsid)">编辑</el-button>
                    <el-button link type="primary" size="small" @click="deleteuser(scope.row.collectsid)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页按钮 -->
            <div class="demo-pagination-block">
                <el-pagination v-model:current-page="currentPage4"
                                v-model:page-size="pagesize"
                                layout="total, prev, pager, next, jumper"
                                :total="total"
                                @current-change="handleCurrentChange"
                />
                <el-button @click="selectdelete" plain type="danger">删除选中</el-button>
                <el-button @click="gotop" plain type="primary">图表统计</el-button>
            </div>
        </div>
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
import { ElMessage,ElTable } from 'element-plus'
let tableData=ref([])
let alltableData=ref([])
let createflag=ref(false)//新建模态框控制
let updateflag=ref(false)//编辑模态框控制
let currentcollectsid;//当前collectsid
let currentPage4=ref(1)//当前分页
let total=ref(0)//数量总数
let pagesize=10;//分页每页显示10条数据
let multipleTableRef=ref()//多选框ref
let Searchinput=ref()//搜索框
let Searchselect=ref('collectsid')//选择框的值
let one=ref()
let tabledata=ref()
let datatablebox=ref()
let qianwulist=ref([])//前五列表
let sortrule={ //排序规则
  prop: 'collectsid', order: 'descending',
  prop: 'userid', order: 'descending',
  prop: 'newsid', order: 'descending',
  prop: 'createdAt', order: 'descending'
}
const form = reactive({
    userid:0,
    newsid:0
})
const form2=reactive({
    userid:0,
    newsid:0
})
function qianwu(){//获取排行前五新闻搜藏数
    axios.get('/admin/qianwucollet')
    .then((res)=>{
        qianwulist.value=res.data.model
        let myChartone= echarts.init(one.value);
        let option;
        option = { 
                    title:{
                        text:'收藏前五新闻',
                        left:'center'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                        type: 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                        type: 'category',
                        data: [
                            `${qianwulist.value[0].newsid}:${qianwulist.value[0].title.slice(0,10)}`,
                            `${qianwulist.value[1].newsid}:${qianwulist.value[1].title.slice(0,10)}`, 
                            `${qianwulist.value[2].newsid}:${qianwulist.value[2].title.slice(0,10)}`, 
                            `${qianwulist.value[3].newsid}:${qianwulist.value[3].title.slice(0,10)}`, 
                            `${qianwulist.value[4].newsid}:${qianwulist.value[4].title.slice(0,10)}`],
                        axisTick: {
                            alignWithLabel: true
                        }
                        }
                    ],
                    yAxis: [
                        {
                        type: 'value'
                        }
                    ],
                    series: [
                        {
                        name: '收藏量',
                        type: 'bar',
                        barWidth: '60%',
                        data: [
                        qianwulist.value[0].collet,
                        qianwulist.value[1].collet, 
                        qianwulist.value[2].collet, 
                        qianwulist.value[3].collet, 
                        qianwulist.value[4].collet
                            ]
                        }
                    ]
            };
        myChartone.setOption(option);
    })
}
function gotop(){
    datatablebox.value.style.transform=`translateY(-100vh)`
    tabledata.value.style.transform=`translateY(-100vh)`
}
function backtop(){
    datatablebox.value.style.transform=`translateY(0)`
    tabledata.value.style.transform=`translateY(0)`
}
function start(){//获取初始数据
    tableData.value=[]
    alltableData.value=[]
    axios.get('/admin/collectall')
    .then((res=>{
        Object.entries(res.data.model).forEach((item)=>{
            alltableData.value.push({
                collectsid:`${item[1].collectsid}`,
                userid:`${item[1].userid}`,
                newsid:`${item[1].newsid}`,
                createdAt:`${item[1].createdAt.slice(0,10)} ${item[1].createdAt.slice(11,19)}`,
            })
        })
        total.value=res.data.model.length
        if(tableData.value==[]){currentPage4.value=0,total.value=0}
        else{currentPage4.value=1}
        tableData.value=alltableData.value.filter((currentValue,index)=>index<currentPage4.value*pagesize&&index>=(currentPage4.value-1)*pagesize)
    }))
}
function opencreate(){//打开新建收藏模态框
    createflag.value=true;
}
function closecreate(){//关闭新建收藏模态框
    createflag.value=false;
}
function createuser(){//添加收藏
    axios.post('/admin/creaetcollect',{userid:`${form.userid}`,newsid:`${form.newsid}`})
        .then((res)=>{
            if(res.data.msg=='已经存在'){
                ElMessage('已经存在相同收藏')
            }else{
                start()
                createflag.value=false
            }
        })
}
function handleClick(userid,newsid,collectsid){//打开编辑界面
    updateflag.value=true
    form2.userid=userid
    form2.newsid=newsid
    currentcollectsid=collectsid
}
function closeupdate(){//关闭编辑界面
    updateflag.value=false
}
function updatecollect(){//更新收藏信息
    axios.post('/admin/updatecollect',{collectsid:`${currentcollectsid}`,userid:`${form2.userid}`,newsid:`${form2.newsid}`})
        .then((res)=>{
            if(res.data.msg=='已经存在'){
                ElMessage('已经存在相同收藏')
            }else{
                start()
                updateflag.value=false
            }
        })
}
const getRowKeys = (row) => {
      //记录每行的key值
      return row.collectsid;
}
function handleCurrentChange(e){//分页当前页面索引改变触发,e参数为索引值直接调用
  currentPage4.value=e
  tableData.value=alltableData.value.filter((currentValue,index)=>index<currentPage4.value*pagesize&&index>=(currentPage4.value-1)*pagesize)
    //   Object.entries(multipleTableRef.value.getSelectionRows()).forEach((item)=>{//分页变化时，把当前的选中项添加到selectidlist中
    //     let flag=true
    //       Object.entries(selectidlist.value).forEach((item2,k)=>{
    //         if(item[1].userid==item2[1].userid){
    //             flag=false
    //         }
    //       })
    //       if(flag){
    //         selectidlist.value.push(item[1])
    //       }
    //   })
    //   setTimeout(() => {
    //     Object.entries(selectidlist.value).forEach((item2)=>{
    //     multipleTableRef.value.toggleRowSelection(item2[1],true)
    //   })
    //   }, 1);
}
function clearselect(){//清除选项
  multipleTableRef.value.clearSelection()
}
function selectdelete(){//删除选中选项
    let i=0;
    Object.entries(multipleTableRef.value.getSelectionRows()).forEach((item)=>{
        i++;
        axios.post('/admin/deletecollect',{collectsid:item[1].collectsid}).then((res)=>{
        if(i==multipleTableRef.value.getSelectionRows().length){
        start()
        }
        })
    })
}
function searchnews(){//搜索新闻
    let collectsid=0;
    let userid=0;
    let newsid=0;
    if(Searchselect.value=='collectsid'){
        collectsid=Searchinput.value
    }else if(Searchselect.value=='userid'){
        userid=Searchinput.value
    }else{
        newsid=Searchinput.value
    }
    axios.post('/admin/searchcollect',{collectsid,userid,newsid})
        .then((res)=>{
            alltableData.value=[]
            let i=0
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
function deleteuser(collectsids){//删除收藏
    let collectsid=collectsids
    axios.post('/admin/deletecollect',{collectsid:`${collectsid}`})
        .then((res)=>{
            if(res.data.msg=='成功'){start()}
        })
}
onMounted(()=>{
    start()
    qianwu()
})
</script>
<style scoped>
.bigbox{
    width:85vw;
    height:100vh;
    overflow:hidden;
    position:reactive;
}
.datatablebox{
    width:85vw;
    height:100vh;
    overflow: hidden;
    transition: all 1s;
}
.create{
    width:85vw;
    height:100vh;
    position:absolute;
    z-index:5;
    background-color:rgba(0,0,0,0.8)
}
.update{
    width:85vw;
    height:100vh;
    position:absolute;
    z-index:5;
    background-color:rgba(0,0,0,0.8)
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