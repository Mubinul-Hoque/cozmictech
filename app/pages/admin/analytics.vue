<template>
  <div class="space-y-8 font-sans">
    <!-- ── Header ───────────────────────────────────────────── -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
      <div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Visitor Analytics</h2>
        <p class="text-slate-400 mt-1 text-xs font-bold uppercase tracking-wider">
          Real-time traffic insights &amp; performance metrics
        </p>
      </div>
      <button
        @click="fetchAnalytics"
        :disabled="loading"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm cursor-pointer"
      >
        <Icon :name="loading ? 'lucide:loader-2' : 'lucide:refresh-cw'" :class="loading ? 'animate-spin' : ''" class="text-sm" />
        Refresh
      </button>
    </div>

    <!-- ── Date Range Selector ────────────────────────────────── -->
    <div class="flex flex-wrap items-center gap-2">
      <button
        v-for="r in rangeOptions"
        :key="r.key"
        @click="selectRange(r.key)"
        class="px-4 py-2 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer border"
        :class="activeRange === r.key
          ? 'bg-[#feb900] border-[#feb900] text-slate-950 shadow-sm'
          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'"
      >
        {{ r.label }}
      </button>

      <!-- Custom date pickers -->
      <template v-if="activeRange === 'custom'">
        <input
          type="date"
          v-model="customFrom"
          class="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-[#feb900] bg-white"
        />
        <span class="text-xs text-slate-400">to</span>
        <input
          type="date"
          v-model="customTo"
          class="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-[#feb900] bg-white"
        />
        <button
          @click="fetchAnalytics"
          class="px-4 py-2 bg-[#feb900] rounded-full text-xs font-bold text-slate-950 cursor-pointer"
        >Apply</button>
      </template>
    </div>

    <!-- ── Loading skeleton ───────────────────────────────────── -->
    <div v-if="loading && !data" class="flex justify-center py-24">
      <div class="relative w-12 h-12">
        <div class="absolute inset-0 rounded-full border-4 border-slate-100 border-t-[#feb900] animate-spin"></div>
      </div>
    </div>

    <!-- ── Empty state ────────────────────────────────────────── -->
    <div v-else-if="!loading && data && data.totalVisitors === 0" class="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
      <Icon name="lucide:bar-chart-2" class="text-5xl text-slate-300 mb-3" />
      <p class="text-sm font-bold text-slate-500">No visitor data yet</p>
      <p class="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
        Tracking is active. Data will appear here once visitors browse your public pages.
      </p>
    </div>

    <!-- ── Dashboard Content ──────────────────────────────────── -->
    <template v-else-if="data">
      <!-- ── Row 1: Summary KPI Cards ───────────────────────── -->
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          v-for="kpi in kpiCards"
          :key="kpi.label"
          class="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3 relative overflow-hidden group hover:shadow-md transition-all duration-200"
        >
          <div class="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 rounded-full blur-2xl opacity-40 pointer-events-none" :style="`background-color: ${kpi.glow}`"></div>
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{{ kpi.label }}</span>
            <div class="w-9 h-9 rounded-xl flex items-center justify-center text-base shadow-sm border" :style="`background-color: ${kpi.bg}; color: ${kpi.color}; border-color: ${kpi.border}`">
              <Icon :name="kpi.icon" />
            </div>
          </div>
          <p class="text-3xl font-black text-slate-800 tracking-tight leading-none">{{ kpi.value }}</p>
          <p class="text-[11px] text-slate-400 font-medium">{{ kpi.sub }}</p>
        </div>
      </div>

      <!-- ── Row 2: Trend Chart + Traffic Sources ──────────────── -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <!-- Trend Chart -->
        <div class="xl:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-extrabold text-slate-800">Visitor Trend</h3>
              <p class="text-xs text-slate-400 mt-0.5">{{ trendLabel }}</p>
            </div>
            <div class="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500">
              <Icon name="lucide:trending-up" />
            </div>
          </div>
          <div class="relative h-56">
            <canvas ref="trendChartEl" class="w-full h-full"></canvas>
          </div>
        </div>

        <!-- Traffic Sources -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-extrabold text-slate-800">Traffic Sources</h3>
              <p class="text-xs text-slate-400 mt-0.5">Where visitors come from</p>
            </div>
            <div class="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
              <Icon name="lucide:globe" />
            </div>
          </div>
          <div class="relative h-36 flex items-center justify-center">
            <canvas ref="sourcesChartEl" class="max-h-36"></canvas>
          </div>
          <div class="space-y-2">
            <div v-for="s in data.sources" :key="s.source" class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="`background-color: ${sourceColor(s.source)}`"></span>
                <span class="font-semibold text-slate-700 capitalize">{{ sourceLabel(s.source) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-slate-800">{{ s.count.toLocaleString() }}</span>
                <span class="text-slate-400 w-10 text-right">{{ s.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Row 3: Devices + Countries ────────────────────────── -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Device Breakdown -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-extrabold text-slate-800">Device Type</h3>
              <p class="text-xs text-slate-400 mt-0.5">Desktop, mobile &amp; tablet</p>
            </div>
            <div class="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-500">
              <Icon name="lucide:monitor-smartphone" />
            </div>
          </div>
          <div class="grid grid-cols-3 gap-3">
            <div
              v-for="d in deviceCards"
              :key="d.type"
              class="rounded-2xl border p-4 text-center space-y-1"
              :style="`background-color: ${d.bg}; border-color: ${d.border}`"
            >
              <Icon :name="d.icon" class="text-2xl" :style="`color: ${d.color}`" />
              <p class="text-xl font-black text-slate-800">{{ d.percentage }}%</p>
              <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{{ d.type }}</p>
              <p class="text-[11px] text-slate-400">{{ d.count.toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <!-- Countries Table -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-extrabold text-slate-800">Visitors by Country</h3>
              <p class="text-xs text-slate-400 mt-0.5">Geographic distribution</p>
            </div>
            <div class="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500">
              <Icon name="lucide:map-pin" />
            </div>
          </div>
          <div class="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
            <div v-for="(c, i) in data.byCountry" :key="c.country_code" class="flex items-center gap-3">
              <span class="text-xs text-slate-400 font-mono w-4 flex-shrink-0">{{ i + 1 }}</span>
              <span class="text-base leading-none" :title="c.country_name">{{ countryFlag(c.country_code) }}</span>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-0.5">
                  <span class="text-xs font-semibold text-slate-700 truncate">{{ c.country_name }}</span>
                  <span class="text-xs font-bold text-slate-800 flex-shrink-0 ml-2">{{ c.count.toLocaleString() }}</span>
                </div>
                <div class="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div class="h-full rounded-full bg-[#feb900] transition-all duration-500" :style="`width: ${c.percentage}%`"></div>
                </div>
              </div>
              <span class="text-[10px] text-slate-400 font-bold w-8 text-right flex-shrink-0">{{ c.percentage }}%</span>
            </div>
            <div v-if="data.byCountry.length === 0" class="text-center py-6 text-xs text-slate-400">
              No country data yet
            </div>
          </div>
        </div>
      </div>

      <!-- ── Row 4: Top Pages + Keywords ───────────────────────── -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Top Pages -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-extrabold text-slate-800">Most Visited Pages</h3>
              <p class="text-xs text-slate-400 mt-0.5">Top performing content</p>
            </div>
            <div class="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-500">
              <Icon name="lucide:file-bar-chart" />
            </div>
          </div>
          <div class="space-y-2">
            <div
              v-for="(p, i) in data.topPages"
              :key="p.page_path"
              class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <span
                class="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0"
                :class="i === 0 ? 'bg-[#feb900] text-slate-950' : i === 1 ? 'bg-slate-200 text-slate-700' : i === 2 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'"
              >{{ i + 1 }}</span>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold text-slate-800 truncate" :title="p.page_title">{{ p.page_title || p.page_path }}</p>
                <p class="text-[10px] text-slate-400 font-mono truncate">{{ p.page_path }}</p>
              </div>
              <span class="text-sm font-black text-slate-800 flex-shrink-0">{{ p.count.toLocaleString() }}</span>
            </div>
            <div v-if="data.topPages.length === 0" class="text-center py-6 text-xs text-slate-400">No page data yet</div>
          </div>
        </div>

        <!-- Search Keywords -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-extrabold text-slate-800">Search Keywords</h3>
              <p class="text-xs text-slate-400 mt-0.5">Terms used to find the site</p>
            </div>
            <div class="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500">
              <Icon name="lucide:search" />
            </div>
          </div>
          <div class="space-y-2.5">
            <div
              v-for="(kw, i) in data.keywords"
              :key="kw.keyword"
              class="flex items-center gap-3"
            >
              <span class="text-xs text-slate-400 font-mono w-4 flex-shrink-0">{{ i + 1 }}</span>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-semibold text-slate-700 truncate">{{ kw.keyword }}</span>
                  <span class="text-xs font-bold text-slate-800 flex-shrink-0 ml-2">{{ kw.count }}</span>
                </div>
                <div class="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    class="h-full rounded-full bg-emerald-400 transition-all duration-500"
                    :style="`width: ${keywordWidth(kw.count)}%`"
                  ></div>
                </div>
              </div>
            </div>
            <div v-if="data.keywords.length === 0" class="text-center py-6 text-xs text-slate-400">
              <Icon name="lucide:search-x" class="text-2xl text-slate-300 mb-1" />
              <p>No search keyword data yet</p>
              <p class="text-[10px] mt-0.5">Keywords appear when visitors arrive via a search engine</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Row 5: Sectors + Categories ───────────────────────── -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Popular Sectors -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-extrabold text-slate-800">Popular Sectors</h3>
              <p class="text-xs text-slate-400 mt-0.5">Most browsed project sectors</p>
            </div>
            <div class="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500">
              <Icon name="lucide:building-2" />
            </div>
          </div>
          <div v-if="data.sectors.length > 0" class="relative h-52">
            <canvas ref="sectorsChartEl" class="w-full h-full"></canvas>
          </div>
          <div v-else class="text-center py-8 text-xs text-slate-400">
            No sector data yet
          </div>
        </div>

        <!-- Popular Categories -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-extrabold text-slate-800">Popular Categories</h3>
              <p class="text-xs text-slate-400 mt-0.5">Most browsed project categories</p>
            </div>
            <div class="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500">
              <Icon name="lucide:layers" />
            </div>
          </div>
          <div class="space-y-2.5">
            <div v-for="(cat, i) in data.categories" :key="cat.name" class="flex items-center gap-3">
              <span class="text-xs text-slate-400 font-mono w-4">{{ i + 1 }}</span>
              <div class="flex-1">
                <div class="flex justify-between mb-1">
                  <span class="text-xs font-semibold text-slate-700 truncate">{{ cat.name }}</span>
                  <span class="text-xs font-bold text-slate-800">{{ cat.count }}</span>
                </div>
                <div class="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    class="h-full rounded-full bg-orange-400 transition-all duration-500"
                    :style="`width: ${categoryWidth(cat.count)}%`"
                  ></div>
                </div>
              </div>
            </div>
            <div v-if="data.categories.length === 0" class="text-center py-8 text-xs text-slate-400">No category data yet</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
  title: 'Visitor Analytics'
});

// ── State ────────────────────────────────────────────────────────────────────
const loading = ref(false);
const data = ref(null);
const activeRange = ref('30d');
const customFrom = ref('');
const customTo = ref('');

// Chart element refs
const trendChartEl = ref(null);
const sourcesChartEl = ref(null);
const sectorsChartEl = ref(null);

// Chart instances
let trendChart = null;
let sourcesChart = null;
let sectorsChart = null;

// ── Date ranges ──────────────────────────────────────────────────────────────
const rangeOptions = [
  { key: 'today', label: 'Today' },
  { key: '7d',    label: '7 Days' },
  { key: '30d',   label: '30 Days' },
  { key: '12m',   label: '12 Months' },
  { key: 'custom', label: 'Custom' },
];

const trendLabel = computed(() => {
  const labels = {
    today: 'Hourly breakdown — today',
    '7d':  'Daily — last 7 days',
    '30d': 'Daily — last 30 days',
    '12m': 'Monthly — last 12 months',
    custom:'Custom date range',
  };
  return labels[activeRange.value] || '';
});

// ── Fetch ────────────────────────────────────────────────────────────────────
const fetchAnalytics = async () => {
  loading.value = true;
  try {
    const params = { range: activeRange.value };
    if (activeRange.value === 'custom') {
      if (customFrom.value) params.from = customFrom.value;
      if (customTo.value)   params.to   = customTo.value;
    }
    const res = await useNuxtApp().$fetch('/api/admin/analytics', { params });
    if (res?.success) {
      data.value = res;
      await nextTick();
      renderCharts();
    }
  } catch (err) {
    console.error('Analytics fetch error:', err);
  } finally {
    loading.value = false;
  }
};

const selectRange = (key) => {
  activeRange.value = key;
  if (key !== 'custom') fetchAnalytics();
};

// ── KPI Cards ────────────────────────────────────────────────────────────────
const kpiCards = computed(() => {
  if (!data.value) return [];
  const d = data.value;
  const topSource = d.sources?.[0];
  const topDevice = d.devices?.[0];
  const topCountry = d.byCountry?.[0];

  return [
    {
      label: 'Total Visitors',
      value: d.totalVisitors.toLocaleString(),
      sub: `in selected period`,
      icon: 'lucide:users',
      bg: '#fffbeb', color: '#d97706', border: '#fde68a', glow: '#fbbf24',
    },
    {
      label: 'Top Source',
      value: topSource ? sourceLabel(topSource.source) : '—',
      sub: topSource ? `${topSource.percentage}% of traffic` : 'No data',
      icon: 'lucide:globe',
      bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe', glow: '#60a5fa',
    },
    {
      label: 'Top Device',
      value: topDevice ? capitalize(topDevice.device_type) : '—',
      sub: topDevice ? `${topDevice.percentage}% of visitors` : 'No data',
      icon: 'lucide:monitor',
      bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0', glow: '#4ade80',
    },
    {
      label: 'Top Country',
      value: topCountry ? topCountry.country_name : '—',
      sub: topCountry ? `${topCountry.percentage}% of visitors` : 'No geo data',
      icon: 'lucide:map-pin',
      bg: '#fdf4ff', color: '#9333ea', border: '#e9d5ff', glow: '#c084fc',
    },
  ];
});

// ── Device breakdown helper ──────────────────────────────────────────────────
const deviceCards = computed(() => {
  if (!data.value?.devices) return [];
  const map = { desktop: { icon: 'lucide:monitor', bg: '#eff6ff', color: '#2563eb', border: '#dbeafe' },
                  mobile:  { icon: 'lucide:smartphone', bg: '#f0fdf4', color: '#16a34a', border: '#dcfce7' },
                  tablet:  { icon: 'lucide:tablet', bg: '#fdf4ff', color: '#9333ea', border: '#f3e8ff' } };
  return data.value.devices.map(d => ({
    ...d,
    ...(map[d.device_type] || { icon: 'lucide:monitor', bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' }),
  }));
});

// ── Source/Keyword/Category width helpers ────────────────────────────────────
const keywordWidth = (count) => {
  const max = data.value?.keywords?.[0]?.count || 1;
  return Math.max(4, Math.round((count / max) * 100));
};
const categoryWidth = (count) => {
  const max = data.value?.categories?.[0]?.count || 1;
  return Math.max(4, Math.round((count / max) * 100));
};

// ── Source helpers ───────────────────────────────────────────────────────────
const SOURCE_COLORS = {
  direct:   '#364d59',
  search:   '#feb900',
  social:   '#3b82f6',
  referral: '#8b5cf6',
};
const SOURCE_LABELS = {
  direct:   'Direct',
  search:   'Search Engine',
  social:   'Social Media',
  referral: 'Referral',
};
const sourceColor  = (s) => SOURCE_COLORS[s] || '#94a3b8';
const sourceLabel  = (s) => SOURCE_LABELS[s] || capitalize(s);

const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

// ── Country flag emoji helper ─────────────────────────────────────────────────
const countryFlag = (code) => {
  if (!code || code === 'XX') return '🌐';
  try {
    return code.toUpperCase().replace(/./g, c =>
      String.fromCodePoint(127397 + c.charCodeAt(0))
    );
  } catch { return '🌐'; }
};

// ── Chart Rendering ───────────────────────────────────────────────────────────
const CHART_COLORS = {
  primary: '#feb900',
  primaryLight: 'rgba(254,185,0,0.12)',
  slate: '#e2e8f0',
  sources: Object.values(SOURCE_COLORS),
  sectors: ['#364d59','#feb900','#3b82f6','#10b981','#8b5cf6','#f97316','#06b6d4','#ec4899'],
};

const destroyCharts = () => {
  [trendChart, sourcesChart, sectorsChart].forEach(c => c?.destroy());
  trendChart = sourcesChart = sectorsChart = null;
};

const renderCharts = async () => {
  if (typeof window === 'undefined') return;
  destroyCharts();

  // Lazy-load Chart.js
  let Chart;
  try {
    Chart = (await import('chart.js/auto')).default;
  } catch {
    return; // Chart.js not available — skip charts gracefully
  }

  const d = data.value;
  if (!d) return;

  // ── Trend (line chart) ───────────────────────────────────────
  if (trendChartEl.value && d.trend?.length > 0) {
    trendChart = new Chart(trendChartEl.value, {
      type: 'line',
      data: {
        labels: d.trend.map(t => t.label),
        datasets: [{
          label: 'Visitors',
          data: d.trend.map(t => t.count),
          borderColor: CHART_COLORS.primary,
          backgroundColor: CHART_COLORS.primaryLight,
          borderWidth: 2.5,
          pointRadius: d.trend.length > 20 ? 0 : 3,
          pointHoverRadius: 5,
          pointBackgroundColor: CHART_COLORS.primary,
          tension: 0.4,
          fill: true,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#94a3b8', maxTicksLimit: 12 } },
          y: { grid: { color: '#f1f5f9' }, ticks: { font: { size: 10 }, color: '#94a3b8', precision: 0 }, beginAtZero: true },
        },
      },
    });
  }

  // ── Sources (doughnut) ───────────────────────────────────────
  if (sourcesChartEl.value && d.sources?.length > 0) {
    sourcesChart = new Chart(sourcesChartEl.value, {
      type: 'doughnut',
      data: {
        labels: d.sources.map(s => sourceLabel(s.source)),
        datasets: [{
          data: d.sources.map(s => s.count),
          backgroundColor: d.sources.map(s => sourceColor(s.source)),
          borderWidth: 2,
          borderColor: '#fff',
          hoverOffset: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed} (${d.sources[ctx.dataIndex]?.percentage}%)` } },
        },
      },
    });
  }

  // ── Sectors (horizontal bar) ──────────────────────────────────
  if (sectorsChartEl.value && d.sectors?.length > 0) {
    sectorsChart = new Chart(sectorsChartEl.value, {
      type: 'bar',
      data: {
        labels: d.sectors.map(s => s.name),
        datasets: [{
          label: 'Views',
          data: d.sectors.map(s => s.count),
          backgroundColor: CHART_COLORS.sectors.slice(0, d.sectors.length),
          borderRadius: 6,
          borderSkipped: false,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: '#f1f5f9' }, ticks: { font: { size: 10 }, color: '#94a3b8', precision: 0 } },
          y: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#64748b' } },
        },
      },
    });
  }
};

// ── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(() => {
  fetchAnalytics();
});

watch(activeRange, (newRange) => {
  if (newRange !== 'custom') fetchAnalytics();
});
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar { width: 4px; }
.scrollbar-thin::-webkit-scrollbar-track { background: #f1f5f9; }
.scrollbar-thin::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 9999px; }
</style>
