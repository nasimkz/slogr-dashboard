import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const srcDir = resolve(__dirname, '..')

describe('No hardcoded credentials in main.js', () => {
    it('must not contain Auth0 domain literal', () => {
        const content = readFileSync(resolve(srcDir, 'main.js'), 'utf-8')
        expect(content).not.toMatch(/\.auth0\.com/)
    })

    it('must not contain Auth0 clientId literal', () => {
        const content = readFileSync(resolve(srcDir, 'main.js'), 'utf-8')
        // Hardcoded client ID was "mB5PpD0aFIYNHO9r9Pgq1ZcEb7ywIRux"
        expect(content).not.toMatch(/mB5PpD0aFIYNHO9r9Pgq1ZcEb7ywIRux/)
    })

    it('Auth0 domain must reference an env var', () => {
        const content = readFileSync(resolve(srcDir, 'main.js'), 'utf-8')
        expect(content).toMatch(/VITE_AUTH0_DOMAIN/)
    })

    it('Auth0 clientId must reference an env var', () => {
        const content = readFileSync(resolve(srcDir, 'main.js'), 'utf-8')
        expect(content).toMatch(/VITE_AUTH0_CLIENT_ID/)
    })
})
