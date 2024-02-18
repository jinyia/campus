<script setup>
import axios from "axios";
import { onMounted, ref,reactive,computed } from "vue";
import { ElTable } from 'element-plus'
const form = reactive({
    id:0,
    image:[],
    name: '',
    selfas:'',
    password:'',
    phone:'',
    sex:'',
    eamil:'',
    follow:0,
    fans:0
})
const form2 = reactive({
    name: '',
    selfas:'',
    password:'',
    phone:'',
    sex:'',
    eamil:'',
    follow:0,
    fans:0,

})
import { Delete, Plus, ZoomIn } from '@element-plus/icons-vue';
import * as echarts from 'echarts';
let Searchinput=ref()//搜索框
let Searchselect=ref('userid')//选择框的值
let avupload=ref()
let multipleTableRef=ref([])
let selectidlist=ref([])//选中的项列表
let upuserload=ref([])//编辑页面上传头像的图片列表
let pagesize=10;//分页每页显示10条数据
let alltableData=ref([])//返回的总数据
let avuploadtwo=ref()//新建功能里的头像框
let upload_btn=ref(false)
let tableData=ref([])//表格渲染数据
let imageUrl=ref()//图片上传成功返回的图片url
let total=ref()//返回的用户表行总数
let currentPage4 = ref(1)//分页的当前按钮索引
let modelflag=ref(false)//模态框是否显示
let updatamodel=ref(false)//编辑模态框
let currid=ref()//当前用户行的编辑id
let currimageurl=ref()//当前路径的url
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)
let sextable=ref()//男女用户表
let man=ref(0);//男
let waman=ref(0);//女
let fansorder=ref()//粉丝数量表
let fansfive=ref([])//粉丝前五
let tabledata=ref()//图标统计盒子
let UsermanageBox=ref()//用户管理的大盒子
let sortrule={ //排序规则
  prop: 'userid', order: 'descending',
  prop: 'username', order: 'descending',
  prop: 'selfas', order: 'descending',
  prop: 'phone', order: 'descending',
  prop: 'sex', order: 'descending',
  prop: 'eamil', order: 'descending',
  prop: 'follow', order: 'descending',
  prop: 'fans', order: 'descending'
}
const rules = reactive({
  name: [
    { required: true, message: '必须输入用户名', trigger: 'blur' },
    { min: 1, max: 5, message: '用户名长度1到5', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '必须输入密码', trigger: 'blur' },
    { min: 5, max: 20, message: '密码长度6到20', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '必须输入手机号', trigger: 'blur' },
    { min: 11, max: 11, message: '手机号长度为11位', trigger: 'blur' },
  ]
})
const rulestwo = reactive({
  name: [
    { required: true, message: '必须输入用户名', trigger: 'blur' },
    { min: 1, max: 5, message: '用户名长度1到5', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 6, message: '密码长度6到20', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '必须输入手机号', trigger: 'blur' },
    { min: 11, max: 11, message: '手机号长度为11位', trigger: 'blur' },
  ]
})
const handleRemove = (file) => {//图片移除
      console.log(file)
      avupload.value.clearFiles()
      avuploadtwo.value.clearFiles()
      upload_btn.value = false
}
const handlePictureCardPreview = (file) => {//预览
  dialogImageUrl.value =currimageurl.value

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
function deleteuser(useridtext) {//删除当前索引行数据
  //删除用户行
  let userid = useridtext ;
  axios.post("/admin/deuser", { userid }).then((res) => {
    //删除成功后重新渲染数据
    start()
    sextablefun()
  });
}
function newuser(id){//打开新建用户界面
    modelflag.value=true
}
function closemodel(){//关闭新建用户界面
    modelflag.value=false
}
function createuser(){//创建用户数据
    let avatarimage=currimageurl.value
    let username=form.name;
    let password=form.password;
    let phone=form.phone;
    let sex=form.sex;
    let eamil=form.eamil;
    let follow=form.follow;
    let fans=form.fans;
    let selfas=form.selfas
    avuploadtwo.value.clearFiles()//清空头像框
    upload_btn.value = false
    axios.post('/admin/cruser',{username,avatarimage,password,phone,sex,eamil,follow,fans,selfas})
    .then(res=>{
      alltableData.value = [];
      start()
    //新建完记得清空刚才输入框的数据
    form.id=0,form.name='',
    form.image=[],form.password='',
    form.phone='',form.sex='',
    form.eamil=''
    })
}
function handleClick(id,scope){//打开用户编辑模态框
    currid.value=id
    updatamodel.value=true
    console.log(scope.row)
    upuserload.value=[]
    upuserload.value.push({url:`${scope.row.image}`})
    form2.name=scope.row.username
    form2.password= scope.row.password
    form2.phone=scope.row.phone
    form2.sex=scope.row.sex
    form2.eamil=scope.row.eamil
    form2.follow=scope.row.follow
    form2.fans=scope.row.fans
    form2.selfas=scope.row.selfas

};
function closeupmodel(){//关闭编辑模态框
    updatamodel.value=false
}
function updateuser(){//更新用户信息
    let userid=currid.value;
    let avatarimage=currimageurl.value;
    let username=form2.name;
    let password=form2.password;
    let phone=form2.phone;
    let sex=form2.sex;
    let eamil=form2.eamil;
    let follow=form2.follow;
    let fans=form2.fans
    let selfas=form2.selfas
    let updatedAt=gettime()
    avupload.value.clearFiles()//清空头像框
    upload_btn.value = false
    axios.post('/admin/upuser',{userid,username,avatarimage,password,phone,sex,eamil,follow,fans,selfas,updatedAt})
    .then(res=>{
        updatamodel.value=false
        alltableData.value = [];
        start()
    form2.id=0,form2.name='',form2.password='',
    form2.phone='',form2.sex='',
    form2.eamil=''
    })
}
function searchnews(){//搜索事件
    if(Searchselect.value==''){return start()}
    let userid=0;
    let username='';
    let phone=0;
    if(Searchselect.value=='userid'){
      userid=Searchinput.value
    }else if(Searchselect.value=='username'){
      username=Searchinput.value
    }else{
      phone=Searchinput.value
    }
    axios.post('/admin/searuser',{userid,username,phone})
        .then((res)=>{
            alltableData.value=[]
            tableData.value=[]
            total.value=res.data.model.length
            let i=0;
            Object.entries(res.data.model).forEach((k) => {
            i++
            alltableData.value.push({
              userid: k[1].userid,
              image: k[1].avatarimage,
              username: k[1].username,
              password: k[1].password,
              phone: k[1].phone,
              sex: k[1].sex,
              eamil: k[1].eamil,
              follow:k[1].follow,
              fans:k[1].fans,
              selfas:k[1].selfas
            });
            if(i==res.data.model.length){
              currentPage4.value=1
              tableData.value=alltableData.value.filter((currentValue,index)=>index<currentPage4.value*pagesize&&index>=(currentPage4.value-1)*pagesize)
            }
          });
    })
}
function handleAvatarSuccess(response, uploadFile){//图片上传成功
  imageUrl.value = uploadFile.response.Image;
  currimageurl.value=uploadFile.response.Image
  upload_btn.value = true
}
function handleCurrentChange(e){//分页当前页面索引改变触发,e参数为索引值直接调用
  currentPage4.value=e
  tableData.value=alltableData.value.filter((currentValue,index)=>index<currentPage4.value*pagesize&&index>=(currentPage4.value-1)*pagesize)
  // Object.entries(multipleTableRef.value.getSelectionRows()).forEach((item)=>{//分页变化时，把当前的选中项添加到selectidlist中
  //   let flag=true
  //     Object.entries(selectidlist.value).forEach((item2,k)=>{
  //       if(item[1].userid==item2[1].userid){
  //           flag=false
  //       }
  //     })
  //     if(flag){
  //       selectidlist.value.push(item[1])
  //     }
  // })
  // setTimeout(() => {
  //   Object.entries(selectidlist.value).forEach((item2)=>{
  //   multipleTableRef.value.toggleRowSelection(item2[1],true)
  // })
  // }, 1);
}
function sextablefun(){//男女用户表渲染图表事件
  let myChart = echarts.init(sextable.value);
  let option;
  //先获取用户数量
  axios.get('/admin/sexs').then((res)=>{
      man.value=res.data.man
      waman.value=res.data.waman
      option = {
                  title: {
                    text: '男女用户数量统计图表',
                    left: 'center'
                  },
                  tooltip: {
                    trigger: 'item'
                  },
                  legend: {
                    orient: 'vertical',
                    left: 'left'
                  },
                  series: [
                    {
                      name: 'Access From',
                      type: 'pie',
                      radius: '50%',
                      data: [
                        { value: man.value, name: '男用户' },
                        { value: waman.value, name: '女用户'}
                      ],
                      emphasis: {
                        itemStyle: {
                          shadowBlur: 10,
                          shadowOffsetX: 0,
                          shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                      }
                    }
                  ]
                };
    myChart.setOption(option);
  })
}
function fansorders(){//粉丝数量表
      let myChart2 = echarts.init(fansorder.value);
      let option;
      axios.get('/admin/fanss').then((res)=>{
        console.log(res)
        fansfive.value=res.data.fans;
        option = {
                    title:{
                          text:'粉丝数量排行表',
                          left:'center'
                          },
                    xAxis: {
                      type: 'category',
                      data: [`${fansfive.value[0].username}`, `${fansfive.value[1].username}`, `${fansfive.value[2].username}`, `${fansfive.value[3].username}`, `${fansfive.value[4].username}`]
                    },
                    yAxis: {
                      type: 'value'
                    },
                    series: [
                      {
                        data: [fansfive.value[0].fans, fansfive.value[1].fans, fansfive.value[2].fans, fansfive.value[3].fans, fansfive.value[4].fans],
                        type: 'bar'
                      }
                    ]
                  };
        myChart2.setOption(option);
      })

}
function start(){//初始化
  alltableData.value=[]
  tableData.value=[]
  let i=0
  axios.get("/admin/seuser").then((res) => {
    console.log(res)
    axios.get('/admin/usercount').then(res=>{total.value=res.data.model})//渲染分页总条数
    Object.entries(res.data.model).forEach((k) => {
      i++
      alltableData.value.push({
        userid: k[1].userid,
        image: k[1].avatarimage,
        username: k[1].username,
        password: k[1].password,
        phone: k[1].phone,
        sex: k[1].sex,
        eamil: k[1].eamil,
        follow:k[1].follow,
        fans:k[1].fans,
        selfas:k[1].selfas
      });
      if(i==res.data.model.length){
        currentPage4.value=1
        tableData.value=alltableData.value.filter((currentValue,index)=>index<currentPage4.value*pagesize&&index>=(currentPage4.value-1)*pagesize)
      }
    });
  });
}
onMounted(() => {//渲染列表数据
  start()
  sextablefun()
  fansorders()
});
const select_order_number = ref('') //表格select选中的条数
    const select_orderId = ref([]) //表格select复选框选中的id
    const multipleSelection = ref([])
const getRowKeys = (row) => {
      //记录每行的key值
      // console.log(row.id)
      return row.userid;
    }
const handleSelectionChange = (val) => {
      // 解决来回切换页面，也无法清除上次选中情况
      // console.log(val)
    }
function clearselect(){//清除选项
  multipleTableRef.value.clearSelection()
}
function selectdelete(){//删除选中数据
  let i=0;
  Object.entries(multipleTableRef.value.getSelectionRows()).forEach((item)=>{
    i++;
    axios.post('/admin/deuser',{userid:item[1].userid}).then((res)=>{
    if(i==multipleTableRef.value.getSelectionRows().length){
      start()
    }
    })
  })
  // tableData.value = [];
  //   axios.get("/admin/seuser").then((res) => {
  //     Object.entries(res.data).forEach((k) => {
  //       tableData.value.push({
  //         userid: k[1].userid,
  //         image:k[1].avatarimage,
  //         username: k[1].username,
  //         password: k[1].password,
  //         phone: k[1].phone,
  //         sex: k[1].sex,
  //         eamil: k[1].eamil,
  //       });
  //     });
  //   });
  //   axios.get('/admin/usercount').then(res=>{total.value=res.data.model})//渲染分页总条数
  sextablefun()
}
function selecti(selection,row){//勾选框改变状态触发
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
        if(ik[1].userid==ik2[1].userid){
            selectidlist.value.splice(xk2,1)
        }
      })
  })
  
}
function gotop(){
  UsermanageBox.value.style.transform=`translateY(-100vh)`
  tabledata.value.style.transform=`translateY(-100vh)`
}
function backtop(){
  UsermanageBox.value.style.transform=`translateY(0)`
  tabledata.value.style.transform=`translateY(0)`
}
</script>

