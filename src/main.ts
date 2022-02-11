import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import router from './plugins/router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import './app.css'
import 'element-plus/dist/index.css'
let app =createApp(App);
app.use(ElementPlus);
app.use(router).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
