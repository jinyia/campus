<template>
    <view class="bigbox">
        <!-- 添加点赞 -->
        <view class="create" v-if="createflag">
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
                            <el-button type="primary" plain style="margin-left: 8vw;" @click="createnewslike">新建</el-button>
                        </el-form>
                    </div>
            </div>
        </view>
        <!-- 编辑点赞 -->
        <view class="update" v-if="updateflag">
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
                            <el-button type="primary" plain style="margin-left: 8vw;" @click="updateconcern">更新</el-button>
                        </el-form>
                    </div>
            </div>
        </view>
        <!-- 表格 -->
        <view class="tabledates">
            <div style="height:10vh;display:flex;flex-direction:row;align-items:center;">
                <el-button type="primary" style="margin-left:2vw;" @click="opencreate">添加点赞</el-button>
                    <el-input v-model="Searchinput" placeholder="Please input" class="input-with-select" style="width: 60%;margin-left: 1vw;">
                        <template #prepend>
                        <el-button @click="searchnews">
                            搜索
                        </el-button>
                        </template>
                        <template #append>
                        <el-select v-model="Searchselect" placeholder="Select" style="width: 115px">
                            <el-option label="newslikeid" value="newslikeid" />
                            <el-option label="用户id" value="userid" />
                            <el-option label="新闻id" value="newsid" />
                        </el-select>
                        </template>
                    </el-input>
            </div>
            <el-table  :default-sort="sortrule" :data="tableData"  ref="multipleTableRef" style="width: 100%;height:60%;" :row-key="getRowKeys" ><!--@selection-change="handleSelectionChange" @selection-change="handleSelectionChange"-->
                <el-table-column type="selection" width="50" :reserve-selection="true"></el-table-column>
                <el-table-column fixed sortable  prop="newslikeid" label="newslikeid" width="300" />
                <el-table-column sortable prop="userid" label="用户id" width="300" />
                <el-table-column sortable prop="newsid" label="新闻id" width="300" />
                <el-table-column sortable prop="createdAt" label="创建日期" width="300" />
                <el-table-column fixed="right"  label="Operations" width="300">
                    <template #default="scope"
                    ><!--scope 用来获取当前行的元素数据-->
                    <el-button link type="primary" size="small" @click="handleClick(scope.row.userid,scope.row.newsid,scope.row.newslikeid)">编辑</el-button>
                    <el-button link type="primary" size="small" @click="deleteuser(scope.row.newslikeid)">删除</el-button>
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
                <el-button @click="selectdelete()" plain type="danger">删除选中</el-button>
                <!-- <el-button @click="gotop" plain type="primary">图标统计</el-button> -->
            </div>
        </view>
    </view>
</template>
<script setup>
import axios from "axios";
import { onMounted, ref,reactive,computed } from "vue";
import * as echarts from 'echarts';
import { ElMessage,ElTable } from 'element-plus';
const form = reactive({
    userid:0,
    newsid:0
})
const form2=reactive({
    userid:0,
    newsid:0
})
let createflag=ref(false)//新建模态框控制
let updateflag=ref(false)//编辑模态框控制
let tableData=ref([])
let alltableData=ref([])
let multipleTableRef=ref()//表格ref
let currentnewslikeid;//当前collectsid
let currentPage4=ref(1)//当前分页
let total=ref(0)//数量总数
let pagesize=10;//分页每页显示10条数据
let Searchinput=ref()//搜索框
let Searchselect=ref('newslikeid')//选择框的值
let sortrule={ //排序规则
  prop: 'newslikeid', order: 'descending',
  prop: 'userid', order: 'descending',
  prop: 'newsid', order: 'descending',
  prop: 'createdAt', order: 'descending'
}
function searchnews(){//搜索事件
    let newslikeid=0;
    let userid=0;
    let newsid=0;
    if(Searchselect.value=='newslikeid'){
        newslikeid=Searchinput.value
    }else if(Searchselect.value=='userid'){
        userid=Searchinput.value
    }else{
        newsid=Searchinput.value
    }
    axios.post('/admin/seanewslike',{newslikeid,userid,newsid})
        .then((res)=>{
            console.log(res)
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
function clearselect(){//清除选项
  multipleTableRef.value.clearSelection()
}
function deleteuser(newslikeids){//删除关注
    let newslikeid=newslikeids
    axios.post('/admin/deletenewslike',{newslikeid:`${newslikeid}`})
        .then((res)=>{
            if(res.data.msg=='删除成功'){
                start()
            }
        })
}
function updateconcern(){//更新关注
    let newslikeid=currentnewslikeid
    let userid=form2.userid
    let newsid=form2.newsid
    axios.post('/admin/updatenewslike',{newslikeid:`${newslikeid}`,userid:`${userid}`,newsid:`${newsid}`})
    .then((res)=>{
        if(res.data.msg=='已经存在'){ElMessage('已经存在')}
        else if(res.data.msg=='失败'){ElMessage('失败')}
        else{
            start()
            updateflag.value=false
        }
    })
}
function  closeupdate(){//关闭编辑
    updateflag.value=false
}
function handleClick(userid,newsid,newslikeid){//打开编辑界面
    updateflag.value=true
    form2.userid=userid
    form2.newsid=newsid
    currentnewslikeid=newslikeid
}
function createnewslike(){//添加新闻点赞
    axios.post('/admin/createnewslike',{userid:`${form.userid}`,newsid:`${form.newsid}`})
    .then((res)=>{
        if(res.data.msg=='已经存在'){ElMessage("已经存在")}
        else if(res.data.msg=='失败'){ElMessage("创建失败")}
        else{
            start()
            createflag.value=false
        }
    })
}
function closecreate(){//关闭新建收藏模态框
    createflag.value=false;
}
function opencreate(){//打开新建收藏模态框
    createflag.value=true;
}
const getRowKeys = (row) => {
      //记录每行的key值
      return row.newslikeid;
}
function handleCurrentChange(e){//索引改变
    currentPage4.value=e
    tableData.value=alltableData.value.filter((currentValue,index)=>index<currentPage4.value*pagesize&&index>=(currentPage4.value-1)*pagesize)
}
function selectdelete(){//删除选中
    let k=0;
    Object.entries(multipleTableRef.value.getSelectionRows()).forEach((item)=>{
        k++
        axios.post('/admin/deletenewslike',{newslikeid:item[1].newslikeid}).then((res)=>{})
        if(k==multipleTableRef.value.getSelectionRows().length){start()}
    })
}
function start(){//初始化
    let i=0;
    alltableData.value=[]
    tableData.value=[]
    axios.get('/admin/newslike')
        .then((res)=>{
            Object.entries(res.data.model).forEach((item)=>{
                i++
                alltableData.value.push({
                    newslikeid:item[1].newslikeid,
                    userid:item[1].userid,
                    newsid:item[1].newsid,
                    createdAt:item[1].createdAt
                })
                if(i==res.data.model.length){
                    total.value=res.data.model.length
                    if(tableData.value==[]){currentPage4.value=0,total.value=0}
                    else{currentPage4.value=1}
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
    width:85vw;
    height:100vh;
    position:reactive;
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
.update{
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