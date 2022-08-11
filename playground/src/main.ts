import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { Quasar } from 'quasar';
import quasarOptions from './quasar';

createApp(App).use(Quasar, quasarOptions).mount('#app');
