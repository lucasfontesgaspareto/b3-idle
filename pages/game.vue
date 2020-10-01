<template>
  <div>
    <h1>B3 - Idle</h1>
    <div>Wallet: {{ formatNumber('price', wallet) }}</div>
    <div>Multiplicator: {{ formatNumber('price', multiplicator) }}</div>
    <div>Count: {{ clicks }}</div>

    <button @click="add">Add {{ formatNumber('price', reward * multiplicator) }}</button>
    
    <div>Stocks</div>
    <button @click="load">Reload</button>
    Bulk action
    <select name="buyQuantity" id="buyQuanity" v-model="quantity">
      <option selected :value="1">1</option>
      <option :value="100">100</option>
      <option :value="10000">10000</option>
      <option :value="1000000">1000000</option>
      <option :value="100000000">100000000</option>
      <option :value="10000000000">10000000000</option>
      <option :value="1000000000000">1000000000000</option>
      <option :value="100000000000000">100000000000000</option>
    </select>
    <table>
      <thead>
        <td></td>
        <td>Price</td>
        <td>Symbol</td>
        <td>Dividends</td>
        <td>Shares</td>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in items"
          :key="index"
        >
          <td><button :disabled="wallet < (item.price * quantity)" @click="buy(item)">buy</button></td>
          <td>{{ formatNumber('price', item.price * quantity) }}</td>
          <td>{{ item.symbol }}</td>
          <td>{{ item.dividends }}</td>
          <td>{{ item.shares }}</td>
        </tr>
      </tbody>
    </table>

    <div>Inventory</div>
    <table>
      <thead>
        <td></td>
        <td>Quantity</td>
        <td>Price</td>
        <td>Symbol</td>
        <td>Dividends</td>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in inventory"
          :key="index"
        >
          <td><button :disabled="(item.quantity * quantity) < 1" @click="sell(item, index)">sell</button></td>
          <td>{{ item.quantity }}</td>
          <td>{{ formatNumber('price', item.price * quantity) }}</td>
          <td>{{ item.symbol }}</td>
          <td>{{ item.dividends * item.quantity }}</td>
        </tr>
      </tbody>
    </table>

    <button @click="reset">Reset</button>
  </div>
</template>

<script>

const DEFAULT_STATE = {
    wallet: 0,
    reward: 1.00,
    items: [
      {
        price: 0.00,
        symbol: 'AAAA3',
        dividends: 0.00,
        shares: 0,
        id: 0,
      },
    ],
    inventory: [],
    quantity: 1,
    clicks: 0,
  }

const {
  wallet,
  reward,
  items,
  inventory,
  quantity,
  clicks,
} = JSON.parse(localStorage.getItem('b3IdleLocalData') || JSON.stringify(DEFAULT_STATE));

export default {
  updated() {
    if (!this.isReseting) {
      localStorage.setItem('b3IdleLocalData', JSON.stringify(this.$data))
    }
  },
  created() {
    this.inventory.forEach(record => {
      record.interval = setInterval(() => {
        this.wallet += record.dividends * record.quantity
      }, 1000)
    })

    this.load()
  },
  data() {
    return {
      wallet,
      reward,
      items,
      inventory,
      quantity,
      clicks,
      isReseting: false,
      stocksList: [
        'WEGE3',
        'B3SA3',
        'ITSA4',
        'BBAS3',
        'ABEV3',
        'BBDC3',
        'VALE3',
        'ITUB4',
        'PETR3',
        'CIEL3',
        // 'BRKM3',
        // 'CMIG3',
        // 'OIBR3',
        'TIMP3',
        'CPFE3',
        // 'GOAU3',
        'HYPE3',
        'PCAR3',
        'PSSA3',
        'MGLU3',
        // 'TAEE3',
      ],
      stocks: [],
    }
  },
  computed: {
    multiplicator() {
      if (!this.inventory.length) return 1
      return this.inventory.reduce((a, b) => 
        a + (b.quantity * b.dividends),
        1
      )
    }
  },
  methods: {
    reset() {
      localStorage.setItem('b3IdleLocalData', JSON.stringify(DEFAULT_STATE))
      this.isReseting = true
      window.location.reload()
      this.isReseting = false
    },
    add() {
      this.wallet += (this.reward * this.multiplicator);
      this.clicks++
    },
    buy(item) {
      const walletUpdated = this.wallet - (item.price * this.quantity)

      if (walletUpdated < 0) {
        alert('can not buy')
        return false
      }

      const record = this.inventory.find(i => i.symbol === item.symbol) || item

      if (record.id) {
        record.quantity += this.quantity
      } else {
        record.id += 1
        record.quantity += this.quantity
        this.inventory.push(record)
        record.interval = setInterval(() => {
          this.wallet += record.dividends * record.quantity
        }, 1000)
      }
      
      this.wallet = walletUpdated
    },
    sell(item, index) {
      const realQuantity = this.inventory[index].quantity - this.quantity

      if (realQuantity < 0) {
        alert('can not sell')
        return false
      }

      this.inventory[index].quantity = realQuantity
      this.wallet = this.wallet + (item.price - item.price)

      if (realQuantity === 0) {
        clearInterval(item.interval)
        this.inventory.splice(index, 1)
      }
    },
    
    async getStockBySymbol(symbol) {
      const response = await fetch(`https://mfinance.com.br/api/v1/stocks/${symbol}`, {
        headers: { 'accept': 'application/json' }
      })
      // https://mfinance.com.br/api/v1/stocks/dividends/ITSA4
      const data = await response.json()
      data.selected = false
      return data
    },
    
    async getDividendsBySymbol(symbol) {
      const response = await fetch(`https://mfinance.com.br/api/v1/stocks/dividends/${symbol}`, {
        headers: { 'accept': 'application/json' }
      })
      const { dividends } = await response.json()
      const d = dividends
      return d && d.length && d[0] && d[0].value || { value: 0 }
    },

    async load() {
      const stocks = await new Promise(resolve => {
        const stocks = Promise.all(
          this.stocksList.map(async symbol => {
            const stock = await this.getStockBySymbol(symbol)
            stock.dividends = await this.getDividendsBySymbol(symbol)
            return stock
          })
        )
        resolve(stocks)
      });
      
      this.items = stocks.map(stock => {
        return {
          price: stock.closingPrice,
          symbol: stock.symbol,
          dividends: stock.dividends,
          shares: stock.shares,
          // buy stuffs
          quantity: 0,
          id: 0,
        }
      })
    },

    formatNumber(type, value) {
      if (type === 'price') {
        // Create our number formatter.
        var formatter = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',

          // These options are needed to round to whole numbers if that's what you want.
          //minimumFractionDigits: 0,
          //maximumFractionDigits: 0,
        });

        return formatter.format(value.toFixed(2)); /* $2,500.00 */
      }

      return value
    }
  }
}
</script>

<style>
button {
  width: 100%;
  padding: 10px;
}
</style>