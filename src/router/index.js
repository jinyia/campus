import { createRouter,createWebHashHistory} from 'vue-router';
import {routers} from "./page-router"
import {adminrouters} from "./adminpage-router"
const routes=[
    {
      path:'/login',
      name:'login',
      component:()=>import("../components/login/login.vue")
    },
    {
        path:"/userindex",
        name:"用户页",
        component:()=>import("../components/userindex/userindex.vue"),
        children:routers.children
    },
    {
        path:"/adminindex",
        name:"管理员页",
        component:()=>import("../components/adminindex/adminindex.vue"),
        children:adminrouters.children
    },
    {
      path:'/register',
      name:'注册页',
      component:()=>import("../components/register/registry.vue")
    }
] //路由数组

const router=createRouter({
    history: createWebHashHistory(),
    routes
})


router.beforeEach((to,from,next)=>{ //路由守卫，没有token的时候跳转到登录页，有则正常跳转页面
    if(to.path === '/login') {
        next();
      }else {
        let token = localStorage.getItem('token');
        if(token === null || token === '')  {
          next('/login')
        }else {
          next()
        }
      }
})

export default router
