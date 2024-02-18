<template>
    <div class="newsauditBox">
    <!--查看数据-->
    <div class="shownewsdata" v-show="showflag">
        <el-button type="primary" size="default" @click="closenewsdaat" style="margin-top: 2vh;margin-left: 2vw;position: absolute;z-index: 10;">关闭</el-button>
            <div style="position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);">
                <div style="width: 100%;height: 40vh;"></div>
                <div><!--新闻封面图-->
                <el-upload action="#" list-type="picture-card" :auto-upload="false"
                    :limit="1"
                    :file-list="uptitlecoverfiles"
                    :class="{hide_box:uploadone}"
                    >
                    <el-icon><Plus /></el-icon>
                    <template #file="{ file }">
                    <div>
                     <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                        <span class="el-upload-list__item-actions">
                        <span class="el-upload-list__item-preview" @click="uploadonereview(file)">
                    <el-icon><zoom-in /></el-icon>
                    </span>
                    </span>
                    </div>
                    </template>
                </el-upload>
                <el-dialog v-model="dialogVisible" append-to-body>
                        <img w-full :src="dialogImageUrl" alt="Preview Image" style="max-width: 500px;max-height: 500px;"/>
                </el-dialog>
                </div>
                <el-input v-model="upauthorid" placeholder="作者id" disabled style="width: 30vw;margin-top: 2vh;"/>
                <el-input v-model="upauthor" placeholder="作者名称" disabled style="width: 30vw;margin-top: 2vh;"/>
                <el-input v-model="uptitle" placeholder="标题" disabled style="width: 30vw;margin-top: 2vh;"/>
                <el-select v-model="upcategory" disabled class="m-2" placeholder="Select" size="large" style="margin-top: 2vh;">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <div style="margin-top:2vh;margin-bottom:2vh;">
                    <main id="sample"><!--富文本编辑器-->
                    <Editor api-key="no-api-key" :init="tinyconfig" />
                    </main>
                </div>

                <div style="display: flex;flex-direction: row;margin-top: 2vh;"><!--视频-->
                    <el-upload action="#" list-type="picture-card" :auto-upload="false"
                    :limit="1"
                    disabled
                    :file-list="videouploadfiles"
                    :class="{videotwo:videoflag}"
                    >
                    <el-icon><Plus /></el-icon>
                 <template #file="{ file }">
                <div>
                <video  style="width: 100%;height: 150px;" controls="controls" :src="file.url"></video>
                <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview" @click="vediotwohandlePictureCardPreview(file)">
                        <el-icon><zoom-in /></el-icon>
                    </span>
                </span>
                </div>
                </template>
                </el-upload>
                <el-dialog v-model="vediotwodialogVisible" append-to-body>
                    <video width="100%" style="width: 100%;height: 100%;" controls="controls" :src="videouploadfiles[0].url"></video>
                </el-dialog>
                </div>
                <el-input v-model="upreadership" placeholder="阅读量" disabled style="width: 30vw;margin-top: 2vh;"/>
                <el-input v-model="upgivelike" placeholder="点赞" disabled style="width: 30vw;margin-top: 2vh;"/>
                <el-input v-model="upcollect" placeholder="收藏" disabled style="width: 30vw;margin-top: 2vh;"/>
                <el-input v-model="upstatus" placeholder="状态" disabled style="width: 30vw;margin-top: 2vh;"/>
                <div style="margin-top: 2vh;">
                    <el-button type="primary" plain @click="pass">通过</el-button>
                    <el-button type="primary" plain @click="lose">驳回</el-button>
                </div>
            </div>
    </div>
     <el-input
      v-model="searchinput"
      placeholder="Please input"
      style="width: 40vw;margin-left: 1vw;margin-top: 5vh;"
    >
      <template #prepend>
        <el-button :icon="Search" @click="searchnewsaudit"/>
      </template>
      <template #append>
        <el-select v-model="select" placeholder="Select" style="width: 115px">
          <el-option label="新闻id" value="newsid" />
          <el-option label="作者id" value="authorid" />
          <el-option label="作者名" value="author" />
          <el-option label="标题" value="title" />
          <el-option label="分类" value="category" />
          <el-option label="内容" value="context" />
        </el-select>
      </template>
    </el-input>
    <el-table :default-sort="sortrule" :data="tableData" style="width: 100%;height:70vh;" ref="multipleTableRef" :row-key="getRowKeys" @selection-change="handleSelectionChange" @select="selecti"> <!--表格渲染数据-->
        <el-table-column type="selection" width="50"  :reserve-selection="false"></el-table-column>
        <el-table-column fixed prop="newsid" sortable label="新闻id" width="150" />
        <el-table-column  prop="authorid" sortable label="作者id" width="150" />
        <el-table-column  prop="author" sortable label="作者名" width="150" />
        <el-table-column prop="title" sortable label="标题" width="200" />
        <el-table-column prop="titlecover"  label="新闻封面" width="120">
            <template #default="scope">
                <el-image  style="width: 50px; height: 50px" :src="scope.row.titlecover" alt=""></el-image>
            </template>
        </el-table-column>
        <el-table-column prop="category" sortable label="分类" width="100" />
        <el-table-column prop="context" :show-overflow-tooltip="true" sortable label="内容" width="600" />
        <el-table-column prop="" label="视频" width="400" >
            <template #default="scope" style="display: flex;flex-direction: row;">
                <video  style="width: 200px;height: 100px;" controls="controls" :src="scope.row.vedio"></video>
            </template>
        </el-table-column>
        <el-table-column prop="readership" sortable label="阅读量" width="100" />
        <el-table-column prop="givelike" sortable label="点赞" width="100" />
        <el-table-column prop="collet" sortable label="收藏" width="100" />
        <el-table-column prop="status" sortable label="状态" width="100" />
        <el-table-column prop="createdAt" sortable label="发布日期" width="300" />
        <el-table-column fixed="right" label="Operations" width="120">
            <template #default="scope">
                <el-button link type="primary" size="small" @click="upnews(scope)">查看</el-button>
                <el-button link type="primary" size="small" @click="directlose(scope)">驳回</el-button>
            </template>
        </el-table-column>
    </el-table>

    <div class="demo-pagination-block">
        <el-pagination
            v-model:current-page="currentPage4"
            v-model:page-size="pageSize4"
            layout="total, prev, pager, next, jumper"
            :total="total"
            @current-change="handleCurrentChange"
            />
        <el-button @click="selectdelete" plain type="danger">
            删除选中
        </el-button>
        </div>

    
    </div>

