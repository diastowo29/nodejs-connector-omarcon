// Initialise Vue instance
const vm = new Vue({
  el: '#app',
  vuetify: vuetify,

  /////////////////////////////////////////////////////////////////////////////
  // Data
  /////////////////////////////////////////////////////////////////////////////

  data: {
    sharedData: {
      // Products
      products: [
        {
          id: '384-91742',
          name: 'Crew Neck Sweater',
          status: 'available',
          price: 25,
          url: null,
          photo: null
        },
        {
          id: '436-46291',
          name: 'Skinny Fit Jeans',
          status: 'unavailable',
          price: 34,
          url: null,
          photo: null
        },
        {
          id: '567-92711',
          name: 'Wool Mini Skirt',
          status: 'available',
          price: 25,
          url: null,
          photo: null
        },
        {
          id: '782-73942',
          name: 'High neck t-shirt',
          status: 'available',
          price: 25,
          url: null,
          photo: null
        },
        {
          id: '543-81346',
          name: 'Boho Bracelet',
          status: 'available',
          price: 50,
          url: null,
          photo: null
        },
        {
          id: '293-61943',
          name: 'Vintage Suitcase',
          status: 'available',
          price: 250,
          url: null,
          photo: null
        }
      ],

      // Orders
      orders: [
        {
          id: 'AB-201346',
          status: 'transit',
          date: 'yesterday',
          details: {
            payment: {
              name: 'Payment type',
              value: 'Credit card'
            },
            cardnumber: {
              name: 'Card number',
              value: '**** **** **** 4130',
              deep: true
            },
            shipping: {
              name: 'Shipping address',
              value: '201 Main St, San Francisco, CA 94103'
            },
            billing: {
              name: 'Billing address',
              value: '989 Market St, San Francisco, CA 94103'
            }
          },
          items: [
            {
              id: '384-91742',
              quantity: 1,
              actions: []
            },
            {
              id: '436-46291',
              quantity: 1,
              actions: []
            }
          ]
        },
        {
          id: 'CA-201265',
          status: 'cancelled',
          date: '2020-04-13',
          details: {
            payment: {
              name: 'Payment type',
              value: 'Credit card'
            },
            cardnumber: {
              name: 'Card number',
              value: '**** **** **** 4130',
              deep: true
            },
            shipping: {
              name: 'Shipping address',
              value: '201 Main St, San Francisco, CA 94103'
            },
            billing: {
              name: 'Billing address',
              value: '989 Market St, San Francisco, CA 94103'
            }
          },
          items: [
            {
              id: '567-92711',
              quantity: 2,
              actions: []
            },
            {
              id: '782-73942',
              quantity: 1,
              actions: []
            }
          ]
        },
        {
          id: 'BE-201162',
          status: 'delivered',
          date: '2019-12-10',
          details: {
            payment: {
              name: 'Payment type',
              value: 'Credit card'
            },
            cardnumber: {
              name: 'Card number',
              value: '**** **** **** 4130',
              deep: true
            },
            shipping: {
              name: 'Shipping address',
              value: '201 Main St, San Francisco, CA 94103'
            },
            billing: {
              name: 'Billing address',
              value: '989 Market St, San Francisco, CA 94103'
            }
          },
          items: [
            {
              id: '436-46291',
              quantity: 2,
              actions: []
            },
            {
              id: '543-81346',
              quantity: 1,
              actions: []
            }
          ]
        }
      ],

      // Loyalty
      loyalty: {
        details: {
          membersince: {
            icon: 'fa-stopwatch',
            title: 'Member since',
            value: '2015'
          },
          status: {
            icon: 'fa-star',
            title: 'Status',
            value: 'Gold'
          }
        },
        vouchers: [
          {
            code: 'SUMMER10',
            source: 'Email',
            discount: '10%',
            status: 'used'
          },
          {
            code: 'FRESHDAYS25',
            source: 'SMS',
            discount: '20%',
            status: 'available'
          },
          {
            code: 'FLASHSALES',
            source: 'Email',
            discount: '10%',
            status: 'expired'
          }
        ]
      },

      // Basket
      basket: [
        {
          id: '543-81346',
          quantity: 1
        },
        {
          id: '293-61943',
          quantity: 1
        }
      ],

      tabs: {
        user: {
          icon: 'fa-user',
          name: 'User info'
        },
        loyalty: {
          icon: 'fa-heart',
          name: 'Loyalty'
        },
        orders: {
          icon: 'fa-shopping-cart',
          name: 'Orders'
        },
        basket: {
          icon: 'fa-shopping-basket',
          name: 'Basket'
        }
      },
      status: {
        transit: {
          name: 'In Transit',
          color: 'light-blue darken-3'
        },
        delivered: {
          name: 'Delivered',
          color: 'teal darken-3'
        },
        cancelled: {
          name: 'Cancelled',
          color: 'red darken-3'
        }
      },
      currencySymbol: '$',

      // Do not change anything below this line
      ///////////////////////////////////////////////////////////////////////////

      ticket: {},
      requester: {},
      userFields: []
    },

    loader: {
      active: false,
      opacity: 1
    },
    defaultAvatar:
      'https://i2.wp.com/assets.zendesk.com/images/2016/default-avatar-80.png',
    availableDiscounts: ['10%', '15%', '20%'],
    selectedDiscount: null,
    loadAllVouchers: false,
    currentTab: 'loyalty',
    searchOrderInput: null,
    searchOrder: null,
    sortOrderBy: 'date',
    sortOrderOrder: 'desc',
    orderTab: null
  },

  /////////////////////////////////////////////////////////////////////////////
  // Computed
  /////////////////////////////////////////////////////////////////////////////

  computed: {
    // Return all items info
    itemsInfo: function () {
      const products = {}

      for (let i = 0; i < this.sharedData.products.length; i++) {
        products[this.sharedData.products[i].id] = this.sharedData.products[i]
      }

      return products
    },

    // Return the total spent based on total of orders, cancelations, etc
    totalSpent: function () {
      const total = this.sharedData.orders.reduce((acc, curr) => {
        const orderTotal =
          curr.status === 'cancelled'
            ? 0
            : curr.items.reduce((orderAcc, orderCurr) => {
                return (
                  orderAcc +
                  orderCurr.quantity * this.itemsInfo[orderCurr.id].price
                )
              }, 0)

        return acc + orderTotal
      }, 0)

      return formatMoney(total, this.sharedData.currencySymbol)
    },

    // Get orders info (filter and sort, depending on the app selection)
    getOrders: function () {
      const orders = this.sharedData.orders.reduce((acc, curr) => {
        curr.date = new Date(dateToString(curr.date))
        acc.push(curr)

        return acc
      }, [])

      const sortBy = this.sortOrderBy ? this.sortOrderBy : 'id'
      const sortOrder = this.sortOrderOrder ? this.sortOrderOrder : 'asc'
      const search = this.searchOrder

      const filtered = search
        ? orders.filter(
            (obj) =>
              obj.id.toUpperCase().includes(search.toUpperCase()) ||
              dateToString(obj.date) === dateToString(search)
          )
        : orders

      return filtered.sort((a, b) =>
        (sortOrder === 'asc' ? a[sortBy] > b[sortBy] : a[sortBy] < b[sortBy])
          ? 1
          : -1
      )
    },

    // Get products info (filter and sort, depending on the app selection)
    getProducts: function () {
      const products = this.sharedData.products
      const sortBy = this.sortProductBy ? this.sortProductBy : 'id'
      const sortOrder = this.sortProductOrder ? this.sortProductOrder : 'asc'
      const search = this.searchProduct

      const filtered = search
        ? products.filter(
            (obj) =>
              obj.id.toUpperCase().includes(search.toUpperCase()) ||
              obj.name.toUpperCase().includes(search.toUpperCase())
          )
        : products

      return filtered.sort((a, b) =>
        (sortOrder === 'asc' ? a[sortBy] > b[sortBy] : a[sortBy] < b[sortBy])
          ? 1
          : -1
      )
    }
  },

  /////////////////////////////////////////////////////////////////////////////
  // Methods
  /////////////////////////////////////////////////////////////////////////////

  methods: {
    // Search for data (emulate loading)
    // Usage example: searchData('Order') will update searchOrder based on searchOrderInput
    searchData: async function (type) {
      this.toggleLoader({ active: true })

      await setTimeout(
        function () {
          this[`search${type}`] = this[`search${type}Input`]
          this[`${type.toLowerCase()}Tab`] = null

          this.toggleLoader({ active: false })
        }.bind(this),
        1000
      )
    },

    // Return the final price of an order
    orderTotal: function (orderId) {
      const order = this.sharedData.orders.find((obj) => obj.id === orderId)

      return formatMoney(
        order.status === 'cancelled'
          ? 0
          : order.items.reduce((acc, curr) => {
              return acc + curr.quantity * this.itemsInfo[curr.id].price
            }, 0),
        this.sharedData.currencySymbol
      )
    },

    // Open modal window with more details about the selected order
    openOrder: async function (orderId) {
      const exports = {
        orderId: orderId,
        ticketId: this.sharedData.ticket.id
      }

      await client.invoke('instances.create', {
        location: 'modal',
        url: `assets/modal-order.html?exports=${encodeURIComponent(
          JSON.stringify(exports)
        )}`,
        size: {
          width: '60vw',
          height: '60vh'
        }
      })
    },

    // Offer a new discount voucher (value should be a string. eg: '15%')
    offerDiscount: function (discount) {
      const voucher = Math.random().toString(36).slice(2).toUpperCase()

      this.sharedData.loyalty.vouchers.unshift({
        code: voucher,
        source: 'Internal',
        discount: discount,
        status: 'available'
      })

      this.displayDiscountOnEditor({ code: voucher, discount: discount })
    },

    // Display discount on editor when an available discount is clicked
    // Input example: displayDiscountOnEditor({ discount: '10%', code: 'SUMMER' })
    displayDiscountOnEditor: function (voucher) {
      client.invoke(
        'ticket.editor.insert',
        `Here is your ${voucher.discount} discount code: ${voucher.code}. Use this when checking out!<br />`
      )
    },

    // Load app initial data
    loadInitialData: async function (args) {
      try {
        const opacity = args && args.opacity

        this.toggleLoader({ active: true, opacity: opacity || 1 })

        this.sharedData.ticket = await this.fetchTicketInfo()
        this.sharedData.requester = await this.fetchUserInfo(
          this.sharedData.ticket.requester.id
        )
        this.sharedData.userFields = await this.fetchUserFields()
      } catch (err) {
        client.invoke('notify', err, 'error', {
          sticky: true
        })
      } finally {
        this.toggleLoader({ active: false })
      }
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

    // Update modal shared data
    updateModal: async function () {
      const instances = Object.values((await client.get('instances')).instances)
      const modal = instances.find((obj) => obj.location === 'modal')

      if (modal) {
        const modalId = modal.instanceGuid
        client.instance(modalId).trigger('update_app', this.sharedData)
      }
    },

    // Fetch ticket info
    fetchTicketInfo: async function () {
      try {
        return (await client.get('ticket')).ticket
      } catch (err) {
        console.error(err)
        throw 'An error has occurred while fetching ticket information.'
      }
    },

    // Fetch user info
    fetchUserInfo: async function (userId) {
      try {
        return (await client.request({ url: `/api/v2/users/${userId}.json` }))
          .user
      } catch (err) {
        console.error(err)
        throw 'An error has occurred while fetching user information.'
      }
    },

    // Fetch user fields
    fetchUserFields: async function () {
      try {
        return (
          await client.request({ url: `/api/v2/user_fields.json?per_page=100` })
        ).user_fields
      } catch (err) {
        console.error(err)
        throw 'An error has occurred while fetching user fields.'
      }
    }
  },

  /////////////////////////////////////////////////////////////////////////////
  // Mounted
  /////////////////////////////////////////////////////////////////////////////

  mounted: function () {
    // Observe when the app container changes its size, then resize the app
    const appContainerObserver = new MutationObserver(
      function () {
        const appContainer = document.querySelector('#app .app-container')

        if (document.contains(appContainer) && !this.loader.active) {
          new ResizeObserver(resizeApp).observe(appContainer)
          appContainerObserver.disconnect()
        }
      }.bind(this)
    )

    appContainerObserver.observe(document, {
      attributes: false,
      childList: true,
      characterData: false,
      subtree: true
    })
  },

  /////////////////////////////////////////////////////////////////////////////
  // Created
  /////////////////////////////////////////////////////////////////////////////

  created: function () {
    // Send data back to the modal window when triggered
    client.on(
      'request_data',
      function () {
        this.updateModal()
      }.bind(this)
    )

    // Update app data when modal sends an update
    client.on(
      'update_app',
      function (data) {
        this.sharedData = data
      }.bind(this)
    )

    // Load initial app data
    this.loadInitialData()
  }
})
