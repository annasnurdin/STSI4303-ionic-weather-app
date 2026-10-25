<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Prakiraan Cuaca Jakarta</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-button expand="block" @click="fetchWeatherData" :disabled="loading">
        {{ loading ? 'Memuat Data...' : 'Refresh Data Cuaca' }}
      </ion-button>

      <p v-if="loading" class="status-msg">Sedang mengambil data dari API...</p>
      <p v-if="error" class="error-msg">{{ error }}</p>

      <table v-if="weatherList.length > 0" class="weather-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Waktu (time)</th>
            <th>Suhu (temperature_2m)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in weatherList" :key="item.time">
            <td>{{ index + 1 }}</td>
            <td>{{ item.time }}</td>
            <td>{{ item.temperature_2m }} °C</td>
          </tr>
        </tbody>
      </table>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
import { getWeatherData } from '@/services/weatherService';

interface WeatherItem {
  time: string;
  temperature_2m: number;
}

const weatherList = ref<WeatherItem[]>([]);
const loading = ref<boolean>(false);
const error = ref<string>('');

const fetchWeatherData = async () => {
  loading.value = true;
  error.value = '';
  try {
    const response = await getWeatherData();
    const times: string[] = response.data.hourly.time;
    const temperatures: number[] = response.data.hourly.temperature_2m;

    weatherList.value = times.slice(0, 10).map((time, index) => ({
      time: new Date(time).toLocaleString('id-ID'), // dd/mm/yyyy, jam
      temperature_2m: temperatures[index]
    }));
  } catch (err) {
    error.value = 'Gagal ambil data dari API.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchWeatherData();
});
</script>

<style scoped>
.status-msg {
  text-align: center;
  color: #666;
  margin-top: 12px;
}

.error-msg {
  text-align: center;
  color: #d32f2f;
  margin-top: 12px;
}

.weather-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
  font-size: 14px;
}

.weather-table th,
.weather-table td {
  border: 1px solid #ddd;
  padding: 8px 10px;
  text-align: left;
}

.weather-table th {
  background-color: #3880ff;
  color: white;
}

.weather-table tr:nth-child(even) {
  background-color: #f9f9f9;
}
</style>