<template>
<div class="usermanagebox" >
  <!-- 新建用户 -->
      <div class="newuser" v-show="modelflag">
        <el-button type="primary" plain @click="closemodel" style="position: absolute;right: 0;">关闭</el-button>
        <div class="userlists">
            <div style="display: flex;flex-direction: row;align-items: center;justify-content: center;margin-bottom: 5vh;">
              <div style="margin-right: 2vw;">头像:</div>
              <el-upload action="http://localhost:3000/admin/image" list-type="picture-card" :auto-upload="true"
                :on-success="handleAvatarSuccess"
                :on-remove="handleRemove"
                :limit="1"
                :class="{hide_box: upload_btn}"
                ref="avuploadtwo">
                <el-icon><Plus /></el-icon>
                  <template #file="{ file }">
                    <div>
                      <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                      <span class="el-upload-list__item-actions">
                        <span
                          class="el-upload-list__item-preview"
                          @click="handlePictureCardPreview(file)"
                        >
                          <el-icon><zoom-in /></el-icon>
                        </span>
                        
                        <span
                          v-if="!disabled"
                          class="el-upload-list__item-delete"
                          @click="handleRemove(file)"
                        >
                          <el-icon><Delete /></el-icon>
                        </span>
                      </span>
                    </div>
                  </template>
                  </el-upload>
                <el-dialog v-model="dialogVisible">
                  <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 200px;height: 200px;"  /><!--自定义style可以定义预览图像大小-->
                </el-dialog>
            </div>
          <div>
            <el-form  :model="form" label-width="120px" status-icon :rules="rules">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="form.name" />
                </el-form-item>
                <el-form-item label="自我介绍">
                    <el-input v-model="form.selfas" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" />
                </el-form-item>
                <el-form-item label="手机" prop="phone">
                    <el-input v-model="form.phone" />
                </el-form-item>
                <el-form-item label="性别">
                    <el-select v-model="form.sex" placeholder="please select">
                        <el-option label="男" value="男" />
                        <el-option label="女" value="女" />
                    </el-select>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="form.eamil" />
                </el-form-item>
                <el-form-item label="关注">
                    <el-input v-model="form.follow" />
                </el-form-item>
                <el-form-item label="粉丝">
                    <el-input v-model="form.fans" />
                </el-form-item>
                <el-button type="primary" plain style="margin-left: 8vw;" @click="createuser">新建</el-button>
            </el-form>
            </div>
        </div>
      </div>
      <!-- 更新用户数据 -->
      <div class="upuser" v-show="updatamodel">
          <el-button type="primary" plain @click="closeupmodel" style="position: absolute;right: 0;">关闭</el-button>
          <div class="userlist">
            
            <div  style="display: flex;flex-direction: row;align-items: center;justify-content: center;margin-bottom: 5vh;">
                <div style="margin-right: 2vw;">头像:</div>
                <el-upload action="http://localhost:3000/admin/image" list-type="picture-card" :auto-upload="true"
                  :on-success="handleAvatarSuccess"
                  :on-remove="handleRemove"
                  :limit="1"
                  :class="{hide_box: upload_btn}"
                  ref="avupload"
                  :file-list="upuserload">
                  <el-icon><Plus /></el-icon>
                  <template #file="{ file }">
                  <div>
                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                    <span class="el-upload-list__item-actions">
                      <span
                        class="el-upload-list__item-preview"
                        @click="handlePictureCardPreview(file)">
                        <el-icon><zoom-in /></el-icon>
                      </span>
                      <span
                        v-if="!disabled"
                        class="el-upload-list__item-delete"
                        @click="handleRemove(file)">
                        <el-icon><Delete /></el-icon>
                      </span>
                    </span>
                  </div>
                  </template>
                </el-upload>
              <el-dialog v-model="dialogVisible">
                <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 200px;height: 200px;"  /><!--自定义style可以定义预览图像大小-->
              </el-dialog>
              </div>

            <div>
          <el-form :model="form2" label-width="120px" :rules="rulestwo" status-icon>
              <el-form-item label="姓名" prop="name">
                  <el-input v-model="form2.name" />
              </el-form-item>
              <el-form-item label="自我介绍">
                  <el-input v-model="form2.selfas" />
              </el-form-item>
              <el-form-item label="密码" prop="password">
                  <el-input v-model="form2.password" />
              </el-form-item>
              <el-form-item label="手机" prop="phone">
                  <el-input v-model="form2.phone" />
              </el-form-item>
              <el-form-item label="性别">
                  <el-select v-model="form2.sex" placeholder="please select">
                      <el-option label="男" value="男" />
                      <el-option label="女" value="女" />
                  </el-select>
              </el-form-item>
              <el-form-item label="邮箱">
                  <el-input v-model="form2.eamil" />
              </el-form-item>
              <el-form-item label="关注">
                  <el-input v-model="form2.follow" />
              </el-form-item>
              <el-form-item label="粉丝">
                  <el-input v-model="form2.fans" />
              </el-form-item>
              <el-button type="primary" plain style="margin-left: 8vw;" @click="updateuser">更新</el-button>
          </el-form>
          </div>
      </div>
      </div>
      <!-- 数据显示 -->
      <div class="usermanage" style="width: 100%;" ref="UsermanageBox">
          <div style="width: 100%;display: flex;flex-direction: row;height: 6vh;margin-bottom: 3vh; align-items: center;">
            <el-button type="primary" plain @click="newuser" style="margin-left: 1vw;">新建用户</el-button>
            <el-input v-model="Searchinput" placeholder="Please input" class="input-with-select" style="width: 60%;margin-left: 1vw;">
                        <template #prepend>
                        <el-button @click="searchnews">
                            搜索
                        </el-button>
                        </template>
                        <template #append>
                        <el-select v-model="Searchselect" placeholder="Select" style="width: 115px">
                            <el-option label="userid" value="userid" />
                            <el-option label="用户名" value="username" />
                            <el-option label="手机号" value="phone" />
                        </el-select>
                        </template>
              </el-input>
          </div>
          <el-table :data="tableData"  ref="multipleTableRef" style="width: 100%;height: 80%;" :row-key="getRowKeys" @selection-change="handleSelectionChange" @select="selecti"
          :default-sort="sortrule"
          ><!--@selection-change="handleSelectionChange"-->
          <el-table-column type="selection" width="50" :reserve-selection="false"></el-table-column>
          <el-table-column fixed   prop="userid" sortable label="用户id" width="150" />
          <el-table-column prop="username" sortable label="用户名" width="120" />
          <el-table-column prop="selfas" :show-overflow-tooltip="true" sortable label="自我介绍" width="200" />
          <el-table-column label="头像" prop="">
          <template #default="scope">
            <el-image  :preview-src-list="[scope.row.image]" preview-teleported="true" fit="cover" :initial-index="0"  style="width: 50px; height: 50px" :src="scope.row.image" alt="无图片"></el-image>
          </template>
          </el-table-column> 
          <el-table-column prop="password"  :show-overflow-tooltip="true" label="用户密码" width="120" />
          <el-table-column prop="phone" sortable  label="手机" width="120" />
          <el-table-column prop="sex" sortable label="性别" width="120" />
          <el-table-column prop="eamil" sortable label="电子邮箱" width="200" />
          <el-table-column prop="follow" sortable label="关注" width="120" />
          <el-table-column prop="fans"  sortable label="粉丝" width="120" />
          <el-table-column fixed="right"  label="Operations" width="120">
            <template #default="scope"
              ><!--scope 用来获取当前行的元素数据-->
              <el-button link type="primary" size="small" @click="handleClick(scope.row.userid,scope)">编辑</el-button>
              <el-button link type="primary" size="small" @click="deleteuser(scope.row.userid)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

      <!--分页按钮-->
      <div class="demo-pagination-block">
      <el-pagination
        
        v-model:current-page="currentPage4"
        v-model:page-size="pagesize"
        layout="total, prev, pager, next, jumper"
        :total="total"
        @current-change="handleCurrentChange"
      />

    <el-button @click="selectdelete" plain type="danger">
      删除选中
    </el-button>
    <el-button @click="gotop" plain type="primary">图表统计</el-button>
    </div>
    
    
