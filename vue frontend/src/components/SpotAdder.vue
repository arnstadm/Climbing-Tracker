<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useApi } from '@/composables/useApi';

const { fetchAll, post, del } = useApi('spots');

const spotName = ref('');
const spotLocation = ref('');
const spots = ref<Array<any>>([]);
const message = ref('');

//fetching spots
const fetchSpots = async () => {
  try {
    spots.value = await fetchAll();
  } catch (err) {
    message.value = 'Error fetching spots.';
  }
};

//post function
const addSpot = async () => {
  if (!spotName.value || !spotLocation.value) return;

  const newSpot = {
    spot_name: spotName.value,
    spot_location: spotLocation.value,
  };

  try {
      const data = await post(newSpot);
      spots.value.push(data);
      //resets values
      spotName.value = '';
      spotLocation.value = '';
  } catch (err) {
    message.value = 'Error saving spot.';
  }
};

const deleteSpot = async (id: number) => {
  try {
    await del(id);
    spots.value = spots.value.filter((s) => s.spot_id !== id);
  } catch (err) {
    message.value = 'Error deleting spot.';
  }
};

onMounted(async () => {
  await fetchSpots();
});

</script>


<template>
  <div class="listLayout">
  <div class="spotAdder">
    <h2>Add spot:</h2>
    <p>
      Spot name:
      <br />
      <input v-model="spotName" placeholder="Storvika" required />
    </p>
    <p>
      Location:
      <br />
      <input v-model="spotLocation" placeholder="Stjørdal" required />
    </p>
    <button @click="addSpot">Add Spot</button>
    <p v-html="message"></p>
  </div>
  <div class="existingSpots">
    <h2>Spots:</h2>
    <div v-for="spot in spots" :key="spot.spot_id" class="cardDisplay">
      <p>{{ spot.spot_name }} - {{ spot.spot_location }}</p>
      <button @click="deleteSpot(spot.spot_id)">Delete</button>
    </div>
  </div>
</div>
</template>