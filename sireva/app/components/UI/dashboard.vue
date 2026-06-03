<template>
  <div class="space-y-6">
    <!-- Top Header Bar -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
          <h1 class="text-xl font-black text-slate-800 tracking-tight uppercase">Dashboard Performa</h1>
          <p class="text-xs font-bold text-slate-400 flex items-center gap-2">
            <IconClock :size="14" />
            Last update: {{ lastUpdate }}
          </p>
        </div>
        
        <div class="flex items-center gap-4">
          <div class="flex flex-col">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tahun</label>
            <div class="relative">
              <select class="appearance-none bg-slate-50 border border-slate-200 rounded-lg px-8 py-1.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer min-w-[120px]">
                <option>2026</option>
                <option>2025</option>
                <option>2024</option>
              </select>
              <IconChevronDown class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="16" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Cards (StatCard Components) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Total Sasaran Strategis" 
        :value="stats?.ss ?? '...'" 
        :icon="IconTarget" 
        color="blue" 
      />
      <StatCard 
        title="Total Sasaran Program" 
        :value="stats?.sp ?? '...'" 
        :icon="IconChartPie" 
        color="green" 
      />
      <StatCard 
        title="Total Sasaran Kegiatan" 
        :value="stats?.sk ?? '...'" 
        :icon="IconLayoutGrid" 
        color="orange" 
      />
      <StatCard 
        title="Rerata Capaian IKU (%)" 
        :value="(stats?.capaian ?? 0) + '%'" 
        :icon="IconTrendingUp" 
        color="red" 
      />
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Chart 1: Tren Capaian IKU -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        <div class="p-6 border-b border-slate-50 flex items-center justify-between">
          <h3 class="text-lg font-black text-slate-800 uppercase tracking-tight">Tren Capaian IKU (Bulanan)</h3>
          <div class="flex gap-2">
            <span class="w-3 h-3 rounded-full bg-blue-500"></span>
          </div>
        </div>
        <div class="flex-1 p-4 relative">
          <ClientOnly>
            <component
              :is="apexchartComponent"
              v-if="apexchartComponent"
              type="line"
              height="100%"
              width="100%"
              :series="seriesIKU"
              :options="optionsIKU"
            />
            <div v-else class="absolute inset-0 flex items-center justify-center">
              <div class="w-8 h-8 border-4 border-slate-100 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          </ClientOnly>
        </div>
        <div class="px-6 py-3 bg-slate-50/50 border-t border-slate-100 text-center">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bulan</p>
        </div>
      </div>

      <!-- Chart 2: Capaian per Triwulan -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        <div class="p-6 border-b border-slate-50 flex items-center justify-between">
          <h3 class="text-lg font-black text-slate-800 uppercase tracking-tight">Capaian Strategis per Triwulan</h3>
          <div class="flex gap-2">
            <span class="w-3 h-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-200"></span>
          </div>
        </div>
        <div class="flex-1 p-4 relative">
          <ClientOnly>
            <component
              :is="apexchartComponent"
              v-if="apexchartComponent"
              type="area"
              height="100%"
              width="100%"
              :series="seriesTW"
              :options="optionsTW"
            />
            <div v-else class="absolute inset-0 flex items-center justify-center">
              <div class="w-8 h-8 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
          </ClientOnly>
        </div>
        <div class="px-6 py-3 bg-slate-50/50 border-t border-slate-100 text-center">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Periode Triwulan</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { shallowRef, onMounted, ref } from 'vue';
import { 
  IconClock, IconChevronDown, IconTarget, 
  IconChartPie, IconLayoutGrid, IconTrendingUp 
} from '@tabler/icons-vue';
import useSWRV from 'swrv';
import StatCard from './StatCard.vue';

const lastUpdate = ref(new Date().toLocaleString('id-ID', { 
  day: 'numeric', 
  month: 'long', 
  year: 'numeric', 
  hour: '2-digit', 
  minute: '2-digit' 
}));

const apexchartComponent = shallowRef<any>(null);

// Fetch Real Data from API
const fetcher = (url: string) => fetch(url).then(r => r.json());
const { data: stats } = useSWRV('/api/dashboard/stats', fetcher);

onMounted(async () => {
  if (typeof window !== 'undefined') {
    const module = await import('vue3-apexcharts');
    apexchartComponent.value = module.default;
  }
});

// Chart Data (Placeholder but mapped to stats if possible)
const seriesIKU = [{
  name: 'Capaian IKU (%)',
  data: [65, 78, 84, 82, 89]
}];

const optionsIKU = {
  chart: {
    type: 'line',
    toolbar: { show: false },
    zoom: { enabled: false }
  },
  colors: ['#3b82f6'],
  stroke: { curve: 'smooth', width: 4 },
  markers: { size: 5, colors: ['#ffffff'], strokeColors: '#3b82f6', strokeWidth: 3 },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei'],
    labels: { style: { colors: '#64748b', fontWeight: 600 } }
  },
  yaxis: { min: 0, max: 100, labels: { style: { colors: '#64748b' } } },
  grid: { borderColor: '#f1f5f9', strokeDashArray: 4 }
};

const seriesTW = [{
  name: 'Capaian Strategis',
  data: [45, 62, 85, 92]
}];

const optionsTW = {
  chart: { type: 'area', toolbar: { show: false }, zoom: { enabled: false } },
  colors: ['#10b981'],
  stroke: { curve: 'smooth', width: 3 },
  fill: {
    type: 'gradient',
    gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1, stops: [0, 90, 100] }
  },
  xaxis: {
    categories: ['TW I', 'TW II', 'TW III', 'TW IV'],
    labels: { style: { colors: '#64748b', fontWeight: 600 } }
  },
  yaxis: { min: 0, max: 100, labels: { style: { colors: '#64748b' } } },
  grid: { borderColor: '#f1f5f9', strokeDashArray: 4 }
};
</script>
