import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const homeFile = resolve(__dirname, '..', 'Home.vue')

describe('Home.vue — XSS protection', () => {
    it('imports DOMPurify', () => {
        const content = readFileSync(homeFile, 'utf-8')
        expect(content).toMatch(/import DOMPurify from ['"]dompurify['"]/)
    })

    it('DOMPurify.sanitize is called at least as many times as setHTML', () => {
        const content = readFileSync(homeFile, 'utf-8')
        // Strip commented-out lines before counting
        const uncommented = content.split('\n')
            .filter(line => !line.trim().startsWith('//'))
            .join('\n')
        const setHTMLCalls = (uncommented.match(/\.setHTML\(/g) || []).length
        const sanitizeCalls = (uncommented.match(/DOMPurify\.sanitize\(/g) || []).length
        expect(setHTMLCalls).toBeGreaterThan(0)
        // Every setHTML call must be covered: either inline sanitize or pre-sanitized variable
        expect(sanitizeCalls).toBeGreaterThanOrEqual(setHTMLCalls)
    })

    it('DOMPurify.sanitize is called before popupHTML is used in setHTML', () => {
        const content = readFileSync(homeFile, 'utf-8')
        // The popupHTML variable assignment must use DOMPurify.sanitize
        expect(content).toMatch(/popupHTML\s*=\s*DOMPurify\.sanitize\(/)
    })
})
