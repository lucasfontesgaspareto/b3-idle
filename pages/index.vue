<template>
  <div class="flex flex-wrap justify-center w-full">
    <div class="mt-8">
      <div class="text-2xl">Balance</div>
      <div class="text-6xl">{{ $formatNumber(wallet) }}</div>
      <button class="bg-green-500 text-white px-4 py-2" @click="doClick">Click to add {{ $formatNumber(reward) }}</button>
      <div class="text-xs text-gray-500">You have been clicked {{ clicks }} times.</div>

      <div class="my-10" v-if="multiplication">
        <div class="text-xl">Money per second</div>
        <div class="text-2xl">{{ $formatNumber(inventorySummary.dividends) }}</div>
      </div>

      <div class="mt-20">
        <p>Click and get money!$</p>
        <p>Earn from dividends times quantity buyed, per second!!!</p>
        <p>Buy everything and WON!</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {

  computed: {
    ...mapState(['wallet', 'clicks']),
    ...mapGetters(['reward', 'multiplication', 'inventorySummary'])
  },
  methods: {
    ...mapActions(['doClick'])
  }
}

</script>

<style>
</style>
