import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const servicesDir = resolve(__dirname, '..')

const serviceFiles = [
    'alerts_services.js',
    'group_services.js',
    'monitor_profile_Services.js',
    'organization_services.js',
    'reports_services.js',
    'sessions_services.js',
]

describe('No credentials in service files', () => {
    it.each(serviceFiles)('%s must not contain a JWT token', (filename) => {
        const content = readFileSync(resolve(servicesDir, filename), 'utf-8')
        // JWT tokens start with eyJ (base64 for {"  )
        expect(content).not.toMatch(/eyJ[A-Za-z0-9_-]{20,}/)
    })

    it.each(serviceFiles)('%s must not contain hardcoded Bearer tokens', (filename) => {
        const content = readFileSync(resolve(servicesDir, filename), 'utf-8')
        // Should not have a static string assigned as a Bearer token value
        expect(content).not.toMatch(/Bearer\s+eyJ/)
    })
})
