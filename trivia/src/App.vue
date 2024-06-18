<template>
  <main>
    <Home @startGame="startGame" v-if="showHome" />
    <Question
      v-if="gameStarted && quizData && !gameFinished"
      :quizData="this.quizData"
      @endGame="endGame"
    />
    <Results
      v-if="gameFinished"
      :correctAnswers="correctAnswers"
      :numberOfQuestions="numberOfQuestions"
      @resetGame="resetGame"
    />
  </main>
</template>

<script>
import "./App.scss";
import { fetchQuestions } from './services/opentdbClient';
import Home from "./components/Home.vue";
import Question from "./components/Question.vue";
import Results from "./components/Results.vue";

export default {
  name: "App",
  components: {
    Home,
    Question,
    Results
  },
  data() {
    return {
      showHome: true,
      gameStarted: false,
      gameFinished: false,
      quizData: undefined,
      numberOfQuestions: 0,
    };
  },
  methods: {
    startGame({ difficulty, categoryId, questionNumber }) {
      this.fetchQuestions(difficulty, categoryId, questionNumber);
      this.showHome = false;
      this.gameStarted = true;
    },
    async fetchQuestions(difficulty, categoryId, questionNumber) {
      try {
        const data = await fetchQuestions(difficulty, categoryId, questionNumber);
        this.quizData = data;
      } catch (error) {
        console.error(error);
      }
    },
    endGame({ numberOfQuestions, correctAnswers }) {
      this.numberOfQuestions = numberOfQuestions;

      this.correctAnswers = correctAnswers;
      this.gameFinished = true;
    },
    resetGame() {
      this.showHome = true;
      this.gameStarted = false;
      this.gameFinished = false;
      this.quizData = undefined;
      this.numberOfQuestions = 0;
    },
  },
};
</script>
