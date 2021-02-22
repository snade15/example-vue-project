import Vue from 'vue';
import VueRouter from 'vue-router';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/nl';

import axios from 'axios';
import VueAxios from 'vue-axios';

import App from './App';
import Main from './pages/main/main';

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(ElementUI,{ locale });
Vue.use(VueAxios, axios);

const routes = [
    { path: '/', component: Main },
];

const router = new VueRouter({routes})

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
