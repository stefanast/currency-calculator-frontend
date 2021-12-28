<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn outlined width="100%" v-bind="attrs" v-on="on" color="#004D40">
        create currency
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Create Currency</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="symbol"
                :error-messages="symbolErrors"
                label="Symbol"
                @input="() => (symbol = symbol.toUpperCase())"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="name"
                :error-messages="nameErrors"
                label="Name"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false"> cancel </v-btn>
        <v-btn color="#004D40" text @click="save"> create </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],

  validations: {
    symbol: { required },
    name: { required },
  },

  name: "CreateCurrency",

  data: () => ({
    symbol: null,
    dialog: false,
    name: null,
  }),

  computed: {
    symbolErrors() {
      const errors = [];
      if (!this.$v.symbol.$dirty) return errors;
      !this.$v.symbol.required && errors.push("Currency Symbol is required");
      return errors;
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.required && errors.push("Currency Name is required");
      return errors;
    },
  },

  methods: {
    async save() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        const ok = await this.$store.dispatch("createCurrency", {
          symbol: this.symbol,
          name: this.name,
        });
        if (ok) {
          await this.$store.dispatch("getCurrencies");
          this.dialog = false;
          this.name = null;
          this.symbol = null;
          this.$v.$reset();
        }
      }
    },
  },
};
</script>