</div>
<div class="tablecss" ref="tabledata">
        <div style="margin-bottom:5vh;margin-left:3vh;margin-top: 5vh;"><el-button type="primary" @click="backtop">返回</el-button></div>
        <div style="display:flex;flex-direction:row;justify-content: space-between;width: 85vw;align-items: center;">
          <div ref="sextable" style="width:35vw;height:90vh;"></div>
          <div ref="fansorder" style="width:60vw;height:50vh;"></div>
        </div>
    </div>
</div>
</template>

<style scoped>
.usermanagebox{
    width: 85vw;
    height: 100vh;
    position: relative;
    overflow:hidden;
}
.usermanage{
    width: 100%;
    height: 100vh;
    transition:all 1s;
    overflow: hidden;
}
.newuser{
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 5;
    position: absolute;
    overflow: hidden;
}
.userlist{
  position: relative;
    width: 30vw;
    margin-top: 5vh;
    background-color: white;
    top: 50%;
    left: 50%;
    transform: translate(-60%,-60%);
    padding-right: 5vw;
    padding-top: 5vh;
}
.userlists{
    position: relative;
    width: 30vw;
    background-color: white;
    top: 50%;
    left: 50%;
    transform: translate(-60%,-50%);
    padding-right: 5vw;
    padding-top: 5vh;
}
.upuser{
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 5;
    position: absolute;
    overflow: hidden;
}
.hide_box /deep/ .el-upload--picture-card {
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
.tablecss{
  width:85vw;
  height:100vh;
  position:reactive;
  overflow:hidden;
  transition:all 1s;
  z-index:999;
  /* background-color: rgb(232, 230, 230); */
}
</style>
