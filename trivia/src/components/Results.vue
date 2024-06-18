<template>
  <section :class="$style.final">
    <h2>{{ message }}</h2>
    <p v-html="result"></p>
    <div>
      <p :class="$style.answersResult">{{ correctAnswers }}/{{ numberOfQuestions }}</p>
      <div :class="$style.bar">
        <div :style="{ width: `${correctAnswersPercentage}%` }" :class="$style.correct"></div>
        <div :style="{ width: `${wrongAnswersPercentage}%` }" :class="$style.wrong"></div>
      </div>
    </div>

    <button @click="resetGame">Play again</button>
  </section>
</template>

<script>
import anime from "animejs/lib/anime.es.js";
export default {
  name: "Final",
  props: {
    correctAnswers: Number,
    numberOfQuestions: Number,
  },
  data() {
    return {
      message: "",
      result: "",
      correctAnswersPercentage: 0,
      wrongAnswersPercentage: 0,
    };
  },
  mounted() {
    this.calculatePercentages();
    this.changeResultText();

    anime({
      targets: `.${this.$style.correct}`,
      width: `${this.correctAnswersPercentage}%`,
      easing: "linear",
      loop: false,
      duration: 900,
    });

    anime({
      targets: `.${this.$style.wrong}`,
      width: `${this.wrongAnswersPercentage}%`,
      easing: "linear",
      loop: false,
      duration: 900,
    });
  },
  methods: {
    calculatePercentages() {
      this.correctAnswersPercentage =
        (this.correctAnswers / this.numberOfQuestions) * 100;
      this.wrongAnswersPercentage = 100 - this.correctAnswersPercentage;
    },
    changeResultText() {
      const results = [
        {
          range: [0, 30],
          message: "Better luck next time. ",
          result: `You only got ${this.correctAnswersPercentage}% of the questions right. You should try again...`,
        },
        {
          range: [31, 79],
          message: "Good effort!",
          result: `You got ${this.correctAnswersPercentage}% of the questions right. Practice makes perfect!`,
        },
        {
          range: [80, 100],
          message: "You're incredible!",
          result: `Exceptional! You got ${this.correctAnswersPercentage}% of the questions right!`,
        },
      ];

      const result = results.find(({ range }) =>
        this.correctAnswersPercentage >= range[0] &&
        this.correctAnswersPercentage <= range[1]
      );

      if (result) {
        this.message = result.message;
        this.result = result.result;
      }
    }
    ,
    resetGame() {
      this.$emit("resetGame");
    },
  },
};
</script>

<style lang="scss" module>
@use "../App.scss";

.final {
  text-align: center;
  width: min(95%, 400px);
  @include App.flex();

  h2 {
    font-size: 2.5rem;
    color: App.$final-screen-heading;
  }

  p {
    font-size: 1.3rem;

    &.answersResult {
      color: #000;
      position: absolute;
      font-size: 1.2rem;
      left: 50%;
      top: 67%;
      height: 30px;
      transform: translate(-50%, -50%);
    }
  }

  >div {
    text-align: center;
    position: relative;
    width: 100%;

    .bar {
      background: rgb(40, 39, 49);
      box-shadow: 0px 0px 4px #2e2e4a;
      margin: 15px auto 0;
      width: 95%;
      height: 30px;
      border-radius: 5px;
      @include App.flex(row, space-between, stretch);

      .correct {
        border-radius: 5px 0 0 5px;
        background: App.$correct;
      }

      .wrong {
        border-radius: 0 5px 5px 0;
        background: App.$wrong;
      }
    }
  }
}
</style>