const STOCKS_STATE = [
  {
    shares: 2098658999,
    symbol: "WEGE3",
    price: 65.7,
    dividends: 0.14
  },
  {
    shares: 2059138490,
    symbol: "B3SA3",
    price: 55.01,
    dividends: 0.1434
  },
  {
    shares: 5520977160,
    symbol: "ITSA4",
    price: 8.8,
    dividends: 0.34
  },
  {
    shares: 2865417020,
    symbol: "BBAS3",
    price: 29.62,
    dividends: 0.1814
  },
  {
    shares: 15735117965,
    symbol: "ABEV3",
    price: 12.54,
    dividends: 0.4906
  },
  {
    shares: 4435106575,
    symbol: "BBDC3",
    price: 18.02,
    dividends: 0.0172
  },
  {
    shares: 5284474770,
    symbol: "VALE3",
    price: 59.11,
    dividends: 1.4144
  },
  {
    shares: 4845844989,
    symbol: "ITUB4",
    price: 22.49,
    dividends: 0.15
  },
  {
    shares: 7442454142,
    symbol: "PETR3",
    price: 19.77,
    dividends: 0.2
  },
  {
    shares: 2716815061,
    symbol: "CIEL3",
    price: 3.93,
    dividends: 0.89
  },
  {
    shares: 2421032479,
    symbol: "TIMP3",
    price: 13.06,
    dividends: 0.1024
  },
  {
    shares: 1152254440,
    symbol: "CPFE3",
    price: 27.56,
    dividends: 0.4802
  },
  {
    shares: 633320423,
    symbol: "HYPE3",
    price: 29.82,
    dividends: 0.2939
  },
  {
    shares: 268336226,
    symbol: "PCAR3",
    price: 69.74,
    dividends: 0.1296
  },
  {
    shares: 323293030,
    symbol: "PSSA3",
    price: 48.25,
    dividends: 0.9849
  },
  {
    shares: 1624731712,
    symbol: "MGLU3",
    price: 89.2,
    dividends: 0.0358
  }
];

const DEFAULT_STATE = {
  wallet: 99999999999999.00,
  reward: 1,
  clicks: 0,
  quantity: 1,
  inventory: [],
  stocks: STOCKS_STATE,
  multiplier: 1,
}

export const state = () => (DEFAULT_STATE)

export const mutations = {
  RESET(state) {
    state = JSON.parse(localStorage.getItem('db') || JSON.stringify(DEFAULT_STATE))
  },

  SET_WALLET(state, wallet) {
    state.wallet = wallet
  },

  SET_REWARD(state, reward) {
    state.reward = reward
  },

  SET_CLICKS(state, clicks) {
    state.clicks = clicks
  },

  SET_QUANTITY(state, quantity) {
    state.quantity = quantity
  },

  SET_INVENTORY(state, inventory) {
    state.inventory = inventory
  },

  SET_STOCKS(state, stocks) {
    state.stocks = stocks
  },

  SET_MULTIPLIER(state, multiplier) {
    state.multiplier = multiplier
  },

  PUSH_INVENTORY(state, stock) {
    state.inventory.push(stock)
  },

  SPLICE_INVENTORY(state, index) {
    state.inventory.splice(index, 1)
  },
}

export const getters = {
  multiplication(state) {
    if (!state.inventory.length) return 0

    return state.inventory.reduce(
      (a, b) =>  a + (b.quantity * b.dividends), 0
    )
  },

  reward(state, getters) {
    return state.reward + getters.multiplication
  },

  stocksSummary(state) {
    return state.stocks.reduce((a, b) => {
      a.price += b.price
      a.symbol += (b.symbol && 1)
      a.dividends += b.dividends
      a.shares += b.shares

      return a
    },{
      price: 0,
      symbol: 0,
      dividends: 0,
      shares: 0,
    })
  },

  inventorySummary(state) {
    return state.inventory.reduce((a, b) => {
      a.price += (b.price * b.quantity)
      a.symbol += (b.symbol && 1)
      a.dividends += (b.dividends * b.quantity)
      a.quantity += b.quantity

      return a
    },{
      price: 0,
      symbol: 0,
      dividends: 0,
      quantity: 0,
    })
  },
}

export const actions = {
  doClick({ commit, getters, state }) {
    const wallet = state.wallet + getters.reward
    commit('SET_WALLET', wallet)
    commit('SET_CLICKS', state.clicks + 1)
  },

  _doBuy({ commit, state }, { stock, quantity }) {
    const wallet = state.wallet - (stock.price * quantity)
    const stockShares = stock.shares - quantity

    if (wallet < 0 || stockShares < 0) {
      alert('Can not buy')
      return
    }

    // verify if stock already exists in the inventory
    const stockFounded = state.inventory.find(s => 
      s.symbol === stock.symbol)

    // update stock quantity in inventory or add if is a new stock
    if (stockFounded) {
      const inventory = state.inventory.map(s => {
        s = {...s}
        if (s.symbol === stockFounded.symbol) {
          s.quantity += quantity
        }
        return s
      })
      commit('SET_INVENTORY', inventory)
    } else {
      commit('PUSH_INVENTORY', { ...stock, quantity })
    }

    // update stock share in stocks list
    const stocks = state.stocks.map(s => {
      s = {...s}
      if (s.symbol === stock.symbol) {
        s.shares -= quantity
      }
      return s
    })
    commit('SET_STOCKS', stocks)

    // finished the process of buying, update the wallet value
    commit('SET_WALLET', wallet)
  },

  
  doBuy({ state, dispatch }, stock) {
    dispatch('_doBuy', { stock, quantity: state.quantity })
  },

  doMaxBuy({ dispatch }, { stock, quantity }) {
    dispatch('_doBuy', { stock, quantity })
  },

  doSell({ commit, getters }, stock) {

  },

  async doFetchStock({ state }, symbol) {
    const res = await fetch(`https://mfinance.com.br/api/v1/stocks/${symbol}`, {
      headers: { 'accept': 'application/json' }
    })
    const data = await res.json()
    data.price = data.closingPrice * state.multiplier
    // data.shares = (state.stocks.find(s => s.symbol === symbol) || data).shares
    return data
  },

  async doFetchDividends(context, symbol) {
    const res = await fetch(`https://mfinance.com.br/api/v1/stocks/dividends/${symbol}`, {
      headers: { 'accept': 'application/json' }
    })
    const { dividends } = await res.json()
    if (dividends && dividends.length) {
      return dividends[0].value
    }
    return 0
  },

  async doFetch({ commit, dispatch, state }) {
    try {
      const stocks = await Promise.all(state.stocks.map(async stock => {
        stock = await dispatch('doFetchStock', stock.symbol)
        stock.dividends = await dispatch('doFetchDividends', stock.symbol)
        return stock
      }))

      if (state.multiplier === 1) {
        commit('SET_MULTIPLIER', Number(state.multiplier) + 9)
      } else {
        commit('SET_MULTIPLIER', Number(state.multiplier) + 10)
      }
      commit('SET_STOCKS', stocks)
    } catch (error) {

    }
  },
}