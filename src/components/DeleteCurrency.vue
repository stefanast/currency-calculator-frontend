<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn outlined width="100%" v-bind="attrs" v-on="on" color="error">
        delete currency
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Delete Currency</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-select
                required
                :disabled="loading"
                :items="currencies"
                :error-messages="currencyErrors"
                label="Currency"
                v-model="currency"
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false"> cancel </v-btn>
        <v-btn color="error" text @click="submit"> delete </v-btn>
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
    currency: { required },
  },

  async created() {
    await this.$store.dispatch("getCurrencies");
  },

  name: "DeleteCurrency",

  data: () => ({
    currency: null,
    dialog: false,
  }),

  methods: {
    async submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        const status = await this.$store.dispatch("deleteCurrency", {
          symbol: this.currency,
        });
        if (status === 204) {
          await this.$store.dispatch("getCurrencies");
          this.dialog = false;
          this.currency = null;
          this.$v.$reset();
        }
      }
    },
  },

  computed: {
    ...mapGetters(["loading", "currencies"]),
    currencyErrors() {
      const errors = [];
      if (!this.$v.currency.$dirty) return errors;
      !this.$v.currency.required && errors.push("Currency is required");
      return errors;
    },
  },
};
</script>
