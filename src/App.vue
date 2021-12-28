<template>
  <v-app>
    <v-app-bar app color="primary" dark class="app-bar-background">
      <router-link to="/" style="text-decoration: none; color: white">
        <div class="d-flex align-center">
          <v-img
            alt="Currency Calculator Logo"
            class="shrink mr-2"
            contain
            :src="logoSrc"
            transition="scale-transition"
            width="25"
          />

          <v-toolbar-title class="ml-2">Currency Calculator</v-toolbar-title>
        </div>
      </router-link>

      <v-spacer></v-spacer>
      <div v-if="user">
        <v-btn plain to="/edit" v-if="isEditor" dark icon>
          <v-icon class="mx-2" dark>mdi-file-edit</v-icon>
        </v-btn>
        <v-menu transition="slide-y-transition" bottom :offset-y="true">
          <template v-slot:activator="{ on, attrs }">
            <v-btn plain dark icon v-on="on" v-bind="attrs">
              <v-icon class="mx-2" dark>mdi-account-circle</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, i) in profileItems"
              :key="i"
              link
              :disabled="item.disabled"
              @click="handleAction(item.action)"
            >
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <v-main>
      <notifications position="bottom right" />
      <v-progress-linear
        absolute
        :active="loading"
        indeterminate
      ></v-progress-linear>
      <v-container class="mt-1">
        <v-scroll-x-transition :hide-on-leave="true">
          <router-view />
        </v-scroll-x-transition>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "App",

  data: () => ({
    logoSrc: require("@/assets/logo.png"),
  }),

  computed: {
    ...mapGetters(["loading", "user"]),
    isEditor() {
      return this.user ? this.user.roles.includes("editor") : false;
    },
    profileItems() {
      return [
        {
          text: this.user ? this.user.email : "",
          action: null,
          disabled: true,
        },
        {
          text: "Logout",
          action: "logout",
        },
      ];
    },
  },

  methods: {
    async handleAction(action) {
      if (action === "logout") {
        await this.$store.dispatch("logout");
      }
    },
  },
};
</script>

<style>
.app-bar-background {
  background: linear-gradient(to left, #2c5364, #203a43, #0f2027);
}
.vue-notification-template.vue-notification.success {
  border-left: none;
  background: linear-gradient(to right, #11998e, #38ef7d);
}
.vue-notification-template.vue-notification.warn {
  border-left: none;
  background: linear-gradient(to right, #f7971e, #ffd200);
}
.vue-notification-template.vue-notification.error {
  border-left: none;
  background: linear-gradient(to right, #cb2d3e, #ef473a);
}
.notification-title {
  font-family: "Roboto" !important;
  font-size: 11pt !important;
}
.notification-content {
  font-family: "Roboto" !important;
  font-size: 10pt !important;
}
.vue-notification-template.vue-notification.error {
  background-color: ;
}
.vue-notification-template.vue-notification.warn {
}
</style>
