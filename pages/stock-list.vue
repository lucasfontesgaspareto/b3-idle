<template>

  <div class="flex justify-center w-full">
    <div class="mt-8">
      <div class="text-2xl">Balance</div>
      <div class="text-6xl">{{ $formatNumber(wallet) }}</div>
      <div class="text-2xl">Stock List</div>

      <!-- <button class="bg-green-500 text-white px-4 py-2" @click="doFetch">Fetch or Update Stocks</button> -->

      <BulkAction/>

      <table class="table-auto">
        <thead>
          <tr>
            <th class="px-4 py-2">Actions</th>
            <th class="px-4 py-2">Price</th>
            <th class="px-4 py-2">Symbol</th>
            <th class="px-4 py-2">Dividends</th>
            <th class="px-4 py-2">Shares</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(stock, index) in stocks"
            :key="index"
            :class="{ 'bg-gray-100': index % 2 }"
          >
            <td class="border px-4 py-1">
              <button
                class="text-white px-2 rounded-md mr-1"
                :class="isDisabled(stock, quantity) ? 'bg-gray-400': 'bg-green-500'"
                :disabled="isDisabled(stock, quantity)"
                @click="doBuy(stock)"
              >Buy</button>
              <button
                class="text-white px-2 rounded-md"
                :class="isDisabled(stock, max(stock)) ? 'bg-gray-400': 'bg-green-500'"
                :disabled="isDisabled(stock, max(stock))"
                @click="doMaxBuy({ stock, quantity: max(stock) })"
              >Buy All ({{ $formatNumber(max(stock)) }})</button>
            </td>
            <td class="border px-4 py-1 text-right">{{ $formatNumber(stock.price * quantity) }}</td>
            <td class="border px-4 py-1">{{ stock.symbol }}</td>
            <td class="border px-4 py-1 text-right">{{ $formatNumber(stock.dividends, 'currency') }}</td>
            <td class="border px-4 py-1 text-right">{{ $formatNumber(stock.shares) }}</td>
          </tr>
          <tr>
            <td class="font-semibold border px-4 py-1 text-right">Summary</td>
            <td class="font-semibold border px-4 py-1 text-right">{{ $formatNumber(stocksSummary.price * quantity) }}</td>
            <td class="font-semibold border px-4 py-1 text-right">{{ stocksSummary.symbol }}</td>
            <td class="font-semibold border px-4 py-1 text-right">{{ $formatNumber(stocksSummary.dividends, 'currency') }}</td>
            <td class="font-semibold border px-4 py-1 text-right">{{ $formatNumber(stocksSummary.shares) }}</td>
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
      return this.wallet < (stock.price * quantity)
    },

    max(stock) {
      return Math.floor(this.wallet / stock.price) || 1
    }
  }
}
</script>