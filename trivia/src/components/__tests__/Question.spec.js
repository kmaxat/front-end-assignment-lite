import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Question from '../Question.vue'

const mockQuizData = {
  results: [
    {
      type: 'multiple',
      difficulty: 'medium',
      category: 'General Knowledge',
      question:
        'What did the Spanish autonomous community of Catalonia ban in 2010, that took effect in 2012?',
      correct_answer: 'Bullfighting',
      incorrect_answers: ['Fiestas', 'Flamenco', 'Mariachi']
    },
    {
      type: 'multiple',
      difficulty: 'medium',
      category: 'General Knowledge',
      question: '2+2=4',
      correct_answer: 'True',
      incorrect_answers: ['False']
    }
  ]
}

describe('Question.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Question, {
      props: {
        quizData: mockQuizData
      }
    })
  })

  it('renders properly', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find(`.${wrapper.vm.$style.questionInfo}`).text()).toBe('Question 1 of 2')
    expect(wrapper.find('h1 span:nth-child(2)').html()).toContain(mockQuizData.results[0].question)
  })

  it('displays the question and answers correctly', () => {
    const answers = wrapper.findAll(`.${wrapper.vm.$style.answer}`)
    expect(answers.length).toBe(4)

    const questionText = mockQuizData.results[0].question
    const allAnswers = [
      mockQuizData.results[0].correct_answer,
      ...mockQuizData.results[0].incorrect_answers
    ]

    expect(wrapper.find('h1 span:nth-child(2)').html()).toContain(questionText)

    const displayedAnswers = answers.map((answer) => answer.text())
    displayedAnswers.forEach((answer) => {
      expect(allAnswers).toContain(answer)
    })
  })

  it('handles incorrect answer selection', async () => {
    const answers = wrapper.findAll(`.${wrapper.vm.$style.answer}`)
    const incorrectAnserIndex = answers.findIndex(
      (answer) => answer.text() !== mockQuizData.results[0].correct_answer
    )
    await answers[incorrectAnserIndex].trigger('click')

    await answers[0].trigger('click')
    const message = wrapper.find(`.${wrapper.vm.$style.message}`).text()
    expect(message).toBe('Keep trying!')
    expect(wrapper.vm.isEndOfRound).toBe(true)
  })

  it('handles correct answer selection', async () => {
    const answers = wrapper.findAll(`.${wrapper.vm.$style.answer}`)
    const correctAnswerIndex = answers.findIndex(
      (answer) => answer.text() === mockQuizData.results[0].correct_answer
    )
    await answers[correctAnswerIndex].trigger('click')

    await wrapper.vm.$nextTick() // Ensure DOM updates are processed

    const message = wrapper.find(`.${wrapper.vm.$style.message}`).text()
    expect(message).toBe('Well done!')
    expect(wrapper.vm.isEndOfRound).toBe(true)
  })

  it('moves to the next question correctly', async () => {
    const nextButton = wrapper.find(`.${wrapper.vm.$style.postAnswer} button`)

    await nextButton.trigger('click')

    expect(wrapper.vm.index).toBe(1)
    expect(wrapper.find(`.${wrapper.vm.$style.questionInfo}`).text()).toBe('Question 2 of 2')
    expect(wrapper.find('h1 span:nth-child(2)').html()).toContain(mockQuizData.results[1].question)
  })

  it('emits endGame event when last question is answered', async () => {
    wrapper.vm.index = 1
    await wrapper.vm.$nextTick()

    const nextButton = wrapper.find(`.${wrapper.vm.$style.postAnswer} button`)
    await nextButton.trigger('click')

    expect(wrapper.emitted().endGame).toBeTruthy()
    expect(wrapper.emitted().endGame[0]).toEqual([
      {
        numberOfQuestions: 2,
        correctAnswers: wrapper.vm.correctAnswers
      }
    ])
  })

  it('displays the correct button text for the last question', async () => {
    wrapper.vm.index = 1
    await wrapper.vm.$nextTick()

    const nextButton = wrapper.find(`.${wrapper.vm.$style.postAnswer} button`)
    expect(nextButton.text()).toBe('See results!')
  })
})
