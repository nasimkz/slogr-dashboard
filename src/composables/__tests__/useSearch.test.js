import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useSearch } from '../useSearch'

const ITEMS = [
    { id: 1, name: 'Alpha Profile', type: 'basic' },
    { id: 2, name: 'Beta Monitor', type: 'advanced' },
    { id: 3, name: 'Gamma Basic', type: 'basic' },
]

describe('useSearch — ref source', () => {
    it('returns all items when query is empty', () => {
        const source = ref(ITEMS)
        const { query, results } = useSearch(source)
        expect(results.value).toEqual(ITEMS)
    })

    it('filters by name field (case-insensitive)', () => {
        const source = ref(ITEMS)
        const { query, results } = useSearch(source)
        query.value = 'alpha'
        expect(results.value).toHaveLength(1)
        expect(results.value[0].id).toBe(1)
    })

    it('matches partial substrings', () => {
        const source = ref(ITEMS)
        const { query, results } = useSearch(source)
        query.value = 'mon'
        expect(results.value).toHaveLength(1)
        expect(results.value[0].id).toBe(2)
    })

    it('is case-insensitive', () => {
        const source = ref(ITEMS)
        const { query, results } = useSearch(source)
        query.value = 'BETA'
        expect(results.value).toHaveLength(1)
        expect(results.value[0].id).toBe(2)
    })

    it('trims whitespace from query', () => {
        const source = ref(ITEMS)
        const { query, results } = useSearch(source)
        query.value = '  alpha  '
        expect(results.value).toHaveLength(1)
    })

    it('returns empty array when no items match', () => {
        const source = ref(ITEMS)
        const { query, results } = useSearch(source)
        query.value = 'zzz-no-match'
        expect(results.value).toHaveLength(0)
    })

    it('supports multiple search fields', () => {
        const source = ref(ITEMS)
        const { query, results } = useSearch(source, ['name', 'type'])
        query.value = 'advanced'
        expect(results.value).toHaveLength(1)
        expect(results.value[0].id).toBe(2)
    })

    it('returns all items matching across multiple fields', () => {
        const source = ref(ITEMS)
        const { query, results } = useSearch(source, ['name', 'type'])
        query.value = 'basic'
        expect(results.value).toHaveLength(2)
    })

    it('reacts to source list changes', () => {
        const source = ref([...ITEMS])
        const { query, results } = useSearch(source)
        query.value = 'delta'
        expect(results.value).toHaveLength(0)
        source.value = [...ITEMS, { id: 4, name: 'Delta New' }]
        expect(results.value).toHaveLength(1)
    })
})

describe('useSearch — getter function source', () => {
    it('works when source is a getter function', () => {
        let list = ITEMS
        const { query, results } = useSearch(() => list)
        expect(results.value).toEqual(ITEMS)
    })

    it('filters when source is a getter function', () => {
        const { query, results } = useSearch(() => ITEMS)
        query.value = 'gamma'
        expect(results.value).toHaveLength(1)
        expect(results.value[0].id).toBe(3)
    })
})

describe('useSearch — edge cases', () => {
    it('handles null/undefined field values gracefully', () => {
        const source = ref([{ id: 1, name: null }, { id: 2, name: undefined }, { id: 3, name: 'valid' }])
        const { query, results } = useSearch(source)
        query.value = 'valid'
        expect(results.value).toHaveLength(1)
    })

    it('returns empty array when source is null', () => {
        const source = ref(null)
        const { query, results } = useSearch(source)
        expect(results.value).toEqual([])
    })
})
