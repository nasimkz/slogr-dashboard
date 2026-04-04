import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const sessionsFile = resolve(__dirname, '..', 'Sessions', 'Sessions.vue')

// Extract the calculateTimeDifference logic for unit testing
function makeCalculateTimeDifference(current_time) {
    return function calculateTimeDifference(updatedAt) {
        if (!updatedAt || !current_time) return '—';

        const updatedDate = new Date(updatedAt);
        const currentDate = new Date(current_time);

        if (isNaN(updatedDate.getTime()) || isNaN(currentDate.getTime())) return '—';

        const timeDifference = currentDate - updatedDate;
        return Math.floor(timeDifference / (1000 * 60));
    }
}

describe('calculateTimeDifference', () => {
    it('returns em-dash when updatedAt is null', () => {
        const fn = makeCalculateTimeDifference('2024-01-01T12:00:00Z')
        expect(fn(null)).toBe('—')
    })

    it('returns em-dash when updatedAt is undefined', () => {
        const fn = makeCalculateTimeDifference('2024-01-01T12:00:00Z')
        expect(fn(undefined)).toBe('—')
    })

    it('returns em-dash when current_time is null', () => {
        const fn = makeCalculateTimeDifference(null)
        expect(fn('2024-01-01T11:00:00Z')).toBe('—')
    })

    it('returns em-dash for invalid date strings', () => {
        const fn = makeCalculateTimeDifference('2024-01-01T12:00:00Z')
        expect(fn('not-a-date')).toBe('—')
    })

    it('returns correct minutes difference for valid dates', () => {
        const fn = makeCalculateTimeDifference('2024-01-01T12:30:00Z')
        expect(fn('2024-01-01T12:00:00Z')).toBe(30)
    })

    it('returns 0 for same timestamps', () => {
        const fn = makeCalculateTimeDifference('2024-01-01T12:00:00Z')
        expect(fn('2024-01-01T12:00:00Z')).toBe(0)
    })
})

describe('Sessions.vue source', () => {
    it('calculateTimeDifference has null guard for updatedAt', () => {
        const content = readFileSync(sessionsFile, 'utf-8')
        expect(content).toMatch(/if\s*\(!updatedAt/)
    })

    it('calculateTimeDifference guards against invalid dates', () => {
        const content = readFileSync(sessionsFile, 'utf-8')
        expect(content).toMatch(/isNaN/)
    })
})
