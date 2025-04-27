<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'

const isLoggedIn = ref(!!localStorage.getItem('token'))

// Optional: listen to token changes (if you want it to react immediately)
window.addEventListener('storage', () => {
  isLoggedIn.value = !!localStorage.getItem('token')
})

//remove token from localStorage to log out user
function logout() {
  localStorage.removeItem('token')
  isLoggedIn.value = false
  window.location.reload()
}

</script>
<template>
  <header>
    <h1>Climbing Tracker</h1>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
    <!-- Show these only if NOT logged in -->
    <template v-if="!isLoggedIn">
      <router-link to="/login">Login</router-link>
      <router-link to="/register">Register</router-link>
    </template>

    <template v-else>
          <RouterLink to="/MyClimbs">My Climbs</RouterLink>
          <RouterLink to="/AddClimb">Add Climb</RouterLink>
          <RouterLink to="/AddSpot">Add Spot</RouterLink>
          <RouterLink to="/AddWall">Add Wall</RouterLink>
          <RouterLink to="/AddRoute">Add Route</RouterLink>
          <button @click="logout">Logout</button>
        </template>
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
