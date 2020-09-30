<template>
  <div>
    <h1>B3 - Idle</h1>
    <div>Wallet: {{ wallet }} R$</div>
    <div>Multiplicator: {{ multiplicator }}</div>
    <div>Count: {{ clicks }}</div>

    <button @click="add">Add {{ reward }} R$</button>
    
    <div>Stocks</div>
    <select name="buyQuantity" id="buyQuanity" v-model="quantity">
      <option selected :value="1">1</option>
      <option :value="10">10</option>
      <option :value="100">100</option>
      <option :value="1000">1000</option>
      <option :value="10000">10000</option>
      <option :value="100000">100000</option>
      <option :value="1000000">1000000</option>
      <option :value="10000000">10000000</option>
    </select>
    <table>
      <thead>
        <td></td>
        <td>Price</td>
        <td>Symbol</td>
        <td>Automatic</td>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in items"
          :key="index"
        >
          <td><button :disabled="wallet < (item.price * quantity)" @click="buy(item)">buy</button></td>
          <td>{{ item.price * quantity }}</td>
          <td>{{ item.symbol }}</td>
          <td>{{ item.automatic }}</td>
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
        <td>Automatic</td>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in inventory"
          :key="index"
        >
          <td><button :disabled="(item.quantity * quantity) < 1" @click="sell(item, index)">sell</button></td>
          <td>{{ item.quantity }}</td>
          <td>{{ item.price * quantity }}</td>
          <td>{{ item.symbol }}</td>
          <td>{{ item.automatic * item.quantity }}</td>
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
        price: 25.00,
        symbol: 'BASA3',
        multiplier: 25.00 * .01,
        quantity: 0,
        automatic: 25.00 * .1,
        id: 0,
      },
      {
        price: 8.00,
        symbol: 'ITSA4',
        multiplier: 8.00 * .01,
        quantity: 0,
        automatic: 8.00 * .1,
        id: 0,
      },
      {
        price: 62.00,
        symbol: 'VALE3',
        multiplier: 62.00 * .01,
        quantity: 0,
        automatic: 62.00 * .1,
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
        this.wallet += record.automatic * record.quantity
      }, 1000)
    })
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
    }
  },
  computed: {
    multiplicator() {
      if (!this.inventory.length) return 1
      return this.inventory.reduce((a, b) => 
        a + (b.quantity * b.multiplier),
        1
      )
    }
  },
  methods: {
    reset() {
      localStorage.setItem('b3IdleLocalData', JSON.stringify(DEFAULT_STATE))
      this.isReseting = true
      window.location.reload()
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
          this.wallet += record.automatic * record.quantity
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
  }
}
</script>

<style>
button {
  width: 100%;
  padding: 10px;
}
</style>