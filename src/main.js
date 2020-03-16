import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import axios from "axios";
import VueAxios from "vue-axios";
import PaperDashboard from "./plugins/paperDashboard";
import VueApexCharts from "vue-apexcharts";

Vue.config.productionTip = false;
axios.interceptors.request.use(
  config => {
    config.headers["Content-Type"] = "application/json; charset=utf-8";
    return config;
  },
  err => {
    console.log(err);
  }
);

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.log(error);
  }
);

Vue.use(VueAxios, axios);
Vue.use(PaperDashboard);
Vue.component("apexchart", VueApexCharts);

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount("#app");
