<template>
  <div class="space-y-8 font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
      <div>
        <h3 class="text-lg font-bold text-slate-700 flex items-center gap-2">
          <Icon name="lucide:mail" class="text-[#feb900]" />
          <span>Email (Google SMTP) Configuration</span>
        </h3>
        <p class="text-slate-400 mt-1 text-xs font-bold uppercase tracking-wider">
          Configure the mailbox used to send password-reset and verification emails
        </p>
      </div>

      <div class="flex items-center gap-3 w-full sm:w-auto">
        <span
          class="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider border"
          :class="form.hasPassword && form.user ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' : 'bg-slate-100 text-slate-500 border-slate-200'"
        >
          <Icon :name="form.hasPassword && form.user ? 'lucide:check-circle' : 'lucide:circle-dashed'" class="text-sm" />
          {{ form.hasPassword && form.user ? 'Configured' : 'Not Configured' }}
        </span>
        <button
          type="button"
          @click="saveSmtp"
          :disabled="saving"
          class="inline-flex items-center justify-center gap-2 bg-[#feb900] hover:bg-amber-500 disabled:opacity-50 text-slate-950 px-6 py-3 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-sm hover:shadow active:scale-95 cursor-pointer"
        >
          <span v-if="saving" class="animate-spin rounded-full h-3.5 w-3.5 border-2 border-slate-950 border-t-transparent mr-1"></span>
          <Icon v-else name="lucide:check" class="text-base" />
          {{ saving ? 'Saving...' : 'Save SMTP Settings' }}
        </button>
      </div>
    </div>

    <!-- Alert Messages -->
    <div v-if="successMsg" class="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-800 text-sm">
      <div class="flex items-center gap-3">
        <Icon name="lucide:check-circle" class="text-emerald-500 text-lg" />
        <span class="font-bold text-slate-700">{{ successMsg }}</span>
      </div>
    </div>
    <div v-if="errorMsg" class="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-rose-800 text-sm">
      <div class="flex items-center gap-3">
        <Icon name="lucide:alert-circle" class="text-rose-500 text-lg" />
        <span class="font-bold text-slate-700">{{ errorMsg }}</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center py-24">
      <div class="relative w-12 h-12">
        <div class="absolute inset-0 rounded-full border-4 border-slate-100 border-t-[#feb900] animate-spin"></div>
      </div>
    </div>

    <div v-else class="space-y-6 max-w-4xl">
      <!-- SMTP Form -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">SMTP Host</label>
            <input
              type="text"
              v-model="form.host"
              placeholder="smtp.gmail.com"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] text-sm transition-colors"
            />
          </div>
          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">SMTP Port</label>
            <input
              type="number"
              v-model.number="form.port"
              placeholder="587"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] text-sm transition-colors"
            />
          </div>

          <div class="space-y-2 md:col-span-2">
            <label class="inline-flex items-center gap-3 cursor-pointer select-none">
              <div class="relative inline-flex items-center">
                <input type="checkbox" v-model="form.secure" class="sr-only peer" />
                <div class="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#feb900]"></div>
              </div>
              <span class="text-xs font-bold text-slate-700">
                Use SSL (port 465). Leave off for STARTTLS on port 587 (recommended for Gmail).
              </span>
            </label>
          </div>

          <div class="space-y-2 md:col-span-2 pt-2 border-t border-slate-100">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Gmail Account (SMTP Username)</label>
            <input
              type="email"
              v-model="form.user"
              placeholder="your-account@gmail.com"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] text-sm transition-colors"
            />
          </div>

          <div class="space-y-2 md:col-span-2">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">App Password</label>
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="form.password"
                :placeholder="form.hasPassword ? 'Leave blank to keep the current password' : '16-character Google App Password'"
                class="w-full px-4 py-3 pr-12 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] text-sm transition-colors"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <Icon :name="showPassword ? 'lucide:eye' : 'lucide:eye-off'" class="text-base" />
              </button>
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">From Name</label>
            <input
              type="text"
              v-model="form.fromName"
              placeholder="Cozmic Technology"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] text-sm transition-colors"
            />
          </div>
          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">From Email <span class="text-slate-400 font-normal">(optional)</span></label>
            <input
              type="email"
              v-model="form.fromEmail"
              placeholder="Defaults to the Gmail account above"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] text-sm transition-colors"
            />
          </div>
        </div>
      </div>

      <!-- Test Email -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
        <h4 class="text-sm font-extrabold text-slate-700 uppercase tracking-wide flex items-center gap-2">
          <Icon name="lucide:send" class="text-amber-500" /> Send Test Email
        </h4>
        <p class="text-xs text-slate-400">Sends a test email using the settings currently shown above (saved first if changed), to verify your Google SMTP credentials actually work.</p>
        <div class="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            v-model="testEmail"
            placeholder="you@example.com"
            class="flex-1 px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] text-sm transition-colors"
          />
          <button
            type="button"
            @click="sendTestEmail"
            :disabled="testing || !testEmail"
            class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 hover:border-[#feb900] hover:bg-amber-50 text-slate-700 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap"
          >
            <span v-if="testing" class="animate-spin rounded-full h-3.5 w-3.5 border-2 border-slate-400 border-t-transparent"></span>
            <Icon v-else name="lucide:send" class="text-sm" />
            {{ testing ? 'Sending...' : 'Send Test Email' }}
          </button>
        </div>
        <div v-if="testResult" class="text-xs font-bold" :class="testResult.ok ? 'text-emerald-600' : 'text-rose-600'">
          {{ testResult.message }}
        </div>
      </div>

      <!-- Setup Guide (Placed under Send Test Email) -->
      <div class="bg-amber-50/60 border border-amber-200 rounded-3xl p-6 space-y-3">
        <h4 class="text-sm font-extrabold text-amber-900 flex items-center gap-2">
          <Icon name="lucide:info" class="text-amber-600" /> How to set up Gmail SMTP
        </h4>
        <ol class="text-xs text-amber-900/90 space-y-2 list-decimal list-inside leading-relaxed">
          <li>Enable <strong>2-Step Verification</strong> on the Google account you want to send from.</li>
          <li>Go to <span class="font-mono bg-white/70 px-1.5 py-0.5 rounded">myaccount.google.com/apppasswords</span> and generate a new 16-character App Password.</li>
          <li>Enter that Gmail address below as the "Account" and paste the App Password &mdash; not your normal Google password.</li>
          <li>Keep Host/Port/Secure at their defaults unless your provider says otherwise.</li>
          <li>Save, then use "Send Test Email" to confirm delivery before relying on it.</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const saving = ref(false)
const testing = ref(false)
const successMsg = ref('')
const errorMsg = ref('')
const showPassword = ref(false)
const testEmail = ref('')
const testResult = ref(null)

const form = reactive({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  user: '',
  password: '',
  fromName: 'Cozmic Technology',
  fromEmail: '',
  hasPassword: false
})

const { data: smtpRes, pending, refresh } = await useFetch('/api/admin/smtp')

const loadSmtp = () => {
  if (smtpRes.value?.success && smtpRes.value.config) {
    Object.assign(form, smtpRes.value.config, { password: '' })
  }
}
loadSmtp()

watch(smtpRes, loadSmtp)

const saveSmtp = async () => {
  saving.value = true
  successMsg.value = ''
  errorMsg.value = ''

  try {
    const res = await useNuxtApp().$fetch('/api/admin/smtp', {
      method: 'POST',
      body: { ...form }
    })

    if (res.success) {
      successMsg.value = res.message || 'SMTP settings saved successfully.'
      await refresh()
      setTimeout(() => { successMsg.value = '' }, 4000)
    }
  } catch (err) {
    console.error(err)
    errorMsg.value = err.data?.statusMessage || 'Failed to save SMTP settings.'
  } finally {
    saving.value = false
  }
}

const sendTestEmail = async () => {
  testing.value = true
  testResult.value = null
  errorMsg.value = ''

  try {
    // Save first so the stored config reflects what's on screen
    await useNuxtApp().$fetch('/api/admin/smtp', { method: 'POST', body: { ...form } })

    const res = await useNuxtApp().$fetch('/api/admin/smtp/test', {
      method: 'POST',
      body: { to: testEmail.value }
    })

    testResult.value = { ok: true, message: res.message || 'Test email sent successfully.' }
    await refresh()
  } catch (err) {
    console.error(err)
    testResult.value = { ok: false, message: err.data?.statusMessage || 'Failed to send test email.' }
  } finally {
    testing.value = false
  }
}
</script>
