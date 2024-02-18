<script setup>
import axios from "axios";
import { ref,reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage,ElTable } from 'element-plus';
// axios.defaults.withCredentials = true// Cookie跨域后端已经写了
// axios.defaults.baseURL = "http://localhost:3000/";
let adminuser = "root";
let adminpassword = "root";
let ruleFormRef=ref()
const ruleForm = reactive({
  username:'',
  password:''
})
const rules = reactive({
  username: [
    { required: true, message: '必须输入用户名', trigger: 'blur' },
    { min: 1, max: 5, message: '用户名长度1到5', trigger: 'blur' },
  ],
  password:[
    {required:true,message:'必须输入密码', trigger: 'blur'},
    {min:4,max:20,message:'密码长度4到20', trigger: 'blur' }
  ]
})
const router = useRouter();
function login() {
  //用户登录
  let username = usertext;
  let password = passwordtext;
  console.log(usertext, passwordtext);
  axios
    .post(`/api/login`, { username, password })
    .then((res) => {
      localStorage.setItem("token", res.data.token);
    })
    .catch((err) => {
      console.log(err);
    });
  router.push({ path: "/userindex" });
}
function adminlogin() {
  //管理员登录
  if(ruleForm.username==''){return ElMessage('用户名必须输入')}
  if(ruleForm.password==''){return ElMessage('密码必须输入')}
  let adminname = ruleForm.username;
  let password = ruleForm.password;
  axios.post("/admin/login", { adminname, password }).then((res) => {
    console.log(res)
    if(res.data.msg=='用户不存在'){ElMessage('用户不存在')}
    else if(res.data.msg=='密码错误'){
      ElMessage('密码错误')
    }else{
      localStorage.setItem("token",res.data.token)
      localStorage.setItem("adminname", res.data.adminname);
      router.push({ path: "/adminindex" });
    }
  });
}

function jumpregister(){
  router.push({ path: "/register" });
}
</script>

<template>
  <div class="indexback">
    <div class="backimg">
      <text style="margin-bottom: 5vh;font-weight: bold;font-family: 'Courier New', Courier, monospace;">login</text>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        :size="default"
        status-icon>
          <el-form-item label="" label-width="0" prop="username">
            <el-input placeholder="输入用户名" v-model="ruleForm.username"/>
          </el-form-item>
          <el-form-item label="" label-width="0" prop="password">
            <el-input show-password type="password" placeholder="输入密码" v-model="ruleForm.password" />
          </el-form-item>
          <el-form-item>
            <el-button type="danger"  @click="adminlogin" style="width: 100%;">登录</el-button>
          </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.indexback {
  width: 100vw;
  height: 100vh;
  background-image: url("../../assets/bk.jpg"); 
   background-size: 100% 100%;
  overflow: hidden;
  position: relative;
}
.backimg {
  width: 20vw;
  height: 40vh;
  overflow: hidden;
  position: absolute;
  top: 50%;
  left: 50%;
  background-color: rgb(255, 255, 255);
  color: black;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px rgb(87, 87, 87); 
  justify-content: center;
  flex-direction: column;
  display: flex;
  align-items: center;
}

</style>
