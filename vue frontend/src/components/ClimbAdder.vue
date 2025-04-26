<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useApi } from '@/composables/useApi';
import { computed } from 'vue';
import { watch } from 'vue';

const { post: postClimb } = useApi('climbs');

const { fetchAll: fetchAllRoutes } = useApi('routes');

// Destructure walls API methods
const { fetchAll: fetchAllWalls } = useApi('walls');

// Destructure spots API methods
const { fetchAll: fetchAllSpots } = useApi('spots');



const routeName = ref('');
const selectedSpot = ref<any>(null); // Ensure it's an object (or null initially)
const selectedWall = ref<any>(null);
const selectedRoute = ref<any>(null);
const climbs = ref<Array<any>>([]);
const routes = ref<Array<any>>([]);
const walls = ref<Array<any>>([]);
const spots = ref<Array<any>>([]);
const message = ref('');

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

const addClimb = async () => {
  if (!selectedRoute.value || !selectedRoute.value.route_id || !selectedSpot.value || !selectedSpot.value.spot_id || !selectedWall.value || !selectedWall.value.wall_id) return;

  const newClimb = {
    climber_id: localStorage.getItem('climber_id'),
    spot_id: selectedSpot.value.spot_id,
    wall_id: selectedWall.value.wall_id,
    route_id: selectedRoute.value.route_id,
  };

  try {
    const data = await postClimb(newClimb);
    climbs.value.push(data);

    // Reset values
    selectedSpot.value = null;
    selectedWall.value = null;
    selectedRoute.value = null;
    message.value = 'Climb saved!';
  } catch (err) {
    message.value = 'Error saving climb.';
    console.error(err);
  }
};


const filteredWalls = computed(() => {
  if (!selectedSpot.value) return [];
  return walls.value.filter(wall => wall.spot_id === selectedSpot.value.spot_id);
});

const filteredRoutes = computed(() => {
  if (!selectedWall.value && !selectedSpot.value) return [];
  return routes.value.filter(route => route.wall_id === selectedWall.value.wall_id && route.spot_id === selectedSpot.value.spot_id)
})

watch(selectedSpot, () => {
  selectedWall.value = null;
});

onMounted(() => {
  fetchRoutes();
  fetchwalls();
  fetchSpots();
});
</script>

<template>

  <p>
      Choose spot:
      <br />
      <select v-model="selectedSpot">
        <option disabled value="">-- Select a spot --</option>
        <option v-for="spot in spots" :key="spot.id" :value="spot">
          {{ spot.spot_name }}
        </option>
      </select>
    </p>
    <p v-if="selectedSpot">
  <h3>Choose wall:</h3>
  <select v-model="selectedWall">
    <option disabled value="">-- Select a wall --</option>
    <option v-for="wall in filteredWalls" :key="wall.id" :value="wall">
      {{ wall.wall_name }}
    </option>
  </select>
</p>
    <p v-if="selectedWall">
      Choose route:
      <br />
      <select v-model="selectedRoute">
        <option disabled value="">-- Select a route --</option>
        <option v-for="route in filteredRoutes" :key="route.id" :value="route">
          {{ route.route_name }}
        </option>
      </select>
    </p>

    <button @click="addClimb">Add climb</button>

    <p v-html="message"></p>

</template>
