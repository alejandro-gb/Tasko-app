import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import MyProfile from "../views/MyProfile.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: Login  
  },
  {
    path: "/signup",
    name: "Sign Up",
    component: Register  
  },
  {
    path: "/myprofile",
    name: "MyProfile",
    component: MyProfile  
  },
];

const router = new VueRouter({
  routes,
});

export default router;
