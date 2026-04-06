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
                                <h3 class="text-secondary ms-3 mt-2"> Profile</h3>
                            </div>
                            <div class="d-flex align-items-center">
                                <h6 class="mx-1 mt-2 text-muted">Home </h6>
                                <h6 class="me-4 mt-2"> - Profile</h6>
                                <AddMonitor :handleMonitorList="handleMonitorList" />
                                <div class="mx-3"><i class="fa-solid fa-ellipsis fa-2xl"></i></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="isReadOnly" class="container-fluid px-4 mt-2">
                <div class="alert mb-0" style="background: #1a0a0a; border: 1px solid #dc2626; color: #fca5a5;">
                    <i class="fa-solid fa-lock me-2"></i>Read-only mode — license expired. <a href="mailto:license@slogr.io" style="color: #fca5a5;">Contact license@slogr.io to renew.</a>
                </div>
            </div>
            <div class="container-fluid tableDiv">
                <div class="card mx-md-2 mt-4 mb-5">
                    <div class="card-body">
                        <LoadingState v-if="loading" />
                        <ErrorState
                            v-else-if="profileError"
                            :message="profileError"
                            :on-retry="handleMonitorList"
                        />
                        <EmptyState
                            v-else-if="!monitorData.length"
                            icon="fa-solid fa-sliders"
                            title="No monitoring profiles"
                            message="Create a profile to define SLA thresholds for your sessions."
                        />
                        <div class="table-responsive" v-else>
                            <table class="table table-striped table-hover text-center">
                                <thead>
                                    <tr>
                                        <th><a href="#" class="tableHead">Profile Name</a></th>
                                        <th><a href="#" class="tableHead">JITTER <br>(ms)</a></th>
                                        <th><a href="#" class="tableHead">Downlink <br>(ms)</a> </th>
                                        <th><a href="#" class="tableHead">Downlink Bandwidth<br>(mbps)</a> </th>
                                        <th><a href="#" class="tableHead">Loss <br>(Percentage)</a></th>
                                        <th><a href="#" class="tableHead">RTT <br>(ms)</a></th>
                                        <th><a href="#" class="tableHead">Uplink <br>(ms)</a></th>
                                        <th><a href="#" class="tableHead">Uplink Bandwidth<br>(mbps)</a></th>
                                        <th><a href="#" class="tableHead">Number Packets</a></th>
                                        <th><a href="#" class="tableHead">Packet Interval<br>(ms)</a></th>
                                        <th><a href="#" class="tableHead">Packet Size<br>(bytes)</a></th>
                                        <th><a href="#" class="tableHead">Delay <br>(ms)</a></th>
                                        <th><a href="#" class="tableHead">Wait Time<br>(ms)</a></th>
                                        <th><a href="#" class="tableHead">Dscp</a></th>

                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="data in monitorData" :key="data.id">
                                        <td>
                                            <p class="tableP">
                                                {{ data.name }}
                                            </p>
                                        </td>
                                     
                                        <td>
                                            <p class="tableP"> <span style="background-color: rgb(144, 245, 144);">{{ data?.jitter_g }}</span> - <span style="background-color: rgb(255, 128, 128);">{{ data?.jitter_r }}</span></p>
                                        </td>
                                        <td>
                                            <p class="tableP"><span style="background-color: rgb(144, 245, 144);">{{ data.downlink_g }} </span> - <span style="background-color: rgb(255, 128, 128);">{{ data.downlink_r }}</span></p>
                                        </td>
                                        <td>
                                            <p class="tableP"><span style="background-color: rgb(144, 245, 144);">{{ data.downlink_bw_g }}</span> - <span style="background-color: rgb(255, 128, 128);">{{ data.downlink_bw_r }}</span></p>
                                        </td>
                                        <td>
                                            <p class="tableP"><span style="background-color: rgb(144, 245, 144);">{{ data.loss_g }}</span> - <span style="background-color: rgb(255, 128, 128);">{{ data.loss_r }}</span></p>
                                        </td>
                                        <td>
                                            <p class="tableP"><span style="background-color: rgb(144, 245, 144);">{{ data.rtt_g }}</span> - <span style="background-color: rgb(255, 128, 128);">{{ data.rtt_r }}</span></p>
                                        </td>
                                        <td>
                                            <p class="tableP"><span style="background-color: rgb(144, 245, 144);">{{ data.uplink_g }}</span> - <span style="background-color: rgb(255, 128, 128);">{{ data.uplink_r }}</span></p>
                                        </td>
                                        <td>
                                            <p class="tableP"><span style="background-color: rgb(144, 245, 144);">{{ data.uplink_bw_g }}</span> - <span style="background-color: rgb(255, 128, 128);">{{ data.uplink_bw_r }}</span></p>
                                        </td>
                                        <td>
                                            <p class="tableP">{{ data.n_packets }}</p>
                                        </td>
                                        <td>
                                            <p class="tableP">{{ data.p_interval }}</p>
                                        </td>
                                        <td>
                                            <p class="tableP">{{ data.p_size }}</p>
                                        </td>
                                        <td>
                                            <p class="tableP"><span style="background-color: rgb(144, 245, 144);">{{ data.delay_g }}</span> - <span style="background-color: rgb(255, 128, 128);">{{ data.delay_r }}</span></p>
                                        </td>
                                        <td>
                                            <p class="tableP">{{ data.w_time }}</p>
                                        </td>
                                        <td>
                                            <p class="tableP">{{ data.dscp }}</p>
                                        </td>
                                        <td class="fs-5 dropstart"><a href="#" class="text-decoration-none text-dark tableP"
                                                data-bs-toggle="dropdown" aria-expanded="false">
                                                <i class="fa-solid fa-ellipsis"></i></a>
                                            <ul class="dropdown-menu">
                                                <li>
                                                    <a href="#" class="dropdown-item" data-bs-toggle="modal"
                                                        data-bs-target="#staticBackdrop1" @click="handleEditModel(data.id, data.name, data.p_size, data.count, data.n_packets,
                                                            data.p_interval, data.w_time, data.dscp,
                                                            data.jitter_g, data.jitter_r, data.downlink_g, data.downlink_r, data.downlink_bw_g, data.downlink_bw_r,
                                                            data.loss_g, data.loss_r, data.rtt_g, data.rtt_r, data.uplink_g, data.uplink_r, data.uplink_bw_g,
                                                            data.uplink_bw_r, data.delay_g, data.delay_r)"><i
                                                            class="fa-regular fa-pen-to-square"></i>
                                                        Edit</a>
                                                </li>
                                                <li><a class="dropdown-item" href="#"><i class="fa-regular fa-eye"></i>
                                                        Details</a></li>
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
                            </div>
                            <div>
                                <div class="pagination">
                                    <button class="prevBtn" :disabled="pages.previousPage === 0" @click="handleMonitorList(pages.previousPage)"><i class="fa-solid fa-angle-left"></i> Prev</button>
                                    <div class="pageNumber">-</div>
                                    <div class="pageNumber">-</div>
                                    <div class="pageNumber pageBtn">{{ pages.currentPage }}</div>
                                    <div class="pageNumber">-</div>
                                    <div class="pageNumber">-</div>
                                    <button class="nextBtn" :disabled="pages.nextPage === 0" @click="handleMonitorList(pages.nextPage)">Next <i class="fa-solid fa-angle-right"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Modal  edit-->
        <div class="modal fade" id="staticBackdrop1" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
            aria-labelledby="staticBackdrop1Label" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered  modal-lg">
                <div class="modal-content">
                    <div class="modal-header d-flex justify-content-center align-items-center">
                        <div class="">
                            <h2 class="text-dark">Edit Profile</h2>
                        </div>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="">
                            <div class="mb-3">
                                <label for="exampleFormControlInput1" class="form-label ms-1">Profile Name</label>
                                <input type="text" class="form-control form-control-lg" placeholder="Type Name" name="name"
                                    v-model="this.form.name" required>
                            </div>
                            <div class="mb-3">
                                <div class="row g-2">
                                    <div class="col-md-6">
                                        <label for="exampleFormControlInput1" class="form-label ms-1">RTT Green</label>
                                        <input type="number" class="form-control form-control-lg" placeholder="RTT Green"
                                            name="rtt_g" v-model="this.form.rtt_g">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="exampleFormControlInput1" class="form-label ms-1">RTT Red</label>
                                        <input type="number" class="form-control form-control-lg" placeholder="RTT Red"
                                            name="rtt_r" v-model="this.form.rtt_r">
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <div class="row g-2">
                                    <div class="col-md-6">
                                        <label for="exampleFormControlInput1" class="form-label ms-1">Jitter Green</label>
                                        <input type="number" class="form-control form-control-lg" placeholder="Jitter Green"
                                            name="jitter_g" v-model="this.form.jitter_g">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="exampleFormControlInput1" class="form-label ms-1">Jitter Red</label>
                                        <input type="number" class="form-control form-control-lg" placeholder="Jitter Red"
                                            name="jitter_r" v-model="this.form.jitter_r">
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <div class="row g-2">
                                    <div class="col-md-6">
                                        <label for="exampleFormControlInput1" class="form-label ms-1">Downlink Green</label>
                                        <input type="number" class="form-control form-control-lg" placeholder="Downlink Green"
                                            name="downlink_g" v-model="this.form.downlink_g">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="exampleFormControlInput1" class="form-label ms-1">Downlink Red</label>
                                        <input type="number" class="form-control form-control-lg" placeholder="Downlink Red"
                                            name="downlink_r" v-model="this.form.downlink_r">
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <div class="row g-2">
                                    <div class="col-md-6">
                                        <label for="exampleFormControlInput1" class="form-label ms-1">Downlink BandWidth Green</label>
                                        <input type="number" class="form-control form-control-lg" placeholder="Downlink BandWidth Green"
                                            name="downlink_bw_g" v-model="this.form.downlink_bw_g">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="exampleFormControlInput1" class="form-label ms-1">Downlink BandWidth Red</label>
                                        <input type="number" class="form-control form-control-lg" placeholder="Downlink BandWidth Red"
                                            name="downlink_bw_r" v-model="this.form.downlink_bw_r">
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <div class="row g-2">
                                    <div class="col-md-6">
                                        <label for="exampleFormControlInput1" class="form-label ms-1">Uplink Green</label>
                                        <input type="number" class="form-control form-control-lg" placeholder="Uplink Green"
                                            name="uplink_g" v-model="this.form.uplink_g">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="exampleFormControlInput1" class="form-label ms-1">Uplink Red</label>
                                        <input type="number" class="form-control form-control-lg" placeholder="Uplink Red"
                                            name="uplink_r" v-model="this.form.uplink_r">
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <div class="row g-2">
                                    <div class="col-md-6">
                                        <label for="exampleFormControlInput1" class="form-label ms-1">Uplink BandWidth Green</label>
                                        <input type="number" class="form-control form-control-lg" placeholder="Uplink BandWidth Green"
                                            name="uplink_bw_g" v-model="this.form.uplink_bw_g">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="exampleFormControlInput1" class="form-label ms-1">Uplink BandWidth Red</label>
                                        <input type="number" class="form-control form-control-lg" placeholder="Uplink BandWidth Red"
                                            name="uplink_bw_r" v-model="this.form.uplink_bw_r">
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <div class="row g-2">
                                    <div class="col-md-6">
                                        <label for="exampleFormControlInput1" class="form-label ms-1">Loss Green</label>
                                        <input type="number" class="form-control form-control-lg" placeholder="Loss Green"
                                            name="loss_g" v-model="this.form.loss_g">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="exampleFormControlInput1" class="form-label ms-1">Loss Red</label>
                                        <input type="number" class="form-control form-control-lg" placeholder="Loss Red"
                                            name="loss_r" v-model="this.form.loss_r">
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <div class="row g-2">
                                    <div class="col-md-6">
                                        <label for="exampleFormControlInput1" class="form-label ms-1">Delay Green</label>
                                        <input type="number" class="form-control form-control-lg" placeholder="Delay Green"
                                            name="delay_g" v-model="this.form.delay_g">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="exampleFormControlInput1" class="form-label ms-1">Delay Red</label>
                                        <input type="number" class="form-control form-control-lg" placeholder="Delay Red"
                                            name="delay_r" v-model="this.form.delay_r">
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <div class="row g-2">
                                    <div class="col-md-4">
                                        <label for="exampleFormControlInput1" class="form-label ms-1">Wait Time</label>
                                        <input type="number" class="form-control form-control-lg" placeholder="W Time"
                                            name="w_time" v-model="this.form.w_time">
                                    </div>
                                    <div class="col-md-4">
                                        <label for="exampleFormControlInput1" class="form-label ms-1">Dscp</label>
                                        <input type="number" class="form-control form-control-lg" placeholder="Dscp"
                                            name="dscp" v-model="this.form.dscp">
                                    </div>
                                    <div class="col-md-4">
                                        <label for="exampleFormControlInput1" class="form-label ms-1">Count</label>
                                        <input type="number" class="form-control form-control-lg" placeholder="Count"
                                            name="count" v-model="this.form.count">
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <div class="row g-2">
                                    <div class="col-md-4">
                                        <label for="exampleFormControlInput1" class="form-label ms-1">Number Packets</label>
                                        <input type="number" class="form-control form-control-lg" placeholder="No Packets"
                                            name="n_packets" v-model="this.form.n_packets">
                                    </div>
                                    <div class="col-md-4">
                                        <label for="exampleFormControlInput1" class="form-label ms-1">Packets
                                            Interval</label>
                                        <input type="number" class="form-control form-control-lg" placeholder="P Interval"
                                            name="p_interval" v-model="this.form.p_interval">
                                    </div>
                                    <div class="col-md-4">
                                        <label for="exampleFormControlInput1" class="form-label ms-1">Packets Size</label>
                                        <input type="number" class="form-control form-control-lg" placeholder="Packets Size"
                                            name="p_size" v-model="this.form.p_size">
                                    </div>
                                </div>
                            </div>   
                        </div>
                    </div>
                    <div class="modal-footer">
                        <div class="d-flex justify-content-end">
                            <button type="button" class="modelCancelBtn" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" data-bs-dismiss="modal" @click="handleEditMonitor"
                                class="modelSaveBtn ms-2">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AddMonitor from './AddMonitor.vue';
