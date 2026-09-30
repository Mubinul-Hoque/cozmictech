<template>
  <div class="space-y-6 font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Users &amp; Roles Management</h2>
        <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">
          Role-Based Access Control, administrative accounts &amp; permission matrices
        </p>
      </div>

      <!-- Action button depending on active tab -->
      <div class="flex items-center gap-2">
        <NuxtLink 
          v-if="activeTab === 'users' && can('users_roles', 'create')"
          to="/admin/users/new" 
          class="group relative inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold transition-all duration-200 bg-[#feb900] hover:bg-[#e5a600] rounded-full shadow-sm hover:shadow focus:outline-none" 
          style="color: #1e293b;"
        >
          <Icon name="lucide:user-plus" class="mr-2 text-sm" />
          Add User
        </NuxtLink>

        <button 
          v-if="activeTab === 'roles' && can('users_roles', 'create')"
          @click="openCreateRoleModal"
          class="group relative inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold transition-all duration-200 bg-[#feb900] hover:bg-[#e5a600] rounded-full shadow-sm hover:shadow focus:outline-none" 
          style="color: #1e293b;"
        >
          <Icon name="lucide:shield-plus" class="mr-2 text-sm" />
          Create New Role
        </button>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="flex border-b border-slate-200 bg-white px-6 rounded-2xl shadow-sm">
      <button 
        @click="switchTab('users')" 
        class="py-4 px-4 text-xs font-bold uppercase tracking-wider transition-all relative flex items-center gap-2 cursor-pointer"
        :class="activeTab === 'users' ? 'text-amber-600' : 'text-slate-500 hover:text-slate-800'"
      >
        <Icon name="lucide:users" class="text-base" />
        <span>User Accounts</span>
        <span class="ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold" :class="activeTab === 'users' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'">
          {{ users?.length || 0 }}
        </span>
        <div v-if="activeTab === 'users'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#feb900]"></div>
      </button>

      <button 
        @click="switchTab('roles')" 
        class="py-4 px-4 text-xs font-bold uppercase tracking-wider transition-all relative flex items-center gap-2 cursor-pointer"
        :class="activeTab === 'roles' ? 'text-amber-600' : 'text-slate-500 hover:text-slate-800'"
      >
        <Icon name="lucide:shield-check" class="text-base" />
        <span>Roles &amp; Permissions</span>
        <span class="ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold" :class="activeTab === 'roles' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'">
          {{ roles?.length || 0 }}
        </span>
        <div v-if="activeTab === 'roles'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#feb900]"></div>
      </button>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- TAB 1: USERS LIST                                                  -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <div v-show="activeTab === 'users'" class="space-y-4">
      <!-- Search & Filters -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div class="relative w-full sm:w-80">
          <Icon name="lucide:search" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input 
            v-model="userSearchQuery" 
            type="text" 
            placeholder="Search by username or email..." 
            class="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-full focus:outline-none focus:border-[#feb900] transition-colors"
          />
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto">
          <select 
            v-model="roleFilter" 
            class="text-xs border border-slate-200 rounded-full px-3 py-2 bg-white text-slate-700 focus:outline-none focus:border-[#feb900]"
          >
            <option value="">All Roles</option>
            <option v-for="r in roles" :key="r.id" :value="r.name">{{ r.name }}</option>
          </select>

          <select 
            v-model="statusFilter" 
            class="text-xs border border-slate-200 rounded-full px-3 py-2 bg-white text-slate-700 focus:outline-none focus:border-[#feb900]"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Deactivated</option>
          </select>
        </div>
      </div>

      <!-- Users Table Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
        <div v-if="usersPending" class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-[#feb900]"></div>
        </div>

        <table v-else class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50/75">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
              <th scope="col" class="px-6 py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Joined</th>
              <th scope="col" class="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-100">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-slate-50/50 transition-colors">
              <!-- Username & Avatar -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 bg-[#364d59]/10 text-[#364d59] rounded-full flex items-center justify-center font-bold text-sm border border-[#364d59]/20 shadow-sm uppercase">
                    {{ user.username.charAt(0) }}
                  </div>
                  <div class="ml-3.5">
                    <div class="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      {{ user.username }}
                      <span v-if="user.id === authUser?.id" class="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">You</span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Email -->
              <td class="px-6 py-4 whitespace-nowrap text-xs text-slate-600 font-medium">
                {{ user.email }}
              </td>

              <!-- Role Badge -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border"
                  :class="user.role === 'Super Admin' ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-slate-100 text-slate-700 border-slate-200'"
                >
                  <Icon v-if="user.role === 'Super Admin'" name="lucide:shield-check" class="mr-1 text-xs text-amber-600" />
                  {{ user.role }}
                </span>
              </td>

              <!-- Active Status Toggle -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <button 
                  type="button" 
                  @click="toggleUserActive(user)"
                  :disabled="user.id === authUser?.id || !can('users_roles', 'edit')"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                  :class="user.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'"
                  :title="user.id === authUser?.id ? 'You cannot deactivate your own account' : 'Click to toggle status'"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="user.is_active ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                  {{ user.is_active ? 'Active' : 'Deactivated' }}
                </button>
              </td>

              <!-- Joined Date -->
              <td class="px-6 py-4 whitespace-nowrap text-xs text-slate-400 font-semibold uppercase tracking-wider">
                {{ new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-xs font-bold space-x-1">
                <!-- Activity Logs Button -->
                <button 
                  @click="openActivityModal(user)"
                  class="inline-flex items-center px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors text-[11px]"
                  title="View user activity logs"
                >
                  <Icon name="lucide:history" class="text-xs mr-1 text-slate-500" />
                  Activity
                </button>

                <!-- Password Reset Button -->
                <button 
                  v-if="can('users_roles', 'edit')"
                  @click="openResetPasswordModal(user)"
                  class="inline-flex items-center px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-full transition-colors text-[11px] border border-amber-200"
                  title="Reset user password"
                >
                  <Icon name="lucide:key-round" class="text-xs mr-1 text-amber-600" />
                  Reset
                </button>

                <!-- Edit User -->
                <NuxtLink 
                  v-if="can('users_roles', 'edit')"
                  :to="`/admin/users/${user.id}`" 
                  class="inline-flex items-center px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors"
                >
                  Edit
                </NuxtLink>

                <!-- Delete User -->
                <button 
                  v-if="can('users_roles', 'delete')"
                  @click="deleteUser(user)" 
                  :disabled="user.id === authUser?.id || user.role === 'Super Admin'"
                  class="inline-flex items-center px-2.5 py-1.5 border border-slate-200 hover:border-red-500 text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  :title="user.id === authUser?.id ? 'Cannot delete self' : 'Delete user'"
                >
                  Delete
                </button>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredUsers?.length === 0">
              <td colspan="6" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center justify-center text-slate-400">
                  <Icon name="lucide:users" class="text-5xl mb-3 text-slate-300" />
                  <p class="text-base font-bold text-slate-700">No users match your filter</p>
                  <p class="text-xs text-slate-400 mt-1">Try adjusting your search criteria or add a new administrator.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- TAB 2: ROLES & PERMISSIONS                                         -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <div v-show="activeTab === 'roles'" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div 
          v-for="r in roles" 
          :key="r.id"
          class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-3">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                  <Icon name="lucide:shield" class="text-base" />
                </div>
                <h3 class="text-base font-bold text-slate-800">{{ r.name }}</h3>
              </div>
              <span 
                class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                :class="r.is_system ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-600 border border-slate-200'"
              >
                {{ r.is_system ? 'System Role' : 'Custom Role' }}
              </span>
            </div>

            <p class="text-xs text-slate-500 min-h-[38px] leading-relaxed mb-4">
              {{ r.description || 'No description provided.' }}
            </p>

            <div class="flex items-center gap-4 py-3 border-y border-slate-100 mb-4">
              <div class="flex items-center gap-1.5 text-xs text-slate-600">
                <Icon name="lucide:users" class="text-slate-400 text-sm" />
                <span><strong>{{ r.user_count }}</strong> users assigned</span>
              </div>
              <div class="flex items-center gap-1.5 text-xs text-slate-600">
                <Icon name="lucide:key" class="text-slate-400 text-sm" />
                <span>
                  <strong>{{ isSuperAdminRole(r) ? 'Full System' : (r.permission_count || 0) }}</strong> permissions
                </span>
              </div>
            </div>
          </div>

          <!-- Role Actions -->
          <div class="flex items-center justify-between pt-2">
            <NuxtLink 
              :to="`/admin/roles/${r.id}`"
              class="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-[#feb900] text-slate-700 hover:text-slate-900 rounded-full text-xs font-bold transition-all shadow-sm"
            >
              <Icon name="lucide:table" class="text-sm" />
              Permission Matrix
            </NuxtLink>

            <div class="flex items-center gap-1">
              <button 
                v-if="!r.is_system && can('users_roles', 'edit')"
                @click="openEditRoleModal(r)"
                class="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
                title="Edit role name & description"
              >
                <Icon name="lucide:pencil" class="text-sm" />
              </button>
              <button 
                v-if="!r.is_system && can('users_roles', 'delete')"
                @click="deleteRole(r)"
                class="p-2 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                title="Delete custom role"
              >
                <Icon name="lucide:trash-2" class="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- MODAL 1: RESET PASSWORD                                            -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <div v-if="resetPasswordModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-fade-in-up">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
              <Icon name="lucide:key-round" class="text-base" />
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-800">Reset User Password</h3>
              <p class="text-xs text-slate-400">{{ selectedUser?.username }} ({{ selectedUser?.email }})</p>
            </div>
          </div>
          <button @click="resetPasswordModalOpen = false" class="text-slate-400 hover:text-slate-600 p-1">
            <Icon name="lucide:x" class="text-xl" />
          </button>
        </div>

        <form @submit.prevent="submitResetPassword" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">New Password</label>
            <div class="relative">
              <input 
                v-model="resetPasswordForm.new_password" 
                :type="showNewPassword ? 'text' : 'password'" 
                required 
                minlength="8" 
                placeholder="At least 8 characters"
                class="w-full pl-3.5 pr-20 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#feb900]"
              />
              <button 
                type="button" 
                @click="showNewPassword = !showNewPassword" 
                class="absolute right-10 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                <Icon :name="showNewPassword ? 'lucide:eye-off' : 'lucide:eye'" />
              </button>
              <button 
                type="button" 
                @click="generateRandomPassword" 
                class="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                title="Generate secure random password"
              >
                Gen
              </button>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              @click="resetPasswordModalOpen = false" 
              class="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              :disabled="resettingPassword" 
              class="px-5 py-2 text-xs font-bold text-slate-900 bg-[#feb900] hover:bg-[#e5a600] rounded-full transition-colors shadow-sm disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              <Icon v-if="resettingPassword" name="lucide:loader-2" class="animate-spin text-sm" />
              {{ resettingPassword ? 'Resetting...' : 'Save New Password' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- MODAL 2: USER ACTIVITY LOGS                                        -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <div v-if="activityModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col animate-fade-in-up">
        <div class="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
              <Icon name="lucide:history" class="text-base" />
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-800">User Activity History</h3>
              <p class="text-xs text-slate-400">{{ selectedUser?.username }} ({{ selectedUser?.email }})</p>
            </div>
          </div>
          <button @click="activityModalOpen = false" class="text-slate-400 hover:text-slate-600 p-1">
            <Icon name="lucide:x" class="text-xl" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto space-y-3 pr-1">
          <div v-if="activityLoading" class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-3 border-slate-200 border-t-[#feb900]"></div>
          </div>

          <div v-else-if="userActivities.length === 0" class="text-center py-12 text-slate-400 text-xs">
            No activity logs found for this user account.
          </div>

          <div 
            v-else 
            v-for="log in userActivities" 
            :key="log.id"
            class="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-start justify-between gap-3 text-xs"
          >
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span 
                  class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                  :class="severityBadge(log.severity)"
                >
                  {{ log.action }}
                </span>
                <span class="text-slate-400 text-[11px]">{{ new Date(log.created_at).toLocaleString() }}</span>
              </div>
              <p class="text-slate-700 font-medium leading-relaxed">{{ log.details || 'No details recorded.' }}</p>
            </div>
            <div class="text-right text-[11px] text-slate-400 font-mono whitespace-nowrap">
              <div>{{ log.ip_address || 'unknown IP' }}</div>
              <div>{{ log.device_type || 'desktop' }}</div>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100 flex justify-end">
          <button @click="activityModalOpen = false" class="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- MODAL 3: CREATE / EDIT ROLE                                        -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <div v-if="roleModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-fade-in-up">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
              <Icon name="lucide:shield" class="text-base" />
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-800">{{ isEditingRole ? 'Edit Custom Role' : 'Create New Role' }}</h3>
              <p class="text-xs text-slate-400">Define role details &amp; permissions matrix</p>
            </div>
          </div>
          <button @click="roleModalOpen = false" class="text-slate-400 hover:text-slate-600 p-1">
            <Icon name="lucide:x" class="text-xl" />
          </button>
        </div>

        <form @submit.prevent="submitRoleForm" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Role Name</label>
            <input 
              v-model="roleForm.name" 
              type="text" 
              required 
              placeholder="e.g. Content Manager, Regional Editor"
              class="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#feb900]"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
            <textarea 
              v-model="roleForm.description" 
              rows="3" 
              placeholder="Summarize the responsibilities of this role..."
              class="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#feb900]"
            ></textarea>
          </div>

          <div class="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              @click="roleModalOpen = false" 
              class="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              :disabled="savingRole" 
              class="px-5 py-2 text-xs font-bold text-slate-900 bg-[#feb900] hover:bg-[#e5a600] rounded-full transition-colors shadow-sm disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              <Icon v-if="savingRole" name="lucide:loader-2" class="animate-spin text-sm" />
              {{ savingRole ? 'Saving...' : (isEditingRole ? 'Update Role' : 'Create Role') }}
            </button>
          </div>
        </form>
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
const authUser = useState('authUser');
const { can, isSuperAdmin } = usePermissions();

// Active tab management: 'users' | 'roles'
const activeTab = ref(route.query.tab === 'roles' ? 'roles' : 'users');

const switchTab = (tab) => {
  activeTab.value = tab;
  router.replace({ query: { ...route.query, tab } });
};

// Data Fetching
const { data: users, pending: usersPending, refresh: refreshUsers } = useFetch('/api/admin/users', { key: 'admin-users-list' });
const { data: roles, pending: rolesPending, refresh: refreshRoles } = useFetch('/api/admin/roles', { key: 'admin-roles-list' });

// User Search & Filters
const userSearchQuery = ref('');
const roleFilter = ref('');
const statusFilter = ref('');

const filteredUsers = computed(() => {
  if (!users.value) return [];
  return users.value.filter(u => {
    const q = userSearchQuery.value.trim().toLowerCase();
    const matchesSearch = !q || (u.username?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
    const matchesRole = !roleFilter.value || u.role === roleFilter.value;
    const matchesStatus = !statusFilter.value || (statusFilter.value === 'active' ? u.is_active : !u.is_active);
    return matchesSearch && matchesRole && matchesStatus;
  });
});

const isSuperAdminRole = (r) => {
  if (!r) return false;
  return (
    r.is_system &&
    (r.name === 'Super Admin' || r.name.toLowerCase().replace(/[\s_-]/g, '') === 'superadmin')
  );
};

// Toggle Active/Inactive Status
const toggleUserActive = async (user) => {
  if (user.id === authUser.value?.id) return;
  const newStatus = !user.is_active;
  try {
    await useNuxtApp().$fetch(`/api/admin/users/${user.id}`, {
      method: 'PUT',
      body: { is_active: newStatus }
    });
    user.is_active = newStatus;
    useToast().success(`User ${user.username} is now ${newStatus ? 'Active' : 'Deactivated'}`);
  } catch (error) {
    useToast().error(error.data?.statusMessage || 'Failed to update user status');
  }
};

// Delete User
const deleteUser = async (user) => {
  if (user.id === authUser.value?.id) return;
  if (confirm(`Are you sure you want to permanently delete administrator account "${user.username}"?`)) {
    try {
      await useNuxtApp().$fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' });
      useToast().success(`User ${user.username} deleted`);
      refreshUsers();
      refreshRoles();
    } catch (error) {
      useToast().error(error.data?.statusMessage || 'Failed to delete user');
    }
  }
};

// Reset Password Modal
const resetPasswordModalOpen = ref(false);
const selectedUser = ref(null);
const showNewPassword = ref(false);
const resettingPassword = ref(false);
const resetPasswordForm = ref({ new_password: '' });

const openResetPasswordModal = (user) => {
  selectedUser.value = user;
  resetPasswordForm.value.new_password = '';
  resetPasswordModalOpen.value = true;
};

const generateRandomPassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
  let pass = '';
  for (let i = 0; i < 12; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  resetPasswordForm.value.new_password = pass;
  showNewPassword.value = true;
};

const submitResetPassword = async () => {
  if (!selectedUser.value) return;
  resettingPassword.value = true;
  try {
    await useNuxtApp().$fetch(`/api/admin/users/${selectedUser.value.id}/reset-password`, {
      method: 'POST',
      body: { new_password: resetPasswordForm.value.new_password }
    });
    useToast().success(`Password successfully reset for ${selectedUser.value.username}`);
    resetPasswordModalOpen.value = false;
  } catch (error) {
    useToast().error(error.data?.statusMessage || 'Failed to reset password');
  } finally {
    resettingPassword.value = false;
  }
};

// Activity Modal
const activityModalOpen = ref(false);
const activityLoading = ref(false);
const userActivities = ref([]);

const openActivityModal = async (user) => {
  selectedUser.value = user;
  activityModalOpen.value = true;
  activityLoading.value = true;
  userActivities.value = [];
  try {
    const res = await useNuxtApp().$fetch(`/api/admin/users/${user.id}/activity`);
    userActivities.value = res.activities || [];
  } catch (error) {
    useToast().error('Failed to load user activity');
  } finally {
    activityLoading.value = false;
  }
};

const severityBadge = (severity) => {
  if (severity === 'critical' || severity === 'danger') return 'bg-rose-100 text-rose-800';
  if (severity === 'warning') return 'bg-amber-100 text-amber-800';
  return 'bg-slate-100 text-slate-700';
};

// Role Create / Edit Modal
const roleModalOpen = ref(false);
const isEditingRole = ref(false);
const editingRoleId = ref(null);
const savingRole = ref(false);
const roleForm = ref({ name: '', description: '' });

const openCreateRoleModal = () => {
  isEditingRole.value = false;
  editingRoleId.value = null;
  roleForm.value = { name: '', description: '' };
  roleModalOpen.value = true;
};

const openEditRoleModal = (role) => {
  isEditingRole.value = true;
  editingRoleId.value = role.id;
  roleForm.value = { name: role.name, description: role.description || '' };
  roleModalOpen.value = true;
};

const submitRoleForm = async () => {
  savingRole.value = true;
  try {
    if (isEditingRole.value) {
      await useNuxtApp().$fetch(`/api/admin/roles/${editingRoleId.value}`, {
        method: 'PUT',
        body: roleForm.value,
      });
      useToast().success('Role updated successfully');
    } else {
      const res = await useNuxtApp().$fetch('/api/admin/roles', {
        method: 'POST',
        body: roleForm.value,
      });
      useToast().success('Role created successfully! You can now configure its permissions.');
      roleModalOpen.value = false;
      refreshRoles();
      if (res.role?.id) {
        router.push(`/admin/roles/${res.role.id}`);
      }
      return;
    }

    roleModalOpen.value = false;
    refreshRoles();
  } catch (error) {
    useToast().error(error.data?.statusMessage || 'Failed to save role');
  } finally {
    savingRole.value = false;
  }
};

const deleteRole = async (role) => {
  if (role.is_system) {
    useToast().error('System roles cannot be deleted');
    return;
  }
  if (role.user_count > 0) {
    useToast().error(`Cannot delete role: ${role.user_count} user(s) are currently assigned to it.`);
    return;
  }

  if (confirm(`Are you sure you want to delete custom role "${role.name}"?`)) {
    try {
      await useNuxtApp().$fetch(`/api/admin/roles/${role.id}`, { method: 'DELETE' });
      useToast().success(`Role "${role.name}" deleted`);
      refreshRoles();
    } catch (error) {
      useToast().error(error.data?.statusMessage || 'Failed to delete role');
    }
  }
};
</script>
