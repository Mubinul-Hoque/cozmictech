<template>
  <div class="font-sans">
    <div class="mb-6 flex flex-col gap-1">
      <NuxtLink to="/admin/messages" class="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition-colors inline-flex items-center gap-1 mb-1">
        <i class="bi bi-arrow-left"></i> Back to Messages
      </NuxtLink>
    </div>

    <div v-if="pending" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-[#feb900]"></div>
    </div>

    <div v-else-if="message" class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
      <div class="px-6 py-5 border-b border-slate-200 bg-slate-50/50">
        <h3 class="text-xl font-bold text-slate-800 tracking-tight">{{ message.subject }}</h3>
        <p class="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Received on {{ new Date(message.date).toLocaleString() }}</p>
      </div>
      
      <div class="p-6 border-b border-slate-200">
        <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6 bg-[#364d59]/5 border border-[#364d59]/10 p-5 rounded-xl gap-4">
          <div>
            <p class="text-sm font-bold text-[#364d59]">From: <span class="text-slate-800 font-semibold ml-1">{{ message.name }}</span></p>
            <p class="text-sm font-bold text-[#364d59] mt-1">Email: <a :href="`mailto:${message.email}`" class="text-[#feb900] hover:underline font-semibold ml-1">{{ message.email }}</a></p>
            <p class="text-sm font-bold text-[#364d59] mt-1">Category: <span class="text-slate-800 font-semibold ml-1">{{ message.category?.name || 'Uncategorized' }}</span></p>
          </div>
          <div class="md:text-right">
            <p class="text-sm font-bold text-[#364d59]">Company: <span class="text-slate-800 font-semibold ml-1">{{ message.company || 'N/A' }}</span></p>
          </div>
        </div>
        
        <div class="prose max-w-none text-slate-700 leading-relaxed text-sm py-4">
          <p class="whitespace-pre-wrap">{{ message.message }}</p>
        </div>
      </div>
      
      <div class="bg-slate-50/50 px-6 py-4 flex justify-end">
        <button @click="deleteMessage" class="inline-flex items-center px-4 py-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-full text-xs font-bold transition-colors">
          <i class="bi bi-trash mr-1.5"></i> Delete Message
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
const { data: message, pending } = useFetch(`/api/admin/messages/${route.params.id}`);

const deleteMessage = async () => {
  if (confirm('Are you sure you want to delete this message?')) {
    try {
      await $fetch(`/api/admin/messages/${route.params.id}`, { method: 'DELETE' });
      router.push('/admin/messages');
    } catch (error) {
      alert('Failed to delete message.');
    }
  }
};
</script>
