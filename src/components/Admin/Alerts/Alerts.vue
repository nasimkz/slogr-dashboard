<template>
    <div class="pageHeight">
        <div class="bg">
            <Header />
            <div class="container-fluid sentinel mt-2">
                <div class="d-flex justify-content-end">
                    <h1 class="me-2">
                        <RouterLink to="/"> <i class="fa-solid fa-xmark fa-xs" style="color: #d8dce2;"></i></RouterLink>
                    </h1>
                </div>
            </div>
            <div class="container-fluid">
                <div class="card mx-md-2">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center ">
                            <div>
                                <h3 class="text-secondary ms-3 mt-2">Alerts</h3>
                            </div>
                            <div>
                                <AddAlerts :handleAllAlerts="handleAllAlerts" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container-fluid tableDiv">
                        <div class="card mx-md-2 mt-4 mb-5" style="height: 100vh;" >
                            <div class="card-body">
                                <div class="mt-3">
                                    <LoadingState v-if="loading" />
                                    <ErrorState
                                        v-else-if="alertError"
                                        :message="alertError"
                                        :on-retry="handleAllAlerts"
                                    />
                                    <EmptyState
                                        v-else-if="!alertList.length"
                                        icon="fa-solid fa-bell-slash"
                                        title="No alerts"
                                        message="Your network is quiet. Create an alert to get notified when SLAs are breached."
                                    />
                                    <div class="table-responsive" v-else>
                                        <table class="table table-striped table-hover text-center">
                                            <thead>
                                                <tr>
                                                    <th scope="col"><a href="#" class="tableHead">Name</a></th>
                                                    <th scope="col"><a href="#" class="tableHead">Email</a></th>
                                                    <th scope="col"><a href="#" class="tableHead">Sla Breach Minutes</a></th>
                                                    <th scope="col"><a href="#" class="tableHead">Sla Breach Tests</a></th>
                                                    <th scope="col"><a href="#" class="tableHead">Tests Norun</a> </th>
                                                    <th scope="col"><a href="#" class="tableHead">Investigate</a></th>
                                                    <th scope="col"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="data in alertList" :key="data.id">
                                                    <td>
                                                        <p class="tableP">{{ data?.name }}</p>
                                                    </td>
                                                    <td>
                                                        <p class="tableP">{{ data?.email }}</p>
                                                    </td>
                                                    <td>
                                                        <p class="tableP">{{ data?.sla_breach_minutes }}</p>
                                                    </td>
                                                    <td>
                                                        <p class="tableP">{{ data?.sla_breach_tests }}</p>
                                                    </td>
                                                    <td>
                                                        <p class="tableP">{{ data?.tests_norun }}</p>
                                                    </td>
                                                    <td>
                                                        <RouterLink :to="`/sessions?group=${data.group_id}`" class="tableP text-decoration-none">
                                                            Investigate →
                                                        </RouterLink>
                                                    </td>
                                                    <td class="fs-5 dropstart">
                                                        <a href="#" class="text-decoration-none text-dark tableP"
                                                            data-bs-toggle="dropdown" aria-expanded="false">
                                                            <i class="fa-solid fa-ellipsis"></i></a>
                                                        <ul class="dropdown-menu">
                                                            <li>
                                                                <a href="#" class="dropdown-item" data-bs-toggle="modal"
                                                                    data-bs-target="#staticBackdrop1"
                                                                    @click="handleEditModel(data.name, data.email, data.group_id, data.profile_id, data.sla_breach_minutes, data.sla_breach_tests, data.tests_norun, data.id)"><i
                                                                        class="fa-regular fa-pen-to-square"></i>
                                                                    Edit</a>
                                                            </li>
                                                            <li><a class="dropdown-item" href="#"
                                                                    @click="handleDelete(data.id)"><i
                                                                        class="fa-regular fa-trash-can"></i> Delete</a></li>
                                                        </ul>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
            </div>
            <!-- Modal  add-->
            <div class="modal fade" id="staticBackdrop1" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                aria-labelledby="staticBackdrop1Label" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Edit Alert</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="">
                                <div class="mb-3">
                                    <div class="row g-2">
                                        <div class="col-md-6">
                                            <label for="exampleFormControlInput1" class="form-label ms-1">Alert
                                                Name*</label>
                                            <input type="text" class="form-control form-control-lg"
                                                placeholder="Enter Alert Name" v-model="this.name" name="name">
                                        </div>
                                        <div class="col-md-6">
                                            <label for="exampleFormControlInput1" class="form-label ms-1">Email*</label>
                                            <input type="email" class="form-control form-control-lg"
                                                placeholder="Enter Email" v-model="this.email" name="email">
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-4">
                                    <label for="exampleFormControlInput1" class="form-label ms-1">Group*</label>
                                    <input type="text" class="form-control mb-2" placeholder="Search groups..."
                                        :value="groupQuery" @input="onGroupSearch($event.target.value)">
                                    <select v-model="selectedGroup" class="form-select form-select-lg mb-3"
                                        aria-label=".form-select-lg example">
                                        <option class="text-secondary" disabled>Select here
                                        </option>
                                        <option v-for="group in filteredGroups" :key="group.id" :value="group.id">{{ group.name
                                        }}
                                        </option>
                                    </select>
                                </div>
                                <div class="mb-4">
                                    <label for="exampleFormControlInput1" class="form-label ms-1">Monitoring
                                        Profile*</label>
                                    <input type="text" class="form-control mb-2" placeholder="Search profiles..."
                                        :value="profileQuery" @input="onProfileSearch($event.target.value)">
                                    <select v-model="selectedProfile" class="form-select form-select-lg mb-3 custom-select"
                                        aria-label=".form-select-lg example">
                                        <option class="text-secondary" disabled>select here</option>
                                        <option v-for="profile in filteredProfiles" :key="profile.id" :value="profile.id">{{
                                            profile.name }}</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <div class="row g-2">
                                        <div class="col-md-6">
                                            <label for="exampleFormControlInput1" class="form-label ms-1">Sla Breach
                                                Minutes*</label>
                                            <input type="number" class="form-control form-control-lg"
                                                v-model="this.sla_breach_minutes" placeholder="Enter sla_breach_minutes"
                                                name="sla_breach_minutes">
                                        </div>
                                        <div class="col-md-6">
                                            <label for="exampleFormControlInput1" class="form-label ms-1">Sla Breach
                                                Tests*</label>
                                            <input type="number" class="form-control form-control-lg" placeholder="Enter Sla Breach
                                            Tests*" v-model="this.sla_breach_tests" name="sla_breach_tests">
                                        </div>
                                        <div class="col-md-6">
                                            <label for="exampleFormControlInput1" class="form-label ms-1">Tests
                                                Norun*</label>
                                            <input type="number" class="form-control form-control-lg"
                                                v-model="this.tests_norun" placeholder="Enter Tests Norun*"
                                                name="tests_norun">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <div class="d-flex justify-content-end">
                                <button type="button" class="modelCancelBtn" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" data-bs-dismiss="modal" class="modelSaveBtn ms-2"
                                    @click="handleUpdateAlerts">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { RouterLink } from 'vue-router';
