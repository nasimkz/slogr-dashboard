<template>
    <div class="pageHeight">
        <div class="bg">
            <Header />
            <div class="container-fluid sentinel mt-2">
                <div class="d-flex justify-content-end">
                    <h1 class="me-2"><RouterLink to="/"><i class="fa-solid fa-xmark fa-xs" style="color: #d8dce2;"></i></RouterLink></h1>
                </div>
            </div>
            <div class="container-fluid">
                <div class="card mx-md-2">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div><h3 class="text-secondary ms-3 mt-2">User Management</h3></div>
                            <div class="d-flex align-items-center">
                                <h6 class="mx-1 mt-2 text-muted">Home</h6>
                                <h6 class="me-4 mt-2"> - Users</h6>
                                <button v-if="can('add_user') && canWrite" @click="showAddModal = true" class="addBtn">
                                    <i class="fa-solid fa-plus fa-lg"></i> Add User
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="isReadOnly" class="container-fluid px-4 mt-2">
                <div class="alert mb-0" style="background: #1a0a0a; border: 1px solid #dc2626; color: #fca5a5;">
                    <i class="fa-solid fa-lock me-2"></i>Read-only mode — license expired.
                    <a href="mailto:license@slogr.io" style="color: #fca5a5;">Contact license@slogr.io to renew.</a>
                </div>
            </div>
            <div class="container-fluid tableDiv">
                <div class="card mx-md-2 mt-4 mb-5">
                    <div class="card-body">
                        <LoadingState v-if="loading" />
                        <ErrorState v-else-if="error" :message="error" :on-retry="fetchUsers" />
                        <div class="table-responsive" v-else>
                            <table class="table table-striped table-hover text-center">
                                <thead>
                                    <tr>
                                        <th><a href="#" class="tableHead">Name</a></th>
                                        <th><a href="#" class="tableHead">Email</a></th>
                                        <th><a href="#" class="tableHead">Role</a></th>
                                        <th><a href="#" class="tableHead">Status</a></th>
                                        <th><a href="#" class="tableHead">Last Login</a></th>
                                        <th><a href="#" class="tableHead">Actions</a></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="user in users" :key="user.id" :class="{ 'opacity-50': user.status === 'inactive' }">
                                        <td><p class="tableP">{{ user.name }}</p></td>
                                        <td><p class="tableP">{{ user.email }}</p></td>
                                        <td>
                                            <span :class="['badge', roleBadge(user.role)]">{{ user.role || 'viewer' }}</span>
                                        </td>
                                        <td>
                                            <span :class="['badge', user.status === 'active' ? 'bg-success' : 'bg-danger']">{{ user.status }}</span>
                                        </td>
                                        <td><p class="tableP">{{ formatDate(user.last_login_at) }}</p></td>
                                        <td>
                                            <div class="d-flex gap-2 justify-content-center align-items-center">
                                                <select v-if="can('edit_user') && canWrite && user.id !== currentUserId" :value="user.role" @change="changeRole(user.id, $event.target.value)" class="form-select form-select-sm" style="width: auto; min-width: 110px;">
                                                    <option value="admin">admin</option>
                                                    <option value="operator">operator</option>
                                                    <option value="viewer">viewer</option>
                                                </select>
                                                <button v-if="can('deactivate_user') && canWrite && user.id !== currentUserId && user.status === 'active'" @click="deactivateUser(user.id)" class="btn btn-sm btn-outline-danger">Deactivate</button>
                                                <button v-if="can('deactivate_user') && canWrite && user.id !== currentUserId && user.status === 'inactive'" @click="reactivateUser(user.id)" class="btn btn-sm btn-outline-success">Reactivate</button>
                                                <span v-if="user.id === currentUserId" class="text-muted" style="font-size: 0.8rem;">(you)</span>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Add User Modal -->
    <div v-if="showAddModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.6);">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header d-flex justify-content-center"><h5 class="modal-title text-dark">Add New User</h5></div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label ms-1">Full Name *</label>
                        <input v-model="newUser.name" type="text" class="form-control form-control-lg" placeholder="Jane Smith">
                    </div>
                    <div class="mb-3">
                        <label class="form-label ms-1">Email Address *</label>
                        <input v-model="newUser.email" type="email" class="form-control form-control-lg" placeholder="jane@company.com">
                    </div>
                    <div class="mb-3">
                        <label class="form-label ms-1">Role *</label>
                        <select v-model="newUser.role" class="form-select form-select-lg">
                            <option value="admin">Admin — Full access + user management</option>
                            <option value="operator">Operator — Manage agents and sessions</option>
                            <option value="viewer">Viewer — Read-only access</option>
                        </select>
                    </div>
                    <div v-if="addError" class="alert alert-danger">{{ addError }}</div>
                    <div v-if="tempPassword" class="alert alert-success text-center">
                        <p class="mb-1"><strong>User created!</strong></p>
                        <p class="mb-1" style="font-size: 0.85rem;">Temporary password (share securely):</p>
                        <code style="font-size: 1.1rem; letter-spacing: 1px;">{{ tempPassword }}</code>
                        <p class="mt-2 mb-0" style="font-size: 0.75rem; color: #666;">This password will not be shown again.</p>
                        <button @click="copyTempPassword" class="btn btn-sm btn-outline-success mt-2">{{ copied ? '✓ Copied' : 'Copy Password' }}</button>
                    </div>
                </div>
                <div class="modal-footer">
                    <button v-if="!tempPassword" @click="createUser" :disabled="creating" class="modelSaveBtn ms-2">{{ creating ? 'Creating...' : 'Create User' }}</button>
                    <button @click="closeAddModal" class="modelCancelBtn">{{ tempPassword ? 'Done' : 'Cancel' }}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '../common/Header.vue'