</template>

<script setup >
import Editor from '@tinymce/tinymce-vue'
import axios from 'axios';
import {ref,onMounted} from 'vue'
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'
import { Search } from '@element-plus/icons-vue'
let select=ref('newsid')//搜索框选项卡的值
let searchinput=ref()//搜索框的值
let tableData=ref([])//表格渲染数据
let alltableData=ref([])//总表格数据
let total=ref(0)//表格总条目
let currentPage4=ref(1)//当前表格索引
let pageSize4=10//分页10条
let showflag=ref(false)//控制查看数据按钮
let upauthorid=ref()//查看界面作者id
let upauthor=ref()//查看界面作者名
let uptitle=ref()//查看界面新闻标题
let upcategory=ref()//查看新闻分类
let upcontext=ref()//查看界面新闻内容
let upreadership=ref()//查看界面阅读量
let upgivelike=ref()//查看界面点赞数
let upcollect=ref()//查看界面收藏数
let upstatus=ref()//查看界面状态值
let uploadone=ref(false)//查看界面头像框控制隐藏
let upcontextfiles=ref([])//查看界面内容图file-list
let videoflag=ref(false)//查看界面视频控制隐藏
const dialogImageUrl = ref('')
const dialogVisible = ref(false)//查看界面封面图
let uptitlecoverfiles=ref([])//查看界面封面图组件file-list
let videouploadfiles=ref([])//查看界面视频file-list
let vediotwodialogVisible=ref(false)//视频预览是否可见
let dialogVisibletwo=ref(false)//内容图预览是否可见
let dialogImageUrltwo=ref()//多图预览地址2
let currentnewsid=ref(0)//当前新闻Id
let currenttitleurl=ref()//当前封面图url
let currentcontextimage=ref('')//当前内容图url
let currentvediourl=ref()//当前视频地址url
let multipleTableRef=ref([])//表格
let selectidlist=ref([])//选中的项列表
let sortrule={ //排序规则
  prop: 'newsid', order: 'descending',
  prop: 'authorid', order: 'descending',
  prop: 'author', order: 'descending',
  prop: 'title', order: 'descending',
  prop: 'category', order: 'descending',
  prop: 'readership', order: 'descending',
  prop: 'givelike', order: 'descending',
  prop: 'collet', order: 'descending',
  prop: 'status', order: 'descending',
  prop: 'createdAt', order: 'descending',
}
const options = [//新闻分类选项卡
  {
    value: '学校新闻',
    label: '学校新闻',
  },
  {
    value: '学习新闻',
    label: '学习新闻',
  },
  {
    value: '生活情感新闻',
    label: '生活情感新闻',
  },
  {
    value: '各级活动新闻',
    label: '各级活动新闻',
  },
  {
    value: '体育文化艺术新闻',
    label: '体育文化艺术新闻',
  },
]
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
function upnews(scope){//查看数据按钮
    showflag.value=true
    console.log(scope)
    let s1=decodeURI(scope.row.titlecover)
    currenttitleurl.value=scope.row.titlecover
    uptitlecoverfiles.value=[{url:s1}]
    uploadone.value=true
    upcontextfiles.value=[]
    let v1=decodeURI( scope.row.vedio)
    currentvediourl.value=scope.row.vedio
    videouploadfiles.value=[{url:v1}]
    videoflag.value=true
    currentnewsid.value=scope.row.newsid
    upauthorid.value=scope.row.authorid
    upauthor.value=scope.row.author
    uptitle.value=scope.row.title
    upcategory.value=scope.row.category
    tinyMCE.activeEditor.setContent(scope.row.context)
    upreadership.value=scope.row.readership
    upgivelike.value=scope.row.givelike
    upcollect.value=scope.row.collet
    upstatus.value=scope.row.status
}
function closenewsdaat(){//关闭查看界面
    showflag.value=false
}
function handleCurrentChange(e){//分页索引改变
    currentPage4.value=e
    tableData.value=alltableData.value.filter((currentValue,index)=>index<currentPage4.value*pageSize4&&index>=(currentPage4.value-1)*pageSize4) 
        Object.entries(multipleTableRef.value.getSelectionRows()).forEach((item)=>{//分页变化时，把当前的选中项添加到selectidlist中
        let flag=true
        Object.entries(selectidlist.value).forEach((item2,k)=>{
            if(item[1].newsid==item2[1].newsid){
                flag=false//一样则不渲染
            }
        })
        if(flag){
            selectidlist.value.push(item[1])
        }
    })
    setTimeout(() => {
        Object.entries(selectidlist.value).forEach((item2)=>{
        multipleTableRef.value.toggleRowSelection(item2[1],true)
    })
    },1);
}
function uploadonereview(file){//查看界面新闻封面预览
    dialogImageUrl.value = file.url
    dialogVisible.value = true
}
function vediotwohandlePictureCardPreview(file){//视频预览
    vediotwodialogVisible.value=true
}
function uploadtworeview(file){//多图预览
    dialogVisibletwo.value=true,
    dialogImageUrltwo.value=file.response
}
function pass(){//查看界面通过按钮
    let ss=tinyMCE.activeEditor.getContent()
    ss=ss.replaceAll('public',"http://localhost:5173/public")
    let data={
        newsid:currentnewsid.value,
        authorid:upauthorid.value,
        author:upauthor.value,
        title:uptitle.value,
        titlecover:currenttitleurl.value,
        category:upcategory.value,
        context:ss,
        vedio:currentvediourl.value,
        readership:upreadership.value,
        givelike:upgivelike.value,
        collet:upcollect.value,
        status:1,
        createdAt:gettime()
    }

    axios.post('/admin/CreateNews',data)
    .then(res=>{
        //删除新闻审核表中的新闻
        let auditnewsid=currentnewsid.value
        axios.post('/admin/newsauditdelete',{newsid:auditnewsid})
        .then(res=>{
            //重新获取表格数据
            showflag.value=false
            alltableData.value=[]
            axios.get('/admin/newsauditall')
            .then(res=>{
            Object.entries(res.data.model).forEach((k)=>{
            alltableData.value.push({
                newsid:k[1].newsid,
                authorid:k[1].authorid,
                author:k[1].author,
                title:k[1].title,
                titlecover:k[1].titlecover,
                category:k[1].category,
                context:k[1].context,
                vedio:k[1].vedio,
                readership:k[1].readership,
                givelike:k[1].givelike,
                collet:k[1].collet,
                createdAt:k[1].createdAt,
                status:k[1].status
            })
        })
        total.value=alltableData.value.length
        tableData.value=alltableData.value.filter((currentValue,index)=>index<currentPage4.value*pageSize4&&index>=(currentPage4.value-1)*pageSize4)
        currentPage4.value=1
            })
        })
    })
}
function lose(){//查看驳回按钮
    let ss=tinyMCE.activeEditor.getContent()
    ss=ss.replaceAll('public',"http://localhost:5173/public")
    let data={
        newsid:currentnewsid.value,
        authorid:upauthorid.value,
        author:upauthor.value,
        title:uptitle.value,
        titlecover:currenttitleurl.value,
        category:upcategory.value,
        context:ss,
        vedio:currentvediourl.value,
        readership:upreadership.value,
        givelike:upgivelike.value,
        collet:upcollect.value,
        status:-1,
        createdAt:gettime()
    }
    axios.post('/admin/newslosecreate',data)
    .then(res=>{
        //删除新闻审核表中的新闻
        let auditnewsid=currentnewsid.value
        axios.post('/admin/newsauditdelete',{newsid:auditnewsid})
        .then(res=>{
            //重新获取表格数据
            showflag.value=false
            alltableData.value=[]
            axios.get('/admin/newsauditall')
            .then(res=>{
            Object.entries(res.data.model).forEach((k)=>{
            alltableData.value.push({
                newsid:k[1].newsid,
                authorid:k[1].authorid,
                author:k[1].author,
                title:k[1].title,
                titlecover:k[1].titlecover,
                category:k[1].category,
                context:k[1].context,
                vedio:k[1].vedio,
                readership:k[1].readership,
                givelike:k[1].givelike,
                collet:k[1].collet,
                createdAt:k[1].createdAt,
                status:k[1].status
            })
        })
        total.value=alltableData.value.length
        tableData.value=alltableData.value.filter((currentValue,index)=>index<currentPage4.value*pageSize4&&index>=(currentPage4.value-1)*pageSize4)
        currentPage4.value=1
            })
        })
    })
}
function directlose(scope){//主界面直接驳回按钮
    let data={
        newsid:scope.row.newsid,
        authorid:scope.row.authorid,
        author:scope.row.author,
        title:scope.row.title,
        titlecover:scope.row.titlecover,
        category:scope.row.category,
        context:scope.row.context,
        vedio:scope.row.vedio,
        readership:scope.row.readership,
        givelike:scope.row.givelike,
        collet:scope.row.collet,
        status:-1,
        createdAt:gettime()
    }
    axios.post('/admin/newslosecreate',data)
    .then(res=>{
        //删除新闻审核表中的新闻
        let auditnewsid=scope.row.newsid
        axios.post('/admin/newsauditdelete',{newsid:auditnewsid})
        .then(res=>{
            //重新获取表格数据
            showflag.value=false
            alltableData.value=[]
            axios.get('/admin/newsauditall')
            .then(res=>{
            Object.entries(res.data.model).forEach((k)=>{
            alltableData.value.push({
                newsid:k[1].newsid,
                authorid:k[1].authorid,
                author:k[1].author,
                title:k[1].title,
                titlecover:k[1].titlecover,
                category:k[1].category,
                context:k[1].context,
                vedio:k[1].vedio,
                readership:k[1].readership,
                givelike:k[1].givelike,
                collet:k[1].collet,
                createdAt:k[1].createdAt,
                status:k[1].status
            })
        })
        total.value=alltableData.value.length
        tableData.value=alltableData.value.filter((currentValue,index)=>index<currentPage4.value*pageSize4&&index>=(currentPage4.value-1)*pageSize4)
            })
        })
    })
}
function searchnewsaudit(){//搜索审核的新闻
    let searchtetx=searchinput.value
    let searchcategorytext=select.value
    axios.post('/admin/selectnewsaudit',{search:searchtetx,searchcategory:searchcategorytext})
    .then(res=>{
        alltableData.value=[]
            Object.entries(res.data.model).forEach((k)=>{
            alltableData.value.push({
                newsid:k[1].newsid,
                authorid:k[1].authorid,
                author:k[1].author,
                title:k[1].title,
                titlecover:k[1].titlecover,
                category:k[1].category,
                context:k[1].context,
                vedio:k[1].vedio,
                readership:k[1].readership,
                givelike:k[1].givelike,
                collet:k[1].collet,
                createdAt:k[1].createdAt,
                status:k[1].status
            })
        })
        total.value=alltableData.value.length
        tableData.value=alltableData.value.filter((currentValue,index)=>index<currentPage4.value*pageSize4&&index>=(currentPage4.value-1)*pageSize4)
        currentPage4.value=1
    })
}
onMounted(()=>{
    axios.get('/admin/newsauditall')
    .then(res=>{
        Object.entries(res.data.model).forEach((k)=>{
            alltableData.value.push({
                newsid:k[1].newsid,
                authorid:k[1].authorid,
                author:k[1].author,
                title:k[1].title,
                titlecover:k[1].titlecover,
                category:k[1].category,
                context:k[1].context,
                vedio:k[1].vedio,
                readership:k[1].readership,
                givelike:k[1].givelike,
                collet:k[1].collet,
                createdAt:k[1].createdAt,
                status:k[1].status
            })
        })
        total.value=alltableData.value.length
        tableData.value=alltableData.value.filter((currentValue,index)=>index<currentPage4.value*pageSize4&&index>=(currentPage4.value-1)*pageSize4)
        currentPage4.value=1
    })
})

