import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LoadingState from '../LoadingState.vue'
import EmptyState from '../EmptyState.vue'
import ErrorState from '../ErrorState.vue'

describe('LoadingState', () => {
    it('renders a spinner', () => {
        const wrapper = mount(LoadingState)
        expect(wrapper.find('.spinner-border').exists()).toBe(true)
    })

    it('has accessible visually-hidden text', () => {
        const wrapper = mount(LoadingState)
        expect(wrapper.find('.visually-hidden').text()).toBe('Loading...')
    })
})

describe('EmptyState', () => {
    it('renders the title', () => {
        const wrapper = mount(EmptyState, {
            props: { title: 'No agents found' }
        })
        expect(wrapper.text()).toContain('No agents found')
    })

    it('renders message when provided', () => {
        const wrapper = mount(EmptyState, {
            props: { title: 'Empty', message: 'Deploy an agent to get started.' }
        })
        expect(wrapper.text()).toContain('Deploy an agent to get started.')
    })

    it('does not render p tag when message is null', () => {
        const wrapper = mount(EmptyState, {
            props: { title: 'Empty' }
        })
        expect(wrapper.find('p').exists()).toBe(false)
    })

    it('renders slot content', () => {
        const wrapper = mount(EmptyState, {
            props: { title: 'Empty' },
            slots: { default: '<button class="add-btn">Add Agent</button>' }
        })
        expect(wrapper.find('.add-btn').exists()).toBe(true)
    })

    it('applies custom icon class', () => {
        const wrapper = mount(EmptyState, {
            props: { title: 'Empty', icon: 'fa-solid fa-satellite-dish' }
        })
        expect(wrapper.find('i').classes()).toContain('fa-satellite-dish')
    })

    it('uses default icon when none provided', () => {
        const wrapper = mount(EmptyState, {
            props: { title: 'Empty' }
        })
        expect(wrapper.find('i').classes()).toContain('fa-inbox')
    })
})

describe('ErrorState', () => {
    it('shows custom message', () => {
        const wrapper = mount(ErrorState, {
            props: { message: 'Failed to load agents' }
        })
        expect(wrapper.text()).toContain('Failed to load agents')
    })

    it('shows fallback message when none provided', () => {
        const wrapper = mount(ErrorState)
        expect(wrapper.text()).toContain('Something went wrong')
    })

    it('shows retry button when handler is provided', () => {
        const onRetry = vi.fn()
        const wrapper = mount(ErrorState, {
            props: { onRetry }
        })
        expect(wrapper.find('button').exists()).toBe(true)
    })

    it('hides retry button when no handler provided', () => {
        const wrapper = mount(ErrorState, {
            props: { message: 'Error' }
        })
        expect(wrapper.find('button').exists()).toBe(false)
    })

    it('calls onRetry when retry button clicked', async () => {
        const onRetry = vi.fn()
        const wrapper = mount(ErrorState, {
            props: { onRetry }
        })
        await wrapper.find('button').trigger('click')
        expect(onRetry).toHaveBeenCalledOnce()
    })

    it('has role="alert" for accessibility', () => {
        const wrapper = mount(ErrorState)
        expect(wrapper.find('[role="alert"]').exists()).toBe(true)
    })
})
