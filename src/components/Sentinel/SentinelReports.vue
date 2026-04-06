<template>
    <div class="pageHeight">
        <div class="bg">
            <Header />
            <div class="container-fluid sentinel mt-2">
                <div class="d-flex justify-content-end">
                    <h1 class="me-2">
                        <RouterLink to="/sessions"> <i class="fa-solid fa-xmark fa-xs" style="color: #d8dce2;"></i>
                        </RouterLink>
                    </h1>
                </div>
            </div>
            <div class="container-fluid">
                <div class="card mx-md-2">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center ">
                            <div>
                                <h3 class="text-muted ms-3 mt-2">{{ serverData.name }} <i class="fa-solid fa-arrow-right mx-2"></i> {{ clientData.name }} </h3>
                            </div>
                            <div class="">
                                <div class="mx-3"><button @click="handleRunTest" class="btn btn-link p-0" :disabled="runningTest" title="Run test now"><i class="fa-solid fa-rotate-right fa-rotate-270 fa-2xl"></i></button></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container-fluid">
                <div class="row g-2 mx-md-2 mt-4 mb-4">
                    <div class="col-lg-3">
                        <div class="card h-100">
                            <div class="text-center m-5" v-if="loading">
                                <VueSpinner size="100" color="#8cb63d" />
                            </div>
                            <div class="card-body" v-else>
                                <p class="card-text ms-3">Server</p>
                                <span class="card-text text-secondary ms-3">{{ serverData.name }}</span> <br>
                                <hr class="hr">
                                <p class="card-text ms-3">System</p>
                                <span class="card-text text-secondary ms-3">{{ serverData.platform }}</span>
                                <hr class="hr">
                                <p class="card-text ms-3">Organization</p>
                                <span class="card-text text-secondary ms-3">{{ serverData.Organization }}</span>
                                <hr class="hr">
                                <p class="card-text ms-3">Location</p>
                                <span class="card-text text-secondary ms-3">{{ serverData.location }}</span>
                                <hr class="hr">
                                <p class="card-text ms-3">Country</p>
                                <span class="card-text text-secondary ms-3">{{ serverData.Country }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <div class="card pb-3 h-100">
                            <div class="text-center m-5" v-if="loading">
                                <VueSpinner size="100" color="#8cb63d" />
                            </div>
                            <div class="card-body" v-else>
                                <p class="card-text ms-3">Client</p>
                                <span class="card-text text-secondary ms-3">{{ clientData.name }} </span> <br>
                                <hr class="hr">
                                <p class="card-text ms-3">System</p>
                                <span class="card-text text-secondary ms-3">{{ clientData.platform }}</span>
                                <hr class="hr">
                                <p class="card-text ms-3">Organization</p>
                                <span class="card-text text-secondary ms-3">{{ clientData.Organization }}</span>
                                <hr class="hr">
                                <p class="card-text ms-3">Location</p>
                                <span class="card-text text-secondary ms-3">{{ clientData.location }}</span>
                                <hr class="hr">
                                <p class="card-text ms-3">Country</p>
                                <span class="card-text text-secondary ms-3">{{ clientData.Country }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="card h-100">
                            <div class="text-center m-5" v-if="loading2">
                                <VueSpinner size="100" color="#8cb63d" />
                            </div>
                            <div class="card-body" v-else>
                                <perfect-scrollbar>
                                    <div class="table-responsive">
                                        <table class="table text-center">
                                            <thead>
                                                <tr>
                                                    <th><a href="#" class="tableHead text-muted">UP <br> Min /Max /Sdev</a></th>
                                                    <th><a href="#" class="tableHead text-muted"> DOWN <br> Min /Max /Sdev</a></th>
                                                    <th><a href="#" class="tableHead text-muted">RTT <br> Min /Max /Sdev</a></th>
                                                    <th><a href="#" class="tableHead text-muted"> JITTER <br> Min /Max /Sdev</a></th>
                                                    <th style="font-size: 18px; color: darkgray;"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="data in analyticsData" :key="data.id">
                                                    <td>
                                                        <p class="tableP css">{{ data?.avg_up }}</p>
                                                        <p class="css fw-lighter"> {{ data.min_up }}/ {{ data.max_up }} /{{ data.st_up }}</p>
                                                    </td>
                                                    <td>
                                                        <p class="tableP css">{{ data.avg_down }}</p>
                                                        <p class="css fw-lighter">{{ data.min_down }}/ {{ data.max_down }} /{{ data.st_down }}</p>
                                                    </td>
                                                    <td>
                                                        <p class="tableP css">{{ data.avg_rtt }}</p>
                                                        <p class="css fw-lighter">{{ data.min_rtt }}/ {{ data.max_rtt }} /{{ data.st_rtt }}</p>
                                                    </td>
                                                    <td>
                                                        <p class="tableP css">{{ data.avg_jitter }}</p>
                                                        <p class="css fw-lighter">{{ data.min_jitter }} / {{ data.max_jitter }}</p>
                                                    </td>
                                                    <td class="fs-5"><a href="#" class="text-decoration-none text-dark tableP">
                                                            <i class="fa-solid fa-ellipsis"></i></a></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </perfect-scrollbar>
                                <div class="d-flex justify-content-end mt-3">
                                    <div>
                                        <div class="pagination">
                                            <button class="prevBtn" :disabled="pages.previousPage === 0"
                                                v-on:click="handleSessionResults(pages.previousPage)"><i
                                                    class="fa-solid fa-angle-left"></i> Prev</button>
                                            <div class="pageNumber">-</div>
                                            <div class="pageNumber">-</div>
                                            <div class="pageNumber pageBtn">{{ pages.currentPage }}</div>
                                            <div class="pageNumber">-</div>
                                            <div class="pageNumber">-</div>
                                            <button class="nextBtn" :disabled="pages.nextPage === 0"
                                                v-on:click="handleSessionResults(pages.nextPage)">Next <i
                                                    class="fa-solid fa-angle-right"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container-fluid tableDiv">
                <div v-if="chartError" class="alert alert-warning mx-md-2">
                    Charts could not be loaded.
                </div>
                <div class="row g-2 mx-md-2 mb-5">
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body">
                                <figure class="highcharts-figure">
                                    <div id="container"></div>
                                </figure>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body">
                                <figure class="highcharts-figure">
                                    <div id="container2"></div>
                                </figure>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body">
                                <figure class="highcharts-figure">
                                    <div id="container3"></div>
                                </figure>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- FE-120: Correlation Graph & Path Ribbon -->
                <div class="card mx-md-2 mb-5">
                    <div class="card-body">
                        <div class="correlation-header">
                            <h5 class="correlation-title">Path Correlation</h5>
                            <div class="time-range-selector">
                                <button v-for="range in ['1h','6h','24h']" :key="range" @click="selectedTimeRange = range" :class="['range-btn', { active: selectedTimeRange === range }]">{{ range }}</button>
                            </div>
                        </div>

                        <div v-if="correlationLoading" class="correlation-loading">
                            <div class="spinner-border spinner-border-sm text-success"></div>
                            <span>Loading path correlation...</span>
                        </div>

                        <div v-else-if="correlationError" class="correlation-error">
                            <i class="fa-solid fa-circle-exclamation me-2"></i>{{ correlationError }}
                        </div>

                        <div v-else-if="!correlationData || !correlationData.series?.length" class="correlation-empty">
                            <i class="fa-solid fa-chart-line me-2"></i>No path correlation data for this time range.
                        </div>

                        <div v-else>
                            <div id="correlationChart"></div>

                            <div class="correlation-legend">
                                <span class="legend-item"><span class="legend-dot baseline-dot"></span> Baseline path</span>
                                <span class="legend-item"><span class="legend-dot alternate-dot"></span> Alternate path</span>
                                <span class="legend-item"><span class="legend-line-dash"></span> Path change</span>
                            </div>

                            <!-- Path Ribbon -->
                            <div v-if="selectedPath" class="path-ribbon">
                                <div class="ribbon-header">
                                    <span class="ribbon-timestamp">Path at {{ formattedSelectedTime }}</span>
                                    <span v-if="selectedSegment?.is_baseline" class="ribbon-badge badge-baseline">Baseline</span>
                                    <span v-else class="ribbon-badge badge-alternate">Alternate</span>
                                    <span v-if="selectedSegment?.is_current" class="ribbon-badge badge-current">Current</span>
                                </div>
                                <div class="asn-chain">
                                    <div class="asn-pill asn-endpoint">Source</div>
                                    <template v-for="(hop, idx) in selectedPath.asn_chain" :key="idx">
                                        <div class="asn-arrow">→</div>
                                        <div class="asn-pill asn-hop">
                                            <span class="asn-number">AS{{ hop.asn }}</span>
                                            <span class="asn-name">{{ hop.name }}</span>
                                        </div>
                                    </template>
                                    <div class="asn-arrow">→</div>
                                    <div class="asn-pill asn-endpoint">Target</div>
                                </div>
                                <div v-if="!selectedPath.asn_chain?.length" class="asn-empty">No ASN chain data for this path.</div>
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
import Header from '../common/Header.vue'
import { getSessionsResults, runSession } from '../../../src/services/sessions_services';
import { getSessionsDetails } from '../../services/agents_reports_services'
import { getPathCorrelation } from '../../services/correlation_services'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'
import { VueSpinner } from 'vue3-spinners';
import moment from 'moment'
import Highcharts from 'highcharts'
import { createToast } from 'mosha-vue-toastify';
import 'mosha-vue-toastify/dist/style.css';

export default {
    name: 'SentinelReports',
    components: { Header, RouterLink, PerfectScrollbar, VueSpinner },
    created: function () { this.moment = moment; },
    data() {
        return {
            analyticsData: [],
            clientData: [],
            serverData: [],
            loading: false,
            loading2: false,
            pages: { currentPage: 1, previousPage: 1, nextPage: 1 },
            Up: [],
            DownLink: [],
            Rtt: [],
            runningTest: false,
            chartError: false,
            // FE-120
            correlationData: null,
            correlationLoading: false,
            correlationError: null,
            selectedTimeRange: '1h',
            selectedTimestamp: null,
            selectedPathId: null,
            correlationChart: null,
        }
    },
    computed: {
        selectedPath() {
            if (!this.correlationData || !this.selectedPathId) return null
            return this.correlationData.paths?.[this.selectedPathId] || null
        },
        selectedSegment() {
            if (!this.correlationData || !this.selectedPathId) return null
            return (this.correlationData.segments || []).find(s => s.path_id === this.selectedPathId) || null
        },
        formattedSelectedTime() {
            if (!this.selectedTimestamp) return ''
            return new Date(this.selectedTimestamp).toLocaleString()
        }
    },
    watch: {
        selectedTimeRange() { this.fetchCorrelation() }
    },
    mounted() {
        this.handleSessionResults()
        this.SessionsDetails()
        this.fetchCorrelation()
    },
    beforeDestroy() {
        if (this.correlationChart) { this.correlationChart.destroy(); this.correlationChart = null }
    },
    methods: {
        async handleSessionResults(page = 1) {
            let id = this.$route.params.id
            try {
                this.loading2 = true;
                let res = await getSessionsResults(id, page)
                this.analyticsData = res.data.analytics
                this.pages.previousPage = res?.data?.prev || 0
                this.pages.currentPage = this.pages.previousPage + 1
                this.pages.nextPage = res?.data?.next || 0
            } catch (error) {
                // session results fetch failed
            } finally {
                this.loading2 = false;
            }
        },
        async handleRunTest() {
            let id = this.$route.params.id;
            this.runningTest = true;
            try {
                await runSession(id);
                createToast('Test re-queued successfully', { type: 'success', position: 'top-right', transition: 'zoom' });
            } catch (error) {
                createToast('Failed to re-queue test', { type: 'danger', position: 'top-right', transition: 'zoom' });
            } finally {
                this.runningTest = false;
            }
        },
        async SessionsDetails() {
            let id = this.$route.params.id
            try {
                this.loading = true;
                let res = await getSessionsDetails(id)
                this.clientData = res.data.client
                this.serverData = res.data.server
                this.Up = res.data.uplink
                this.DownLink = res.data.downlink
                this.Rtt = res.data.rtt
                try { await this.loadCharts(); } catch (chartErr) { this.chartError = true; }
            } catch (error) {
                // session details load failed
            } finally {
                this.loading = false;
            }
        },
        async loadCharts() {
            const categories = this.Up.map(data => moment(data.date).format('MMMM Do YYYY, h:mm:ss a'))
            const value = this.Up.map(data => parseFloat(data.value))
            Highcharts.chart('container', {
                title: { text: 'UPLINK', align: 'center' },
                colors: ['#4caefe','#3fbdf3','#35c3e8','#2bc9dc','#20cfe1','#16d4e6','#0dd9db','#03dfd0','#00e4c5','#00e9ba','#00eeaf','#23e274'],
                xAxis: { type: 'datetime', categories: categories.reverse(), min: 0, max: 30, scrollbar: { enabled: true }, reversed: true, labels: { enabled: false } },
                series: [{ type: 'column', name: 'Uplink Data', borderRadius: 1, colorByPoint: true, data: value.reverse(), showInLegend: false }]
            });
            const categories2 = this.DownLink.map(data => moment(data.date).format('MMMM Do YYYY, h:mm:ss a'))
            const value2 = this.DownLink.map(data => parseFloat(data.value))
            Highcharts.chart('container2', {
                title: { text: 'DOWNLINK', align: 'center' },
                colors: ['#4caefe','#3fbdf3','#35c3e8','#2bc9dc','#20cfe1','#16d4e6','#0dd9db','#03dfd0','#00e4c5','#00e9ba','#00eeaf','#23e274'],
                xAxis: { type: 'datetime', categories: categories2.reverse(), min: 0, max: 30, scrollbar: { enabled: true }, reversed: true, labels: { enabled: false } },
                series: [{ type: 'column', name: 'Downlink Data', borderRadius: 1, colorByPoint: true, data: value2.reverse(), showInLegend: false }]
            });
            const categories3 = this.Rtt.map(data => moment(data.date).format('MMMM Do YYYY, h:mm:ss a'))
            const value3 = this.Rtt.map(data => parseFloat(data.value))
            Highcharts.chart('container3', {
                title: { text: 'RTT', align: 'center' },
                colors: ['#4caefe','#3fbdf3','#35c3e8','#2bc9dc','#20cfe1','#16d4e6','#0dd9db','#03dfd0','#00e4c5','#00e9ba','#00eeaf','#23e274'],
                xAxis: { type: 'datetime', categories: categories3.reverse(), min: 0, max: 30, scrollbar: { enabled: true }, reversed: true, labels: { enabled: false } },
                series: [{ type: 'column', name: 'RTT Data', borderRadius: 1, colorByPoint: true, data: value3.reverse(), showInLegend: false }]
            });
        },

        // FE-120: Correlation Graph
        async fetchCorrelation() {
            if (!this.$route.params.id) return
            this.correlationLoading = true
            this.correlationError = null
            const now = new Date()
            const from = new Date(now)
            switch (this.selectedTimeRange) {
                case '1h': from.setHours(from.getHours() - 1); break
                case '6h': from.setHours(from.getHours() - 6); break
                case '24h': from.setDate(from.getDate() - 1); break
            }
            try {
                const res = await getPathCorrelation(this.$route.params.id, from.toISOString(), now.toISOString())
                this.correlationData = res.data
                if (res.data.series?.length > 0) {
                    // Default to current segment or last point
                    const currentSeg = (res.data.segments || []).find(s => s.is_current)
                    if (currentSeg) {
                        const lastInCurrent = [...res.data.series].reverse().find(p => p.path_id === currentSeg.path_id)
                        this.selectedTimestamp = lastInCurrent?.timestamp || res.data.series[res.data.series.length - 1].timestamp
                        this.selectedPathId = currentSeg.path_id
                    } else {
                        const last = res.data.series[res.data.series.length - 1]
                        this.selectedTimestamp = last.timestamp
                        this.selectedPathId = last.path_id
                    }
                }
                this.$nextTick(() => this.renderCorrelationChart())
            } catch (e) {
                this.correlationError = e.response?.data?.error || 'Failed to load correlation data'
            } finally {
                this.correlationLoading = false
            }
        },

        renderCorrelationChart() {
            if (!this.correlationData || !document.getElementById('correlationChart')) return
            const { series, segments } = this.correlationData
            if (!series || series.length === 0) return

            const plotBands = (segments || []).map(seg => ({
                from: new Date(seg.start_time).getTime(),
                to: seg.end_time ? new Date(seg.end_time).getTime() : new Date(series[series.length - 1].timestamp).getTime(),
                color: seg.is_baseline ? 'rgba(255,255,255,0.03)' : 'rgba(254,252,191,0.08)',
            }))

            const plotLines = []
            for (let i = 1; i < (segments || []).length; i++) {
                if (segments[i].path_id !== segments[i - 1].path_id) {
                    plotLines.push({
                        value: new Date(segments[i].start_time).getTime(),
                        color: 'rgba(156,163,175,0.5)',
                        width: 1,
                        dashStyle: 'Dash',
                    })
                }
            }

            if (this.correlationChart) { this.correlationChart.destroy(); this.correlationChart = null }

            const self = this
            this.correlationChart = Highcharts.chart('correlationChart', {
                chart: { backgroundColor: 'transparent', height: 220 },
                title: { text: null },
                xAxis: {
                    type: 'datetime',
                    lineColor: '#1E2835', tickColor: '#1E2835',
                    labels: { style: { color: '#6b7280' } },
                    plotBands, plotLines,
                    crosshair: { color: '#8cb63d', dashStyle: 'Solid', width: 1 }
                },
                yAxis: {
                    title: { text: null },
                    gridLineColor: '#1E2835',
                    labels: { style: { color: '#6b7280' }, format: '{value}ms' },
                },
                legend: { enabled: false },
                tooltip: {
                    backgroundColor: '#121821', borderColor: '#1E2835',
                    style: { color: '#d1d5db' },
                    formatter: function () { return `<b>${new Date(this.x).toLocaleTimeString()}</b><br/>Latency: ${this.y}ms` }
                },
                series: [{
                    name: 'Latency',
                    data: series.map(p => [new Date(p.timestamp).getTime(), p.latency]),
                    color: '#8cb63d', lineWidth: 2, marker: { enabled: false },
                    point: {
                        events: {
                            click: function () {
                                const ts = new Date(this.x).toISOString()
                                const pt = series.find(s => new Date(s.timestamp).getTime() === this.x)
                                if (pt) { self.selectedTimestamp = pt.timestamp; self.selectedPathId = pt.path_id }
                            }
                        }
                    }
                }],
                credits: { enabled: false },
            })
        },
    },
}
</script>

<style>
.ps { height: 300px; }
.hr { margin: 0.4rem 0; color: inherit; border: 0; border-top: var(--bs-border-width) solid; opacity: 0.25; }
#container, #container2, #container3 { height: 400px; }
.highcharts-figure, .highcharts-data-table table { min-width: 320px; max-width: 800px; margin: 1em auto; }
.highcharts-data-table table { font-family: Verdana, sans-serif; border-collapse: collapse; border: 1px solid #ebebeb; margin: 10px auto; text-align: center; width: 100%; max-width: 500px; }
.highcharts-data-table caption { padding: 1em 0; font-size: 1.2em; color: #555; }
.highcharts-data-table th { font-weight: 600; padding: 0.5em; }
.highcharts-data-table td, .highcharts-data-table th, .highcharts-data-table caption { padding: 0.5em; }
.highcharts-data-table thead tr, .highcharts-data-table tr:nth-child(even) { background: #f8f8f8; }
.highcharts-data-table tr:hover { background: #f1f7ff; }

/* FE-120 Correlation */
.correlation-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.correlation-title { color: #6b7280; margin: 0; font-size: 1rem; font-weight: 600; }
.time-range-selector { display: flex; gap: 4px; }
.range-btn { background: #f3f3f3; color: #6b7280; border: 1px solid #ddd; border-radius: 6px; padding: 4px 12px; font-size: 0.8rem; cursor: pointer; }
.range-btn.active { background: #8cb63d22; color: #8cb63d; border-color: #8cb63d66; }
.range-btn:hover:not(.active) { background: #eee; color: #333; }
.correlation-loading { display: flex; align-items: center; gap: 12px; color: #6b7280; padding: 40px 0; justify-content: center; }
.correlation-error { color: #dc2626; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px 16px; margin: 16px 0; }
.correlation-empty { color: #9ca3af; text-align: center; padding: 40px 0; }
#correlationChart { margin-bottom: 8px; }
.correlation-legend { display: flex; gap: 20px; margin-bottom: 16px; padding: 0 4px; }
.legend-item { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; color: #6b7280; }
.legend-dot { width: 12px; height: 12px; border-radius: 2px; }
.baseline-dot { background: rgba(255,255,255,0.2); border: 1px solid rgba(0,0,0,0.1); }
.alternate-dot { background: rgba(254,252,191,0.6); border: 1px solid rgba(254,252,191,1); }
.legend-line-dash { width: 16px; height: 0; border-top: 2px dashed #9ca3af; }

/* Path Ribbon */
.path-ribbon { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; }
.ribbon-header { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
.ribbon-timestamp { color: #6b7280; font-size: 0.85rem; }
.ribbon-badge { font-size: 0.7rem; padding: 2px 8px; border-radius: 999px; font-weight: 600; }
.badge-baseline { background: #dbeafe; color: #1d4ed8; }
.badge-alternate { background: #fef3c7; color: #92400e; }
.badge-current { background: #dcfce7; color: #16a34a; }
.asn-chain { display: flex; align-items: center; gap: 6px; overflow-x: auto; padding-bottom: 4px; }
.asn-chain::-webkit-scrollbar { height: 4px; }
.asn-chain::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 2px; }
.asn-pill { display: flex; flex-direction: column; align-items: center; padding: 8px 14px; border-radius: 8px; white-space: nowrap; min-width: 80px; }
.asn-endpoint { background: #8cb63d22; border: 1px solid #8cb63d44; color: #8cb63d; font-weight: 600; font-size: 0.85rem; }
.asn-hop { background: white; border: 1px solid #e5e7eb; }
.asn-number { font-size: 0.7rem; color: #6b7280; font-family: monospace; }
.asn-name { font-size: 0.85rem; color: #111827; font-weight: 500; }
.asn-arrow { color: #9ca3af; font-size: 1rem; flex-shrink: 0; }
.asn-empty { color: #9ca3af; font-size: 0.85rem; text-align: center; padding: 12px; }
</style>
