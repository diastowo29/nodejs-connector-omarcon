// App Loader (Vuetify required)
Vue.component('app-loader', {
  /////////////////////////////////////////////////////////////////////////////
  // Props
  /////////////////////////////////////////////////////////////////////////////

  props: {
    opacity: {
      type: Number,
      default: 0.7
    }
  },

  /////////////////////////////////////////////////////////////////////////////
  // Template
  /////////////////////////////////////////////////////////////////////////////

  template: `
    <v-overlay class="loader" color="white" :opacity="opacity" z-index="9999">
      <svg
        class="primary--text"
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
        viewBox="0 0 81 72"
      >
        <g fill="currentColor">
          <circle cy="36" r="9" cx="9" class="first-dot"></circle>
          <circle cy="36" r="9" cx="40" class="second-dot"></circle>
          <circle cy="36" r="9" cx="71" class="third-dot"></circle>
        </g>
      </svg>
    </v-overlay>`
})
