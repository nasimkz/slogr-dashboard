<template>
    <!-- <Header/> -->
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
                                <h3 class="text-secondary ms-3 mt-2">Sentinel</h3>
                            </div>
                            <div class="d-flex align-items-center">
                                <h6 class="mx-1 mt-2 text-muted">Home </h6>
                                <h6 class="me-4 mt-2"> - Sentinel</h6>
                                <button class="addBtn" :disabled="isReadOnly" :title="readOnlyTitle" :class="{ 'opacity-50': isReadOnly }" data-bs-toggle="modal" data-bs-target="#staticBackdrop2"> <i
                                        class="fa-solid fa-plus fa-lg"></i> Add New Sentinel</button>
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
                <div class="row g-2">
                    <div id="col1" class="col-12">
                        <div class="card mx-md-2 mt-4 mb-5">
                            <div class="card-body">
                                <LoadingState v-if="loading2" />
                                <ErrorState
                                    v-else-if="agentError"
                                    :message="agentError"
                                    :on-retry="() => handleSentinelListing()"
                                />
                                <EmptyState
                                    v-else-if="!agents.length"
                                    icon="fa-solid fa-satellite-dish"
                                    title="No agents yet"
                                    message="Deploy your first agent to start monitoring your network."
                                />
                                <div class="table-responsive" v-else>
                                    <table class="table table-striped table-hover text-center">
                                        <thead>
                                            <tr>
                                                <th scope="col"><a href="#" class="tableHead" data-bs-toggle="dropdown"
                                                        aria-expanded="false">Name </a>
                                                </th>
                                                <th scope="col"><a href="#" class="tableHead" data-bs-toggle="dropdown"
                                                        aria-expanded="false">Ip
                                                        Address</a>
                                                </th>
                                                <th scope="col"><a href="#" class="tableHead" data-bs-toggle="dropdown"
                                                        aria-expanded="false">Organization</a>
                                                </th>
                                                <th scope="col"><a href="#" class="tableHead" data-bs-toggle="dropdown"
                                                        aria-expanded="false">
                                                        Machine</a>
                                                </th>
                                                <th scope="col"><a href="#" class="tableHead" data-bs-toggle="dropdown"
                                                        aria-expanded="false">Location</a>
                                                </th>
                                                <th scope="col"><a href="#" class="tableHead" data-bs-toggle="dropdown"
                                                        aria-expanded="false">Country</a>
                                                </th>
                                                <th scope="col"><a href="#" class="tableHead">Last Seen</a></th>
                                                <th scope="col"><a href="#" class="tableHead">Status</a></th>
                                                <th scope="col"></th>
                                                <th scope="col"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="data in agents" :key="data">
                                                <td>
                                                    <p class="tableP">{{ data.name }}</p>
                                                </td>
                                                <td>
                                                    <p class="tableP">{{ data.ipaddress }}</p>
                                                </td>
                                                <td>
                                                    <p class="tableP">{{ data.Organization }}</p>
                                                </td>
                                                <td>
                                                    <p class="tableP">{{ data.machine }}</p>
                                                </td>
                                                <td>
                                                    <p class="tableP">{{ data.location }}</p>
                                                </td>
                                                <td>
                                                    <p class="tableP">{{ data.Country }}</p>
                                                </td>
                                                <td>
                                                    <span :class="['badge', agentIsStale(data.updated_at) ? 'bg-danger' : 'bg-success']">
                                                        {{ agentFreshnessLabel(data.updated_at) }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span :class="['badge', agentStatusBadgeClass(data.updated_at)]">
                                                        {{ agentStatusLabel(data.updated_at) }}
                                                    </span>
                                                </td>
                                                <td class="fs-5"><a href="#" class="text-decoration-none text-dark tableP"
                                                        data-bs-toggle="modal" data-bs-target="#staticBackdrop"
                                                        @click="handleUpdateModalData(data.id, data.name)"> <i
                                                            class="fa-solid fa-pen-to-square fa-lg"></i></a></td>
                                                <td class="fs-5"><a href="#" class="text-decoration-none text-dark tableP"
                                                        @click="handleGrids(data.id, data.name)">
                                                        <i class="fa-solid fa-chevron-right"></i></a></td>
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
                                            <button class="prevBtn" @click="handleSentinelListing(pages.previousPage)"><i
                                                    class="fa-solid fa-angle-left"></i> Prev</button>
                                            <div class="pageNumber">-</div>
                                            <div class="pageNumber">-</div>
                                            <div class="pageNumber pageBtn">{{ pages.currentPage }}</div>
                                            <div class="pageNumber">-</div>
                                            <div class="pageNumber">-</div>
                                            <button class="nextBtn" @click="handleSentinelListing(pages.nextPage)">Next <i
                                                    class="fa-solid fa-angle-right"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="col2" class="col-2 d-none">
                        <div class="card mt-4 mb-5">
                            <div class="text-center m-5" v-if="loading">
                                <VueSpinner size="80" color="#8cb63d" />
                            </div>
                            <div class="text-center m-5" v-if="error">
                                <h3 class="text-danger">Sessions not found.</h3>
                            </div>
                            <div v-else>
                                <div class="card-body" v-for="data in refSessions" :key="data.id">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div>
                                            <p class="card-text ms-2">{{ data?.name }}</p>
                                            <span class="text-secondary ms-2" style="font-size: 13px;">{{ data?.machine_name
                                            }}
                                            </span> <br>
                                            <span class="text-secondary ms-2" style="font-size: 13px;">Data</span>
                                        </div>
                                        <div>
                                            <RouterLink :to="`/sentinelReports/` + data.id"><i
                                                    class="fa-solid fa-chevron-right me-1 text-secondary"></i></RouterLink>
                                        </div>
                                    </div>
                                    <hr class="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- go to Modal -->
    <!-- <div class="modal fade" id="groupModal" tabindex="-1" aria-labelledby="groupModalLabel" aria-hidden="true">
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
    </div> -->

    <!-- Modal  Add new sentinel-->
    <div class="modal fade" id="staticBackdrop2" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdrop2Label" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="my-2 text-center">
                        <h2 class="text-secondary">Add Sentinel</h2>
                        <p class="modelText">Add new Sentinel</p>
                    </div>
                    <div class="">
                        <div class="mb-3">
                            <label for="exampleFormControlInput1" class="form-label ms-1">Name</label>
                            <input type="text" class="form-control form-control-lg" id="exampleFormControlInput1"
                                placeholder="Enter Name" v-model="addSentinel.name">
                            <span class="text-danger" v-if="!addSentinel.name">This field is required.</span>
                        </div>
                        <div class="mb-3">
                            <label for="exampleFormControlInput2" class="form-label ms-1">Agent Code</label>
                            <input type="text" class="form-control form-control-lg" id="exampleFormControlInput2"
                                placeholder="Enter Agent Code" v-model="addSentinel.agent_code">
                            <span class="text-danger" v-if="!addSentinel.agent_code">This field is required.</span>
                        </div>
                        <div class="d-flex justify-content-end">
                            <button type="button" id="AddCancelButton" class="modelCancelBtn"
                                data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="modelSaveBtn ms-2" @click="handleSentinelCreation">Save</button>
                        </div>
                        <hr>
                        <br>
                        <div class="d-flex justify-content-center">
                            <a :href="agentDownloadUrl"><button
                                    type="button" class="modelSaveBtn ms-2"
                                    style="background-color: rgba(85, 253, 253, 0.39); color: black; border: none; font-weight: 500;">Download
                                    Windows Agent</button></a>
                        </div>
                        <br>
                        <strong  class="d-flex justify-content-center">OR</strong>
                        <br>
                        <div class="d-flex justify-content-center">
                            <label for="exampleFormControlInput2" class="form-label ms-1">Paste Script for linux Installation</label>
                        </div>
                        
                        <div class="d-flex justify-content-center">
                            
                            <div class="copy-text">
                                <input type="text" class="text" ref="textInput" :value="agentInstallCmd" disabled/>
                                <button @click="copyText"><i class="fa fa-clone"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal  edit-->
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="my-2 text-center">
                        <h2 class="text-secondary">Edit Sentinel</h2>
                        <p class="modelText">Enter your Sentinel Below Field</p>
                    </div>
                    <div class="">
                        <div class="mb-3">
                            <label for="exampleFormControlInput1" class="form-label ms-1">Name</label>
                            <input type="text" class="form-control form-control-lg" id="exampleFormControlInput1"
                                placeholder="Enter Name" v-model="updateData.name">
                            <span class="text-danger" v-if="!updateData.name">This field is required.</span>
                        </div>
                        <div class="d-flex justify-content-end">
                            <button type="button" id="EditCancelButton" class="modelCancelBtn"
                                data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="modelSaveBtn ms-2" @click="handleSentinelUpdate">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '../common/Header.vue';
import { createAgent, agentUpdate, agentList, agentRefSessions } from '../../services/agent_services';
import { VueSpinner } from 'vue3-spinners';
import { createToast } from 'mosha-vue-toastify';
import 'mosha-vue-toastify/dist/style.css';


export default {
    name: 'Sentinel',
    components: {
        Header,
        VueSpinner
    },
    computed: {
        isReadOnly() { return this.$store.getters.isReadOnly },
        readOnlyTitle() { return this.isReadOnly ? 'Your license has expired. Renew at license@slogr.io to enable this action.' : null },
    },
    data() {
        return {
            addSentinel: {
                name: null,
                agent_code: null,
            },
            updateData: {
                id: null,
                name: null
            },
            editName: null,
            agents: [],
            pages: {
                currentPage: 1,
                previousPage: 1,
                nextPage: 1
            },
            selectedGridId: 0,
            selectedGridName: null,
            refSessions: [],
            error: null, // data not found check
            agentError: null,
            loading: false,
            loading2: true,
            agentDownloadUrl: import.meta.env.VITE_AGENT_DOWNLOAD_URL || '',
            agentInstallCmd: import.meta.env.VITE_AGENT_INSTALL_CMD || ''
        }
    },
    async mounted() {
        await this.handleSentinelListing()


    },
    methods: {

        copyText() {
            const input = this.$refs.textInput;
            input.select();
            document.execCommand("copy");
            this.$el.classList.add("active");
            window.getSelection().removeAllRanges();

            setTimeout(() => {
                this.$el.classList.remove("active");
            }, 2500);
        },
        async handleSentinelListing(page = 1) {
            this.loading2 = true
            this.agentError = null
            try {
                const respData = await agentList(page)
                this.agents = respData.data.agents
                this.pages.previousPage = respData.data.prev || 0
                this.pages.currentPage = this.pages.previousPage + 1
                this.pages.nextPage = respData.data.next || 1
            } catch (error) {
                this.agentError = error.response?.data?.message ?? error.message ?? 'Failed to load agents'
            } finally {
                this.loading2 = false;
            }
        },
        async handleSentinelCreation() {
            if (this.addSentinel.name && this.addSentinel.agent_code) {
                const payload = { name: this.addSentinel.name, agent_code: this.addSentinel.agent_code }
                try {
                    await createAgent(payload)
                    await this.handleSentinelListing()
                    document.getElementById('AddCancelButton').click();
                    this.addSentinel.name = null;
                    this.addSentinel.agent_code = null;
                } catch (error) {
                    console.log('add-error', error)
                    let newError = error.response.data.error
                    if (newError) {
                        console.log('res-error', newError)
                        createToast(newError, {
                            type: 'danger',
                            position: 'top-right',
                            transition: 'zoom',
                        });
                    }
                }
            }
        },
        agentFreshnessLabel(updatedAt) {
            if (!updatedAt) return 'Unknown'
            const diffMs = Date.now() - new Date(updatedAt).getTime()
            if (isNaN(diffMs) || diffMs < 0) return 'Unknown'
            const minutes = Math.floor(diffMs / 60_000)
            if (minutes < 1) return 'Just now'
            if (minutes < 60) return `${minutes}m ago`
            const hours = Math.floor(minutes / 60)
            return hours < 24 ? `${hours}h ago` : `${Math.floor(hours / 24)}d ago`
        },
        agentIsStale(updatedAt) {
            if (!updatedAt) return true
            const diffMs = Date.now() - new Date(updatedAt).getTime()
            return isNaN(diffMs) || diffMs > 15 * 60_000
        },
        agentStatusLabel(updatedAt) {
            if (!updatedAt) return 'Unknown'
            const diffMs = Date.now() - new Date(updatedAt).getTime()
            if (isNaN(diffMs) || diffMs < 0) return 'Unknown'
            return diffMs <= 5 * 60_000 ? 'Online' : 'Offline'
        },
        agentStatusBadgeClass(updatedAt) {
            const label = this.agentStatusLabel(updatedAt)
            if (label === 'Online') return 'bg-success'
            if (label === 'Offline') return 'bg-secondary'
            return 'bg-warning text-dark'
        },
        handleUpdateModalData(id, name) {
            this.updateData.id = id
            this.updateData.name = name
        },
        async handleSentinelUpdate() {
            if (this.updateData.name) {
                const payload = { aid: this.updateData.id, name: this.updateData.name }
                await agentUpdate(payload)
                await this.handleSentinelListing()

                document.getElementById('EditCancelButton').click();
                this.updateData.name = null;
                this.updateData.id = null;
            }
        },
        async handleGrids(selectedId, selectedName) {
            let col1 = document.getElementById('col1')
            let col2 = document.getElementById('col2')
            if (selectedId == this.selectedGridId) {
                if (col2.classList.contains('d-none')) {
                    col1.classList.remove("col-12")
                    col1.classList.add("col-10")
                    col2.classList.remove("d-none")
                } else {
                    col1.classList.add("col-12")
                    col1.classList.remove("col-10")
                    col2.classList.add("d-none")
                }
            } else {
                col1.classList.remove("col-12")
                col1.classList.add("col-10")
                col2.classList.remove("d-none")
            }
            this.selectedGridId = selectedId
            this.selectedGridName = selectedName
            console.log('id-grid', selectedId)
            try {
                this.loading = true;
                this.error = null;
                let res = await agentRefSessions(selectedId)
                if (res.sessions.length === 0) {
                    this.error = "Sentinel not found.";
                    this.refSessions = []
                } else {
                    this.refSessions = res.sessions
                    console.log('ref-sessions', res.sessions)
                }
            } catch (error) {
                console.log(error)
            } finally {
                this.loading = false;
            }
        },

    }
}


</script>

<style>
.pageHeight {
    height: 100vh;
}

.addBtn {
    background-color: #8CB63D;
    border-radius: 6px;
    border: 1px solid #8CB63D;
    padding: 7px 15px;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.addBtn:hover {
    background-color: #72962f;
}

.addBtn2 {
    background-color: white;
    border-radius: 6px;
    border: 1px solid #8CB63D;
    padding: 10px 15px;
    color: #8CB63D;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.addBtn2:hover {
    background-color: #72962f;
    color: white;
}

.modelSaveBtn {
    background-color: #8CB63D;
    border-radius: 6px;
    border: 1px solid #8CB63D;
    padding: 7px 50px;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.modelSaveBtn:hover {
    background-color: #72962f;
}

.modelCancelBtn {
    border: none;
    background-color: white;
    color: darkgray;
    padding: 7px 30px;
    text-decoration: none;
}

.modelCancelBtn:hover {
    color: #8CB63D;
}

.createGroupBtn {
    background-color: white;
    border-radius: 6px;
    border: 1px solid #8CB63D;
    padding: 7px 40px;
    color: #8CB63D;
    cursor: pointer;
}

.createGroupBtn:hover {
    background-color: #8CB63D;
    color: white;
}

/* .sentinel {
    margin-top: 40px;
} */

.bg {
    background-color: #f7f7f8;
    min-height: 100vh;
    top: 1;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
}

.prevBtn,
.nextBtn {
    padding: 10px 15px;
    /* font-size: 16px; */
    border-radius: 6px;
    /* background-color:  #8CB63D; */
    border: 1px solid #8CB63D;
    /* color: #8CB63D; */
    cursor: pointer;
    transition: background-color 0.3s ease;
    background-color: white;
}

.prevBtn:hover,
.nextBtn:hover {
    background-color: #8CB63D;
    color: white;
}

.pageNumber {
    font-size: 15px;
    margin: 0 20px;
    color: darkgray;
}

.pageBtn {
    background-color: #8CB63D;
    padding: 5px 15px;
    border-radius: 7px;
    color: white;
}

.tableDiv {
    padding-bottom: 22px;
}

.pointer {
    cursor: pointer;
    color: darkgrey;
}

.modelText {
    font-size: 20px;
}

p {
    margin-bottom: 0 !important;
}

.tableP {
    font-size: 18px;
    margin-top: 15px !important;
    margin-bottom: 10px !important;
    display: inline-block;
}

.tableHead {
    text-decoration: none;
    color: #000;
    margin-top: 10px !important;
    margin-bottom: 10px !important;
    font-size: 16px;
    display: inline-block;
}

.ApplyBtn {
    background-color: #8CB63D;
    color: white;
    border-radius: 6px;
    border: 1px solid #8CB63D;
    padding: 5px 0;

}

.ApplyBtn:hover {
    background-color: #72962f;
}

/* Style the label text */
.form-check-label {
    font-weight: normal;
    /* Make the label text normal weight */
    color: #333;
    /* Change the label text color */
}

/* Style the checkbox when checked */
.form-check-input:checked {
    background-color: #8CB63D !important;
    /* Change the background color when checked */
    border: 1px solid #8CB63D !important;
    /* Change the border color when checked */
}

.copy-text {
    position: relative;
    padding: 5px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 10px;
    display: flex;
}

.copy-text input.text {
    padding: 10px;
    font-size: 18px;
    color: #555;
    border: none;
    outline: none;
}

.copy-text button {
    padding: 10px;
    background: #3d0834;
    color: #fff;
    font-size: 18px;
    border: none;
    outline: none;
    border-radius: 10px;
    cursor: pointer;
}

.copy-text button:active {
    background: #809ce2;
}

.copy-text button:before {
    content: "Copied";
    position: absolute;
    top: -45px;
    right: 0px;
    background: #5c81dc;
    padding: 8px 10px;
    border-radius: 20px;
    font-size: 15px;
    display: none;
}

.copy-text button:after {
    content: "";
    position: absolute;
    top: -20px;
    right: 25px;
    width: 10px;
    height: 10px;
    background: #5c81dc;
    transform: rotate(45deg);
    display: none;
}

.copy-text.active button:before,
.copy-text.active button:after {
    display: block;
}
</style>
