<template>
  <div class="fixed-bottom bottom-page-links">
    <a href="https://linkedin.com/in/victor-shahbazian/" target="_blank">
      <button type="button" class="btn btn-outline-success">Linkedin</button>
    </a>
    <a href="https://github.com/victorsh" target="_blank">
      <button type="button" class="btn btn-outline-info">Github</button>
    </a>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'BottomLinks',
  components: {

  },
  data() {
    return {
      black: 'blank'
    }
  },
  computed: {
    ...mapState([
      'rotateCube',
      'pageState'
    ]),
    ...mapMutations([
      'setRotateCube',
      'setPageState'
    ])
  },
  methods: {
    updateCube: function() {
      this.$store.commit('setRotateCube', true);
    },
    switchPage: function(page) {
      this.$store.commit('setPageState', page)
    }
  }
}
</script>

<style>

.bottom-page-links {
  background: white;
  opacity: 0.9;
  padding: 10px;
}
</style>