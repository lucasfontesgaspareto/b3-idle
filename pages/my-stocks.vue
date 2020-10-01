<template>

  <div class="flex justify-center w-full">
    <div class="mt-8">
      <div class="text-2xl">My Stocks</div>

      <!-- <button class="bg-green-500 text-white px-4 py-2" @click="doFetch">Fetch or Update Stocks</button> -->

      <BulkAction/>

      <table class="table-auto">
        <thead>
          <tr>
            <th class="px-4 py-2"></th>
            <th class="px-4 py-2">Price</th>
            <th class="px-4 py-2">Symbol</th>
            <th class="px-4 py-2">Dividends p/ sec.</th>
            <th class="px-4 py-2">Quantity</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(stock, index) in inventory"
            :key="index"
            :class="{ 'bg-gray-100': index % 2 }"
          >
            <td class="border px-4 py-1">
              <!-- <button class="bg-green-500 text-white px-2 rounded-md" :disabled="wallet < (stock.price * quantity)" @click="doSell(stock)">buy</button> -->
            </td>
            <td class="border px-4 py-1 text-right">{{ $formatNumber(stock.price * stock.quantity) }}</td>
            <td class="border px-4 py-1">{{ stock.symbol }}</td>
            <td class="border px-4 py-1 text-right">{{ $formatNumber(stock.dividends * stock.quantity) }}</td>
            <td class="border px-4 py-1 text-right">{{ $formatNumber(stock.quantity) }}</td>
          </tr>
          <tr>
            <td class="font-semibold border px-4 py-1 text-right">Summary</td>
            <td class="font-semibold border px-4 py-1 text-right">{{ $formatNumber(inventorySummary.price * inventorySummary.quantity) }}</td>
            <td class="font-semibold border px-4 py-1 text-right">{{ inventorySummary.symbol }}</td>
            <td class="font-semibold border px-4 py-1 text-right">{{ $formatNumber(inventorySummary.dividends) }}</td>
            <td class="font-semibold border px-4 py-1 text-right">{{ $formatNumber(inventorySummary.quantity) }}</td>
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
  data() {
    return {
    }
  },
  created() {
    // this.doFetch()
  },
  computed: {
    ...mapState(['wallet', 'inventory', 'quantity']),
    ...mapGetters(['inventorySummary'])
  },
  methods: {
    ...mapActions(['doFetch', 'doSell'])
  }
}
</script>