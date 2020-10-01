<template>

  <div class="flex justify-center">
    <div class="mt-8">
      <div class="text-2xl">Balance</div>
      <div class="text-6xl">{{ $formatNumber(wallet) }}</div>
      <div class="text-2xl">Stock List</div>

      <!-- <button class="bg-green-500 text-white px-1" @click="doFetch">Fetch or Update Stocks</button> -->

      <BulkAction/>

      <table class="table-auto">
        <thead>
          <tr>
            <th class="px-1">Actions</th>
            <th class="px-1">Price</th>
            <th class="px-1">Symbol</th>
            <th class="px-1">Dividends</th>
            <th class="px-1">Shares</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(stock, index) in stocks"
            :key="index"
            :class="{ 'bg-gray-100': index % 2 }"
          >
            <td class="border px-1">
              <button
                class="text-white px-1 rounded-md my-1 mr-1"
                :class="isDisabled(stock, quantity) ? 'bg-gray-400': 'bg-green-500'"
                :disabled="isDisabled(stock, quantity)"
                @click="doBuy(stock)"
              >$</button>
              <button
                class="text-white px-1 rounded-md my-1 "
                :class="isDisabled(stock, max(stock)) ? 'bg-gray-400': 'bg-green-500'"
                :disabled="isDisabled(stock, max(stock))"
                @click="doMaxBuy({ stock, quantity: max(stock) })"
              >$ ({{ $formatNumber(max(stock)) }})</button>
            </td>
            <td class="border px-1 text-right">{{ $formatNumber(stock.price * quantity) }}</td>
            <td class="border px-1">{{ stock.symbol }}</td>
            <td class="border px-1 text-right">{{ $formatNumber(stock.dividends, 'currency') }}</td>
            <td class="border px-1 text-right">{{ $formatNumber(stock.shares) }}</td>
          </tr>
          <tr>
            <td class="font-semibold border px-1 text-right">Summary</td>
            <td class="font-semibold border px-1 text-right">{{ $formatNumber(stocksSummary.price * quantity) }}</td>
            <td class="font-semibold border px-1 text-right">{{ stocksSummary.symbol }}</td>
            <td class="font-semibold border px-1 text-right">{{ $formatNumber(stocksSummary.dividends, 'currency') }}</td>
            <td class="font-semibold border px-1 text-right">{{ $formatNumber(stocksSummary.shares) }}</td>
          </tr>
        </tbody>
      </table>

      <table>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import BulkAction from '@/components/BulkAction'

export default {
  components: {
    BulkAction,
  },
  computed: {
    ...mapState(['wallet', 'stocks', 'quantity']),
    ...mapGetters(['stocksSummary']),
  },
  methods: {
    ...mapActions(['doFetch', 'doBuy', 'doMaxBuy']),

    isDisabled(stock, quantity) {
      return this.wallet < (stock.price * quantity) || stock.shares === 0
    },

    max(stock) {
      var count = Math.floor(this.wallet / stock.price) || 1
      return count > stock.shares ? stock.shares : count
    }
  }
}
</script>