import { createRouter, createWebHistory } from 'vue-router'
import HomeVue from "@/views/Home.vue"
import InvoiceView from "@/views/InvoiceView.vue"
const routes = [
  {
    path: "/",
    name: 'Home',
    component: HomeVue
  },
  {
    path: "/invoice/:invoiceId",
    name: 'invoice-comp',
    component: InvoiceView
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
