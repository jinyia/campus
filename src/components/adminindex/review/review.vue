<script setup>
import Editor from '@tinymce/tinymce-vue'
import {ref,onMounted} from 'vue'
import axios from 'axios';
import { ElMessage } from 'element-plus'//消息提示框
import { Search } from '@element-plus/icons-vue';
import * as echarts from 'echarts';
let flagone=ref(false)//控制新建模态框的显示
let flagtwo=ref(false)//控制更改模态框

let alltabledata=ref([])//总表格数据
let tableData=ref([])//表格渲染的数据

let Crreviewid=ref()//新建评论界面评论的id值
let Crnewsid=ref()//新建评论界面新闻的id值
let Crauthorid=ref()//新建评论界面的作者id值
let Crcontext=ref()//新建评论界面的评论内容
let Crrelike=ref()//新建评论界面评论点赞数
let Crparentid=ref()//新建界面父id

let Upnews=ref()//编辑界面的值
let Upauthorid=ref()//编辑界面的值
let Upcontext=ref()//编辑内容
let Uprelike=ref()//评论点赞数
let currentreviewid=ref()//当前评论id

let currentPage4=ref(1)//当前分页
let pageSize4=10//分页大小
let total=ref(0)//数据总条目
let select=ref('reviewid')//选择框的值
let Searchinput=ref()//搜索框的值

let multipleTableRef=ref([])//表格
let selectidlist=ref([])//选中的项列表

