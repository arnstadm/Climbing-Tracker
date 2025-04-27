import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    //routed without Auth requirement
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue'),
    },
    //Auth required routes
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/AddClimb',
      name: 'AddClimb',
      component: () => import('../views/AddClimb.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/AddWall',
      name: 'AddWall',
      component: () => import('../views/AddWall.vue'),
      meta: {requiresAuth: true},
    },
    {
      path: '/MyClimbs',
      name: 'MyClimbs',
      component: () => import('../views/MyClimbs.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/AddRoute',
      name: 'AddRoute',
      component: () => import('../views/AddRoute.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/AddSpot',
      name: 'AddSpot',
      component: () => import('../views/AddSpot.vue'),
      meta: { requiresAuth: true }
    },
  ],
})


router.beforeEach((to, _, next) => {
  const isAuthenticated = !!localStorage.getItem('token')

  // If user is logged in and tries to go to login or register, redirect them to home
  if ((to.name === 'login' || to.name === 'register') && isAuthenticated) {
    next('/')
  }
  // If route requires auth and user is not logged in, send them to login
  else if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  }
  else {
    next()
  }
})

export default router