import { usePermission } from '../../composables/usePermission'
import apiClient from '../../services/apiClient'

export default {
    name: 'UserManagement',
    components: { Header },
    setup() {
        const { can, canWrite } = usePermission()
        return { can, canWrite }
    },
    data() {
        return {
            users: [],
            loading: true,
            error: null,
            showAddModal: false,
            newUser: { name: '', email: '', role: 'viewer' },
            addError: null,
            creating: false,
            tempPassword: null,
            copied: false,
        }
    },
    computed: {
        isReadOnly() { return this.$store.getters.isReadOnly },
        currentUserId() { return this.$store.getters.getUserData?.user?.id }
    },
    async mounted() { await this.fetchUsers() },
    methods: {
        async fetchUsers() {
            this.loading = true; this.error = null
            try {
                const res = await apiClient.get('/api/users')
                this.users = res.data.users || []
            } catch (e) { this.error = e.response?.data?.error || 'Failed to load users' }
            finally { this.loading = false }
        },
        async createUser() {
            this.addError = null; this.creating = true
            try {
                const res = await apiClient.post('/api/users', this.newUser)
                this.tempPassword = res.data.temporary_password
                await this.fetchUsers()
                this.newUser = { name: '', email: '', role: 'viewer' }
            } catch (e) { this.addError = e.response?.data?.errors?.email?.[0] || e.response?.data?.error || e.response?.data?.message || 'Failed to create user' }
            finally { this.creating = false }
        },
        async changeRole(userId, role) {
            try { await apiClient.put(`/api/users/${userId}`, { role }); await this.fetchUsers() }
            catch (e) { alert(e.response?.data?.error || 'Failed to update role') }
        },
        async deactivateUser(userId) {
            if (!confirm('Deactivate this user? They will no longer be able to log in.')) return
            try { await apiClient.post(`/api/users/${userId}/deactivate`); await this.fetchUsers() }
            catch (e) { alert(e.response?.data?.error || 'Failed to deactivate') }
        },
        async reactivateUser(userId) {
            try { await apiClient.post(`/api/users/${userId}/reactivate`); await this.fetchUsers() }
            catch (e) { alert(e.response?.data?.error || 'Failed to reactivate') }
        },
        closeAddModal() {
            this.showAddModal = false; this.tempPassword = null; this.addError = null; this.copied = false
            this.newUser = { name: '', email: '', role: 'viewer' }
        },
        async copyTempPassword() {
            await navigator.clipboard.writeText(this.tempPassword)
            this.copied = true; setTimeout(() => this.copied = false, 2000)
        },
        roleBadge(role) {
            if (role === 'admin') return 'bg-purple'
            if (role === 'operator') return 'bg-primary'
            return 'bg-secondary'
        },
        formatDate(d) { return d ? new Date(d).toLocaleDateString() : 'Never' }
    }
}
</script>

<style scoped>
.bg-purple { background-color: #7c3aed !important; }
</style>
