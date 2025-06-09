<script setup lang="ts">
import { ref } from 'vue'
import { useApi } from '@/composables/useApi'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const router = useRouter()
const error = ref('')
const { post } = useApi('login')

const login = async () => {
  if (!username.value || !password.value) return

  const user = {
    climber_name: username.value,
    password: password.value,
  }

  try {
    const res = await post(user)

    if (res.error || !res.token) {
      throw new Error(res.message || 'Login failed')
    }

    localStorage.setItem('token', res.token)
    router.push('/about')
  } catch (err: any) {
    error.value = err.message || 'An error occurred'
  }
}
</script>

<template>
  <div class="p-4 max-w-md mx-auto">
    <h1 class="text-xl font-bold mb-4">Login</h1>
    <form @submit.prevent="login" class="space-y-3">
      <input v-model="username" type="text" placeholder="Username" class="w-full p-2 border rounded" />
      <input v-model="password" type="password" placeholder="Password" class="w-full p-2 border rounded" />
      <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded">Login</button>
      <p v-if="error" class="text-red-500">{{ error }}</p>
    </form>
  </div>
</template>