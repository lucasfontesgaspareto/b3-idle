<template>
  <label>
    Bulk action
    <select name="buyQuantity" id="buyQuanity" :value="$store.state.quantity" @change="event => $store.commit('SET_QUANTITY', Number(event.target.value))">
      <option :value="o" v-for="o in opts" :key="o">{{ $formatNumber(o) }}</option>
    </select>
  </label>
</template>

<script>
export default {
  data() {
    return {
      opts: [
        1,
        10,
        100,
        1000,
        10000,
        100000,
        1000000,
        10000000,
        100000000,
        1000000000,
        10000000000,
        100000000000,
        1000000000000,
        10000000000000,
        100000000000000,
        1000000000000000,
        10000000000000000,
        100000000000000000,
        1000000000000000000,
        10000000000000000000,
        100000000000000000000,
      ]
    }
  }
}
</script>