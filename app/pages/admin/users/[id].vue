<template>
  <div class="font-sans">
    <div class="mb-6 flex flex-col gap-1">
      <NuxtLink to="/admin/users" class="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition-colors inline-flex items-center gap-1 mb-1">
        <Icon name="lucide:arrow-left" /> Back to Users
      </NuxtLink>
      <h2 class="text-2xl font-bold text-slate-800 tracking-tight">{{ isNew ? 'Add New User' : 'Edit User' }}</h2>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-2xl">
      <form @submit.prevent="saveUser" class="space-y-5">
        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Username</label>
          <input v-model="form.username" type="text" required class="block w-full border border-slate-300 rounded-lg py-2.5 px-4 bg-white text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-sm transition-colors" />
        </div>
        
        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
          <input v-model="form.email" type="email" required class="block w-full border border-slate-300 rounded-lg py-2.5 px-4 bg-white text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-sm transition-colors" />
        </div>
        
        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Role</label>
          <select v-model="form.role" class="block w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-sm transition-colors">
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
            <option v-if="authUser?.role === 'SuperAdmin'" value="SuperAdmin">Super Admin</option>
          </select>
        </div>
        
        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password <span v-if="!isNew" class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider normal-case ml-1">(Leave blank to keep current)</span></label>
          <div class="relative">
            <input 
              v-model="form.password" 
              :type="showPassword ? 'text' : 'password'" 
              :required="isNew" 
              class="block w-full border border-slate-300 rounded-lg py-2.5 pl-4 pr-12 bg-white text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-sm transition-colors" 
            />
            <button 
              type="button" 
              @click="showPassword = !showPassword" 
              class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700 transition-colors focus:outline-none cursor-pointer"
            >
              <Icon :name="showPassword ? 'lucide:eye' : 'lucide:eye-off'" class="text-base" />
            </button>
          </div>
        </div>

        <div class="flex justify-end pt-5 border-t border-slate-200">
          <button type="button" @click="router.push('/admin/users')" class="bg-white py-2 px-5 border border-slate-300 rounded-full shadow-sm text-xs font-bold text-slate-650 hover:bg-slate-50 hover:text-slate-800 focus:outline-none mr-3 transition-colors">Cancel</button>
          <button type="submit" :disabled="saving" class="bg-[#feb900] border border-transparent rounded-full shadow-sm py-2 px-5 text-xs font-bold hover:bg-[#e5a600] focus:outline-none disabled:opacity-50 transition-colors" style="color: #1e293b;">
            {{ saving ? 'Saving...' : 'Save User' }}
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
const showPassword = ref(false);

const form = ref({
  username: '',
  email: '',
  role: 'Admin',
  password: ''
});

const saving = ref(false);

if (!isNew) {
  const { data: user } = await useFetch(`/api/admin/users/${route.params.id}`);
  if (user.value) {
    form.value.username = user.value.username;
    form.value.email = user.value.email;
    form.value.role = user.value.role;
  }
}

const saveUser = async () => {
  saving.value = true;
  try {
    const url = isNew ? '/api/admin/users' : `/api/admin/users/${route.params.id}`;
    const method = isNew ? 'POST' : 'PUT';
    
    // Only send password if it's provided
    const body = { ...form.value };
    if (!isNew && !body.password) {
      delete body.password;
    }
    
    await useNuxtApp().$fetch(url, { method, body });
    clearNuxtData();
    useToast().success('Saved successfully');
    await refreshNuxtData('admin-users-list');
    router.push('/admin/users');
  } catch (error) {
    useToast().error(error.data?.statusMessage || 'Failed to save user');
  } finally {
    saving.value = false;
  }
};
</script>
