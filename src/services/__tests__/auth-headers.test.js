import { describe, it, expect, vi, beforeEach } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const servicesDir = resolve(__dirname, '..')

const authServiceFiles = [
    'alerts_services.js',
    'group_services.js',
    'monitor_profile_Services.js',
    'organization_services.js',
    'reports_services.js',
]

describe('Auth header pattern — static capture removed', () => {
    it.each(authServiceFiles)('%s must not capture token at module load time', (filename) => {
        const content = readFileSync(resolve(servicesDir, filename), 'utf-8')
        // The broken pattern: let TOKEN = getToken() at module scope
        // followed by let HEADERS = { "Authorization": `Bearer ${TOKEN}` }
        expect(content).not.toMatch(/^let TOKEN\s*=/m)
        expect(content).not.toMatch(/^let HEADERS\s*=/m)
        expect(content).not.toMatch(/^var TOKEN\s*=/m)
        expect(content).not.toMatch(/^var HEADERS\s*=/m)
    })

    it.each(authServiceFiles)('%s must define getHeaders as a function', (filename) => {
        const content = readFileSync(resolve(servicesDir, filename), 'utf-8')
        expect(content).toMatch(/const getHeaders\s*=\s*\(\s*\)\s*=>/)
    })

    it.each(authServiceFiles)('%s must call getHeaders() on every axios call', (filename) => {
        const content = readFileSync(resolve(servicesDir, filename), 'utf-8')
        // Count axios calls and getHeaders() invocations — they must match
        const axiosCalls = (content.match(/axios\.(get|post|put|patch|delete)\(/g) || []).length
        const getHeadersCalls = (content.match(/getHeaders\(\)/g) || []).length
        expect(axiosCalls).toBeGreaterThan(0)
        expect(getHeadersCalls).toBe(axiosCalls)
    })
})

describe('reports_services.js — auth headers added', () => {
    it('imports store', () => {
        const content = readFileSync(resolve(servicesDir, 'reports_services.js'), 'utf-8')
        expect(content).toMatch(/import store from/)
    })

    it('all 5 functions include auth headers', () => {
        const content = readFileSync(resolve(servicesDir, 'reports_services.js'), 'utf-8')
        const axiosCalls = (content.match(/axios\.(get|post)\(/g) || []).length
        const getHeadersCalls = (content.match(/getHeaders\(\)/g) || []).length
        expect(axiosCalls).toBe(5)
        expect(getHeadersCalls).toBe(5)
    })
})
