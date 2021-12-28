<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn outlined width="100%" v-bind="attrs" v-on="on" color="#283593">
        set exchange rate
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Set Exchange Rate</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-select
                required
                :disabled="loading"
                :error-messages="baseCurrencyErrors"
                :items="currencies"
                label="Base Currency"
                v-model="baseCurrency"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                required
                :disabled="loading"
                :error-messages="targetCurrencyErrors"
                :items="currencies"
                label="Target Currency"
                v-model="targetCurrency"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field
                type="number"
                v-model="rate"
                :error-messages="rateErrors"
                label="Rate"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false"> cancel </v-btn>
        <v-btn color="#283593" text @click="submit"> set </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";

export default {
  mixins: [validationMixin],

  validations: {
    baseCurrency: { required },
    targetCurrency: { required },
    rate: { required },
  },

  async created() {
    await this.$store.dispatch("getCurrencies");
  },

  name: "SetExchangeRate",

  data: () => ({
    baseCurrency: null,
    targetCurrency: null,
    rate: null,
    dialog: false,
  }),

  computed: {
    ...mapGetters(["loading", "currencies"]),
    baseCurrencyErrors() {
      const errors = [];
      if (!this.$v.baseCurrency.$dirty) return errors;
      !this.$v.baseCurrency.required &&
        errors.push("Base Currency is required");
      return errors;
    },
    targetCurrencyErrors() {
      const errors = [];
      if (!this.$v.targetCurrency.$dirty) return errors;
      !this.$v.targetCurrency.required &&
        errors.push("Target Currency is required");
      return errors;
    },
    rateErrors() {
      const errors = [];
      if (!this.$v.rate.$dirty) return errors;
      !this.$v.rate.required && errors.push("Rate is required");
      return errors;
    },
  },

  methods: {
    async submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        const ok = await this.$store.dispatch("setExchangeRate", {
          base: this.baseCurrency,
          target: this.targetCurrency,
          rate: Number(this.rate),
        });
        if (ok) {
          await this.$store.dispatch("getCurrencies");
          this.dialog = false;
          this.baseCurrency = null;
          this.targetCurrency = null;
          this.rate = null;
          this.$v.$reset();
        }
      }
    },
  },
};
</script>
