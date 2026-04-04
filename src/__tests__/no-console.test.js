import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const srcDir = resolve(__dirname, '..')

const filesToCheck = [
    ['components/Home.vue', resolve(srcDir, 'components/Home.vue')],
    ['components/Sessions/Sessions.vue', resolve(srcDir, 'components/Sessions/Sessions.vue')],
    ['store/store.js', resolve(srcDir, 'store/store.js')],
    ['components/Sentinel/SentinelReports.vue', resolve(srcDir, 'components/Sentinel/SentinelReports.vue')],
    ['services/group_services.js', resolve(srcDir, 'services/group_services.js')],
    ['services/monitor_profile_Services.js', resolve(srcDir, 'services/monitor_profile_Services.js')],
]

describe('No active console statements in security-sensitive files', () => {
    it.each(filesToCheck)('%s has no console.log or console.error calls', (name, filePath) => {
        const content = readFileSync(filePath, 'utf-8')
        // Strip commented-out lines
        const uncommented = content.split('\n')
            .filter(line => !line.trim().startsWith('//'))
            .join('\n')
        expect(uncommented).not.toMatch(/console\.(log|error|warn)\s*\(/)
    })
})
