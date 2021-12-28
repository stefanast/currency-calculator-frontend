<template>
  <v-form @submit.prevent="submit">
    <h1>Convert</h1>
    <v-container fluid class="mt-4">
      <v-row align="center">
        <v-col class="d-flex" cols="12" sm="4">
          <v-text-field
            outlined
            required
            :disabled="loading"
            label="Amount"
            type="number"
            v-model="amount"
            :error-messages="amountErrors"
          >
          </v-text-field>
        </v-col>

        <v-col class="d-flex" cols="12" sm="4">
          <v-select
            outlined
            required
            :disabled="loading"
            :error-messages="baseCurrencyErrors"
            :items="currencies"
            label="Base Currency"
            v-model="baseCurrency"
          ></v-select>
        </v-col>

        <v-col class="d-flex" cols="12" sm="4">
          <v-select
            outlined
            required
            :disabled="loading"
            :items="currencies"
            label="Target Currency"
            v-model="targetCurrency"
            :error-messages="targetCurrencyErrors"
          ></v-select>
        </v-col>

        <v-col class="d-flex" cols="12" sm="12">
          <v-text-field
            outlined
            required
            :disabled="convertedAmount === null"
            readonly
            v-model="convertedAmount"
            label="Converted Amount"
            type="number"
          ></v-text-field>
        </v-col>
      </v-row>
      <div class="d-flex mt-4">
        <v-btn outlined @click="clear" :disabled="loading" color="primary">
          clear
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn type="submit" :disabled="loading" dark color="primary">
          submit
        </v-btn>
      </div>
    </v-container>
  </v-form>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";

export default {
  mixins: [validationMixin],

  validations: {
    amount: { required },
    baseCurrency: { required },
    targetCurrency: { required },
  },

  name: "Home",

  data: () => ({
    amount: null,
    baseCurrency: null,
    targetCurrency: null,
    convertedAmount: null,
  }),

  async created() {
    await this.$store.dispatch("getCurrencies");
  },

  computed: {
    ...mapGetters(["loading", "currencies"]),
    amountErrors() {
      const errors = [];
      if (!this.$v.amount.$dirty) return errors;
      !this.$v.amount.required && errors.push("Amount is required");
      return errors;
    },
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
  },

  methods: {
    async submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        const value = await this.$store.dispatch("convert", {
          amount: Number(this.amount),
          base: this.baseCurrency,
          target: this.targetCurrency,
        });
        this.convertedAmount = value ? Number(value).toFixed(4) : null;
      }
    },
    clear() {
      this.amount = null;
      this.baseCurrency = null;
      this.targetCurrency = null;
      this.convertedAmount = null;
      this.$v.$reset();
    },
  },
};
</script>
