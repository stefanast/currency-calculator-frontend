import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

const vuetify = new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#203a43",
        secondary: "#2c5364",
        accent: "#0f2027",
        error: "#b71c1c",
      },
    },
  },
});

Vue.use(Vuetify);

export default vuetify;
