// Select quantity component (Vuetify required)
Vue.component('app-select-quantity', {
  /////////////////////////////////////////////////////////////////////////////
  // Props
  /////////////////////////////////////////////////////////////////////////////

  props: {
    value: Boolean,
    title: {
      type: String,
      default: 'Select a quantity'
    },
    placeholder: {
      type: String,
      default: 'Enter a number'
    },
    confirm: {
      type: String,
      default: 'Confirm'
    },
    color: {
      type: String,
      default: 'primary'
    },
    icon: {
      type: String,
      default: 'fa-check'
    },
    min: {
      type: [String, Number],
      default: 1
    },
    max: [String, Number]
  },

  /////////////////////////////////////////////////////////////////////////////
  // Data
  /////////////////////////////////////////////////////////////////////////////

  data: function () {
    return {
      status: this.value,
      selectedNumber: parseInt(this.min) || 0
    }
  },

  /////////////////////////////////////////////////////////////////////////////
  // Methods
  /////////////////////////////////////////////////////////////////////////////

  methods: {
    confirmNumber: function () {
      this.$emit('confirmed', this.selectedNumber)
      this.status = false
    }
  },

  /////////////////////////////////////////////////////////////////////////////
  // Watch
  /////////////////////////////////////////////////////////////////////////////

  watch: {
    value: function () {
      this.status = this.value
    },

    status: function () {
      this.$emit('input', this.status)
    }
  },

  /////////////////////////////////////////////////////////////////////////////
  // Template
  /////////////////////////////////////////////////////////////////////////////

  template: `
    <v-dialog v-model="status" max-width="290">
      <template v-slot:activator="{ on, attrs }">
        <slot :on="on" :attrs="attrs"></slot>
      </template>
      <v-card>
        <v-card-title class="headline grey lighten-2 title" primary-title>
          {{ title }}
        </v-card-title>
        <v-card-text class="mt-4">
          <v-text-field
            v-model="selectedNumber"
            type="number"
            :label="placeholder"
            :min="min"
            :max="max"
            flat
            dense
            outlined
            hide-details
            autocomplete="off"
          />
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="px-3"
            :color="color"
            depressed
            :disabled="selectedNumber < min || max && selectedNumber > max"
            @click="confirmNumber"
          >
            <v-icon class="mr-2">{{ icon }}</v-icon>
            {{ confirm }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>`
})
