import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const storeFile = resolve(__dirname, '..', 'store.js')

describe('store.js — token storage', () => {
    it('must use sessionStorage, not localStorage for vuex-persist', () => {
        const content = readFileSync(storeFile, 'utf-8')
        // Must not use bare localStorage
        expect(content).not.toMatch(/storage:\s*localStorage/)
    })

    it('storage is set to window.sessionStorage', () => {
        const content = readFileSync(storeFile, 'utf-8')
        expect(content).toMatch(/storage:\s*window\.sessionStorage/)
    })
})
