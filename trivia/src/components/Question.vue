<template>
  <section :class="$style.question">
    <div :class="$style.questionInfo">
      Question {{ index + 1 }} of {{ numberOfQuestions }}
    </div>
    <h1>
      <span>{{ index + 1 }}</span>. <span v-html="questionText"></span>
    </h1>
    <div :class="$style.answers">
      <div v-for="(answer, i) in answers" :key="i" :class="$style.answer" @click="checkAnswer(answer, $event)"
        :style="[isEndOfRound ? '' : { background: '#fff' }]" v-html="answer"></div>
    </div>

    <div :class="$style.postAnswer" :style="[isEndOfRound ? { display: 'block' } : { display: 'none' }]">
      <p :class="$style.message">
        {{ message }}
      </p>
      <button @click="goToNextQuestion"
        v-html="index == numberOfQuestions - 1 ? 'See results!' : 'Next question'"></button>
    </div>
  </section>
</template>

<script>
export default {
  name: "Question",
  props: {
    quizData: Object,
  },
  data() {
    return {
      gameFinished: false,
      correctAnswers: 0,
      index: 0,
      numberOfQuestions: 0,
      answers: [],
      questionText: "",
      userAnswered: false,
      isEndOfRound: false,
      isUserAnswerCorrect: undefined,
      message: "",
    };
  },
  mounted() {
    this.prepareQuestion();
  },
  methods: {
    prepareQuestion() {
      const question = this.quizData.results[this.index];
      const allAnswers = question.type === "multiple"
        ? [question.correct_answer, ...question.incorrect_answers]
        : ["True", "False"];

      this.numberOfQuestions = this.quizData.results.length;
      this.correctAnswer = question.correct_answer;
      this.questionText = question.question;

      this.answers = this.shuffleAnswers(allAnswers);
    },

    shuffleAnswers(array) {
      const shuffledArray = [...array];
      for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
      }
      return shuffledArray;
    },

    checkAnswer(answerText, event) {
      if (!this.isEndOfRound) {
        this.userAnswered = true;
        this.isEndOfRound = true;

        this.isUserAnswerCorrect = answerText == this.correctAnswer;

        this.message = this.isUserAnswerCorrect ? "Well done!" : "Keep trying!";

        if (this.isUserAnswerCorrect) this.correctAnswers++;

        setTimeout(() => {
          event.target.style.background = this.isUserAnswerCorrect ? "#00e900" : "#ff4a4a";
        }, 200);
      }
    },

    goToNextQuestion() {
      this.checkIfItIsTheLastRound();

      if (!this.gameFinished) {
        this.index++;
        this.isEndOfRound = false;
        this.userAnswered = false;
        this.isUserAnswerCorrect = undefined;
        this.answers = [];
        this.prepareQuestion();
      }
    },

    checkIfItIsTheLastRound() {
      if (this.index == this.numberOfQuestions - 1) {
        this.gameFinished = true;
        this.$emit("endGame", {
          numberOfQuestions: this.numberOfQuestions,
          correctAnswers: this.correctAnswers,
        });
      }
    },
  },
};
</script>

<style lang="scss" module>
@use "../App.scss";

.question {
  text-align: center;
  width: min(95%, 550px);

  h1 {
    width: 95%;
    margin: auto;
    text-align: justify;
  }

  .questionInfo {
    font-size: 1.2rem;
    margin: 10px 0;
  }

  .answers {
    display: grid;
    height: 180px;
    margin-top: 16px;
    margin-bottom: 40px;
    gap: 10px;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    justify-items: center;

    .answer {
      font-size: 1.1rem;
      background: #fff;
      border-radius: 4px;
      transition: 0.3s;
      @include App.flex();
      color: black;
      width: 100%;
      cursor: default;
      box-shadow: 0px 0px 4px #2e2e4a;

      &:hover {
        transform: scale(1.03);
      }
    }
  }

  .postAnswer {
    animation: fadeIn 1.5s;

    .message {
      font-size: 1.3rem;
      transition: 0.3s;
    }

    button {
      margin-top: 10px !important;
    }
  }
}

@media screen and (max-width: 600px) {
  .question {
    .answers {
      height: 250px;
      grid-template-columns: 1fr;
      grid-template-rows: repeat(4, 1fr);
    }
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
