import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import App from './App.vue'
import Home from './components/Home.vue'
import Question from './components/Question.vue'
import Results from './components/Results.vue'
import { fetchQuestions } from './services/opentdbClient'

vi.mock('./services/opentdbClient', () => ({
  fetchQuestions: vi.fn()
}))

const mockQuizData = {
  response_code: 0,
  results: [
    {
      type: 'multiple',
      difficulty: 'medium',
      category: 'General Knowledge',
      question: 'Which item of clothing is usually worn by a Scotsman at a wedding?',
      correct_answer: 'Kilt',
      incorrect_answers: ['Skirt', 'Dress', 'Rhobes']
    },
    {
      type: 'multiple',
      difficulty: 'medium',
      category: 'General Knowledge',
      question: 'What alcoholic drink is mainly made from juniper berries?',
      correct_answer: 'Gin',
      incorrect_answers: ['Vodka', 'Rum', 'Tequila']
    }
  ]
}

describe('App.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(App)
    fetchQuestions.mockResolvedValue(mockQuizData)
    wrapper.vm.$nextTick() // Wait for any state changes
  })

  it('renders Home component initially', () => {
    expect(wrapper.findComponent(Home).exists()).toBe(true)
    expect(wrapper.findComponent(Question).exists()).toBe(false)
    expect(wrapper.findComponent(Results).exists()).toBe(false)
  })

  it('starts game correctly', async () => {
    fetchQuestions.mockResolvedValue(mockQuizData)

    await wrapper.vm.startGame({ difficulty: 'easy', categoryId: '9', questionNumber: 10 })

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick() // Additional tick to ensure state updates

    expect(fetchQuestions).toHaveBeenCalledWith('easy', '9', 10)
    expect(wrapper.vm.showHome).toBe(false)
    expect(wrapper.vm.gameStarted).toBe(true)
    expect(wrapper.vm.quizData).toEqual(mockQuizData)
    expect(wrapper.findComponent(Home).exists()).toBe(false)
    expect(wrapper.findComponent(Question).exists()).toBe(false)
    expect(wrapper.findComponent(Results).exists()).toBe(false)
  })

  it('ends game correctly', async () => {
    wrapper.vm.endGame({ numberOfQuestions: 10, correctAnswers: 7 })

    await wrapper.vm.$nextTick() // Wait for the state changes

    expect(wrapper.vm.numberOfQuestions).toBe(10)
    expect(wrapper.vm.correctAnswers).toBe(7)
    expect(wrapper.vm.gameFinished).toBe(true)
    expect(wrapper.findComponent(Home).exists()).toBe(true)
    expect(wrapper.findComponent(Question).exists()).toBe(false)
    expect(wrapper.findComponent(Results).exists()).toBe(true)
  })

  it('resets game correctly', async () => {
    wrapper.vm.resetGame()
    expect(wrapper.vm.showHome).toBe(true)
    expect(wrapper.vm.gameStarted).toBe(false)
    expect(wrapper.vm.gameFinished).toBe(false)
    expect(wrapper.vm.quizData).toBe(undefined)
    expect(wrapper.vm.numberOfQuestions).toBe(0)
    expect(wrapper.findComponent(Home).exists()).toBe(true)
    expect(wrapper.findComponent(Question).exists()).toBe(false)
    expect(wrapper.findComponent(Results).exists()).toBe(false)
  })

  it('handles fetchQuestions error', async () => {
    fetchQuestions.mockRejectedValue(new Error('API error'))
    await wrapper.vm.startGame({ difficulty: 'easy', categoryId: '9', questionNumber: 10 })
    await wrapper.vm.$nextTick() // Wait for the state changes
    expect(fetchQuestions).toHaveBeenCalledWith('easy', '9', 10)
    expect(wrapper.vm.quizData).toBe(undefined)
  })
})
