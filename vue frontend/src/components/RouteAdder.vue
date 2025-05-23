<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useApi } from '@/composables/useApi';
import { climbingGrades } from '@/composables/climbingGrades';

const { fetchAll: fetchAllRoutes, post: postRoute, del: delRoute } = useApi('routes');

// Destructure walls and spot API methods
const { fetchAll: fetchAllWalls } = useApi('walls');
const { fetchAll: fetchAllSpots } = useApi('spots');



const routeName = ref('');
const selectedSpot = ref<any>(null); // Ensure it's an object (or null initially)
const selectedWall = ref<any>(null);
const selectedGrade = ref<any>(null);
const routes = ref<Array<any>>([]);
const walls = ref<Array<any>>([]);
const spots = ref<Array<any>>([]);
const message = ref('');
const { grades } = climbingGrades();

//fetching functions
const fetchRoutes = async () => {
  try {
    const fetchedRoutes = await fetchAllRoutes();

    routes.value = fetchedRoutes.map((route: any) => {
      const spot = spots.value.find(s => s.spot_id === route.spot_id);
      const wall = walls.value.find(w => w.wall_id === route.wall_id);

      return {
        ...route,
        spot_name: spot ? spot.spot_name : 'Unknown Spot',
        wall_name: wall ? wall.wall_name : 'Unknown Wall',
      };
    });
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

const addroute = async () => {
  //checking if all values are filled
  if (!routeName.value || !selectedSpot.value || !selectedSpot.value.spot_id || !selectedWall.value || !selectedWall.value.wall_id ) return;

  const newroute = {
    route_name: routeName.value,
    route_grade: selectedGrade.value,
    spot_id: selectedSpot.value.spot_id,
    wall_id: selectedWall.value.wall_id,
  };

  try {
      await postRoute(newroute);
      await fetchRoutes();
    // Reset values
    routeName.value = '';
    selectedSpot.value = null;
    selectedWall.value = null;
    selectedGrade.value = null;
    message.value = 'Route saved!';
  } catch (err) {
    message.value = 'Error saving Route.';
    console.error(err);
  }
};

//delete function
const deleteroute = async (id: any) => {
  try {
    await delRoute(id);
    routes.value = routes.value.filter((s) => s.route_id !== id);
  } catch (err) {
    message.value = 'Error deleting route.';
  }
};

//filters routes so only routes for chosen spot and wall are shown
const filteredRoutes = computed(() => {
  if (!selectedSpot.value || !selectedWall.value) return [];
  return routes.value.filter(route =>
    route.spot_id === selectedSpot.value.spot_id && route.wall_id === selectedWall.value.wall_id
  );
});

//filters walls so only walls for chosen spot are shown
const filteredWalls = computed(() => {
  if (!selectedSpot.value) return [];
  return walls.value.filter(wall => wall.spot_id === selectedSpot.value.spot_id);
});

//resets selected wall if selected spot is changeds
watch(selectedSpot, () => {
  selectedWall.value = null;
});

onMounted(async () => {
  await fetchSpots();
  await fetchwalls();
  await fetchRoutes();
});

</script>

<template>
  <div class="listLayout">
    <div class="routeAdder">
      <h2>Add route:</h2>
      <p>
        <h3>Choose spot:</h3>
        <select v-model="selectedSpot">
          <option disabled value="">-- Select a spot --</option>
          <option v-for="spot in spots" :key="spot.spot_id" :value="spot">
            {{ spot.spot_name }}
          </option>
        </select>
      </p>

      <p v-if="selectedSpot">
        <h3>Choose wall:</h3>
        <select v-model="selectedWall">
          <option disabled value="">-- Select a wall --</option>
          <option v-for="wall in filteredWalls" :key="wall.wall_id" :value="wall">
            {{ wall.wall_name }}
          </option>
        </select>
      </p>

      <p v-if="selectedSpot && selectedWall">
        <h3>Route name:</h3>
        <input v-model="routeName" placeholder="Sand mellom tærne" required />
      </p>

      <p v-if="selectedSpot && selectedWall && routeName">
        <h3>Choose grade:</h3>
        <select v-model="selectedGrade">
          <option disabled value="">-- Select a grade--</option>
          <option v-for="grade in grades" :key="grade.grade" :value="grade">
            {{ grade.grade }}
          </option>
        </select>
      </p>

      <button @click="addroute">Add route</button>

      <p v-html="message"></p>
    </div>

    <div v-if="selectedWall" class="existingRoutes">
      <h2>Existing routes:</h2>
      <div v-for="route in filteredRoutes" :key="route.route_id" class="cardDisplay">
        <p>
          <strong>{{ route.route_name }}</strong><br />
          Grade: {{ route.route_grade.grade }} - {{ route.route_grade.description }}<br />
          Spot: {{ route.spot_name }}<br />
          Wall: {{ route.wall_name }}<br />
        </p>
        <button @click="deleteroute(route.route_id)">Delete</button>
      </div>
    </div>
  </div>
</template>
