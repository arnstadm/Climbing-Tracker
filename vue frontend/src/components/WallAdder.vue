<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useApi } from '@/composables/useApi';

// Destructure API methods
const { fetchAll: fetchAllWalls, post: postWall, put: putWall, del: delWall } = useApi('walls');
const { fetchAll: fetchAllSpots } = useApi('spots');

// State
const wallName = ref('');
const selectedSpot = ref<{ spot_id: number; spot_name: string } | null>(null);
const walls = ref<Array<any>>([]);
const spots = ref<Array<{ spot_id: number; spot_name: string }>>([]);
const message = ref('');

// Fetch data
const fetchWalls = async () => {
  try {
    walls.value = await fetchAllWalls();
  } catch (err) {
    message.value = 'Error fetching walls.';
    console.error(err);
  }
};

const fetchSpots = async () => {
  try {
    spots.value = await fetchAllSpots();
  } catch (err) {
    message.value = 'Error fetching spots.';
    console.error(err);
  }
};

// Add or update wall
const addWall = async () => {
  if (!wallName.value || !selectedSpot.value?.spot_id) return;

  const newWall = {
    wall_name: wallName.value,
    spot_id: selectedSpot.value.spot_id,
  };

  try {
      const data = await postWall(newWall);
      walls.value.push(data);

    // Reset form
    wallName.value = '';
    selectedSpot.value = null;
    message.value = 'Wall saved!';
  } catch (err) {
    message.value = 'Error saving wall.';
    console.error(err);
  }
};

// Delete wall
const deleteWall = async (id: number) => {
  try {
    await delWall(id);
    walls.value = walls.value.filter((w) => w.id !== id);
  } catch (err) {
    message.value = 'Error deleting wall.';
    console.error(err);
  }
};

// Get spot name by ID
const getSpotName = (spotId: number): string => {
  const spot = spots.value.find((s) => s.spot_id === spotId);
  return spot ? spot.spot_name : 'Unknown spot';
};

// Computed to filter walls by the selected spot
const filteredWalls = computed(() => {
  return walls.value.filter(wall => wall.spot_id === selectedSpot.value?.spot_id);
});

// Init
onMounted(async () => {
  await fetchSpots();
  await fetchWalls();
});
</script>

<template>
  <div class="listLayout">
    <div class="wallAdder">
      <h2>Add Wall:</h2>
      <p>
        Spot:
        <br />
        <select v-model="selectedSpot">
          <option disabled value="">-- Select a spot --</option>
          <option v-for="spot in spots" :key="spot.spot_id" :value="spot">
            {{ spot.spot_name }}
          </option>
        </select>
      </p>
      <p v-if="selectedSpot">
        Wall Name:
        <br />
        <input v-model="wallName" placeholder="Tegneveggen" required />
      </p>

      <button @click="addWall">Add Wall</button>
      <p v-html="message"></p>
    </div>

    <div v-if="selectedSpot" class="existingWalls">
      <h2>Existing Walls:</h2>
      <div v-for="wall in filteredWalls" :key="wall.wall_id" class="cardDisplay">
        <p>{{ wall.wall_name }} - {{ getSpotName(wall.spot_id) }}</p>
        <button @click="deleteWall(wall.wall_id)">Delete</button>
      </div>
    </div>
  </div>
</template>
