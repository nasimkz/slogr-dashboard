<template>
    <div>
        <button class="addBtn" data-bs-toggle="modal" data-bs-target="#staticBackdrop"><i
                class="fa-solid fa-plus fa-lg"></i> Create New Alerts</button>
        <!-- Modal  add-->
        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
            aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add New Alert</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="">
                            <div class="mb-3">
                                <div class="row g-2">
                                    <div class="col-md-6">
                                        <label for="exampleFormControlInput1" class="form-label ms-1">Alert Name*</label>
                                        <input type="text" class="form-control form-control-lg"
                                            placeholder="Enter Alert Name" v-model="this.name" name="name">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="exampleFormControlInput1" class="form-label ms-1">Email*</label>
                                        <input type="email" class="form-control form-control-lg" placeholder="Enter Email"
                                          v-model="this.email"  name="email">
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
                                    <option v-for="group in filteredGroups" :key="group.id" :value="group.id">{{ group.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="mb-4">
                                <label for="exampleFormControlInput1" class="form-label ms-1">Monitoring Profile*</label>
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
                                           v-model="this.sla_breach_minutes" placeholder="Enter sla_breach_minutes" name="sla_breach_minutes">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="exampleFormControlInput1" class="form-label ms-1">Sla Breach
                                            Tests*</label>
                                        <input type="number" class="form-control form-control-lg" placeholder="Enter Sla Breach
                                            Tests*"
                                          v-model="this.sla_breach_tests"  name="sla_breach_tests">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="exampleFormControlInput1" class="form-label ms-1">Tests Norun*</label>
                                        <input type="number" class="form-control form-control-lg"
                                          v-model="this.tests_norun"  placeholder="Enter Tests Norun*" name="tests_norun">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <div class="d-flex justify-content-end">
                            <button type="button" class="modelCancelBtn" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" data-bs-dismiss="modal" class="modelSaveBtn ms-2"
                                @click="handleAddAlerts">Create</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { createToast } from 'mosha-vue-toastify';
import 'mosha-vue-toastify/dist/style.css';
import { ProfileListForm } from '../../../services/monitor_profile_Services';
import { GroupListForm } from '../../../services/group_services';
import { createAlert } from '../../../services/alerts_services'
import { useDebounceFn } from '../../../composables/useDebounceFn';
export default {
    name: 'AddAlerts',
    props:{
        handleAllAlerts:Function
    },
    components: {

    },
    data() {
        return {
            name: '',
            email: '',
            sla_breach_minutes: '',
            sla_breach_tests: '',
            tests_norun: '',
            selectedProfile: 'Select Profile Here', // Will store the selected profile id
            profiles: [],
            selectedGroup: 'Select Group Here',
            groupsLIst: [],
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
        await this.monitor()
        await this.groups()
    },
    methods: {
        async handleAddAlerts() {
            const payload = {
                name: this.name,
                email: this.email,
                profile: this.selectedProfile,
                group: this.selectedGroup,
                sla_breach_minutes: this.sla_breach_minutes,
                sla_breach_tests: this.sla_breach_tests,
                tests_norun: this.tests_norun
            }
            try {
                await createAlert(payload)
                this.handleAllAlerts()
                createToast(`add Alert successfully`, {
                    type: 'success',
                    position: 'top-right',
                    transition: 'zoom',
                });
                this.name = ''
                this.email = '',
                this.selectedProfile = ''
                this.selectedGroup = ''
                this.sla_breach_minutes = ''
                this.sla_breach_tests = ''
                this.tests_norun = ''
            } catch (error) {
                createToast(`Alert not save something is wrong`, {
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
    }
}
</script>