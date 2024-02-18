export const adminrouters={
    children:[
        {   
            title:'用户管理',
            path:'/usermanger',
            name:'用户管理',
            component:()=>import("../components/adminindex/usermanger/usermage.vue")
        },
        {   
            title:'用户管理',
            path:'/chatsmanger',
            name:'信息管理',
            component:()=>import("../components/adminindex/chats/chat.vue")
        },
        {   
            title:'新闻管理',
            path:'/newsmanage',
            name:'新闻管理',
            component:()=>import("../components/adminindex/newsmanage/newsmanage.vue")
        },
        {   
            title:'新闻管理',       
            path:'/reviewmanage',
            name:'评论管理',
            component:()=>import("../components/adminindex/review/review.vue")
        },
        {   
            title:'新闻管理',
            path:'/newsaudit',
            name:'新闻审核',
            component:()=>import("../components/adminindex/newsaudit/newsaudit.vue")
        },
        {
            title:'新闻管理',
            path:'/newscollect',
            name:'收藏管理',
            component:()=>import("../components/adminindex/newscollect/newscollect.vue")
        },
        {
            title:'新闻管理',
            path:'/concern',
            name:'关注管理',
            component:()=>import("../components/adminindex/concern/concern.vue")
        },
        {
            title:'新闻管理',
            path:'/newslike',
            name:'新闻点赞管理',
            component:()=>import("../components/adminindex/newslike/newslike.vue")
        },
        {
            title:'新闻管理',
            path:'/reviewlike',
            name:'评论点赞管理',
            component:()=>import("../components/adminindex/reviewlike/reviewlike.vue")
        },
        {
            title:'主页',
            path:'/zhuye',
            name:'主页',
            component:()=>import("../components/adminindex/zhuye/zhuye.vue")
        }
    ]
}