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
                                <h3 class="text-secondary ms-3 mt-2">
                                    <i class="fa-solid fa-route me-2"></i>Traceroute
                                </h3>
                            </div>
                            <div class="d-flex align-items-center me-3">
                                <select class="form-select form-select-sm" style="min-width: 280px;" v-model="selectedSessionId" @change="onSessionChange">
                                    <option value="">— All Sessions —</option>
                                    <option v-for="s in sessions" :key="s.id" :value="s.id">
                                        #{{ s.id }} — {{ s.s_name }} → {{ s.c_name }}
                                    </option>
                                </select>
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

                        <div v-else-if="traceroutes.length === 0" class="text-center text-muted py-5">
                            <i class="fa-solid fa-route fa-3x mb-3" style="color: #8cb63d;"></i>
                            <p class="mt-2">No traceroute data found{{ selectedSessionId ? ' for this session' : '' }}.<br>
                            Data is collected automatically when TWAMP tests run between agents.</p>
                        </div>

                        <div v-else>
                            <div class="table-responsive">
                                <table class="table table-striped table-hover text-center">
                                    <thead>
                                        <tr>
                                            <th><a href="#" class="tableHead">ID</a></th>
                                            <th><a href="#" class="tableHead">Session</a></th>
                                            <th><a href="#" class="tableHead">TTL (Hop)</a></th>
                                            <th><a href="#" class="tableHead">IP Address</a></th>
                                            <th><a href="#" class="tableHead">ASN</a></th>
                                            <th><a href="#" class="tableHead">Hostname</a></th>
                                            <th><a href="#" class="tableHead">RTT (ms)</a></th>
                                            <th><a href="#" class="tableHead">Timestamp</a></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="tr in traceroutes" :key="tr.id">
                                            <td><p class="tableP">{{ tr.id }}</p></td>
                                            <td>
                                                <p class="tableP">
                                                    <a href="#" class="text-decoration-none"
                                                       style="color: #8cb63d;"
                                                       @click.prevent="filterBySession(tr.session_id)">
                                                        #{{ tr.session_id }}
                                                    </a>
                                                    <small class="d-block text-muted" v-if="sessionMap[tr.session_id]">
                                                        {{ sessionMap[tr.session_id] }}
                                                    </small>
                                                </p>
                                            </td>
                                            <td>
                                                <span class="badge bg-secondary">{{ tr.ttl ?? '—' }}</span>
                                            </td>
                                            <td>
                                                <code v-if="tr.address">{{ tr.address }}</code>
                                                <span class="text-muted" v-else>* * *</span>
                                            </td>
                                            <td>
                                                <template v-if="tr.asn_name === 'PRIVATE'">
                                                    <span class="asn-badge asn-private"
                                                          title="RFC1918 / CGNAT / loopback / link-local — no public ASN">
                                                        PRIVATE
                                                    </span>
                                                </template>
                                                <template v-else-if="tr.asn">
                                                    <span class="asn-badge" :class="asnClass(tr.asn)">
                                                        AS{{ tr.asn }}
                                                    </span>
                                                    <small v-if="tr.asn_name" class="d-block text-muted mt-1 asn-name">
                                                        {{ tr.asn_name }}
                                                    </small>
                                                </template>
                                                <template v-else-if="tr.address">
                                                    <span class="asn-badge asn-unknown"
                                                          title="Public IP but ASN lookup unavailable">
                                                        AS&#8209;UNKNOWN
                                                    </span>
                                                </template>
                                                <template v-else>
                                                    <span class="asn-badge asn-unknown">—</span>
                                                </template>
                                            </td>
                                            <td><p class="tableP">{{ tr.hostname || '—' }}</p></td>
                                            <td>
                                                <span v-if="tr.rtt !== null && tr.rtt !== undefined"
                                                      class="hop-badge"
                                                      :class="rttClass(tr.rtt)">
                                                    {{ parseFloat(tr.rtt).toFixed(2) }} ms
                                                </span>
                                                <span v-else class="hop-badge hop-none">N/A</span>
                                            </td>
                                            <td><small class="text-muted">{{ tr.created_at }}</small></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="d-flex justify-content-end mt-3">
                                <div class="pagination">
                                    <button class="prevBtn" :disabled="pages.prev === null"
                                            @click="loadPage(pages.prev)">
                                        <i class="fa-solid fa-angle-left"></i> Prev
                                    </button>
                                    <div class="pageNumber pageBtn">{{ pages.current }}</div>
                                    <button class="nextBtn" :disabled="pages.next === null"
                                            @click="loadPage(pages.next)">
                                        Next <i class="fa-solid fa-angle-right"></i>
                                    </button>
                                </div>
                            </div>
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
import { getTraceroutes } from '../../services/traceroute_services';

