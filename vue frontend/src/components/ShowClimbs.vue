<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useApi } from '@/composables/useApi';

const { fetchMy, del } = useApi('climbs');
const { fetchAll: fetchAllRoutes } = useApi('routes');
const { fetchAll: fetchAllWalls } = useApi('walls');
const { fetchAll: fetchAllSpots } = useApi('spots');

const climbs = ref<Array<any>>([]);
const message = ref('');
const successMessage = ref('');
const spots = ref<Array<any>>([]);
const walls = ref<Array<any>>([]);
const routes = ref<Array<any>>([]);


//delete function
const deleteclimb = async (id: number) => {
  if (confirm('Are you sure you want to delete this climb?')) { //confirmation on deletion
    try {
      await del(id);
      climbs.value = climbs.value.filter((s) => s.id !== id);
      successMessage.value = 'Climb deleted successfully!';
      setTimeout(() => successMessage.value = '', 3000); // Hide success message after 3 seconds
    } catch (err) {
      message.value = 'Error deleting climb.';
    }
  }
};

//fetching functions
const fetchMyClimbs = async () => {
  try {
    climbs.value = await fetchMy();
  } catch (err) {
    message.value = 'Error fetching climbs.';
  }
};

const fetchRoutes = async () => {
  try {
    routes.value = await fetchAllRoutes();
  } catch (err) {
    message.value = 'Error fetching routes.';
  }
};

const fetchwalls = async () => {
  try {
    walls.value = await fetchAllWalls();
  } catch (err) {
    message.value = 'Error fetching walls.';
  }
};

const fetchSpots = async () => {
  try {
    spots.value = await fetchAllSpots();
  } catch (err) {
    message.value = 'Error fetching spots.';
  }
};

//matches spots, walls and routes to the climb
const climbsWithDetails = computed(() => {
  return climbs.value.map((climb) => {
    const spot = spots.value.find((s) => s.spot_id === climb.spot_id);
    const wall = walls.value.find((w) => w.wall_id === climb.wall_id);
    const route = routes.value.find((r) => r.route_id === climb.route_id);

    return {
      ...climb,
      spot_name: spot?.spot_name || 'Unknown Spot',
      wall_name: wall?.wall_name || 'Unknown Wall',
      route_name: route?.route_name || 'Unknown Route',
      route_grade: route?.route_grade || 'Unknown Grade',
    };
  });
});

onMounted(async () => {
  await fetchRoutes();
  await fetchwalls();
  await fetchSpots();
  await fetchMyClimbs(Number(localStorage.getItem('climber_id')), 'climber'); //uses id stored in localStorage to only get climbs from logged in user
});
</script>

<template>
  <div class="climbAdder">
    <h2>My climbs:</h2>
    <div v-for="climb in climbsWithDetails" :key="climb.climb_id" class="cardDisplay">
      <p>Spot: {{ climb.spot_name }}</p>
      <p>Wall: {{ climb.wall_name }}</p>
      <p>Route: {{ climb.route_name }} (Grade: {{ climb.route_grade.grade }}, {{ climb.route_grade.description }})</p>
      <button @click="deleteclimb(climb.climb_id)" class="delete-button">
        Delete
      </button>
    </div>

    <p v-if="message" class="error-message">{{ message }}</p>
    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
  </div>
</template>

