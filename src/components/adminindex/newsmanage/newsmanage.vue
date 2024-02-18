<script setup>
import Editor from '@tinymce/tinymce-vue'
import { onMounted,ref } from 'vue';
import axios from "axios";
import { Delete,  Plus, ZoomIn } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'//消息提示框
import * as echarts from 'echarts';
const tableData = ref([])//表格数据
let createflag=ref(false)//判断新建新闻界面
const Crselectvalue = ref('')//选项卡的值
let Crtoitlecover=ref()//新建新闻界面的新闻封面图
let Crcurrenttitlecover=ref()//新建新闻界面当前封面图片地址
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)
let upflag=ref(false)//控制编辑界面
let Crcontext=ref()//新建界面多张图
let Crconimagelist=ref([])//新建界面多选图列表用来删除新建时多选图
let CrconimagelistTwo=ref('')//新建界面多选图用来上传数据库
let uploadone=ref(false)//控制新建新闻界面头像框的隐藏
let uploadtwo=ref(false)
let Crnewsid=ref()//新建新闻界面的输入框值
let Crauthoorid=ref()//新建新闻界面的输入框值
let Crauthoor=ref()//新建新闻界面的输入框值
let Crtitle=ref()//新建新闻界面的输入框值
let multipleTableRef=ref([])//表格
let selectidlist=ref([])//选中的项列表
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
let Crcategory=ref()//新建新闻界面分类
let Crtextarea=ref()//新建新闻界面的输入框值
let Crreadership=ref(0)//新建新闻界面的输入框值
let Crgivelike=ref(0)//新建新闻界面的输入框值
let Crcollet=ref(0)//新建新闻界面的输入框值

let uptitlecover=ref()//编辑界面封面组件
let uploadonethree=ref(false)//编辑界面控制封面显示隐藏
let uptitlecoverfiles=ref([])//控制编辑界面的封面文件列表
let upauthorid=ref()//编辑界面输入框值
let upauthor=ref()//编辑界面输入框值
let uptitle=ref()//编辑界面输入框值
let upcategory=ref()//编辑界面输入框值
let upcontext=ref()//编辑框界面输入的值
let upreadership=ref()//编辑界面输入框值
let upgivelike=ref()//编辑界面输入框值
let upcollect=ref()//编辑界面输入框值

let uploadonefour=ref(false)//控制编辑界面内容多选图的隐藏
let upcontimagefiles=ref([])//编辑界面多图的file-list列表
let upcontimage=ref()//编辑界面多图的组件名
let CurrcontimageUrls=ref()//编辑界面多图的url拼接存数据库
let Currupdatenewsid=ref(0)//编辑界面现在的新闻id
let Searchinput=ref()//搜索框
let Searchselect=ref('newsid')//选择框的值

let pageSize4=10;//一页10条数据
let total=ref(0)//数据总条目
let currentPage4=ref(1)//分页当前索引
let alltabledata=ref()//分页表格总数据

let videooneflag=ref(false)//上传视频后隐藏上传组件
let ishow=ref(false)//控制视频的显示
let vedioupload=ref()//新建界面视频上传控件
let vediodialogVisible=ref(false)//视频预览
let dialogonevedio=ref()

let CRvediourl=ref()//当前视频url
let videotwoflag=ref()//编辑界面视频上传组件
let vediotwoupload=ref()//编辑界面视频上传组件
let vediotwo=ref([])//编辑界面视频组件的file-list
let ishowtwo=ref(false)
let vediotwodialogVisible=ref(false)
let one=ref()//可视化图标1
let newtables=ref()//新闻管理大盒子
let tableview=ref()//可视化盒子

let autocreateidflag=ref(false)//创建用户控制自动显示用户名节流阀
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
const CrhandleRemove = (file) => {//新建新闻封面移除
    Crtoitlecover.value.clearFiles()
    uploadone.value=false;
}