import Header from '../../common/Header.vue';
import AddAlerts from './AddAlerts.vue';
import { getAlerts, updateAlert, deleteAlert } from '../../../services/alerts_services';
import { createToast } from 'mosha-vue-toastify';
import 'mosha-vue-toastify/dist/style.css';
import { ProfileListForm } from '../../../services/monitor_profile_Services';
import { GroupListForm } from '../../../services/group_services';
import { useDebounceFn } from '../../../composables/useDebounceFn';
export default {
    name: 'Alerts',
    components: {
        Header,
        AddAlerts,
    },
    data() {
        return {
            alertList: [],
            id: '',
            name: '',
            email: '',
            sla_breach_minutes: '',
            sla_breach_tests: '',
            tests_norun: '',
            selectedProfile: 'Select Profile Here', // Will store the selected profile id
            profiles: [],
            selectedGroup: 'Select Group Here',
            groupsLIst: [],
            loading: false,
            alertError: null,
            profileQuery: '',
            groupQuery: '',
        }
    },
    created() {
        this.onProfileSearch = useDebounceFn(function (val) { this.profileQuery = val }, 300)
        this.onGroupSearch = useDebounceFn(function (val) { this.groupQuery = val }, 300)
    },
    computed: {
        filteredProfiles() {
            const q = this.profileQuery.trim().toLowerCase()
            if (!q) return this.profiles
            return this.profiles.filter(p => p.name?.toLowerCase().includes(q))
        },
        filteredGroups() {
            const q = this.groupQuery.trim().toLowerCase()
            if (!q) return this.groupsLIst
            return this.groupsLIst.filter(g => g.name?.toLowerCase().includes(q))
        },
    },
    async mounted() {
        this.handleAllAlerts();
        await this.monitor()
        await this.groups()
    },
    methods: {
        async handleAllAlerts() {
            this.loading = true
            this.alertError = null
            try {
                let res = await getAlerts()
                this.alertList = res
            } catch (error) {
                this.alertError = error.response?.data?.message ?? error.message ?? 'Failed to load alerts'
            } finally {
                this.loading = false
            }
        },
        handleEditModel(name, email, group_id, profile_id, sla_breach_minutes, sla_breach_tests, tests_norun, id) {
            this.name = name
            this.email = email,
                this.selectedGroup = group_id,
                this.selectedProfile = profile_id,
                this.sla_breach_minutes = sla_breach_minutes,
                this.sla_breach_tests = sla_breach_tests,
                this.tests_norun = tests_norun,
                this.id = id
        },
        async handleUpdateAlerts() {
            const payload = {
                name: this.name,
                email: this.email,
                profile: this.selectedProfile,
                group: this.selectedGroup,
                sla_breach_minutes: this.sla_breach_minutes,
                sla_breach_tests: this.sla_breach_tests,
                tests_norun: this.tests_norun,
                id: this.id,
                edit: true
            }
            try {
                await updateAlert(payload)
                this.handleAllAlerts();
                createToast(`Alert update successfully`, {
                    type: 'success',
                    position: 'top-right',
                    transition: 'zoom',
                });
            } catch (error) {
                createToast(`Alert not update something is wrong`, {
                    type: 'danger',
                    position: 'top-right',
                    transition: 'zoom',
                });
                console.log(error)
            }
        },
        async monitor(size = 1000) {
            try {
                let res = await ProfileListForm(size)
                this.profiles = res.profiles;

            } catch (error) {
                console.log(error)
            }
        },
        async groups(size = 1000) {
            try {
                let res = await GroupListForm(size)
                this.groupsLIst = res;
            } catch (error) {
                console.log(error)
            }
        },
        async handleDelete(id) {
            const payload = {
                id: id
            }
            try {
                await deleteAlert(payload)
                this.handleAllAlerts()
                createToast(`Alert delete`, {
                    type: 'success',
                    position: 'top-right',
                    transition: 'zoom',
                });
            } catch (error) {
                createToast(`delete error`, {
                    type: 'danger',
                    position: 'top-right',
                    transition: 'zoom',
                });
                console.log(error)
            }
        }
    }
}
</script>

<style></style>