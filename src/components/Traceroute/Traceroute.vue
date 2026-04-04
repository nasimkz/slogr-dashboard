<template>
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
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h3 class="text-secondary ms-3 mt-2">Traceroute</h3>
                            </div>
                            <div class="d-flex align-items-center">
                                <h6 class="mx-1 mt-2 text-muted">Home</h6>
                                <h6 class="me-4 mt-2"> - Traceroute</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container-fluid tableDiv">
                <div class="card mx-md-2 mt-4 mb-2">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <div class="col-md-4">
                                <select class="form-select" v-model="selectedSessionId" @change="loadTraceroute">
                                    <option value="">— Select a session —</option>
                                    <option v-for="s in sessions" :key="s.id" :value="s.id">
                                        {{ s.s_name }} → {{ s.c_name }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card mx-md-2 mt-2 mb-5">
                    <div class="card-body">
                        <div class="text-center m-5" v-if="loading">
                            <VueSpinner size="80" color="#8cb63d" />
                        </div>
                        <div v-else-if="!selectedSessionId" class="text-center text-muted py-5">
                            <i class="fa-solid fa-route fa-3x mb-3"></i>
                            <p>Select a session above to view its traceroute data.</p>
                        </div>
                        <div v-else-if="hops.length === 0" class="text-center text-muted py-5">
                            <i class="fa-solid fa-circle-xmark fa-3x mb-3 text-warning"></i>
                            <p>No traceroute data available for this session yet.<br>
                            Data will appear here once the agent completes a traceroute run.</p>
                        </div>
                        <div class="table-responsive" v-else>
                            <table class="table table-striped table-hover text-center">
                                <thead>
                                    <tr>
                                        <th scope="col"><a href="#" class="tableHead">Hop</a></th>
                                        <th scope="col"><a href="#" class="tableHead">IP Address</a></th>
                                        <th scope="col"><a href="#" class="tableHead">Hostname</a></th>
                                        <th scope="col"><a href="#" class="tableHead">RTT 1 (ms)</a></th>
                                        <th scope="col"><a href="#" class="tableHead">RTT 2 (ms)</a></th>
                                        <th scope="col"><a href="#" class="tableHead">RTT 3 (ms)</a></th>
                                        <th scope="col"><a href="#" class="tableHead">ASN</a></th>
                                        <th scope="col"><a href="#" class="tableHead">Organization</a></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="hop in hops" :key="hop.hop">
                                        <td><p class="tableP">{{ hop.hop }}</p></td>
                                        <td><p class="tableP">{{ hop.ip || '*' }}</p></td>
                                        <td><p class="tableP">{{ hop.hostname || '*' }}</p></td>
                                        <td><p class="tableP">{{ hop.rtt1 !== null ? hop.rtt1 + ' ms' : '*' }}</p></td>
                                        <td><p class="tableP">{{ hop.rtt2 !== null ? hop.rtt2 + ' ms' : '*' }}</p></td>
                                        <td><p class="tableP">{{ hop.rtt3 !== null ? hop.rtt3 + ' ms' : '*' }}</p></td>
                                        <td><p class="tableP">{{ hop.asn || '—' }}</p></td>
                                        <td><p class="tableP">{{ hop.org || '—' }}</p></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '../common/Header.vue';
import { VueSpinner } from 'vue3-spinners';
import { sessionsList } from '../../services/sessions_services';
import { getTraceroute } from '../../services/traceroute_services';

export default {
    name: 'Traceroute',
    components: {
        Header,
        VueSpinner,
    },
    data() {
        return {
            sessions: [],
            selectedSessionId: '',
            hops: [],
            loading: false,
        };
    },
    mounted() {
        this.loadSessions();
    },
    methods: {
        async loadSessions() {
            try {
                const res = await sessionsList(1, 1000);
                this.sessions = res.data?.sessions || [];
            } catch (error) {
                console.error('Failed to load sessions', error);
            }
        },
        async loadTraceroute() {
            if (!this.selectedSessionId) {
                this.hops = [];
                return;
            }
            this.loading = true;
            try {
                const res = await getTraceroute(this.selectedSessionId);
                this.hops = res.data?.hops || [];
            } catch (error) {
                this.hops = [];
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>
