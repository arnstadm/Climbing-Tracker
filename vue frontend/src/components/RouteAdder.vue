<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useApi } from '@/composables/useApi';
import { computed } from 'vue';
import { watch } from 'vue';

const { fetchAll: fetchAllRoutes, post: postRoute, put: putRoute, del: delRoute } = useApi('routes');

// Destructure walls API methods
const { fetchAll: fetchAllWalls } = useApi('walls');

// Destructure spots API methods
const { fetchAll: fetchAllSpots } = useApi('spots');



const routeName = ref('');
const selectedSpot = ref<any>(null); // Ensure it's an object (or null initially)
const selectedWall = ref<any>(null);
const selectedGrade = ref<any>(null);
const routes = ref<Array<any>>([]);
const walls = ref<Array<any>>([]);
const spots = ref<Array<any>>([]);
const message = ref('');

const grades =   [
  { "grade": "1", "description": "Walking terrain, no hands needed" },
  { "grade": "2", "description": "Simple scrambling, hands occasionally" },
  { "grade": "3", "description": "Easy climbing, may need rope" },
  { "grade": "4", "description": "Beginner climbing, basic rope work" },
  { "grade": "5-", "description": "Moderate difficulty, more technique needed" },
  { "grade": "5", "description": "First real climbing grade" },
  { "grade": "5+", "description": "Slightly harder, small holds" },
  { "grade": "6-", "description": "Intermediate climbing, technical movement" },
  { "grade": "6", "description": "Solid intermediate level" },
  { "grade": "6+", "description": "Challenging intermediate, pumpy or cruxy" },
  { "grade": "7-", "description": "Advanced climbing, physical and mental challenge" },
  { "grade": "7", "description": "Hard advanced climbing" },
  { "grade": "7+", "description": "Very hard, athletic moves" },
  { "grade": "8-", "description": "Expert level, strong technique and power" },
  { "grade": "8", "description": "Elite climbing, redpoint projects" },
  { "grade": "8+", "description": "Near pro level, demanding routes" },
  { "grade": "9-", "description": "Elite/pro climbing, rarely onsighted" },
  { "grade": "9", "description": "World-class difficulty" },
  { "grade": "9+", "description": "Extreme difficulty, few climbers at this level" },
  { "grade": "10-", "description": "Cutting edge, only top climbers" },
  { "grade": "10", "description": "World elite, few ascents worldwide" },
  { "grade": "10+", "description": "Ultra elite, cutting-edge sport climbing" },
  { "grade": "11-", "description": "Possibly the hardest in Norway" }
];

const fetchRoutes = async () => {
  try {
    const fetchedRoutes = await fetchAllRoutes();

    // Enrich each route with spot_name and wall_name
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
  if (!routeName.value || !selectedSpot.value || !selectedSpot.value.spot_id || !selectedWall.value || !selectedWall.value.wall_id ) return;

  const newroute = {
    route_name: routeName.value,
    route_grade: selectedGrade.value,
    spot_id: selectedSpot.value.spot_id,
    wall_id: selectedWall.value.wall_id,
  };

  try {
      const data = await postRoute(newroute);
      routes.value.push(data);
    // Reset values
    routeName.value = '';
    selectedSpot.value = null; // Reset selected spot
    selectedWall.value = null;
    selectedGrade.value = null;
    message.value = 'Route saved!';
  } catch (err) {
    message.value = 'Error saving Route.';
    console.error(err);
  }
};

const deleteroute = async (id: number) => {
  try {
    await delRoute(id);
    routes.value = routes.value.filter((s) => s.id !== id);
  } catch (err) {
    message.value = 'Error deleting route.';
  }
};

const filteredRoutes = computed(() => {
  if (!selectedSpot.value || !selectedWall.value) return [];
  return routes.value.filter(route =>
    route.spot_id === selectedSpot.value.spot_id && route.wall_id === selectedWall.value.wall_id
  );
});

const filteredWalls = computed(() => {
  if (!selectedSpot.value) return [];
  return walls.value.filter(wall => wall.spot_id === selectedSpot.value.spot_id);
});

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
      <div v-for="route in filteredRoutes" :key="route.id" class="cardDisplay">
        <p>
          <strong>{{ route.route_name }}</strong><br />
          Grade: {{ route.route_grade.grade }} - {{ route.route_grade.description }}<br />
          Spot: {{ route.spot_name }}<br />
          Wall: {{ route.wall_name }}<br />
        </p>
        <button @click="deleteroute(route.id)">Delete</button>
      </div>
    </div>
  </div>
</template>