import Header from '../common/Header.vue';
import { ProfileList, deleteMonitor, updateMonitor } from '../../services/monitor_profile_Services';
import { VueSpinner } from 'vue3-spinners';
import moment from 'moment';
import { createToast } from 'mosha-vue-toastify';
import 'mosha-vue-toastify/dist/style.css';

export default {
    name: 'Monitor',
    components: {
        Header,
        VueSpinner,
        AddMonitor,
    },
    created: function () {
        this.moment = moment;
    },
    computed: {
        isReadOnly() { return this.$store.getters.isReadOnly },
        readOnlyTitle() { return this.isReadOnly ? 'Your license has expired. Renew at license@slogr.io to enable this action.' : null },
    },
    data() {
        return {
            monitorData: [],
            profileError: null,
            loading: true,
            pages: {
                currentPage: 1,
                previousPage: 0,
                nextPage: 0
            },
            form: {
                id: null,
                name: '',
                w_time: '',
                dscp: '',
                count: '',
                n_packets: '',
                p_interval: '',
                p_size: '',
                jitter_g: '',
                jitter_r: '',
                downlink_g: '',
                downlink_r: '',
                downlink_bw_g: '',
                downlink_bw_r: '',
                loss_g: '',
                loss_r: '',
                rtt_g: '',
                rtt_r: '',
                uplink_g: '',
                uplink_r: '',
                uplink_bw_g: '',
                uplink_bw_r: '',
                delay_g: '',
                delay_r: '',
            }
        }
    },
    mounted() {
        this.handleMonitorList()
    },
    methods: {
        async handleMonitorList() {
            this.loading = true
            this.profileError = null
            try {
                let res = await ProfileList()
                this.monitorData = res.profiles
            } catch (error) {
                this.profileError = error.response?.data?.message ?? error.message ?? 'Failed to load profiles'
            } finally {
                this.loading = false
            }
        },
        async handleDelete(id) {
            try {
                await deleteMonitor(id)
                createToast(`delete successfully`, {
                    type: 'success',
                    position: 'top-right',
                    transition: 'zoom',
                });
                this.handleMonitorList()
            } catch (error) {
                console.log(error)
            }
        },
        handleEditModel(id, name, p_size, count, n_packets, p_interval, w_time, dscp, jitter_g, jitter_r, downlink_g, downlink_r, downlink_bw_g, downlink_bw_r,
            loss_g, loss_r, rtt_g, rtt_r, uplink_g, uplink_r, uplink_bw_g, uplink_bw_r, delay_g, delay_r) {
            this.form.id = id
            this.form.name = name
            this.form.p_size = p_size
            this.form.count = count
            this.form.n_packets = n_packets
            this.form.p_interval = p_interval
            this.form.w_time = w_time
            this.form.dscp = dscp
            this.form.jitter_g = jitter_g
            this.form.jitter_r = jitter_r
            this.form.downlink_g = downlink_g
            this.form.downlink_r = downlink_r
            this.form.downlink_bw_g = downlink_bw_g
            this.form.downlink_bw_r = downlink_bw_r
            this.form.loss_g = loss_g
            this.form.loss_r = loss_r
            this.form.rtt_g = rtt_g
            this.form.rtt_r = rtt_r
            this.form.uplink_g = uplink_g
            this.form.uplink_r = uplink_r
            this.form.uplink_bw_g = uplink_bw_g
            this.form.uplink_bw_r = uplink_bw_r
            this.form.delay_g = delay_g
            this.form.delay_r = delay_r
        },
        async handleEditMonitor() {
            const payload = {
                id: this.form.id,
                name: this.form.name,
                count: this.form.count,
                n_packets: this.form.n_packets,
                p_interval: this.form.p_interval,
                w_time: this.form.w_time,
                dscp: this.form.dscp,
                p_size: this.form.p_size,
                rtt_g: this.form.rtt_g,
                rtt_r: this.form.rtt_r,
                uplink_g: this.form.uplink_g,
                uplink_r: this.form.uplink_r,
                downlink_g: this.form.downlink_g,
                downlink_r: this.form.downlink_r,
                delay_g: this.form.delay_g,
                delay_r: this.form.delay_r,
                downlink_bw_g: this.form.downlink_bw_g,
                downlink_bw_r: this.form.downlink_bw_r,
                uplink_bw_g: this.form.uplink_bw_g,
                uplink_bw_r: this.form.uplink_bw_r,
                jitter_g: this.form.jitter_g,
                jitter_r: this.form.jitter_r,
                loss_g: this.form.loss_g,
                loss_r: this.form.loss_r,
                edit: true
            }
            try {
                await updateMonitor(payload)
                this.handleMonitorList()
                createToast(`Profile update successfully`, {
                    type: 'success',
                    position: 'top-right',
                    transition: 'zoom',
                });
            } catch (error) {
                createToast(`Profile update error`, {
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

<style>
.addBtn {
    background-color: var(--primary_color);
    border-radius: 6px;
    border: 1px solid var(--primary_color);
    padding: 7px 15px;
    color: var(--white_color);
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.addBtn:hover {
    background-color: var(--primary_color_Hover);
}

.modelSaveBtn {
    background-color: var(--primary_color);
    border-radius: 6px;
    border: 1px solid var(--primary_color);
    padding: 7px 50px;
    color: var(--white_color);
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.modelSaveBtn:hover {
    background-color: var(--primary_color_Hover);
}

.modelCancelBtn {
    border: none;
    background-color: var(--white_color);
    color: var(--dark_gray_Color);
    padding: 7px 30px;
    text-decoration: none;
}

.modelCancelBtn:hover {
    color: var(--primary_color_Hover);
}

.css {
    line-height: 1.2;
}
</style>