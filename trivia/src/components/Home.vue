<template>
  <section class="home" :class="$style.home">
    <h1>Maxat's Trivia</h1>
    <p>Check you trivia knowledge in 10 questions.</p>
    <p>Select the category</p>
    <select @change="changeCategory">
      <option :key="category.name" :id="category.id" :value="category.id" v-for="category in categories">
        {{ category.name }}
      </option>
    </select>

    <p>Choose the difficulty</p>
    <select v-model="selectedDifficultyId" @change="changeDifficulty">
      <option :key="difficulty.name" :id="difficulty.id" :value="difficulty.id" v-for="difficulty in difficulties">
        {{ difficulty.name }}
      </option>
    </select>
    <button @click="startGame()">Start!</button>
  </section>
</template>

<script>
import { fetchCategories } from '../services/opentdbClient';

export default {
  name: "Home",
  data() {
    return {
      categories: [],
      selectedCategoryId: 0,
      difficulties: [
        { name: "Easy", id: "easy" },
        { name: "Medium", id: "medium" },
        { name: "Hard", id: "hard" },],
      selectedDifficultyId: "medium",
      questionNumber: 10,
    };
  },

  async mounted() {
    try {
      const data = await fetchCategories();
      this.categories = data.trivia_categories;
      this.selectedCategoryId = data.trivia_categories[0].id;
    } catch (error) {
      console.error(error);
    }
  },

  methods: {
    changeCategory(event) {
      this.selectedCategoryId = event.target.value;
    },
    changeDifficulty(event) {
      this.selectedDifficultyId = event.target.value;
    },
    startGame() {
      this.$emit("startGame", {
        difficulty: this.selectedDifficultyId,
        categoryId: this.selectedCategoryId,
        questionNumber: this.questionNumber,
      });
    },
  },
};
</script>

<style module>
.home {
  width: min(95%, 400px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h1 {
    font-size: 2.5rem;
  }

  p {
    text-align: center;
    margin: 10px 0 5px;
    font-size: 1.3rem;
  }

  select {
    width: 80%;
    padding: 3px;
    font-size: 1rem;
    cursor: pointer;

    &:focus {
      outline: 0;
    }
  }

  .questions {
    width: 25%;
    padding: 2px 5px;
  }
}
</style>