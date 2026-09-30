<template>
  <div class="space-y-6 font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <NuxtLink to="/admin/users?tab=roles" class="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition-colors inline-flex items-center gap-1.5 mb-1.5">
          <Icon name="lucide:arrow-left" class="text-sm" />
          Back to Roles &amp; Permissions
        </NuxtLink>
        <div class="flex items-center gap-3">
          <h2 class="text-2xl font-bold text-slate-800 tracking-tight">{{ role?.name || 'Role Permissions' }}</h2>
          <span v-if="role?.is_system" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            System Role
          </span>
          <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            Custom Role
          </span>
        </div>
        <p class="text-slate-500 text-xs mt-1">{{ role?.description || 'Configure module and action permissions for this role.' }}</p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2">
        <button 
          v-if="!isSuperAdminRole"
          type="button" 
          @click="grantAll" 
          class="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-full hover:bg-slate-50 transition-colors shadow-sm inline-flex items-center gap-1.5"
        >
          <Icon name="lucide:check-check" class="text-emerald-600" />
          Grant All
        </button>
        <button 
          v-if="!isSuperAdminRole"
          type="button" 
          @click="revokeAll" 
          class="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-full hover:bg-slate-50 transition-colors shadow-sm inline-flex items-center gap-1.5"
        >
          <Icon name="lucide:x" class="text-red-500" />
          Revoke All
        </button>
        <button 
          v-if="!isSuperAdminRole"
          type="button" 
          @click="savePermissions" 
          :disabled="saving"
          class="px-5 py-2 text-xs font-bold text-slate-900 bg-[#feb900] hover:bg-[#e5a600] rounded-full transition-colors shadow-sm hover:shadow inline-flex items-center gap-1.5 disabled:opacity-50"
        >
          <Icon v-if="saving" name="lucide:loader-2" class="animate-spin text-sm" />
          <Icon v-else name="lucide:save" class="text-sm" />
          {{ saving ? 'Saving Changes...' : 'Save Matrix' }}
        </button>
      </div>
    </div>

    <!-- Super Admin Banner Notice -->
    <div v-if="isSuperAdminRole" class="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
      <div class="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5 text-amber-700">
        <Icon name="lucide:shield-check" class="text-lg" />
      </div>
      <div>
        <h4 class="text-sm font-bold text-amber-900">Unrestricted System Privileges</h4>
        <p class="text-xs text-amber-700 mt-0.5 leading-relaxed">
          The <strong>Super Admin</strong> role inherently has unrestricted access across all existing and future modules and actions. Individual permissions cannot be disabled or downgraded for this role.
        </p>
      </div>
    </div>

    <!-- Permission Matrix Table Card -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div v-if="pending" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-[#feb900]"></div>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50/75">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider min-w-[200px]">
                Module / Resource
              </th>
              <th 
                v-for="act in availableActions" 
                :key="act.id" 
                scope="col" 
                class="px-4 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider min-w-[110px]"
              >
                <div class="flex flex-col items-center gap-1">
                  <span>{{ act.label }}</span>
                  <button 
                    v-if="!isSuperAdminRole"
                    type="button" 
                    @click="toggleColumn(act.id)"
                    class="text-[10px] lowercase text-slate-400 hover:text-amber-600 font-semibold"
                    title="Toggle entire column"
                  >
                    toggle
                  </button>
                </div>
              </th>
              <th v-if="!isSuperAdminRole" scope="col" class="px-4 py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-wider min-w-[90px]">
                All
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 bg-white">
            <template v-for="category in moduleCategories" :key="category.name">
              <!-- Category Header -->
              <tr class="bg-slate-50/40">
                <td :colspan="availableActions.length + (isSuperAdminRole ? 1 : 2)" class="px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <div class="flex items-center gap-2">
                    <Icon :name="category.icon" class="text-sm text-slate-400" />
                    <span>{{ category.name }}</span>
                  </div>
                </td>
              </tr>

              <!-- Module Rows -->
              <tr 
                v-for="mod in category.modules" 
                :key="mod.id" 
                class="hover:bg-slate-50/50 transition-colors"
              >
                <!-- Module Name -->
                <td class="px-6 py-3.5 whitespace-nowrap">
                  <div class="flex items-center gap-2.5">
                    <div class="w-2 h-2 rounded-full" :class="isModuleActive(mod.id) ? 'bg-emerald-500' : 'bg-slate-300'"></div>
                    <span class="text-sm font-bold text-slate-800">{{ mod.name }}</span>
                  </div>
                </td>

                <!-- Action Checkbox Cells -->
                <td 
                  v-for="act in availableActions" 
                  :key="act.id" 
                  class="px-4 py-3.5 text-center whitespace-nowrap"
                >
                  <template v-if="mod.actions.includes(act.id)">
                    <label class="inline-flex items-center justify-center cursor-pointer p-1">
                      <input 
                        type="checkbox" 
                        :checked="hasPermission(mod.id, act.id)" 
                        :disabled="isSuperAdminRole"
                        @change="togglePermission(mod.id, act.id)"
                        class="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 border-slate-300 cursor-pointer disabled:cursor-not-allowed" 
                      />
                    </label>
                  </template>
                  <template v-else>
                    <span class="text-slate-200 font-bold select-none">—</span>
                  </template>
                </td>

                <!-- Row Select All -->
                <td v-if="!isSuperAdminRole" class="px-4 py-3.5 text-center whitespace-nowrap">
                  <button 
                    type="button" 
                    @click="toggleRow(mod)"
                    class="text-xs font-semibold px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                    title="Toggle all supported actions for this module"
                  >
                    {{ isRowFullySelected(mod) ? 'None' : 'All' }}
                  </button>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Bottom Bar -->
      <div v-if="!isSuperAdminRole" class="p-4 bg-slate-50/50 border-t border-slate-200 flex justify-between items-center">
        <span class="text-xs text-slate-500 font-medium">
          {{ selectedPermissionCount }} permissions configured for <strong>{{ role?.name }}</strong>
        </span>
        <button 
          type="button" 
          @click="savePermissions" 
          :disabled="saving"
          class="px-5 py-2 text-xs font-bold text-slate-900 bg-[#feb900] hover:bg-[#e5a600] rounded-full transition-colors shadow-sm hover:shadow inline-flex items-center gap-1.5 disabled:opacity-50"
        >
          <Icon v-if="saving" name="lucide:loader-2" class="animate-spin text-sm" />
          <Icon v-else name="lucide:save" class="text-sm" />
          {{ saving ? 'Saving Changes...' : 'Save Matrix' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: ['auth']
});

const route = useRoute();
const router = useRouter();
const roleId = computed(() => route.params.id);

const { data: moduleSchema, pending: schemaPending } = await useFetch('/api/admin/roles/modules');
const { data: role, pending: rolePending, refresh: refreshRole } = await useFetch(`/api/admin/roles/${roleId.value}`);

const pending = computed(() => schemaPending.value || rolePending.value);

const availableActions = computed(() => moduleSchema.value?.actions || [
  { id: 'view', label: 'View' },
  { id: 'create', label: 'Create' },
  { id: 'edit', label: 'Edit' },
  { id: 'delete', label: 'Delete' },
  { id: 'publish', label: 'Publish/Unpublish' },
  { id: 'manage_settings', label: 'Manage Settings' }
]);

const rawModules = computed(() => moduleSchema.value?.modules || []);

const moduleCategories = computed(() => {
  const mods = rawModules.value;
  return [
    {
      name: 'Core & Dashboard',
      icon: 'lucide:gauge',
      modules: mods.filter(m => m.category === 'core' || m.id === 'dashboard')
    },
    {
      name: 'Content & Publishing',
      icon: 'lucide:file-text',
      modules: mods.filter(m => m.category === 'content')
    },
    {
      name: 'Analytics & Insights',
      icon: 'lucide:bar-chart-2',
      modules: mods.filter(m => m.category === 'analytics')
    },
    {
      name: 'System, Access & Security',
      icon: 'lucide:shield',
      modules: mods.filter(m => m.category === 'system')
    }
  ].filter(c => c.modules.length > 0);
});

const isSuperAdminRole = computed(() => {
  if (!role.value) return false;
  return (
    role.value.is_system &&
    (role.value.name === 'Super Admin' ||
      role.value.name.toLowerCase().replace(/[\s_-]/g, '') === 'superadmin')
  );
});

// Permissions local state: Record<module, string[]>
const permissionsMap = ref({});

watch(() => role.value?.permissions, (newVal) => {
  if (newVal) {
    // Clone
    const cloned = {};
    for (const [k, v] of Object.entries(newVal)) {
      cloned[k] = [...v];
    }
    permissionsMap.value = cloned;
  }
}, { immediate: true });

const hasPermission = (module, action) => {
  if (isSuperAdminRole.value) return true;
  return permissionsMap.value[module]?.includes(action) || false;
};

const isModuleActive = (module) => {
  if (isSuperAdminRole.value) return true;
  return (permissionsMap.value[module]?.length || 0) > 0;
};

const togglePermission = (module, action) => {
  if (isSuperAdminRole.value) return;

  if (!permissionsMap.value[module]) {
    permissionsMap.value[module] = [];
  }

  const idx = permissionsMap.value[module].indexOf(action);
  if (idx > -1) {
    permissionsMap.value[module].splice(idx, 1);
  } else {
    permissionsMap.value[module].push(action);
  }
};

const isRowFullySelected = (mod) => {
  const current = permissionsMap.value[mod.id] || [];
  return mod.actions.every(a => current.includes(a));
};

const toggleRow = (mod) => {
  if (isSuperAdminRole.value) return;

  if (isRowFullySelected(mod)) {
    // Deselect all
    permissionsMap.value[mod.id] = [];
  } else {
    // Select all supported actions
    permissionsMap.value[mod.id] = [...mod.actions];
  }
};

const toggleColumn = (actionId) => {
  if (isSuperAdminRole.value) return;

  // Check if all modules supporting this action already have it
  const supportingModules = rawModules.value.filter(m => m.actions.includes(actionId));
  const allSelected = supportingModules.every(m => permissionsMap.value[m.id]?.includes(actionId));

  supportingModules.forEach(m => {
    if (!permissionsMap.value[m.id]) {
      permissionsMap.value[m.id] = [];
    }
    const idx = permissionsMap.value[m.id].indexOf(actionId);
    if (allSelected) {
      if (idx > -1) permissionsMap.value[m.id].splice(idx, 1);
    } else {
      if (idx === -1) permissionsMap.value[m.id].push(actionId);
    }
  });
};

const grantAll = () => {
  if (isSuperAdminRole.value) return;

  const next = {};
  for (const m of rawModules.value) {
    next[m.id] = [...m.actions];
  }
  permissionsMap.value = next;
};

const revokeAll = () => {
  if (isSuperAdminRole.value) return;
  permissionsMap.value = {};
};

const selectedPermissionCount = computed(() => {
  let count = 0;
  for (const acts of Object.values(permissionsMap.value)) {
    count += (acts?.length || 0);
  }
  return count;
});

const saving = ref(false);

const savePermissions = async () => {
  if (isSuperAdminRole.value) return;
  saving.value = true;
  try {
    await useNuxtApp().$fetch(`/api/admin/roles/${roleId.value}`, {
      method: 'PUT',
      body: {
        name: role.value.name,
        description: role.value.description,
        permissions: permissionsMap.value,
      }
    });

    useToast().success(`Permissions saved successfully for ${role.value.name}`);
    await refreshRole();
  } catch (error) {
    useToast().error(error.data?.statusMessage || 'Failed to save permissions');
  } finally {
    saving.value = false;
  }
};
</script>
