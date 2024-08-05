import { createRouter, createWebHistory } from "vue-router";
// import Home from '@/views/home/home.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "home",
      component: () => import("@/layout/layout.vue"),
      children: [
        {
          path: "/home",
          name: "home",
          component: () => import("@/views/home/home.vue"),
        },
        {
          path: "/:pathMatch(.*)*",
          name: "NotFound",
          component: () => import("@/views/NotFound/NotFound.vue"),
        },
      ],
    },
    {
      path: "/demo",
      name: "demo",
      component: () => import("@/views/demo/demo.vue"),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (savedPosition) {
          resolve(savedPosition);
        } else {
          resolve({ left: 0, top: 0 });
        }
      }, 500);
    });
  },
});

export default router;
