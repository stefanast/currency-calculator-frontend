import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/edit",
    name: "Edit",
    beforeEnter: (to, from, next) => {
      if (!store.getters["user"].roles.includes("editor")) {
        next({ path: "/" });
      }
      next();
    },
    component: () => import(/* webpackChunkName: "edit" */ "../views/Edit.vue"),
  },
  {
    path: "/login",
    name: "Login",
    beforeEnter: (to, from, next) => {
      if (store.getters["user"]) {
        next({ path: "/" });
      }
      next();
    },
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    beforeEnter: (to, from, next) => {
      if (store.getters["user"]) {
        next({ path: "/" });
      }
      next();
    },
    component: () =>
      import(/* webpackChunkName: "register" */ "../views/Register.vue"),
  },
  {
    path: "*",
    beforeEnter: (to, from, next) => {
      next({ path: "/" });
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.path !== "/login" && to.path !== "/register") {
    if (!store.getters["user"]) {
      next({ name: "Login" });
    }
  }
  next();
});

export default router;
