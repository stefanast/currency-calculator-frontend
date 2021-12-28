import Vue from "vue";
import Vuex from "vuex";
import router from "../router";
import api from "../services/api";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false,
    user: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null,
    tokens: {
      access: localStorage.getItem("accessToken")
        ? JSON.parse(localStorage.getItem("accessToken"))
        : null,
      refresh: localStorage.getItem("refreshToken")
        ? JSON.parse(localStorage.getItem("refreshToken"))
        : null,
    },
    currencies: [],
    convertedAmount: null,
  },
  getters: {
    loading: (state) => state.loading,
    user: (state) => state.user,
    accessToken: (state) => state.tokens.access,
    refreshToken: (state) => state.tokens.refresh,
    currencies: (state) => state.currencies,
    convertedAmount: (state) => state.convertedAmount,
  },
  actions: {
    refresh({ commit }, value) {
      commit("setAccessToken", value);
    },
    setLoading({ commit }, value) {
      commit("setLoading", value);
    },
    async login({ commit }, params) {
      commit("setLoading", true);
      try {
        const res = await api.post("/auth/login", params);
        const { accessToken, refreshToken, user } = await res.data;
        commit("setAccessToken", accessToken);
        commit("setRefreshToken", refreshToken);
        commit("setUser", user);
        router.push({ path: "/" });
        Vue.notify({
          title: "Success",
          text: "Logged in successfully!",
          type: "success",
        });
      } catch (err) {
        Vue.notify({
          title: "Error",
          text: "Login failed!",
          type: "error",
        });
        console.log(err);
      } finally {
        commit("setLoading", false);
      }
    },
    async logout({ commit, state }) {
      commit("setLoading", true);
      try {
        await api.delete("/auth/logout", {
          data: { token: state.tokens.refresh },
        });
      } catch (err) {
        console.log(err);
      } finally {
        commit("removeAccessToken", null);
        commit("removeRefreshToken", null);
        commit("removeUser", null);
        router.push({ path: "/login" });
        commit("setLoading", false);
      }
    },
    async register({ commit }, params) {
      commit("setLoading", true);
      try {
        await api.post("/auth/register", params);
        router.push({ path: "/login" });
        Vue.notify({
          title: "Success",
          text: "User created successfully!",
          type: "success",
        });
      } catch (err) {
        Vue.notify({
          title: "Registration failed",
          text: err.response.data.msg,
          type: "error",
        });
        console.log(err);
      } finally {
        commit("setLoading", false);
      }
    },
    async getCurrencies({ commit }) {
      commit("setLoading", true);
      try {
        const res = await api.get("/currencies");
        const { result } = await res.data;
        const currencies = result.map((curr) => curr.symbol);
        commit("setCurrencies", currencies);
      } catch (err) {
        Vue.notify({
          title: "Error",
          text: err.response.data.msg,
          type: "error",
        });
        console.log(err);
      } finally {
        commit("setLoading", false);
      }
    },
    async convert({ commit }, params) {
      commit("setLoading", true);
      try {
        const res = await api.post("currencies/convert", params);
        const { convertedAmount } = await res.data;
        return convertedAmount;
      } catch (err) {
        Vue.notify({
          title: "Error",
          text: err.response.data.msg,
          type: "error",
        });
        console.log(err);
      } finally {
        commit("setLoading", false);
      }
    },
    async createCurrency({ commit }, params) {
      commit("setLoading", true);
      try {
        const res = await api.post("/currencies", params);
        const { ok, msg } = await res.data;
        Vue.notify({
          title: "Success",
          text: msg,
          type: "success",
        });
        return ok;
      } catch (err) {
        Vue.notify({
          title: "Error",
          text: err.response.data.msg,
          type: "error",
        });
        console.log(err);
      } finally {
        commit("setLoading", false);
      }
    },
    async deleteExchangeRate({ commit }, params) {
      commit("setLoading", true);
      try {
        const res = await api.delete("/currencies/rate", {
          data: { ...params },
        });
        Vue.notify({
          title: "Success",
          text: `${params.base}->${params.target} deleted.`,
          type: "success",
        });
        return res.status;
      } catch (err) {
        Vue.notify({
          title: "Error",
          text: err.response.data.msg,
          type: "error",
        });
        console.log(err);
      } finally {
        commit("setLoading", false);
      }
    },
    async deleteCurrency({ commit }, params) {
      commit("setLoading", true);
      try {
        const res = await api.delete("/currencies", {
          data: { ...params },
        });
        Vue.notify({
          title: "Success",
          text: `${params.symbol} deleted successfully.`,
          type: "success",
        });
        return res.status;
      } catch (err) {
        Vue.notify({
          title: "Error",
          text: err.response.data.msg,
          type: "error",
        });
        console.log(err);
      } finally {
        commit("setLoading", false);
      }
    },
    async setExchangeRate({ commit }, params) {
      commit("setLoading", true);
      try {
        const res = await api.put("/currencies/rate", params);
        const { ok, msg } = await res.data;
        Vue.notify({
          title: "Success",
          text: msg,
          type: "success",
        });
        return ok;
      } catch (err) {
        Vue.notify({
          title: "Error",
          text: err.response.data.msg,
          type: "error",
        });
        console.log(err);
      } finally {
        commit("setLoading", false);
      }
    },
  },
  mutations: {
    setLoading(state, value) {
      state.loading = value;
    },
    setAccessToken(state, value) {
      localStorage.setItem("accessToken", JSON.stringify(value));
      state.tokens.access = value;
    },
    setRefreshToken(state, value) {
      localStorage.setItem("refreshToken", JSON.stringify(value));
      state.tokens.refresh = value;
    },
    setUser(state, value) {
      localStorage.setItem("user", JSON.stringify(value));
      state.user = value;
    },
    removeAccessToken(state) {
      localStorage.removeItem("accessToken");
      state.tokens.access = null;
    },
    removeRefreshToken(state) {
      localStorage.removeItem("refreshToken");
      state.tokens.refresh = null;
    },
    removeUser(state) {
      localStorage.removeItem("user");
      state.user = null;
    },
    setCurrencies(state, value) {
      state.currencies = value;
    },
  },
});