export default {
    name: 'Traceroute',
    components: { Header, VueSpinner },
    data() {
        return {
            sessions: [],
            sessionMap: {},
            selectedSessionId: '',
            traceroutes: [],
            loading: false,
            pages: { current: 1, prev: null, next: null },
            asnColorIndex: {},
            asnColorCounter: 0,
        };
    },
    mounted() {
        this.loadSessions().then(() => this.loadTraceroutes(1));
    },
    methods: {
        async loadSessions() {
            try {
                const res = await sessionsList(1, 1000);
                this.sessions = res.data?.sessions || [];
                this.sessions.forEach(s => {
                    this.sessionMap[s.id] = `${s.s_name} → ${s.c_name}`;
                });
            } catch (e) {
                console.error('Failed to load sessions', e);
            }
        },
        async loadTraceroutes(page = 1) {
            this.loading = true;
            try {
                const res = await getTraceroutes(this.selectedSessionId || null, page);
                this.traceroutes = res.data?.traceroutes || [];
                this.pages = {
                    current: page,
                    prev: res.data?.prev ?? null,
                    next: res.data?.next ?? null,
                };
                this.traceroutes.forEach(tr => {
                    if (tr.asn && !(tr.asn in this.asnColorIndex)) {
                        this.asnColorIndex[tr.asn] = this.asnColorCounter++ % 10;
                    }
                });
            } catch (e) {
                this.traceroutes = [];
            } finally {
                this.loading = false;
            }
        },
        onSessionChange() {
            this.asnColorIndex = {};
            this.asnColorCounter = 0;
            this.loadTraceroutes(1);
        },
        filterBySession(sessionId) {
            this.selectedSessionId = String(sessionId);
            this.onSessionChange();
        },
        loadPage(page) {
            if (page !== null) this.loadTraceroutes(page);
        },
        rttClass(rtt) {
            const v = parseFloat(rtt);
            if (v > 100) return 'hop-bad';
            if (v > 50)  return 'hop-warn';
            return 'hop-good';
        },
        asnClass(asn) {
            if (asn in this.asnColorIndex) {
                return `asn-color-${this.asnColorIndex[asn]}`;
            }
            return 'asn-unknown';
        },
    },
};
</script>

<style scoped>
.hop-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
}
.hop-good { background: #d4edda; color: #155724; }
.hop-warn { background: #fff3cd; color: #856404; }
.hop-bad  { background: #f8d7da; color: #721c24; }
.hop-none { background: #e2e3e5; color: #383d41; }

.asn-badge {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.3px;
    white-space: nowrap;
}
.asn-color-0  { background: #e3f2fd; color: #1565c0; }
.asn-color-1  { background: #e8f5e9; color: #2e7d32; }
.asn-color-2  { background: #fff3e0; color: #e65100; }
.asn-color-3  { background: #f3e5f5; color: #7b1fa2; }
.asn-color-4  { background: #e0f7fa; color: #00838f; }
.asn-color-5  { background: #fce4ec; color: #c62828; }
.asn-color-6  { background: #f1f8e9; color: #558b2f; }
.asn-color-7  { background: #e8eaf6; color: #283593; }
.asn-color-8  { background: #fff8e1; color: #f57f17; }
.asn-color-9  { background: #efebe9; color: #4e342e; }
.asn-unknown  { background: #f5f5f5; color: #9e9e9e; }
.asn-private  { background: #eef1f6; color: #4a5568; font-style: italic; }
.asn-name     { font-size: 10px; letter-spacing: 0.2px; }
</style>
