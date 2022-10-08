const { createApp } = Vue
createApp({
    data() {
        return {
            showSidebar: false,
            inventory: [],
            cart: {}
        }
    },
    computed: {
        totalQuantity() {
            return Object.values(this.cart).reduce((prev, curr) => prev + curr, 0)
        }
    },
    methods: {
        addToCart(name, index) {
            if (!this.cart[name]) this.cart[name] = 0
            this.cart[name] += this.inventory[index].quantity
            this.inventory[index].quantity = 0
        },
        toggleSidebar() {
            this.showSidebar = !this.showSidebar
        },
        deleteFromCart(name) {
            delete this.cart[name]
        }
    },
    async mounted() {
        const res = await fetch('./food.json')
        const data = await res.json()
        this.inventory = data
    },
})
    .component('sidebar', {
        props: ['toggle', 'cart', 'inventory', 'remove'],
        // computed: {
        // },
        methods: {
            getPrice(name) {
                const product = this.inventory.find((p) => {
                    return p.name === name
                })
                return product.price.USD
            },
            // calculateTotal() {
            //   const names = Object.keys(this.cart)
            //   const total = Object.values(this.cart).reduce((pre, curr, index) =>
            //     pre + (curr * this.getPrice(names[index])), initialValue
            //   );
            //   return total
            // }
            calculateTotal() {
                const total = Object.entries(this.cart).reduce((prv, curr) => {
                    return prv + (this.getPrice(curr[0]) * curr[1])
                }, 0)
                return total.toFixed(2)
            }
        },
        template: `
      <aside class="cart-container" >
        <div class="cart">
          <h1 class="cart-title spread">
            <span>
              Cart
              <i class="icofont-cart-alt icofont-1x"></i>
            </span>
            <button @click="toggle" class="cart-close">&times;</button>
          </h1>

          <div class="cart-body">
            <table class="cart-table">
              <thead>
                <tr>
                  <th><span class="sr-only">Product Image</span></th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th><span class="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody v-for="(quantity, key, i) in cart" :key="i">
                <tr>
                  <td><i class="icofont-carrot icofont-3x"></i></td>
                  <td>{{ key }}</td>
                  <td>\${{ getPrice(key) }}</td>
                  <td class="center">{{ quantity }}</td>
                  <td>\${{(quantity * getPrice(key)).toFixed(2) }}</td>
                  <td class="center">
                    <button class="btn btn-light cart-remove" @click="remove(key)">
                      &times;
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <p class="center" v-if="!Object.keys(cart).length"><em>No items in cart</em></p>
            <div class="spread">
              <span><strong>Total:</strong>\${{ calculateTotal() }}</span>
              <button class="btn btn-light">Checkout</button>
            </div>
          </div>
        </div>
      </aside >
  `
    })
    .mount('#app')