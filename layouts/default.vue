<template>
  <div class="p-2">
    <ul class="flex justify-center w-full mt-10">
      <li class="underline mx-2 text-xl">
        <nuxt-link to="/">
          home
        </nuxt-link>
      </li>
      <li class="underline mx-2 text-xl">
        <nuxt-link to="/stock-list">
          stock list
        </nuxt-link>
      </li>
      <li class="underline mx-2 text-xl">
        <nuxt-link to="/my-stocks">
          my stocks
        </nuxt-link>
      </li>
    </ul>
    <Nuxt />
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      setInterval: null
    }
  },
  created() {
    this.doFetch()
    
    this.setInterval = setInterval(() => {
      this.$store.commit('SET_WALLET', this.wallet + this.inventorySummary.dividends)
    }, 1000)
  },
  beforeDestroy() {
    clearInterval(this.setInterval)
    this.setInterval = null
  },
  computed: {
    ...mapState(['wallet']),
    ...mapGetters(['inventorySummary', 'multiplication']),
  },
  methods: {
    ...mapActions(['doFetch'])
  }
}
</script>

<style>
html {
  font-family:
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
