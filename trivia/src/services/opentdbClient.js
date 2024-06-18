import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://opentdb.com/',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export default apiClient

export const fetchCategories = async () => {
  try {
    const response = await apiClient.get('api_category.php')
    return response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

export const fetchQuestions = async (difficulty, categoryId, questionNumber) => {
  try {
    const { data } = await apiClient.get(
      `api.php?amount=${questionNumber}&category=${categoryId}&difficulty=${difficulty}`
    )
    return data
  } catch (error) {
    console.error(error)
    throw error
  }
}
