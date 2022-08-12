import { createApp } from 'vue';
import App from './App.vue';
import { Quasar } from 'quasar';
import quasarOptions from './quasar';
import './styles/common.scss';

createApp(App).use(Quasar, quasarOptions).mount('#app');
