import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Interview from "../views/Interview.vue";
import Profile from "../views/Profile.vue";
import Matching from "../views/Matching.vue";
import Growth from "../views/Growth.vue";
import Community from "../views/Community.vue";
import Knowledge from "../views/Knowledge.vue";
import GameInterview from "../views/GameInterview.vue";
import LevelChallenge from "../views/LevelChallenge.vue";
import Report from "../views/Report.vue";
import { useUserStore } from "../stores/user";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { title: "首页", hideSidebar: true },
  },
  {
    path: "/interview",
    name: "Interview",
    component: Interview,
    meta: { title: "面试实战" },
  },
  {
    path: "/game-interview",
    name: "GameInterview",
    component: GameInterview,
    meta: { title: "游戏式面试" },
  },
  {
    path: "/game-interview/level/:id",
    name: "LevelChallenge",
    component: LevelChallenge,
    meta: { title: "关卡挑战" },
  },
  {
    path: "/matching",
    name: "Matching",
    component: Matching,
    meta: { title: "岗位匹配" },
  },
  {
    path: "/growth",
    name: "Growth",
    component: Growth,
    meta: { title: "能力提升" },
  },
  {
    path: "/community",
    name: "Community",
    component: Community,
    meta: { title: "面试社区" },
  },
  {
    path: "/knowledge",
    name: "Knowledge",
    component: Knowledge,
    meta: { title: "知识库" },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { title: "个人中心" },
  },
  {
    path: "/report",
    name: "Report",
    component: Report,
    meta: { title: "面试报告" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const userStore = useUserStore();
  
  const requiresAuth = to.meta.requiresAuth || false;

  if (requiresAuth && !userStore.isLoggedIn) {
    next("/login");
  } else {
    document.title = `${to.meta.title} | 面面俱到`;
    next();
  }
});
export default router;
