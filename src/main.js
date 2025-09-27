import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import App from './App.vue';
import router from './router';

// Styles
import 'primevue/resources/themes/lara-light-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import './styles/main.css';

const app = createApp(App);
const pinia = createPinia();

// --- ESTE ES EL ORDEN CORRECTO Y LA SOLUCIÓN ---
app.use(pinia);  // 1. Primero inicializamos Pinia (el motor de datos)
app.use(router); // 2. Luego inicializamos el Router (el GPS, que necesita los datos)

app.use(PrimeVue, { ripple: true });
app.use(ToastService);

app.mount('#app');