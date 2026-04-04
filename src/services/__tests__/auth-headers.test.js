import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const servicesDir = resolve(__dirname, '..')

const apiServiceFiles = [
    'alerts_services.js',
    'group_services.js',
    'monitor_profile_Services.js',
    'organization_services.js',
    'reports_services.js',
    'sessions_services.js',
    'traceroute_services.js',
    'agents_reports_services.js',
    'agent_services.js',
]

describe('All service files use apiClient (no manual auth headers)', () => {
    it.each(apiServiceFiles)('%s imports apiClient, not raw axios', (filename) => {
        const content = readFileSync(resolve(servicesDir, filename), 'utf-8')
        expect(content).toMatch(/import apiClient from ['"]\.\/apiClient['"]/)
        expect(content).not.toMatch(/^import axios from/m)
    })

    it.each(apiServiceFiles)('%s has no getHeaders() function', (filename) => {
        const content = readFileSync(resolve(servicesDir, filename), 'utf-8')
        expect(content).not.toMatch(/const getHeaders\s*=/)
        expect(content).not.toMatch(/let HEADERS\s*=/)
    })

    it.each(apiServiceFiles)('%s has no manual Authorization header construction', (filename) => {
        const content = readFileSync(resolve(servicesDir, filename), 'utf-8')
        expect(content).not.toMatch(/Authorization.*Bearer/)
    })

    it.each(apiServiceFiles)('%s uses apiClient for all HTTP calls', (filename) => {
        const content = readFileSync(resolve(servicesDir, filename), 'utf-8')
        // All get/post calls should be on apiClient, not axios
        expect(content).not.toMatch(/\baxios\.(get|post|put|delete|patch)\(/)
    })
})

describe('apiClient has no hardcoded base URL', () => {
    it('apiClient.js reads baseURL from env var', () => {
        const content = readFileSync(resolve(servicesDir, 'apiClient.js'), 'utf-8')
        expect(content).toMatch(/VITE_BASE_URL/)
        expect(content).not.toMatch(/https?:\/\/[a-z]/)
    })
})