let one=ref()//折线图
let keshihuaBox=ref()
let dataBigBox=ref()
let arr1=[]
let arr2=[]//接受返回当天发布评论的数据
let sortrule={ //排序规则
  prop: 'reviewid', order: 'descending',
  prop: 'newsid', order: 'descending',
  prop: 'authorid', order: 'descending',
  prop: 'relike', order: 'descending',
  prop: 'parentid', order: 'descending',
  prop: 'createdAt', order: 'descending'
}
function gettime(){//获取当前时间
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
function createreviewBox(){//打开新建评论模态框
    flagone.value=true
}
function closereviewBox(){//关闭评论模态框
    flagone.value=false
}
function createreviewbutton(){//新建评论
    let reviewid=Crreviewid.value
    let newsid=Crnewsid.value
    let authorid=Crauthorid.value
    let context=Crcontext.value
    let relike=Crrelike.value
    let parentid=Crparentid.value
    let createdAt=gettime()
    axios.post('/admin/checkids',{newsid,authorid})
    .then(res=>{
        if(res.data.msg=='false'){ElMessage('新闻不存在或者用户不存在')}
        else{//新闻存在则添加，不存在则不添加
            axios.post('/admin/createreview',{reviewid,newsid,authorid,context,relike,parentid,createdAt})
            .then(res=>{
                start()
                ones()
                flagone.value=false
            })
        }
    })

}
function updatereviewBox(scope){//打开编辑界面
    flagtwo.value=true
    Upnews.value=scope.row.newsid
    Upauthorid.value=scope.row.authorid
    Upcontext.value=scope.row.context
    currentreviewid.value=scope.row.reviewid
    Uprelike.value=scope.row.relike
}
function closeupdatereview(){//关闭编辑界面
    flagtwo.value=false
}
function updareview(){//更新评论
    let reviewid=currentreviewid.value
    let newsid=Upnews.value
    let authorid=Upauthorid.value
    let context=Upcontext.value
    let relike=Uprelike.value
    let updatedAt=gettime()
    axios.post('/admin/updatereview',{reviewid,newsid,authorid,context,relike,updatedAt})
    .then(res=>{
        flagtwo.value=false
        axios.get('/admin/reviewall').then(res=>{
                    alltabledata.value=[]
                    Object.entries(res.data.model).forEach((k)=>{
                    alltabledata.value.push({
                        reviewid:k[1].reviewid,
                        newsid:k[1].newsid,
                        authorid:k[1].authorid,
                        context:k[1].context,
                        relike:k[1].relike,
                        createdAt:k[1].createdAt
                    })
                    tableData.value=alltabledata.value.filter((currentValue,index)=>index<currentPage4.value*pageSize4&&index>=(currentPage4.value-1)*pageSize4)
                    flagtwo.value=false
                    axios.get('/admin/countreview')
                    .then(res=>{
                    total.value=res.data.model
                    })

                })
            })
    })
}
function dereview(scope){//删除评论
    let reviewid= scope.row.reviewid
    axios.post('/admin/dereview',{reviewid})
    .then(res=>{
        axios.get('/admin/reviewall').then(res=>{
                    alltabledata.value=[]
                    if(res.data.model.length==0){tableData.value=[]}
                    Object.entries(res.data.model).forEach((k)=>{
                    alltabledata.value.push({
                        reviewid:k[1].reviewid,
                        newsid:k[1].newsid,
                        authorid:k[1].authorid,
                        context:k[1].context,
                        createdAt:k[1].createdAt
                    })
                    tableData.value=alltabledata.value.filter((currentValue,index)=>index<currentPage4.value*pageSize4&&index>=(currentPage4.value-1)*pageSize4)
                    flagone.value=false
                    axios.get('/admin/countreview')
                    .then(res=>{
                    total.value=res.data.model
                    })
                })
        })
    })
}
function handleCurrentChange(val){//索引改变
    currentPage4.value=val
    tableData.value=alltabledata.value.filter((currentValue,index)=>index<currentPage4.value*pageSize4&&index>=(currentPage4.value-1)*pageSize4)
    //     Object.entries(multipleTableRef.value.getSelectionRows()).forEach((item)=>{//分页变化时，把当前的选中项添加到selectidlist中
    //     let flag=true
    //     Object.entries(selectidlist.value).forEach((item2,k)=>{
    //         if(item[1].reviewid==item2[1].reviewid){
    //             flag=false//一样则不渲染
    //         }
    //     })
    //     if(flag){
    //         selectidlist.value.push(item[1])
    //     }
    // })
    // setTimeout(() => {
    //     Object.entries(selectidlist.value).forEach((item2)=>{
    //     multipleTableRef.value.toggleRowSelection(item2[1],true)
    // })
    // },1);
}
function searchreviews(){//搜索评论
    let reviewid=0
    let newsid=0
    let authorid=0
    let context=''
    if(select.value=='reviewid'){
        reviewid=parseInt( Searchinput.value)
        axios.post('/admin/serachrevire',{reviewid,newsid,authorid,context})
        .then(res=>{
                    total.value=res.data.model.length
                    alltabledata.value=[]
                    Object.entries(res.data.model).forEach((k)=>{
                    alltabledata.value.push({
                        reviewid:k[1].reviewid,
                        newsid:k[1].newsid,
                        authorid:k[1].authorid,
                        context:k[1].context,
                        createdAt:k[1].createdAt
                    })
                    tableData.value=alltabledata.value.filter((currentValue,index)=>index<currentPage4.value*pageSize4&&index>=(currentPage4.value-1)*pageSize4)
                    flagtwo.value=false
                })
        })
    }
    else if(select.value=='newsid'){
        newsid=parseInt(Searchinput.value)
        axios.post('/admin/serachrevire',{reviewid,newsid,authorid,context})
        .then(res=>{
                    total.value=res.data.model.length
                    alltabledata.value=[]
                    Object.entries(res.data.model).forEach((k)=>{
                    alltabledata.value.push({
                        reviewid:k[1].reviewid,
                        newsid:k[1].newsid,
                        authorid:k[1].authorid,
                        context:k[1].context,
                        createdAt:k[1].createdAt
                    })
                    tableData.value=alltabledata.value.filter((currentValue,index)=>index<currentPage4.value*pageSize4&&index>=(currentPage4.value-1)*pageSize4)
                    flagtwo.value=false
                })
        })
    }
    else if(select.value=='authorid'){
        authorid=parseInt(Searchinput.value)
        axios.post('/admin/serachrevire',{reviewid,newsid,authorid,context})
        .then(res=>{
                    total.value=res.data.model.length
                    alltabledata.value=[]
                    Object.entries(res.data.model).forEach((k)=>{
                    alltabledata.value.push({
                        reviewid:k[1].reviewid,
                        newsid:k[1].newsid,
                        authorid:k[1].authorid,
                        context:k[1].context,
                        createdAt:k[1].createdAt
                    })
                    tableData.value=alltabledata.value.filter((currentValue,index)=>index<currentPage4.value*pageSize4&&index>=(currentPage4.value-1)*pageSize4)
                    flagtwo.value=false
                })
        })
    }
    else if(select.value=='context'){
        context=Searchinput.value
        axios.post('/admin/serachrevire',{reviewid,newsid,authorid,context})
        .then(res=>{
                    total.value=res.data.model.length
                    alltabledata.value=[]
                    Object.entries(res.data.model).forEach((k)=>{
                    alltabledata.value.push({
                        reviewid:k[1].reviewid,
                        newsid:k[1].newsid,
                        authorid:k[1].authorid,
                        context:k[1].context,
                        createdAt:k[1].createdAt
                    })
                    tableData.value=alltabledata.value.filter((currentValue,index)=>index<currentPage4.value*pageSize4&&index>=(currentPage4.value-1)*pageSize4)
                    flagtwo.value=false
                })
        })
    }else{//内容全控搜索全部
        axios.post('/admin/serachrevire',{reviewid,newsid,authorid,context})
        .then(res=>{
                    total.value=res.data.model.length
                    alltabledata.value=[]
                    Object.entries(res.data.model).forEach((k)=>{
                    alltabledata.value.push({
                        reviewid:k[1].reviewid,
                        newsid:k[1].newsid,
                        authorid:k[1].authorid,
                        context:k[1].context,
                        createdAt:k[1].createdAt
                    })
                    tableData.value=alltabledata.value.filter((currentValue,index)=>index<currentPage4.value*pageSize4&&index>=(currentPage4.value-1)*pageSize4)
                    flagtwo.value=false
                })
        })
    }
}
function start(){
    alltabledata.value=[]
    tableData.value=[]
    axios.get('/admin/reviewall')
        .then(res=>{
            Object.entries(res.data.model).forEach((k)=>{
                tableData.value.push({
                    reviewid:k[1].reviewid,
                    newsid:k[1].newsid,
                    authorid:k[1].authorid,
                    context:k[1].context,
                    relike:k[1].relike,
                    parentid:k[1].parentid,
                    createdAt:k[1].createdAt
                })
            })
            alltabledata.value=tableData.value
            axios.get('/admin/countreview')
            .then(res=>{
                total.value=res.data.model
                currentPage4.value=1
                tableData.value=alltabledata.value.filter((currentValue,index)=>index<currentPage4.value*pageSize4&&index>=(currentPage4.value-1)*pageSize4)
            })
        })
}
onMounted(()=>{
    start()
    getfive()
    setTimeout(() => {
        ones()//可视化初始渲染
    }, 2000);
})
const getRowKeys = (row) => {
      //记录每行的key值
      return row.reviewid;
    }
const handleSelectionChange = (val) => {
      // 解决来回切换页面，也无法清除上次选中情况
      // console.log(val)
    }
function clearselect(){
    multipleTableRef.value.clearSelection()
}
function selecti(selection,row){//多选框状态改变
  let selectall=multipleTableRef.value.data
  let currentselect=[]
  let selectno=[]
  currentselect=selection
  Object.entries(selectall).forEach((it,k1)=>{//筛选出每次跳转分页没选中的项
    let flag=true
    Object.entries(currentselect).forEach((it2,k2)=>{
        if(it[1]==it2[1]){flag=false}
    })
    if(flag==true){
      selectno.push(it[1])
    }
  })
    Object.entries(selectno).forEach((ik)=>{//删除selectidlist中没有勾选的项
      Object.entries(selectidlist.value).forEach((ik2,xk2)=>{
        if(ik[1].reviewid==ik2[1].reviewid){
            selectidlist.value.splice(xk2,1)
        }
      })
  })
}
function selectdelete(){//删除选中
    let i=0;    
    Object.entries(multipleTableRef.value.getSelectionRows()).forEach((item)=>{
        i++
        axios.post('/admin/dereview',{reviewid:`${item[1].reviewid}`}).then((res)=>{})
        if(i==multipleTableRef.value.getSelectionRows().length){
            axios.get('/admin/reviewall').then(res=>{
                    start()
                    ones()
        })
        }
    })
}
function ones(){//图表函数one
    let myChartone = echarts.init(one.value);
    let option;
    option = {
                title:{
                    text:'近五日发布评论图',
                    left:'center'
                },
                xAxis: {
                    type: 'category',
                    data: [`${arr1[7].slice(0,10)}`, `${arr1[6].slice(0,10)}`, `${arr1[5].slice(0,10)}`, `${arr1[4].slice(0,10)}`, `${arr1[3].slice(0,10)}`, `${arr1[2].slice(0,10)}`, `${arr1[1].slice(0,10)}`]
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                    data: [arr2[0][6], arr2[0][5], arr2[0][4], arr2[0][3], arr2[0][2], arr2[0][1], arr2[0][0]],
                    type: 'line'
                    }
                ]
                };
    myChartone.setOption(option);
}
function gotokeshihua(){//打开可视化
    dataBigBox.value.style.transform=`translateY(-100vh)`
    keshihuaBox.value.style.transform=`translateY(-100vh)`
}
function backtop(){//退出可视化
    dataBigBox.value.style.transform=`translateY(0)`
    keshihuaBox.value.style.transform=`translateY(0)`
}
function getfive(){//获取近五天日期
    let myday=new Date()
    let year=myday.getFullYear()
    let month=myday.getMonth()+1
    let date=myday.getDate()
    arr1=[]
    let newdate=year+"-"+month+"-"+date
    let currentdate=year+"-"+month+"-"+date
    for(let i=0;i<7;i++){
        newdate=year+"-"+month+"-"+(date-i-1)
        arr1.push(newdate)
    }
    arr1.unshift(currentdate)
    console.log(arr1)
    axios.post('/admin/sevenreview',{arr1,currentdate})
    .then((res)=>{
        arr2=[]
        arr2.push(res.data.arr2)
        console.log(arr2)
    })

}
</script>

