import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Home from '../Home.vue'
import { fetchCategories } from '../../services/opentdbClient'

vi.mock('../../services/opentdbClient', () => ({
  fetchCategories: vi.fn()
}))

const mockCategories = {
  trivia_categories: [
    { id: 9, name: 'General Knowledge' },
    { id: 10, name: 'Entertainment: Books' }
  ]
}

describe('Home.vue', () => {
  let wrapper

  beforeEach(async () => {
    fetchCategories.mockResolvedValue(mockCategories)
    wrapper = mount(Home)
    await wrapper.vm.$nextTick() // Wait for any state changes
  })

  it('renders properly', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('h1').text()).toBe("Maxat's Trivia")
    expect(wrapper.find('p').text()).toContain('Check you trivia knowledge in 10 questions.')
  })

  it('fetches categories on mount', async () => {
    expect(fetchCategories).toHaveBeenCalled()
    expect(wrapper.vm.categories).toEqual(mockCategories.trivia_categories)
    expect(wrapper.vm.selectedCategoryId).toBe(mockCategories.trivia_categories[0].id)
  })

  it('updates selectedCategoryId when category changes', async () => {
    const select = wrapper.findAll('select')[0]
    await select.setValue(mockCategories.trivia_categories[1].id.toString())
    expect(wrapper.vm.selectedCategoryId).toBe(mockCategories.trivia_categories[1].id.toString())
  })

  it('updates selectedDifficultyId when difficulty changes', async () => {
    const select = wrapper.findAll('select')[1]
    await select.setValue('hard')
    expect(wrapper.vm.selectedDifficultyId).toBe('hard')
  })

  it('emits startGame event with correct payload on button click', async () => {
    wrapper.setData({
      selectedCategoryId: '9',
      selectedDifficultyId: 'easy'
    })
    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted().startGame).toBeTruthy()
    expect(wrapper.emitted().startGame[0]).toEqual([
      { categoryId: '9', difficulty: 'easy', questionNumber: 10 }
    ])
  })
})
