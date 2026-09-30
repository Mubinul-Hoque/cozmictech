<template>
  <div class="font-sans space-y-6">
    <div class="flex flex-col gap-1">
      <NuxtLink to="/admin/users" class="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition-colors inline-flex items-center gap-1.5 mb-1">
        <Icon name="lucide:arrow-left" class="text-sm" /> Back to Users &amp; Roles
      </NuxtLink>
      <h2 class="text-2xl font-bold text-slate-800 tracking-tight">{{ isNew ? 'Add Administrator' : 'Edit User Account' }}</h2>
      <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Configure user credentials, role assignment, and access state</p>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-2xl">
      <form @submit.prevent="saveUser" class="space-y-6">
        <!-- Username -->
        <div>
          <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Username</label>
          <input 
            v-model="form.username" 
            type="text" 
            required 
            placeholder="e.g. John Doe"
            class="block w-full border border-slate-300 rounded-lg py-2.5 px-4 bg-white text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-xs transition-colors" 
          />
        </div>
        
        <!-- Email -->
        <div>
          <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Email Address</label>
          <input 
            v-model="form.email" 
            type="email" 
            required 
            placeholder="admin@example.com"
            class="block w-full border border-slate-300 rounded-lg py-2.5 px-4 bg-white text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-xs transition-colors" 
          />
        </div>
        
        <!-- Role Assignment (Dynamically Loaded from DB) -->
        <div>
          <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Assigned Role</label>
          <select 
            v-model="form.role_id" 
            required
            class="block w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-xs transition-colors"
          >
            <option v-for="r in filteredRoles" :key="r.id" :value="r.id">
              {{ r.name }} {{ r.is_system ? '(System)' : '(Custom)' }} — {{ r.description || '' }}
            </option>
          </select>
          <p class="text-[11px] text-slate-400 mt-1">
            Permissions for this user will be determined by the chosen role's matrix.
          </p>
        </div>

        <!-- Account Status Toggle -->
        <div class="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl flex items-center justify-between">
          <div>
            <span class="block text-xs font-bold text-slate-700">Account Status</span>
            <span class="block text-[11px] text-slate-400 mt-0.5">
              {{ form.is_active ? 'Account is active and able to sign in.' : 'Account is deactivated. Login will be prevented.' }}
            </span>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              v-model="form.is_active" 
              :disabled="!isNew && user?.id === authUser?.id"
              class="sr-only peer" 
            />
            <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#feb900]"></div>
          </label>
        </div>
        
        <!-- Password Field -->
        <div>
          <div class="flex justify-between items-center mb-1.5">
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider">
              Password 
              <span v-if="!isNew" class="text-[10px] text-slate-400 font-semibold normal-case ml-1">(Leave blank to keep existing)</span>
            </label>
            <button 
              type="button" 
              @click="generatePassword" 
              class="text-[11px] font-bold text-amber-600 hover:text-amber-700 transition-colors inline-flex items-center gap-1"
            >
              <Icon name="lucide:sparkles" class="text-xs" />
              Generate Secure
            </button>
          </div>

          <div class="relative">
            <input 
              v-model="form.password" 
              :type="showPassword ? 'text' : 'password'" 
              :required="isNew" 
              minlength="8"
              placeholder="Minimum 8 characters"
              class="block w-full border border-slate-300 rounded-lg py-2.5 pl-4 pr-12 bg-white text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-xs transition-colors" 
            />
            <button 
              type="button" 
              @click="showPassword = !showPassword" 
              class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700 transition-colors focus:outline-none cursor-pointer"
            >
              <Icon :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'" class="text-base" />
            </button>
          </div>
        </div>

        <div class="flex justify-end pt-5 border-t border-slate-200">
          <NuxtLink to="/admin/users" class="bg-white py-2 px-5 border border-slate-300 rounded-full shadow-sm text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 focus:outline-none mr-3 transition-colors">
            Cancel
          </NuxtLink>
          <button 
            type="submit" 
            :disabled="saving" 
            class="bg-[#feb900] border border-transparent rounded-full shadow-sm py-2 px-6 text-xs font-bold hover:bg-[#e5a600] focus:outline-none disabled:opacity-50 transition-colors" 
            style="color: #1e293b;"
          >
            {{ saving ? 'Saving...' : (isNew ? 'Create User' : 'Save Changes') }}
          </button>
        </div>
      </form>
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
const isNew = route.params.id === 'new';

const authUser = useState('authUser');
const { isSuperAdmin } = usePermissions();
const showPassword = ref(false);

// Load all DB roles
const { data: roles } = await useFetch('/api/admin/roles');

const filteredRoles = computed(() => {
  if (!roles.value) return [];
  if (isSuperAdmin.value) return roles.value;
  // Non-SuperAdmin cannot assign Super Admin role
  return roles.value.filter(r => r.name !== 'Super Admin');
});

const form = ref({
  username: '',
  email: '',
  role_id: null,
  is_active: true,
  password: ''
});

const saving = ref(false);
const user = ref(null);

if (!isNew) {
  const { data: fetchedUser } = await useFetch(`/api/admin/users/${route.params.id}`);
  if (fetchedUser.value) {
    user.value = fetchedUser.value;
    form.value.username = fetchedUser.value.username;
    form.value.email = fetchedUser.value.email;
    form.value.role_id = fetchedUser.value.role_id;
    form.value.is_active = fetchedUser.value.is_active !== false;
  }
} else {
  // Default to standard Admin role for new user
  watch(filteredRoles, (rList) => {
    if (rList?.length && !form.value.role_id) {
      const defaultRole = rList.find(r => r.name === 'Admin') || rList[0];
      if (defaultRole) form.value.role_id = defaultRole.id;
    }
  }, { immediate: true });
}

const generatePassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
  let pass = '';
  for (let i = 0; i < 12; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  form.value.password = pass;
  showPassword.value = true;
};

const saveUser = async () => {
  saving.value = true;
  try {
    const url = isNew ? '/api/admin/users' : `/api/admin/users/${route.params.id}`;
    const method = isNew ? 'POST' : 'PUT';
    
    const body = {
      username: form.value.username,
      email: form.value.email,
      role_id: form.value.role_id,
      is_active: form.value.is_active,
    };

    if (form.value.password) {
      body.password = form.value.password;
    }
    
    await useNuxtApp().$fetch(url, { method, body });
    clearNuxtData();
    useToast().success(isNew ? 'User created successfully' : 'User updated successfully');
    await refreshNuxtData('admin-users-list');
    router.push('/admin/users');
  } catch (error) {
    useToast().error(error.data?.statusMessage || 'Failed to save user');
  } finally {
    saving.value = false;
  }
};
</script>
