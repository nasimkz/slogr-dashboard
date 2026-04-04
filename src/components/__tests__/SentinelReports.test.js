import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const sentinelFile = resolve(__dirname, '..', 'Sentinel', 'SentinelReports.vue')

describe('SentinelReports.vue — Highcharts', () => {
    it('imports Highcharts from the npm package (not global)', () => {
        const content = readFileSync(sentinelFile, 'utf-8')
        expect(content).toMatch(/import Highcharts from ['"]highcharts['"]/)
    })

    it('does not reference window.Highcharts', () => {
        const content = readFileSync(sentinelFile, 'utf-8')
        expect(content).not.toMatch(/window\.Highcharts/)
    })

    it('Highcharts.chart calls use the imported Highcharts', () => {
        const content = readFileSync(sentinelFile, 'utf-8')
        // Confirm Highcharts.chart is used (not the old global pattern)
        expect(content).toMatch(/Highcharts\.chart\(/)
    })
})

describe('SentinelReports.vue — chartError state', () => {
    it('declares chartError in data()', () => {
        const content = readFileSync(sentinelFile, 'utf-8')
        expect(content).toMatch(/chartError\s*:\s*false/)
    })

    it('sets chartError to true in catch block', () => {
        const content = readFileSync(sentinelFile, 'utf-8')
        expect(content).toMatch(/chartError\s*=\s*true/)
    })

    it('renders chartError state in template', () => {
        const content = readFileSync(sentinelFile, 'utf-8')
        expect(content).toMatch(/v-if="chartError"/)
    })
})