<template>
<div class="reviewBigbox">
    <div class="createreview" v-show="flagone"><!--新建评论-->
        <el-button type="primary" plain style="margin-top: 5vh;margin-left: 1vw;margin-bottom: 1vh;position: absolute;" @click="closereviewBox">关闭评论</el-button>
        <div class="Crrevirebox" style="position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);">
            <el-input v-model="Crreviewid" placeholder="输入评论id" style="width: 30vw;margin-top: 2vh;"/>
            <el-input v-model="Crnewsid" placeholder="输入新闻id" style="width: 30vw;margin-top: 2vh;"/>
            <el-input v-model="Crauthorid" placeholder="输入作者id" style="width: 30vw;margin-top: 2vh;"/>
            <el-input v-model="Crcontext" :rows="2" type="textarea" placeholder="输入评论内容" style="margin-top: 2vh;width: 30vw;"/>
            <el-input v-model="Crparentid" :rows="2" type="text" placeholder="输入父id" style="margin-top: 2vh;width: 30vw;"/>
            <el-input v-model="Crrelike" placeholder="评论点赞数量" style="width: 30vw;margin-top: 2vh;"/>
            <el-button type="primary" plain  @click="createreviewbutton" style="display: block;margin-top: 2vh;">新建评论</el-button>
        </div>
    </div>
    <div class="updatereview" v-show="flagtwo">
        <el-button type="primary" plain style="margin-top: 5vh;margin-left: 1vw;margin-bottom: 1vh;position: absolute;" @click="closeupdatereview">关闭编辑</el-button>
        <div style="position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);">
            <el-input v-model="Upnews" placeholder="新闻id" disabled style="width: 30vw;margin-top: 2vh;"/>
            <el-input v-model="Upauthorid" placeholder="作者id" disabled style="width: 30vw;margin-top: 2vh;"/>
            <el-input v-model="Upcontext" :rows="2" type="textarea" placeholder="输入评论内容" style="margin-top: 2vh;width: 30vw;"/>
            <el-input v-model="Uprelike" placeholder="评论点赞数" style="width: 30vw;margin-top: 2vh;"/>
            <el-button type="primary" plain style="display: block;margin-top: 2vh;" @click="updareview">更新评论</el-button>
        </div>
    </div>
    <div class="reviewtablebox" ref="dataBigBox">
        <div style="display: flex;flex-direction: row;height: 4.5vh;margin-top: 5vh;">
        <el-button type="primary" plain  @click="createreviewBox" style="margin-left: 1vw;">新建评论</el-button>
        <el-input
        v-model="Searchinput"
        placeholder="Please input"
        class="input-with-select"
        style="width: 50vw;margin-left: 1vw;"
        >
        <template #prepend>
        <el-button :icon="Search"  @click="searchreviews"/>
        </template>
        <template #append>
        <el-select v-model="select" placeholder="Select" style="width: 115px">
          <el-option label="评论Id" value="reviewid" />
          <el-option label="新闻id" value="newsid" />
          <el-option label="作者id" value="authorid" />
          <el-option label="内容" value="context" />
        </el-select>
        </template>
        </el-input>
        </div>
        <el-table :data="tableData" :default-sort="sortrule" style="width: 100%;height: 70vh;" ref="multipleTableRef" :row-key="getRowKeys" @selection-change="handleSelectionChange" @select="selecti">
            <el-table-column type="selection" width="50" :reserve-selection="true"></el-table-column>
            <el-table-column fixed prop="reviewid" sortable label="评论id" width="150" />
            <el-table-column prop="newsid"  sortable label="新闻id" width="120" />
            <el-table-column prop="authorid" sortable label="作者id" width="120" />
            <el-table-column prop="context" sortable label="评论内容" width="600" />
            <el-table-column prop="parentid" sortable label="父id" width="120" />
            <el-table-column prop="relike" sortable label="点赞" width="120" />
            <el-table-column prop="createdAt" sortable label="发布日期" width="120" />
            <el-table-column fixed="right" sortable label="Operations" width="120">
            <template #default="scope">
            <el-button link type="primary" size="small" @click="updatereviewBox(scope)">编辑</el-button>
            <el-button link type="primary" size="small" @click="dereview(scope)">删除</el-button>
            </template>
            </el-table-column>
        </el-table>

        <div class="demo-pagination-block">
            <el-pagination v-model:current-page="currentPage4" v-model:page-size="pageSize4"
            layout="total, prev, pager, next, jumper"
            :total="total"
            @current-change="handleCurrentChange"/>
            <el-button @click="selectdelete" plain type="danger">
                    删除选中
            </el-button>
            <el-button @click="gotokeshihua" plain type="primary">图表统计</el-button>
        </div>
    </div>

    <div class="keshihuabox" ref="keshihuaBox">
        <div style="margin-left:3vh;"><el-button type="primary" @click="backtop">返回</el-button></div>
        <div  ref="one" style="width:80vw;height:80vh;"></div>
    </div>
</div>
</template>
<style scoped>
.reviewBigbox{
    width: 100%;
    height: 100vh;
    overflow: scroll;
    overflow:hidden;
    position: relative;
}
.createreview{
    position: absolute;
    width: 100vw;
    height: 100vh;
    z-index: 5;
    background-color: rgba(0, 0, 0, 0.8);
}
.reviewtablebox{
    width:100%;
    height:100vh;
    transition:all 1s;
}
.updatereview{
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 5;
    background-color: rgba(0, 0, 0, 0.8);
}
.demo-pagination-block + .demo-pagination-block {
  margin-top: 10px;
}
.demo-pagination-block .demonstration {
  margin-bottom: 16px;
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
.keshihuabox{
    width:100vw;
    height:100vh;
    transition:all 1s;
}
</style>