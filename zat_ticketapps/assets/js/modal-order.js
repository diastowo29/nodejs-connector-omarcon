// Initialise Vue instance
const vm = new Vue({
  el: '#modal',
  vuetify: vuetify,

  /////////////////////////////////////////////////////////////////////////////
  // Data
  /////////////////////////////////////////////////////////////////////////////

  data: {
    sharedData: {},
    ticketId: 0,
    firstLoad: true,
    loader: {
      active: false,
      opacity: 1
    },
    dialog: {
      refund: false,
      replace: false
    },
    orderId: null
  },

  /////////////////////////////////////////////////////////////////////////////
  // Computed
  /////////////////////////////////////////////////////////////////////////////

  computed: {
    // Return selected order info
    currentOrder: function () {
      return this.sharedData.orders.find((obj) => obj.id === this.orderId)
    },

    // Return all items info
    itemsInfo: function () {
      const products = {}

      for (let i = 0; i < this.sharedData.products.length; i++) {
        products[this.sharedData.products[i].id] = this.sharedData.products[i]
      }

      return products
    },

    // Return the total spent with the current order, if not cancelled
    orderTotal: function () {
      const total =
        this.currentOrder.status === 'cancelled'
          ? 0
          : this.currentOrder.items.reduce((acc, curr) => {
              return acc + curr.quantity * this.itemsInfo[curr.id].price
            }, 0)

      return formatMoney(total, this.sharedData.currencySymbol)
    }
  },

  /////////////////////////////////////////////////////////////////////////////
  // Methods
  /////////////////////////////////////////////////////////////////////////////

  methods: {
    // Load app initial data
    loadInitialData: function () {
      const urlParams = new URLSearchParams(window.location.search)

      const exports = JSON.parse(urlParams.get('exports'))

      for (const key in exports) {
        this[key] = exports[key]
      }

      this.syncWithParent()
    },

    // Toggle app loader
    // Usage example: toggleLoader({ active: true, opacity: 1 })
    // Optional: opacity
    toggleLoader: function (args) {
      const active = args && args.active
      const opacity = args && args.opacity

      this.loader = {
        active: active,
        opacity: opacity || 0.7
      }
    },

    // Cancel order
    cancelOrder: async function () {
      try {
        this.toggleLoader({ active: true })

        for (let i = 0; i < this.currentOrder.items.length; i++) {
          const item = this.currentOrder.items[i]

          item.actions.push({
            action: 'cancelled',
            date: new Date().toLocaleDateString('en-GB')
          })
        }

        this.currentOrder.status = 'cancelled'
      } catch (err) {
        console.error(err)
      } finally {
        this.toggleLoader({ active: false })
      }
    },

    // Refund/replace selected item
    // Usage example: setItemAction('refund', '123-4567', 2)
    // Available types: refund / replace
    setItemAction: async function (type, itemId, quantity) {
      try {
        this.toggleLoader({ active: true })

        const item = this.currentOrder.items.find((obj) => obj.id === itemId)

        item.actions.push({
          action: `${type} (${quantity} item${quantity !== 1 ? 's' : ''})`,
          date: new Date().toLocaleDateString('en-GB')
        })

        if (type === 'refund') {
          item.quantity = item.quantity - parseInt(quantity)
        }
      } catch (err) {
        console.error(err)
      } finally {
        this.toggleLoader({ active: false })
      }
    },

    // Request data from parent
    syncWithParent: async function () {
      const instances = Object.values((await client.get('instances')).instances)
      const parentId = instances.find(
        (obj) =>
          obj.location === 'ticket_sidebar' && obj.ticketId === this.ticketId
      ).instanceGuid

      await client.instance(parentId).trigger('request_data')
    },

    // Update parent shared data
    updateParent: async function () {
      const instances = Object.values((await client.get('instances')).instances)
      const parentId = instances.find(
        (obj) =>
          obj.location === 'ticket_sidebar' && obj.ticketId === this.ticketId
      ).instanceGuid

      client.instance(parentId).trigger('update_app', this.sharedData)
    }
  },

  /////////////////////////////////////////////////////////////////////////////
  // Created
  /////////////////////////////////////////////////////////////////////////////

  created: function () {
    // Update modal data when parent sends an update
    client.on(
      'update_app',
      function (data) {
        this.sharedData = data
        this.firstLoad = false
      }.bind(this)
    )

    // Load initial app data
    this.loadInitialData()
  },

  /////////////////////////////////////////////////////////////////////////////
  // Watch
  /////////////////////////////////////////////////////////////////////////////

  watch: {
    sharedData: {
      handler: function () {
        if (!this.firstLoad) {
          this.updateParent()
        }
      },
      deep: true
    }
  }
})