const example_image_upload_handler = (blobInfo, progress) => new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('file', blobInfo.blob())
    axios.post('/admin/image',formData)
    .then(res=>{
        console.log(res);
        resolve(res.data.Image);
        return
    })
    
  
});
let tinyconfig=({
    selector: '#sample',  // change this value according to your HTML
    plugins: 'image',
    toolbar: 'image',
    width:'40vw',
    height:'80vh',
    images_upload_handler: example_image_upload_handler
});

const getRowKeys = (row) => {
      //记录每行的key值
      return row.id;
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
        if(ik[1].newsid==ik2[1].newsid){
            selectidlist.value.splice(xk2,1)
        }
      })
  })
}
function selectdelete(){
    Object.entries(multipleTableRef.value.getSelectionRows()).forEach((item)=>{
        axios.post('/admin/newsauditdelete',{newsid:`${item[1].newsid}`}).then((res)=>{
        })
    })
    alltableData.value=[]
    axios.get('/admin/newsauditall')
            .then(res=>{
            Object.entries(res.data.model).forEach((k)=>{
            alltableData.value.push({
                newsid:k[1].newsid,
                authorid:k[1].authorid,
                author:k[1].author,
                title:k[1].title,
                titlecover:k[1].titlecover,
                category:k[1].category,
                context:k[1].context,
                vedio:k[1].vedio,
                readership:k[1].readership,
                givelike:k[1].givelike,
                collet:k[1].collet,
                createdAt:k[1].createdAt,
                status:k[1].status
            })
        })
        total.value=alltableData.value.length
        tableData.value=alltableData.value.filter((currentValue,index)=>index<currentPage4.value*pageSize4&&index>=(currentPage4.value-1)*pageSize4)
        currentPage4.value=1
        })
}
</script>
<style scoped>
.newsauditBox{
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
}
.shownewsdata{
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 6;
    overflow: auto;
    overflow-x: hidden;
}
.newsdatabox{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-40%,-50%);
}
.hide_box /deep/ .el-upload--picture-card{
    display: none;
}
.videotwo /deep/ .el-upload--picture-card{
    display: none;
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