<script setup lang="ts">
import { ref } from 'vue'
import { useApi } from '@/composables/useApi';
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const users = ref<Array<any>>([]);
const message = ref('');

const { post } = useApi('register');
const register = async () => {
  if (!username.value || !password.value) return;

  const newUser = {
    climber_name: username.value,
    password: password.value,
  };

  try {
      const data = await post(newUser);
      users.value.push(data);
    username.value = '';
    password.value = '';
    router.push('/login')
  } catch (err) {
    message.value = 'Error registering user.';
  }
};

</script>

<template>
  <div class="p-4 max-w-md mx-auto">
    <h1 class="text-xl font-bold mb-4">Register</h1>
    <form @submit.prevent="register" class="space-y-3">
      <input v-model="username" type="text" placeholder="Username" class="w-full p-2 border rounded" />
      <input v-model="password" type="password" placeholder="Password" class="w-full p-2 border rounded" />
      <button type="submit" class="w-full bg-green-500 text-white py-2 rounded">Register</button>
      <p v-if="error" class="text-red-500">{{ message }}</p>
    </form>
  </div>
</template>