import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const headerFile = resolve(__dirname, '..', 'common', 'Header.vue')

describe('Header.vue — null safety', () => {
    it('uses optional chaining on userData.user.name', () => {
        const content = readFileSync(headerFile, 'utf-8')
        // Must not have bare userData.user.name without optional chaining
        expect(content).not.toMatch(/userData\.user\.name/)
    })

    it('uses optional chaining pattern for user name display', () => {
        const content = readFileSync(headerFile, 'utf-8')
        expect(content).toMatch(/userData\?\.user\?\.name/)
    })

    it('provides a fallback for null user name substring', () => {
        const content = readFileSync(headerFile, 'utf-8')
        // Must use ?? fallback for the avatar abbreviation
        expect(content).toMatch(/userData\?\.user\?\.name\?\.substring.*\?\?/)
    })
})

describe('Header.vue — Auth0 logout safety', () => {
    it('Auth0 logout is inside a try/catch', () => {
        const content = readFileSync(headerFile, 'utf-8')
        // The logoutUser method must wrap this.logout() in try/catch
        expect(content).toMatch(/try\s*\{[\s\S]*?this\.logout\(\)[\s\S]*?\}\s*catch/)
    })
})

describe('Header.vue — store logout fires before Auth0', () => {
    it('dispatch logout appears before this.logout()', () => {
        const content = readFileSync(headerFile, 'utf-8')
        const dispatchIdx = content.indexOf("dispatch('logout')")
        const auth0LogoutIdx = content.indexOf('this.logout()')
        expect(dispatchIdx).toBeGreaterThan(-1)
        expect(auth0LogoutIdx).toBeGreaterThan(dispatchIdx)
    })
})
