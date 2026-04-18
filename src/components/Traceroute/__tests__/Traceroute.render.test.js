/**
 * Traceroute.vue render test — proves the ASN column correctly distinguishes
 * PRIVATE / public-resolved / public-unresolved / star hops.
 *
 * Fixture is a real response shape from Enterprise tracerouteController::bySession(),
 * captured during D0 integration test (2026-04-18) against live stack.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Traceroute from '../Traceroute.vue'

// Stub the service modules so the component doesn't try to hit a real API.
vi.mock('../../../services/sessions_services', () => ({
    sessionsList: vi.fn(() => Promise.resolve({ data: { sessions: [] } })),
}))

vi.mock('../../../services/traceroute_services', () => ({
    getTraceroutes: vi.fn(() => Promise.resolve({
        data: {
            count: 5,
            traceroutes: [
                { id: 1, session_id: 1, ttl: 1, address: '192.168.1.1',  asn: null,  asn_name: 'PRIVATE', hostname: null, rtt: 1.2,  loss_pct: 0,   created_at: '2026-04-18 09:37:07', direction: 'UPLINK' },
                { id: 2, session_id: 1, ttl: 2, address: '10.0.0.1',     asn: null,  asn_name: 'PRIVATE', hostname: null, rtt: 3.5,  loss_pct: 0,   created_at: '2026-04-18 09:37:07', direction: 'UPLINK' },
                { id: 3, session_id: 1, ttl: 3, address: null,           asn: null,  asn_name: null,      hostname: null, rtt: null, loss_pct: 100, created_at: '2026-04-18 09:37:07', direction: 'UPLINK' },
                { id: 4, session_id: 1, ttl: 4, address: '142.251.49.8', asn: 15169, asn_name: 'GOOGLE',  hostname: null, rtt: 12.3, loss_pct: 0,   created_at: '2026-04-18 09:37:07', direction: 'UPLINK' },
                { id: 5, session_id: 1, ttl: 5, address: '203.0.113.1',  asn: null,  asn_name: null,      hostname: null, rtt: 22.0, loss_pct: 0,   created_at: '2026-04-18 09:37:07', direction: 'UPLINK' },
            ],
            next: null,
            prev: null,
        },
    })),
    getTracerouteBySession: vi.fn(),
}))

// Stub the Header component — it imports router/auth that aren't relevant here.
vi.mock('../../common/Header.vue', () => ({
    default: { name: 'HeaderStub', template: '<div class="header-stub"></div>' },
}))

// Stub the spinner (optional visual component).
vi.mock('vue3-spinners', () => ({
    VueSpinner: { name: 'VueSpinnerStub', template: '<div class="spinner-stub"></div>' },
}))

describe('Traceroute.vue — ASN cell renders each case distinctly', () => {
    let wrapper
    beforeEach(async () => {
        wrapper = mount(Traceroute)
        // Let the async loadSessions + loadTraceroutes resolve.
        await wrapper.vm.$nextTick()
        await new Promise(resolve => setTimeout(resolve, 0))
        await wrapper.vm.$nextTick()
    })

    it('renders 5 hop rows', () => {
        const rows = wrapper.findAll('tbody tr')
        expect(rows).toHaveLength(5)
    })

    it('RFC1918 hop (TTL 1) renders PRIVATE badge, no numeric ASN', () => {
        const row = wrapper.findAll('tbody tr')[0]
        const html = row.html()
        expect(html).toContain('PRIVATE')
        expect(row.find('.asn-private').exists()).toBe(true)
        // Should NOT contain "AS" prefix for this hop's ASN cell
        const asnCell = row.findAll('td')[4]
        expect(asnCell.text()).not.toMatch(/AS\d/)
    })

    it('CGNAT hop (TTL 2, 10.0.0.1) renders PRIVATE badge', () => {
        const row = wrapper.findAll('tbody tr')[1]
        expect(row.html()).toContain('PRIVATE')
        expect(row.find('.asn-private').exists()).toBe(true)
    })

    it('star hop (TTL 3, null IP) shows timeout marker, no PRIVATE', () => {
        const row = wrapper.findAll('tbody tr')[2]
        const ipCell = row.findAll('td')[3]
        const asnCell = row.findAll('td')[4]
        expect(ipCell.text()).toContain('* * *')
        expect(asnCell.html()).not.toContain('PRIVATE')
        expect(asnCell.html()).not.toMatch(/AS\d/)
        expect(asnCell.text().trim()).toBe('—')
    })

    it('public hop (TTL 4, 8.8.8.8 → GOOGLE) shows AS number AND ISP name', () => {
        const row = wrapper.findAll('tbody tr')[3]
        const asnCell = row.findAll('td')[4]
        expect(asnCell.text()).toContain('AS15169')
        expect(asnCell.text()).toContain('GOOGLE')
        expect(asnCell.find('.asn-name').exists()).toBe(true)
    })

    it('public hop with failed ASN lookup (TTL 5) shows AS-UNKNOWN', () => {
        const row = wrapper.findAll('tbody tr')[4]
        const asnCell = row.findAll('td')[4]
        const text = asnCell.text()
        // "AS-UNKNOWN" uses a non-breaking hyphen (&#8209;) in the template
        expect(text).toMatch(/AS.UNKNOWN/)
        expect(asnCell.find('.asn-unknown').exists()).toBe(true)
    })

    it('IP column preserves raw IP for non-null hops', () => {
        const rows = wrapper.findAll('tbody tr')
        expect(rows[0].findAll('td')[3].text()).toContain('192.168.1.1')
        expect(rows[1].findAll('td')[3].text()).toContain('10.0.0.1')
        expect(rows[3].findAll('td')[3].text()).toContain('142.251.49.8')
        expect(rows[4].findAll('td')[3].text()).toContain('203.0.113.1')
    })

    it('CSS class .asn-private exists in component styles', () => {
        // Style is scoped, so it lands on a <style scoped> block.
        // We check the rendered DOM has the class applied on the PRIVATE element.
        const privateEl = wrapper.find('.asn-private')
        expect(privateEl.exists()).toBe(true)
        expect(privateEl.text()).toBe('PRIVATE')
    })
})
