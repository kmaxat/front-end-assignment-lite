import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Final from '../Results.vue'
import anime from 'animejs/lib/anime.es.js'

vi.mock('animejs/lib/anime.es.js')

describe('Final.vue', () => {
  let wrapper

  const propsData = {
    correctAnswers: 7,
    numberOfQuestions: 10
  }

  beforeEach(() => {
    wrapper = mount(Final, {
      props: propsData
    })
  })

  it('renders properly', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('h2').exists()).toBe(true)
    expect(wrapper.find('p').exists()).toBe(true)
    expect(wrapper.find(`.${wrapper.vm.$style.answersResult}`).exists()).toBe(true)
    expect(wrapper.find(`.${wrapper.vm.$style.bar}`).exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('calculates percentages correctly', () => {
    expect(wrapper.vm.correctAnswersPercentage).toBe(70)
    expect(wrapper.vm.wrongAnswersPercentage).toBe(30)
  })

  it('displays the correct result message', () => {
    const resultMessage = wrapper.find('h2').text()
    const resultDetails = wrapper.find('p').text()

    expect(resultMessage).toBe('Good effort!')
    expect(resultDetails).toContain('70% of the questions right')
  })

  it('renders the correct width for correct and wrong answers', () => {
    const correctClass = wrapper.find(`.${wrapper.vm.$style.correct}`).classes()[0]
    const wrongClass = wrapper.find(`.${wrapper.vm.$style.wrong}`).classes()[0]

    expect(anime).toHaveBeenCalledWith({
      targets: `.${correctClass}`,
      width: '70%',
      easing: 'linear',
      loop: false,
      duration: 900
    })

    expect(anime).toHaveBeenCalledWith({
      targets: `.${wrongClass}`,
      width: '30%',
      easing: 'linear',
      loop: false,
      duration: 900
    })
  })

  it('emits resetGame event when the button is clicked', async () => {
    const button = wrapper.find('button')
    await button.trigger('click')

    expect(wrapper.emitted().resetGame).toBeTruthy()
  })

  it('displays the correct message for different percentages', async () => {
    await wrapper.setProps({ correctAnswers: 2 })
    wrapper.vm.calculatePercentages()
    wrapper.vm.changeResultText()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.correctAnswersPercentage).toBe(20)
    expect(wrapper.vm.message).toBe('Better luck next time. ')
    expect(wrapper.vm.result).toContain('You only got 20% of the questions right.')

    await wrapper.setProps({ correctAnswers: 5 })
    wrapper.vm.calculatePercentages()
    wrapper.vm.changeResultText()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.correctAnswersPercentage).toBe(50)
    expect(wrapper.vm.message).toBe('Good effort!')
    expect(wrapper.vm.result).toContain('You got 50% of the questions right.')

    await wrapper.setProps({ correctAnswers: 9 })
    wrapper.vm.calculatePercentages()
    wrapper.vm.changeResultText()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.correctAnswersPercentage).toBe(90)
    expect(wrapper.vm.message).toBe("You're incredible!")
    expect(wrapper.vm.result).toContain('Exceptional! You got 90% of the questions right!')
  })
})
