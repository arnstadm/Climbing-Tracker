<script lang="ts" setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useApi } from '@/composables/useApi';
import { climbingGrades } from '@/composables/climbingGrades';

const { fetchAll: fetchAllRoutes, post: postRoute} = useApi('routes');

// Destructure walls and spot API methods
const { fetchAll: fetchAllWalls, post: postWall } = useApi('walls');
const { fetchAll: fetchAllSpots } = useApi('spots');
const photoUploader = useApi('upload');

const routeName = ref('');
const wallName = ref('');
const selectedSpot = ref<any>(null); // Ensure it's an object (or null initially)
const selectedWall = ref<any>(null);
const selectedGrade = ref<any>(null);
const routes = ref<Array<any>>([]);
const walls = ref<Array<any>>([]);
const spots = ref<Array<any>>([]);
const message = ref('');
const { grades } = climbingGrades();

const photoInput = ref<HTMLInputElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const image = ref<HTMLImageElement | null>(null)



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

// adds the wall first to get a wall id, then uploads the photo, then the route
const addWallAndRoute = async () => {
  if (!wallName.value ||
      !selectedSpot.value?.spot_id ||
      !selectedGrade.value ||
      !routeName.value) {
    return;
  }

  let wallId;

  try {
    const newWall = {
      wall_name: wallName.value,
      spot_id: selectedSpot.value.spot_id,
    };
    const wall = await postWall(newWall);
    wallId = wall.wall_id;

    message.value = 'Wall successfully created';
  } catch (err) {
    console.error(err);
    message.value = 'Error creating wall';
    return;
  }

if (photoInput.value?.files.length) {
  try {
    const formData = new FormData();
    formData.append('photo', photoInput.value.files[0]);
    formData.append('wall_id', wallId.toString());

    const response = await photoUploader.uploadPhoto(formData);
    console.log('Upload response:', response);
    message.value = response.message || 'Photo successfully uploaded';
  } catch (err) {
    console.error(err);
    message.value = 'Error uploading photo';
    return;
  }
}

  try {
    await postRoute({
      route_name: routeName.value,
      route_grade: selectedGrade.value,
      spot_id: selectedSpot.value.spot_id,
      wall_id: wallId
    });
    routeName.value = '';
    selectedSpot.value = null;
    selectedWall.value = null;
    selectedGrade.value = '';
    wallName.value = '';
    message.value = 'Route successfully saved';
  } catch (err) {
    console.error(err);
    message.value = 'Error saving route';
  }
};

const holdColors = { //trying default colors on climbing holds, might need to use ranges
  blue: [0, 0, 255],
  red: [255, 0, 0],
  magenta: [255, 0, 255],
  limegreen: [50, 205, 50],
  green: [0, 128, 0],
  pink: [255, 192, 203],
  purple: [128, 0, 128],
  black: [0, 0, 0],
}

const selectedColor = ref<string>('')

interface Grip { //defining grips
  color: string
  x: number
  y: number
  count: number
}

const grips = reactive<Grip[]>([])

function handlePhotoUpload(event: Event) { //photo uploader
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        if (canvasRef.value) {
          const ctx = canvasRef.value.getContext('2d')
          if (ctx) {
            canvasRef.value.width = img.width
            canvasRef.value.height = img.height
            ctx.drawImage(img, 0, 0)
            analyzeCanvas()
          }
        }
      }
      img.src = e.target?.result as string
      image.value = img
    }
    reader.readAsDataURL(file)
  }
}

function findClosestColor(r: number, g: number, b: number): string { //locates the closes color of the given rgb value
  let closest = ''
  let minDistance = Infinity
  for (const [color, [cr, cg, cb]] of Object.entries(holdColors)) {
    const dist = Math.sqrt((r-cr)**2 + (g-cg)**2 + (b-cb)**2)
    if (dist < minDistance) {
      minDistance = dist
      closest = color
    }
  }
  return closest
}

//analyzes the canvas pixel data to group nearby pixels with similar colors into grips
function analyzeCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  grips.length = 0 // Clear previous grips

  const detectionDistance = 30 // distance in pixels for grouping points into same grip

  for (let y = 0; y < canvas.height; y += 5) {
    for (let x = 0; x < canvas.width; x += 5) {
      const idx = (y * canvas.width + x) * 4
      const [r, g, b, a] = [data[idx], data[idx+1], data[idx+2], data[idx+3]]
      if (a > 100) {
        const color = findClosestColor(r, g, b)

        let foundGrip = grips.find(grip => {
          return grip.color === color && Math.hypot(grip.x - x, grip.y - y) < detectionDistance
        })

        if (foundGrip) {
          // Update existing grip
          foundGrip.x = (foundGrip.x * foundGrip.count + x) / (foundGrip.count + 1)
          foundGrip.y = (foundGrip.y * foundGrip.count + y) / (foundGrip.count + 1)
          foundGrip.count++
        } else {
          // Create new grip
          grips.push({ color, x, y, count: 1 })
        }
      }
    }
  }

  redrawCanvas()
}

function redrawCanvas() {
  const canvas = canvasRef.value
  if (!canvas || !image.value) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(image.value, 0, 0)

  // Sort grips from bottom to top (for better route order)
  grips.sort((a, b) => a.y - b.y)

  // Draw the route path
  let isFirstGrip = true
  for (const grip of grips) {
    if (grip.color === selectedColor.value) {
      if (isFirstGrip) {
        ctx.beginPath()
        ctx.moveTo(grip.x, grip.y)
        isFirstGrip = false
      } else {
        ctx.lineTo(grip.x, grip.y)
      }
      ctx.strokeStyle = grip.color
      ctx.lineWidth = 3
      ctx.globalAlpha = 0.7
      ctx.stroke()
    }
  }

  // Draw the grips themselves as circles
  for (const grip of grips) {
    if (grip.color === selectedColor.value) {
      ctx.beginPath()
      ctx.arc(grip.x, grip.y, 12, 0, Math.PI * 2)
      ctx.fillStyle = grip.color
      ctx.globalAlpha = 0.6
      ctx.fill()
      ctx.globalAlpha = 1
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 2
      ctx.stroke()
    }
  }
}

watch(selectedColor, () => {
  redrawCanvas()
})

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
        Wall Name:
        <br />
        <input v-model="wallName" placeholder="Tegneveggen" required />
      </p>
      <p v-if="selectedSpot">
        <h3>Take picture of wall:</h3>
        <input
      type="file"
      accept="image/*"
      capture="environment"
      ref="photoInput"
      @change="handlePhotoUpload"
    />

    <canvas ref="canvasRef" class="border shadow-lg"></canvas>
    <div>
      <label for="colorSelect">Select route color:</label>
      <select id="colorSelect" v-model="selectedColor">
        <option value="">-- Choose a color --</option>
        <option v-for="(rgb, colorName) in holdColors" :key="colorName" :value="colorName">
          {{ colorName }}
        </option>
      </select>
    </div>
      </p>

      <p v-if="selectedSpot && wallName">
        <h3>Route name:</h3>
        <input v-model="routeName" placeholder="Sand mellom tærne" required />
      </p>

      <p v-if="selectedSpot && wallName && routeName">
        <h3>Choose grade:</h3>
        <select v-model="selectedGrade">
          <option disabled value="">-- Select a grade--</option>
          <option v-for="grade in grades" :key="grade.grade" :value="grade">
            {{ grade.grade }}
          </option>
        </select>
      </p>

      <button @click="addWallAndRoute">Add route</button>

      <p v-html="message"></p>

    </div>

  </div>
</template>

<style scoped>
canvas {
  max-width: 100%;
  height: auto;
}
</style>
