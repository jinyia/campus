<template>
<div class="bigxbox">
    <!-- 添加关注 -->
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
                        <el-form-item label="作者">
                            <el-input v-model="form.authorid" />
                        </el-form-item>
                        <el-button type="primary" plain style="margin-left: 8vw;" @click="createconcern">新建</el-button>
                    </el-form>
                </div>
        </div>
    </view>
    <!-- 编辑关注 -->
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
                        <el-form-item label="作者id">
                            <el-input v-model="form2.authorid" />
                        </el-form-item>
                        <el-button type="primary" plain style="margin-left: 8vw;" @click="updateconcern">更新</el-button>
                    </el-form>
                </div>
        </div>
    </view>
    <!-- 表格 -->
    <div style="width: 85vw;height: 100vh;overflow: hidden;transition: all 1s;" ref="datatablebox">
        <div style="height:10vh;display:flex;flex-direction:row;align-items:center;">
                <el-button type="primary" style="margin-left:2vw;" @click="opencreate">添加关注</el-button>
                <el-input v-model="Searchinput" placeholder="Please input" class="input-with-select" style="width: 60%;margin-left: 1vw;">
                    <template #prepend>
                    <el-button @click="searchnews">
                        搜索
                    </el-button>
                    </template>
                    <template #append>
                    <el-select v-model="Searchselect" placeholder="Select" style="width: 115px">
                        <el-option label="concernid" value="concernid" />
                        <el-option label="用户id" value="userid" />
                        <el-option label="作者id" value="authorid" />
                    </el-select>
                    </template>
                </el-input>
        </div>
        <el-table :data="tableData" :default-sort="sortrule"  ref="multipleTableRef" style="width: 100%;height:60%;" :row-key="getRowKeys" ><!--@selection-change="handleSelectionChange" @selection-change="handleSelectionChange"-->
                <el-table-column type="selection" width="50" :reserve-selection="true"></el-table-column>
                <el-table-column fixed  sortable  prop="concernid" label="concernid" width="300" />
                <el-table-column prop="userid" sortable label="用户id" width="300" />
                <el-table-column prop="authorid" sortable label="作者id" width="300" />
                <el-table-column prop="createdAt" sortable label="创建日期" width="300" />
                <el-table-column fixed="right"  label="Operations" width="300">
                    <template #default="scope"
                    ><!--scope 用来获取当前行的元素数据-->
                    <el-button link type="primary" size="small" @click="handleClick(scope.row.userid,scope.row.authorid,scope.row.concernid)">编辑</el-button>
                    <el-button link type="primary" size="small" @click="deleteuser(scope.row.concernid)">删除</el-button>
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
        </div>
    <!-- <div style="width: 85vw;height: 100vh;overflow: hidden;transition: all 1s;z-index: 999;" ref="tabledata">
            <div style="margin-bottom:5vh;margin-left:3vh;margin-top: 5vh;"><el-button type="primary" @click="backtop">返回</el-button></div>
            <div class="one" ref="one" style="width:80vw;height:80vh;"></div>
    </div> -->
</div>
</template>
<script setup>
    import axios from "axios";
    import { onMounted, ref,reactive,computed } from "vue";
    import * as echarts from 'echarts';
    import { ElMessage,ElTable } from 'element-plus';
    const form = reactive({
        userid:0,
        authorid:0
    })
    const form2=reactive({ 
        userid:0,
        authorid:0
    })
    let createflag=ref(false)//新建模态框控制
    let updateflag=ref(false)//编辑模态框控制
    let tableData=ref([])
    let alltableData=ref([])
    let multipleTableRef=ref()//表格ref
    let currentconcernid;//当前collectsid
    let currentPage4=ref(1)//当前分页
    let total=ref(0)//数量总数
    let pagesize=10;//分页每页显示10条数据
    let Searchinput=ref()//搜索框
    let Searchselect=ref('concernid')//选择框的值
    let tabledata=ref()
    let datatablebox=ref()
    let sortrule={ //排序规则
    prop: 'concernid', order: 'descending',
    prop: 'userid', order: 'descending',
    prop: 'authorid', order: 'descending',
    prop: 'createdAt', order: 'descending'
    }
    // function gotop(){
    // datatablebox.value.style.transform=`translateY(-100vh)`
    // tabledata.value.style.transform=`translateY(-100vh)`
    // }
    // function backtop(){
    //     datatablebox.value.style.transform=`translateY(0)`
    //     tabledata.value.style.transform=`translateY(0)`
    // }
    function searchnews(){//搜索事件
        let concernid=0;
        let userid=0;
        let authorid=0;
        if(Searchselect.value=='concernid'){
            concernid=Searchinput.value
        }else if(Searchselect.value=='userid'){
            userid=Searchinput.value
        }else{
            authorid=Searchinput.value
        }
        axios.post('/admin/seaconcern',{concernid,userid,authorid})
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
    function deleteuser(concernids){//删除关注
        let concernid=concernids
        axios.post('/admin/deleteconcern',{concernid:`${concernid}`})
            .then((res)=>{
                if(res.data.msg=='删除成功'){
                    start()
                }
            })
    }
    function updateconcern(){//更新关注
        let concernid=currentconcernid
        let userid=form2.userid
        let authorid=form2.authorid
        axios.post('/admin/updateconcern',{concernid:`${concernid}`,userid:`${userid}`,authorid:`${authorid}`})
        .then((res)=>{
            if(res.data.msg=='已经存在'){ElMessage('已经存在')}
            else if(res.data.msg=='失败'){ElMessage('失败')}
            else{
                start()
                updateflag.value=false
            }
        })
    }
    function  closeupdate(){
        updateflag.value=false
    }
    function handleClick(userid,authorid,concernid){//打开编辑界面
        updateflag.value=true
        form2.userid=userid
        form2.authorid=authorid
        currentconcernid=concernid
    }
    function createconcern(){//创建新关注
        axios.post('/admin/createconcern',{userid:`${form.userid}`,authorid:`${form.authorid}`})
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
        return row.concernid;
    }
    function clearselect(){//清除选项
    multipleTableRef.value.clearSelection()
    }
    function handleCurrentChange(e){//索引改变
        currentPage4.value=e
        tableData.value=alltableData.value.filter((currentValue,index)=>index<currentPage4.value*pagesize&&index>=(currentPage4.value-1)*pagesize)
    }
    function start() {//初始化
        let i=0;
        alltableData.value=[]
        tableData.value=[]
        axios.get("/admin/allconcern")
            .then((res)=>{
                Object.entries(res.data.model).forEach((item)=>{
                    i++
                    alltableData.value.push({
                    concernid:item[1].concernid,
                    userid:item[1].userid,
                    authorid:item[1].authorid,
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
    function selectdelete(){//删除选中
        let s=0;
        Object.entries(multipleTableRef.value.getSelectionRows()).forEach((item)=>{
            s++;
            axios.post('/admin/deleteconcern',{concernid:item[1].concernid}).then((res)=>{
            })
            if(s==multipleTableRef.value.getSelectionRows().length){
                    tableData.value=[]
                    start()
            }
        })
    }
    onMounted(()=>{
        start()
    })
</script>
<style scoped>
.bigxbox{
    width:85vw;
    height:100vh;
    overflow:hidden;
    position:reactive;
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