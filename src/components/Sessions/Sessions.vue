<template>
    <!-- <Header/> -->
    <div class="pageHeight">
        <div class="bg">
            <Header />
            <div class="container-fluid sentinel mt-2">
                <div class="d-flex justify-content-end">
                    <h1 class="me-2"><i class="fa-solid fa-xmark fa-xs" style="color: #d8dce2;"></i></h1>
                </div>
            </div>
            <div class="container-fluid">
                <div class="card mx-md-2">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center ">
                            <div>
                                <h3 class="text-secondary ms-3 mt-2">Sessions</h3>
                            </div>
                            <div class="d-flex align-items-center">
                                <h6 class="mx-1 mt-2 text-muted">Home </h6>
                                <h6 class="me-4 mt-2"> - Sessions</h6>
                                <AddSessions :getSessions="getSessions" />
                                <div class="mx-3"><i class="fa-solid fa-ellipsis fa-2xl"></i></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container-fluid tableDiv">
                <div class="card mx-md-2 mt-4 mb-5">
                    <div class="card-body">
                        <div class="text-center m-5" v-if="loading">
                            <VueSpinner size="80" color="#8cb63d" />
                        </div>
                        <div class="table-responsive" v-else>
                            <table class="table table-striped table-hover text-center">
                                <thead>
                                    <tr>
                                        <th scope="col"><a href="#" class="tableHead">Server Name</a></th>
                                        <th scope="col"><a href="#" class="tableHead">Client Name</a> </th>
                                        <th scope="col"><a href="#" class="tableHead"> Number Packets</a> </th>
                                        <th scope="col"><a href="#" class="tableHead"> Profile Name</a> </th>
                                        <th scope="col"><a href="#" class="tableHead">Packet Interval</a> </th>
                                        <th scope="col"><a href="#" class="tableHead">Wait Time</a> </th>
                                        <th scope="col"><a href="#" class="tableHead">Packet Length</a> </th>
                                        <th scope="col"><a href="#" class="tableHead">DSCP</a> </th>
                                        <th scope="col"><a href="#" class="tableHead">Last Run</a> </th>
                                        <th scope="col"> </th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="data in sessionsData" :key="data.id">
                                        <td>
                                            <p class="tableP">{{ data?.s_name }}</p>
                                        </td>
                                        <td>
                                            <p class="tableP">{{ data?.c_name }}</p>
                                        </td>
                                        <td>
                                            <p class="tableP">{{ data?.n_packets }}</p>
                                        </td>
                                        <td>
                                            <p class="tableP">{{ data?.p_name }}</p>
                                        </td>
                                        <td>
                                            <p class="tableP">{{ data?.p_interval }}</p>
                                        </td>
                                        <td>
                                            <p class="tableP">{{ data.w_time }}</p>
                                        </td>
                                        <td>
                                            <p class="tableP">{{ data.p_size }}</p>
                                        </td>
                                        <td>
                                            <p class="tableP">{{ data.dscp }}</p>
                                        </td>

                                        <td>
                                            <p class="tableP">{{ calculateTimeDifference(data.updated_at) }} minutes ago</p>
                                        </td>
                                        <td class="fs-5">
                                            <RouterLink :to="'/sentinelReports/' + data.id" class="text-decoration-none text-dark tableP">
                                                <i class="fa-solid fa-circle-play"></i>
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
                                                        @click="handleEditModel(data.id, data.s_name, data.c_name, data.p_name, data.n_packets,
                                                            data.p_interval, data.w_time, data.dscp, data.count, data.schedule, data.p_size)"><i
                                                            class="fa-regular fa-pen-to-square"></i>
                                                        Edit</a>
                                                </li>
                                                <li>
                                                    <RouterLink :to="`/sentinelReports/` + data.id" class="dropdown-item"><i
                                                            class="fa-regular fa-eye me-1 text-dark"></i>Details
                                                    </RouterLink>
                                                </li>
                                                <li><a class="dropdown-item" href="#" v-on:click="handleDelete(data.id)"><i
                                                            class="fa-regular fa-trash-can"></i> Delete</a></li>
                                            </ul>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="d-flex justify-content-between">
                            <div>
                                <button class="addBtn2"><i class="fa-solid fa-chevron-down fa-lg"></i> Go to
                                    Page</button>
                                <!-- <button class="addBtn2 mx-2" data-bs-toggle="modal" data-bs-target="#groupModal"><i
                                        class="fa-solid fa-plus fa-lg"></i> Add to
                                    Group</button>
                                <button class="addBtn2"><i class="fa-solid fa-plus fa-lg"></i> Create
                                    Report</button> -->
                            </div>
                            <div>
                                <div class="pagination">
                                    <button class="prevBtn" :disabled="pages.previousPage === 0"
                                        v-on:click="getSessions(pages.previousPage)"><i class="fa-solid fa-angle-left"></i>
                                        Prev</button>
                                    <div class="pageNumber">-</div>
                                    <div class="pageNumber">-</div>
                                    <div class="pageNumber pageBtn">{{ pages.currentPage }}</div>
                                    <div class="pageNumber">-</div>
                                    <div class="pageNumber">-</div>
                                    <button class="nextBtn" :disabled="pages.nextPage === 0"
                                        v-on:click="getSessions(pages.nextPage)">Next <i
                                            class="fa-solid fa-angle-right"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- go to Modal -->
    <div class="modal fade" id="groupModal" tabindex="-1" aria-labelledby="groupModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="my-4 text-center">
                        <h2 class="text-dark">Add To Group</h2>
                    </div>
                    <div class="container mb-2">
                        <input type="text" class="form-control form-control-lg" style="background-color: #f3f3f3;"
                            id="exampleFormControlInput1" placeholder="">
                    </div>
                    <div class="">
                        <hr>
                        <button class="createGroupBtn"> <i class="fa-solid fa-plus fa-lg"></i> Create New Group</button>
                        <hr>
                    </div>
                    <div class="mx-2">
                        <div class="form-check mb-3">
                            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                            <label class="form-check-label" for="flexCheckDefault">
                                Group 01
                            </label>
                        </div>
                        <div class="form-check mb-3">
                            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault1">
                            <label class="form-check-label" for="flexCheckDefault1">
                                Group 024
                            </label>
                        </div>
                        <div class="form-check mb-3">
                            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault2">
                            <label class="form-check-label" for="flexCheckDefault2">
                                Group Number 021
                            </label>
                        </div>
                        <div class="form-check mb-3">
                            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault3">
                            <label class="form-check-label" for="flexCheckDefault3">
                                Group Number B23
                            </label>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="modelCancelBtn" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="modelSaveBtn ms-2">Add Group</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal  edit-->
    <div class="modal fade" id="staticBackdrop1" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdrop1Label" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header d-flex justify-content-center align-items-center">
                    <div class="">
                        <h2 class="text-dark">Edit Session</h2>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="">
                        <div class="mb-4">
                            <label for="exampleFormControlInput1" class="form-label ms-1">Form*</label>
                            <select v-model="selectedAgentId" class="form-select form-select-lg mb-3 custom-select"
                                aria-label=".form-select-lg example">
                                <option class="text-secondary" selected disabled>please select sender sentinel</option>
                                <option v-for="agent in agents" :key="agent.id" :value="agent.id">{{ agent.name }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-4">
                            <label for="exampleFormControlInput1" class="form-label ms-1">To*</label>
                            <select v-model="selectedClientId" class="form-select form-select-lg mb-3"
                                aria-label=".form-select-lg example">
                                <option class="text-secondary" disabled>please select receiver sentinel
                                </option>
                                <option v-for="client in clients" :key="client.id" :value="client.id">{{ client.name }}
                                </option>
                            </select>
                        </div>
                        <!-- Advanced button -->
                        <RouterLink to="#" @click="toggleAdvancedFields" class="ms-2 mt-2">
                            {{ showAdvancedFields ? "Hide Advanced -" : "Show Advanced +" }}
                        </RouterLink>
                        <div v-if="showAdvancedFields">
                            <div class="mb-4">
                                <label for="exampleFormControlInput1" class="form-label ms-1">Monitoring Profile*</label>
                                <select v-model="selectedProfile" class="form-select form-select-lg mb-3 custom-select"
                                    aria-label=".form-select-lg example">
                                    <option class="text-secondary" disabled>select here</option>
                                    <option v-for="profile in profiles" :key="profile.id" :value="profile.id">{{
                                        profile.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <div class="row g-2">
                                    <div class="col-md-12">
                                        <label for="exampleFormControlInput1" class="form-label ms-1">Schedule*</label>
                                        <input type="number" class="form-control form-control-lg"
                                            placeholder="Enter Schedule" v-model="this.form.schedule" name="schedule">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="exampleFormControlInput1" class="form-label ms-1">Count*</label>
                                        <input type="number" class="form-control form-control-lg" placeholder="Enter Count"
                                            v-model="this.form.count" name="count">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="exampleFormControlInput1" class="form-label ms-1">Number Of
                                            Packets*</label>
                                        <input type="number" class="form-control form-control-lg"
                                            placeholder="Enter No-packets" v-model="this.form.n_packets" name="n_packets">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="exampleFormControlInput1" class="form-label ms-1">Packet
                                            Interval*</label>
                                        <input type="number" class="form-control form-control-lg"
                                            placeholder="Enter P-Interval" v-model="this.form.p_interval" name="p_interval">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="exampleFormControlInput1" class="form-label ms-1">Wait Time*</label>
                                        <input type="number" class="form-control form-control-lg" placeholder="Enter W Time"
                                            v-model="this.form.w_time" name="w_time">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="exampleFormControlInput1" class="form-label ms-1">DSCP*</label>
                                        <input type="number" class="form-control form-control-lg" placeholder="Enter Dscp"
                                            v-model="this.form.dscp" name="dscp">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="exampleFormControlInput1" class="form-label ms-1">Packet Size*</label>
                                        <input type="number" class="form-control form-control-lg" placeholder="Enter P_Size"
                                            name="p_size" v-model="this.form.p_size">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="d-flex justify-content-end">
                        <button type="button" class="modelCancelBtn" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" data-bs-dismiss="modal" @click="handleEditSessions"
                            class="modelSaveBtn ms-2">Save</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '../common/Header.vue';
import { sessionsList, deleteSessions, updateSessions } from '../../services/sessions_services';
import { ProfileListForm } from '../../services/monitor_profile_Services';
import { agentListForm } from '../../services/agent_services';
import { VueSpinner } from 'vue3-spinners';
import AddSessions from './AddSessions.vue';
import { RouterLink } from 'vue-router';
import { createToast } from 'mosha-vue-toastify';
import 'mosha-vue-toastify/dist/style.css';
export default {
    name: 'Sessions',
    components: {
        Header,
        VueSpinner,
        AddSessions
    },
    data() {
        return {
            sessionsData: [],
            loading: false,
            pages: {
                currentPage: 1,
                previousPage: 1,
                nextPage: 1
            },
            form: {
                n_packets: null,
                p_interval: null,
                w_time: null,
                dscp: null,
                count: null,
                schedule: null,
                p_size: null,
            },
            selectedProfile: null, // Will store the selected profile id
            profiles: [],
            agents: [],
            selectedAgentId: 'please select sender sentinel',
            clients: [],
            current_time:null,
            selectedClientId: 'please select receiver sentinel',
            showAdvancedFields: false,
        }
    },
    mounted() {
        this.getSessions();
        this.monitor()
        this.server()
    },
    methods: {

        async getSessions(page = 1) {
            try {
                this.loading = true
                let res = await sessionsList(page)
                this.current_time = res.data.current_time
                this.sessionsData = res.data.sessions
                this.pages.previousPage = res?.data?.prev || 0
                this.pages.currentPage = this.pages.previousPage + 1
                this.pages.nextPage = res?.data?.next || 0
            } catch (error) {
                // sessions fetch failed
            } finally {
                this.loading = false
            }
        },
        async handleDelete(id) {
            const payload = {
                delete: id
            }
            try {
                await deleteSessions(payload)
                this.getSessions()
                createToast(`session delete`, {
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
            }
        },
        calculateTimeDifference(updatedAt) {
            if (!updatedAt || !this.current_time) return '—';

            const updatedDate = new Date(updatedAt);
            const currentDate = new Date(this.current_time);

            if (isNaN(updatedDate.getTime()) || isNaN(currentDate.getTime())) return '—';

            const timeDifference = currentDate - updatedDate;
            return Math.floor(timeDifference / (1000 * 60));
        },
        handleEditModel(id, s_name, c_name, p_name, n_packets, p_interval, w_time, dscp, count, schedule, p_size) {
            this.form.id = id
            this.form.n_packets = n_packets
            this.form.p_interval = p_interval
            this.form.w_time = w_time
            this.form.dscp = dscp
            this.form.count = count
            this.form.schedule = schedule
            this.form.p_size = p_size

            this.selectedClientId = this.clients.find(client => client.name === c_name)?.id;
            this.selectedAgentId = this.agents.find(agent => agent.name === s_name)?.id;
            this.selectedProfile = this.profiles.find(profile => profile.name === p_name)?.id;
        },
        async handleEditSessions() {
            const payload = {
                serve: this.selectedAgentId,
                client: this.selectedClientId,
                profile: this.selectedProfile,
                schedule: this.form.schedule,
                count: this.form.count,
                n_packets: this.form.n_packets,
                p_interval: this.form.p_interval,
                w_time: this.form.w_time,
                dscp: this.form.dscp,
                p_size: this.form.p_size,
                edit: true,
                aid: this.form.id
            }
            try {
                await updateSessions(payload)
                this.getSessions();
                createToast(`session update successfully`, {
                    type: 'success',
                    position: 'top-right',
                    transition: 'zoom',
                });
            } catch (error) {
                if (error.response.status === 400) {
                    createToast(error.response.data.error, {
                        type: 'danger',
                        position: 'top-right',
                        transition: 'zoom',
                    });
                }
                else if (error.response.status === 401) {
                    createToast(error.response.data.Unauthorized, {
                        type: 'warning',
                        position: 'top-right',
                        transition: 'zoom',
                    });
                }
            }
        },
        async monitor(size = 1000) {
            try {
                let res = await ProfileListForm(size)
                this.profiles = res.profiles;
            } catch (error) {
                // profiles fetch failed
            }
        },
        async server(size = 1000) {
            try {
                let res = await agentListForm(size)
                this.agents = res.data.agents
                this.clients = res.data.agents
            } catch (error) {
                // agents fetch failed
            }
        },
        toggleAdvancedFields() {
            this.showAdvancedFields = !this.showAdvancedFields;
        }
    }
}
</script>

<style>
.addBtnSessions {
    background-color: var(--white_color);
    border-radius: 6px;
    border: 1px solid var(--primary_color);
    padding: 7px 15px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    color: var(--primary_color);
}

.addBtnSessions:hover {
    background-color: var(--primary_color_Hover);
    color: var(--white_color);
}
</style>