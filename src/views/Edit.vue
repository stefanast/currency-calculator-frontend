<template>
  <div>
    <h1>Edit</h1>
    <v-container fluid class="mt-4">
      <h3 class="mb-1">Currencies</h3>
      <v-row align="center">
        <v-col class="d-flex justify-center" cols="12" sm="6">
          <CreateCurrency />
        </v-col>
        <v-col class="d-flex justify-center" cols="12" sm="6">
          <DeleteCurrency />
        </v-col>
      </v-row>
      <v-divider class="my-8"></v-divider>
      <h3 class="mb-1">Exchange Rates</h3>
      <v-row align="center">
        <v-col class="d-flex justify-center" cols="12" sm="6">
          <SetExchangeRate />
        </v-col>
        <v-col class="d-flex justify-center" cols="12" sm="6">
          <DeleteExchangeRate />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import CreateCurrency from "@/components/CreateCurrency.vue";
import DeleteCurrency from "@/components/DeleteCurrency.vue";
import SetExchangeRate from "@/components/SetExchangeRate.vue";
import DeleteExchangeRate from "@/components/DeleteExchangeRate.vue";

export default {
  name: "Edit",

  components: {
    CreateCurrency,
    DeleteCurrency,
    SetExchangeRate,
    DeleteExchangeRate,
  },

  data: () => ({}),
};
</script>
