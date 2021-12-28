<template>
  <v-form @submit.prevent="submit">
    <h1>Login</h1>
    <v-text-field
      class="mt-4"
      v-model="email"
      :error-messages="emailErrors"
      label="E-mail"
      required
    ></v-text-field>
    <v-text-field
      class="mt-4"
      v-model="password"
      :error-messages="passwordErrors"
      label="Password"
      type="password"
      required
    ></v-text-field>
    <div class="d-flex mt-4">
      <v-btn outlined to="/register" color="primary"> register </v-btn>
      <v-spacer></v-spacer>
      <v-btn type="submit" dark color="primary"> submit </v-btn>
    </div>
  </v-form>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],

  validations: {
    email: { required, email },
    password: { required },
  },

  name: "Login",

  data: () => ({
    email: "",
    password: "",
  }),

  computed: {
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push("Password is required");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Must be valid e-mail");
      !this.$v.email.required && errors.push("E-mail is required");
      return errors;
    },
  },

  methods: {
    async submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        await this.$store.dispatch("login", {
          email: this.email,
          password: this.password,
        });
      }
    },
  },
};
</script>