const CrhandlePictureCardPreview = (file) => {//新建新闻预览
  dialogImageUrl.value = file.url
  dialogVisible.value = true
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
function createNews(){//打开新建新闻界面
    createflag.value=true
}
function closeNews(){//关闭新建新闻界面
    createflag.value=false
}
function Crtitlecoveruploadsuccess(res,file,files){//新闻封面上传成功
    uploadone.value=true;
    Crcurrenttitlecover.value=res.Image;
}
function createnews(){//创建新闻
    let ss=(tinyMCE.activeEditor.getContent()).toString();
    let context=ss.replaceAll('public',"http://localhost:5173/public")//这里的地址是项目的端口，不是express的端口
    let data={
        authorid:Crauthoorid.value,
        author:Crauthoor.value,
        title:Crtitle.value,
        titlecover:Crcurrenttitlecover.value,
        category:Crcategory.value,
        context:context,
        vedio:CRvediourl.value,
        readership:Crreadership.value,
        givelike:Crgivelike.value,
        collet:Crcollet.value,
        createdAt:gettime(),
        status:true
    }
    let authorid=Crauthoorid.value
    let author=Crauthoor.value
    axios.post('/admin/existuser',{authorid,author})
    .then(res=>{
        if(res.data.msg=='存在'){
            axios.post('/admin/CreateNews',data)
    .then(res=>{
        start()
        createflag.value=false
    })
    createflag.value=false
    Crnewsid.value='',
    Crauthoorid.value='',
    Crauthoor.value='',
    Crtitle.value='',
    Crcurrenttitlecover.value='',
    Crcategory.value='',
    Crtextarea.value='',
    CrconimagelistTwo.value='',
    Crreadership.value='0',
    Crgivelike.value='0',
    Crcollet.value='0',
    Crtoitlecover.value.clearFiles(),
    vedioupload.value.clearFiles()
    uploadone.value=false;
    currentPage4.value=1
    //重新渲染表格
    tableData.value=alltabledata.value.filter((currentValue,index)=>index<currentPage4.value*pageSize4&&index>=(currentPage4.value-1)*pageSize4)
    axios.get('/admin/newscount')
   .then(res=>{
        total.value=res.data.model
    })
        }
        else if(res.data.msg=='不存在'){
            ElMessage('用户id或者用户名不存在')
        }
    })
    ones()
}
function upnews(scope){//编辑新闻
        console.log(scope)
        tinyMCE.activeEditor.setContent(scope.row.context)
        const s1=scope.row.titlecover
        let s2=decodeURI(s1)//字符串装成地址
        //vediotwo
        uptitlecoverfiles.value=[]
        uptitlecoverfiles.value.push({url:s2})
        // console.log(uptitlecoverfiles.value)
        const v1=scope.row.vedio
        let v2=decodeURI(v1)//字符串转成视频地址
        vediotwo.value=[{url:v2}]
        ishowtwo.value=true
        videotwoflag.value=true
        Currupdatenewsid.value=scope.row.newsid
        upauthorid.value=scope.row.authorid
        upauthor.value=scope.row.author
        uptitle.value=scope.row.title
        upcategory.value=scope.row.category
        upcontext.value=scope.row.context
        upreadership.value=scope.row.readership
        upgivelike.value=scope.row.givelike
        upcollect.value=scope.row.collet
        upflag.value=true
        uploadonethree.value=true
}
function denews(scope){//删除新闻
    let newsid=scope.row.newsid;
    axios.post('/admin/denews',{newsid})
    .then(res=>{
        alltabledata.value=[]//清空table
        axios.get('/admin/newsall')//渲染用户数据
        .then(res=>{//重新渲染表格
        if(res.data.model.length==0){tableData.value=[]}
        Object.entries(res.data.model).forEach((k)=>{
            alltabledata.value.push({
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
                createdAt:k[1].createdAt
            })
        //重新渲染表格
        tableData.value=alltabledata.value.filter((currentValue,index)=>index<currentPage4.value*pageSize4&&index>=(currentPage4.value-1)*pageSize4)
        axios.get('/admin/newscount')
        .then(res=>{
        total.value=res.data.model
        })
        })
        })
        ones()
    })
}
function xuanranshuju(){//重新渲染表格数据
    alltabledata.value=[]//清空table
        axios.get('/admin/newsall')//渲染用户数据
        .then(res=>{//重新渲染表格
        Object.entries(res.data.model).forEach((k)=>{
            alltabledata.value.push({
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
                createdAt:k[1].createdAt
            })
        })
        currentPage4.value=1
        //重新渲染表格
        tableData.value=alltabledata.value.filter((currentValue,index)=>index<currentPage4.value*pageSize4&&index>=(currentPage4.value-1)*pageSize4)
        axios.get('/admin/newscount')
        .then(res=>{
        total.value=res.data.model
        })
        })
}
function closeupNews(){//关闭编辑界面
    upflag.value=false
}
function uphandlePictureCardPreview(file){//编辑界面封面图预览事件
    dialogImageUrl.value = file.url
    dialogVisible.value = true
}
function uphandleRemove(file){//编辑界面封面移除
    uptitlecover.value.clearFiles()
    uploadonethree.value=false
}
function uptitlecoversuccess(res,file,files){//编辑界面封面图像上传成功
    console.log(res)
    uptitlecoverfiles.value=files
    console.log(uptitlecoverfiles.value)
    uploadonethree.value=true
}

function updatenews(){//编辑界面更新数据事件
        let ticover=''
        console.log(uptitlecoverfiles.value)
        Object.entries(uptitlecoverfiles.value).forEach((k)=>{
            ticover= k[1].url
        })//读取封面url
        let ss=(tinyMCE.activeEditor.getContent()).toString();
        let context=ss.replaceAll('public',"http://localhost:5173/public")//这里的地址是项目的端口，不是express的端口
        let data={
            newsid:Currupdatenewsid.value,
            authorid:upauthorid.value,
            author:upauthor.value,
            title:uptitle.value,
            titlecover:ticover,
            category:upcategory.value,
            context:context,
            vedio:CRvediourl.value,
            readership:upreadership.value,
            givelike:upgivelike.value,
            collet:upcollect.value,
            updatedAt:gettime()
        }
        let authorid=upauthorid.value
        let author=upauthor.value
        axios.post('/admin/existuser',{authorid,author})
        .then(res=>{
            if(res.data.msg=='存在'){
                axios.post('/admin/upnews',data)
        .then(res=>{
            start()
            upflag.value=false
        })
            }
            else if(res.data.msg=='不存在'){
            ElMessage('用户id或者用户名不存在')
            }
        })
}
function searchnews(){//搜索新闻
    let newsid=0;
    let title='';
    let authorid=0;
    let author='';
    let category=0;
    let context='';
    if(Searchselect.value=='newsid'){
        newsid=Searchinput.value
    }else if(Searchselect.value=='title'){
        title=Searchinput.value
    }else if(Searchselect.value=='authorid'){
        authorid=Searchinput.value
    }else if(Searchselect.value=='author'){
        author=Searchinput.value
    }else if(Searchselect.value=='category'){
        category=Searchinput.value
    }else if(Searchselect.value=='context'){
        context=Searchinput.value
    }
    axios.post('/admin/searchnews',{newsid,title,authorid,author,category,context})
    .then(res=>{
        console.log(res)
        let countl=res.data.model
        total.value=countl.length
        console.log(total.value)
        tableData.value=[]//清空table
        Object.entries(res.data.model).forEach((k)=>{
            tableData.value.push({
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
                createdAt:k[1].createdAt
            })
        })
    })

}
function handleCurrentChange(e){//渲染分页表格信息
    currentPage4.value=e
    tableData.value=alltabledata.value.filter((currentValue,index)=>index<currentPage4.value*pageSize4&&index>=(currentPage4.value-1)*pageSize4)
    // Object.entries(multipleTableRef.value.getSelectionRows()).forEach((item)=>{//分页变化时，把当前的选中项添加到selectidlist中
    //     let flag=true
    //     Object.entries(selectidlist.value).forEach((item2,k)=>{
    //         if(item[1].newsid==item2[1].newsid){
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
function vediosuccess(res,file,files){//视频文件上传成功
    dialogonevedio.value=file.response
    CRvediourl.value=file.response
    ishow.value=true
    videooneflag.value=true
}
function vedioonehandleRemove(file){//上传视频删除
    vedioupload.value.clearFiles()
    videooneflag.value=false
}
function vedioonehandlePictureCardPreview(file){//新建视频预览
    vediodialogVisible.value=true
    dialogonevedio.value=file.response
}
function vediotwohandleRemove(file){//编辑界面视频上传删除
    const index = vediotwo.value.findIndex((item) => {
        return item.uid === file.uid
      })
    vediotwo.value.splice(index, 1);
    videotwoflag.value=false
}
function vediotwosuccess(res,file,files){//更新视频上传成功
    vediotwo.value=files
    CRvediourl.value=res
    videotwoflag.value=true
}
function vediotwohandlePictureCardPreview(file){
    vediotwodialogVisible.value=true
}
function ones(){//新闻分类数量图表1
    let myChartone = echarts.init(one.value);
    let option;
    axios.get('/admin/categorycount').then((res)=>{
        option = {
                legend: {
                    top: 'bottom'
                },
                toolbox: {
                    show: true,
                    feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true }
                    }
                },
                series: [
                    {
                    name: 'Nightingale Chart',
                    type: 'pie',
                    radius: [50, 250],
                    center: ['50%', '50%'],
                    roseType: 'area',
                    itemStyle: {
                        borderRadius: 8
                    },
                    data: [
                        { value: res.data.model1, name: '学校新闻' },
                        { value: res.data.model2, name: '学习新闻' },
                        { value: res.data.model3, name: '生活情感新闻' },
                        { value: res.data.model4, name: '各级活动新闻' },
                        { value: res.data.model5, name: '体育文化艺术新闻' }
                    ]
                    }
                ]
                };
        myChartone.setOption(option);
    })
}
function start(){
    tableData.value=[]
    alltabledata.value=[]
    axios.get('/admin/newsall')//渲染用户数据
    .then(res=>{
            Object.entries(res.data.model).forEach((k)=>{
                tableData.value.push({
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
                    createdAt:k[1].createdAt
                })
            })
            if(tableData.value==0){currentPage4.value=0,total.value=0}
            else{currentPage4.value=1}
            alltabledata.value=tableData.value
            tableData.value=alltabledata.value.filter((currentValue,index)=>index<currentPage4.value*pageSize4&&index>=(currentPage4.value-1)*pageSize4)
    })
    axios.get('/admin/newscount')
    .then(res=>{
            total.value=res.data.model
    })
}
onMounted(()=>{
   start()
    ones()
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
      return row.newsid;
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
async function selectdelete(){
    let v=await(Object.entries(multipleTableRef.value.getSelectionRows()).forEach((item)=>{
        axios.post('/admin/denews',{newsid:`${item[1].newsid}`}).then((res)=>{})}))
    xuanranshuju()
    ones()
}
function gotop(){
    newtables.value.style.transform=`translateY(-100vh)`
    tableview.value.style.transform=`translateY(-100vh)`
}
function backtop(){
    newtables.value.style.transform=`translateY(0)`
    tableview.value.style.transform=`translateY(0)`
}
function createchangeinput(){//新建新闻作者id改变时触发
    if(autocreateidflag.value==true){return}
    else{
        autocreateidflag.value=true
        let userid=Crauthoorid.value
        axios.post('/admin/findusernaem',{userid:`${userid}`})
        .then((res)=>{
            autocreateidflag.value=false
            if(res.data.msg=='没有此作者'){return Crauthoor.value='' }
            else{Crauthoor.value=res.data.model.username}
        })
    }
}
</script>

<template>
    <div class="newmanageBox">
        <div class="newNews" v-show="createflag"><!--新建新闻-->
            <el-button type="primary" plain style="position: absolute;right: 0;margin-right: 1vw;margin-top: 5vh;" @click="closeNews">关闭</el-button>
            <div style="position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);height: 100vh;margin-top: 10vh;">
                <div class="Crtitlecover" style="display: flex;flex-direction: row;">
                <el-upload action="http://localhost:3000/admin/image" list-type="picture-card" :auto-upload="true" ref="Crtoitlecover"
                :on-success="Crtitlecoveruploadsuccess"
                :limit="1"
                :class="{hide_box:uploadone}"
                >
                    <el-icon><Plus /></el-icon>
                    <template #file="{ file }">
                    <div>
                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                    <span class="el-upload-list__item-actions"><span class="el-upload-list__item-preview"
                    @click="CrhandlePictureCardPreview(file)"><el-icon><zoom-in /></el-icon>
                    </span>
                    <span v-if="!disabled" class="el-upload-list__item-delete" @click="CrhandleRemove(file)">
                    <el-icon><Delete /></el-icon>
                    </span>
                    </span>
                    </div>
                    </template>
                </el-upload>
                <el-dialog v-model="dialogVisible">
                    <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 200px;height: 200px;"/>
                </el-dialog>
                </div>
                <el-input v-model="Crauthoorid" @input="createchangeinput" placeholder="请输入作者id(必填)" style="width: 30vw;margin-top: 2vh;"/>
                <el-input v-model="Crauthoor" placeholder="请输入作者名(必填)" style="width: 30vw;margin-top: 2vh;"/>
                <el-input v-model="Crtitle" placeholder="请输入新闻标题(必填)" style="width: 30vw;margin-top: 2vh;"/>
                <el-select v-model="Crcategory" class="m-2" placeholder="Select" size="large" style="margin-top: 2vh;">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value" 
                    />
                </el-select>
                <div style="margin-top:2vh;margin-bottom:2vh;">
                    <main id="sample"><!--富文本编辑器-->
                    <Editor api-key="6z4yhtie7u4vsrgyjnom7v3qx7xedausck52thrq304482dl" :init="tinyconfig" />
                    </main>
                </div>
                <!--视频上传-->
                <div class="Crtitlecover" style="display: flex;flex-direction: row;margin-top: 2vh;">
                    <el-upload action="http://localhost:3000/admin/vedio" list-type="picture-card" :auto-upload="true"
                    :on-success="vediosuccess"
                    :limit="1"
                    ref="vedioupload"
                    :class="{videoone:videooneflag}"
                    >
                    <el-icon><Plus /></el-icon>
                 <template #file="{ file }">
                <div>
                <video  v-show="ishow" style="width: 100%;height: 150px;" controls="controls" :src="dialogonevedio"></video>
                <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview" @click="vedioonehandlePictureCardPreview(file)">
                        <el-icon><zoom-in /></el-icon>
                    </span>
                <span class="el-upload-list__item-preview" @click="vedioonehandleRemove(file)">
                <el-icon><Delete /></el-icon>
                </span>
                </span>
                </div>
                </template>
                </el-upload>
                <el-dialog v-model="vediodialogVisible" append-to-body>
                    <video width="100%" style="width: 100%;height: 100%;" controls="controls" :src="dialogonevedio"></video>
                </el-dialog>
                </div>
                <el-input v-model="Crreadership" placeholder="阅读量" type="number" style="width: 30vw;margin-top: 2vh;"/>
                <el-input v-model="Crgivelike" placeholder="点赞数" type="number" style="width: 30vw;margin-top: 2vh;"/>
                <el-input v-model="Crcollet" placeholder="收藏数" type="number" style="width: 30vw;margin-top: 2vh;"/>
                <br/>
                <el-button type="primary" plain style="margin-top: 2vh;" @click="createnews">新建</el-button>
            </div>
        </div>
        <div class="upnews" v-show="upflag"><!--更新新闻-->
            <el-button type="primary" plain style="margin-top: 5vh;margin-left: 1vw;position: absolute;" @click="closeupNews">关闭编辑</el-button>
            <div style="position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);height: 100vh;margin-top: 0vh;">
                <div style="width: 100%;height: 30vh;"></div>
                <div class="Crtitlecover" style="display: flex;flex-direction: row;">
                <el-upload action="http://localhost:3000/admin/image" list-type="picture-card" :auto-upload="true" 
                ref="uptitlecover"
                :class="{hide_boxthree:uploadonethree}"
                :on-success="uptitlecoversuccess"
                :file-list="uptitlecoverfiles"
                >
                <el-icon><Plus /></el-icon>
                <template #file="{ file }">
                <div>
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="uphandlePictureCardPreview(file)">
                <el-icon><zoom-in /></el-icon>
                </span>
                <span v-if="!disabled" class="el-upload-list__item-delete" @click="uphandleRemove(file)">
                <el-icon><Delete /></el-icon>
                </span>
                </span>
                </div>
                </template>
                </el-upload>
                <el-dialog v-model="dialogVisible">
                <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 200px;height: 200px;"/>
                </el-dialog>
                </div>
                <el-input v-model="upauthorid" placeholder="作者id" style="width: 30vw;margin-top: 2vh;"/>
                <el-input v-model="upauthor" placeholder="作者名称" style="width: 30vw;margin-top: 2vh;"/>
                <el-input v-model="uptitle" placeholder="标题" style="width: 30vw;margin-top: 2vh;"/>
                <el-select v-model="upcategory" class="m-2" placeholder="Select" size="large" style="margin-top: 2vh;">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value" 
                    />
                </el-select>
                <div style="margin-top:2vh;margin-bottom:2vh;">
                    <main id="sample"><!--富文本编辑器-->
                    <Editor api-key="6z4yhtie7u4vsrgyjnom7v3qx7xedausck52thrq304482dl" :init="tinyconfig" />
                    </main>
                </div>
                <!--更新视频-->
                <div class="Crtitlecover" style="display: flex;flex-direction: row;margin-top: 2vh;">
                    <el-upload action="http://localhost:3000/admin/vedio" list-type="picture-card" :auto-upload="true"
                    :on-success="vediotwosuccess"
                    :limit="1"
                    ref="vediotwoupload"
                    :file-list="vediotwo"
                    :class="{videotwo:videotwoflag}"
                    >
                    <el-icon><Plus /></el-icon>
                 <template #file="{ file }">
                <div>
                <video  v-show="ishowtwo" style="width: 100%;height: 150px;" controls="controls" :src="file.url"></video>
                <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview" @click="vediotwohandlePictureCardPreview(file)">
                        <el-icon><zoom-in /></el-icon>
                    </span>
                <span class="el-upload-list__item-preview" @click="vediotwohandleRemove(file)">
                <el-icon><Delete /></el-icon>
                </span>
                </span>
                </div>
                </template>
                </el-upload>
                <el-dialog v-model="vediotwodialogVisible" append-to-body>
                    <video width="100%" style="width: 100%;height: 100%;" controls="controls" :src="vediotwo[0].url"></video>
                </el-dialog>
                </div>
                <el-input v-model="upreadership" placeholder="阅读量" style="width: 30vw;margin-top: 2vh;"/>
                <el-input v-model="upgivelike" placeholder="点赞" style="width: 30vw;margin-top: 2vh;"/>
                <el-input v-model="upcollect" placeholder="收藏" style="width: 30vw;margin-top: 2vh;"/>
                <el-button type="primary" plain style="display: block;margin-top: 2vh;" @click="updatenews">更新</el-button>
            </div>
        </div>
        <div class="newtable" ref="newtables"><!--表格显示数据-->
        <div style="display: flex;flex-direction: row;padding-top: 5vh;padding-left: 1vw;">
        <el-button type="primary" plain style="" @click="createNews">新建新闻</el-button>
        <el-input v-model="Searchinput" placeholder="Please input" class="input-with-select" style="width: 60%;margin-left: 1vw;">
            <template #prepend>
            <el-button @click="searchnews">
                搜索
            </el-button>
            </template>
            <template #append>
            <el-select v-model="Searchselect" placeholder="Select" style="width: 115px">
            <el-option label="新闻id" value="newsid" />
            <el-option label="新闻标题" value="title" />
            <el-option label="作者id" value="authorid" />
            <el-option label="作者名字" value="author" />
            <el-option label="内容" value="context" />
            <el-option label="分类" value="category" />
            </el-select>
            </template>
        </el-input>
        </div>
        <el-table :default-sort="sortrule" :data="tableData" ref="multipleTableRef" style="width: 100%;margin-top: 5vh;height:70vh;" :row-key="getRowKeys" @selection-change="handleSelectionChange" @select="selecti">
        <el-table-column type="selection"  width="50" :reserve-selection="true"></el-table-column>
        <el-table-column fixed prop="newsid" sortable label="新闻id" width="150" />
        <el-table-column  prop="authorid" sortable label="作者id" width="150" />
        <el-table-column  prop="author" sortable label="作者名" width="150" />
        <el-table-column prop="title" sortable label="标题" :show-overflow-tooltip="true" width="200" />
        <el-table-column prop="titlecover" label="新闻封面" width="120">
            <template #default="scope">
                <el-image :preview-src-list="[scope.row.titlecover]" preview-teleported="true" fit="cover" style="width: 50px; height: 50px" :src="scope.row.titlecover" alt="没有图片"></el-image>
            </template>
        </el-table-column>
        <el-table-column prop="category" sortable label="分类" width="100" />
        <el-table-column prop="context" label="内容" width="600" :show-overflow-tooltip="true" style=""/>
        <el-table-column prop="" label="视频" width="400" >
            <template #default="scope" style="display: flex;flex-direction: row;">
                <video  style="width: 200px;height: 100px;" controls="controls" :src="scope.row.vedio"></video>
            </template>
        </el-table-column>
        <el-table-column prop="readership" sortable label="阅读量" width="100" />
        <el-table-column prop="givelike" sortable label="点赞" width="100" />
        <el-table-column prop="collet" sortable label="收藏" width="100" />
        <el-table-column prop="createdAt" sortable label="发布日期" width="300" />
        <el-table-column fixed="right" label="Operations" width="120">
            <template #default="scope">
                <el-button link type="primary" size="small" @click="upnews(scope)">编辑</el-button>
                <el-button link type="primary" size="small" @click="denews(scope)">删除</el-button>
            </template>
        </el-table-column>
        </el-table>

        <div class="demo-pagination-block">
            <el-pagination
                v-model:current-page="currentPage4"
                v-model:page-size="pageSize4"
                layout="total,prev,pager,next,jumper"
                :total="total"
                @current-change="handleCurrentChange"
                style="height: 5vh;"
                />
        <el-button @click="selectdelete" plain type="danger">
            删除选中
        </el-button>
        <el-button @click="gotop" plain type="primary">图表统计</el-button>
        </div>
        </div>

        <div class="keshihuabox" ref="tableview">
            <div style="margin-top:5vh;margin-left:3vh;"><el-button type="primary" @click="backtop">返回</el-button></div>
            <div class="one" ref="one" style="width:80vw;height:80vh;"></div>
        </div>
</div>
</template>
<style scoped>
.newmanageBox{
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
}
.newtable{
    width: 100%;
    height: 100vh;
    transition:all 1s;
    overflow-y: auto;

}
.newNews{
    width: 100%;
    height: 100vh;
    position: absolute;
    z-index: 5;
    background-color: rgba(0, 0, 0, 0.8);
    overflow: scroll;
    overflow-x: hidden;
    overflow-y: scroll;
}
.hide_box /deep/ .el-upload--picture-card{
    display: none;
}
.hide_boxtwo /deep/ .el-upload--picture-card{
    display: none;
}
.hide_boxthree /deep/ .el-upload--picture-card{
    display: none;
}
.hide_boxfour /deep/ .el-upload--picture-card{
    display: none;
}
.videoone /deep/ .el-upload--picture-card{
    display: none;
}
.videotwo /deep/ .el-upload--picture-card{
    display: none;
}
.upnews{
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    position: absolute;
    z-index: 5;
    overflow: scroll;
    overflow-x: hidden;
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