// Layouts
import LayoutAuth from "@/layouts/auth.vue";

// Pages
const Login = () => import("@/views/login").then(m => m.Login);

const auth = [
  {
    path: "/login",
    component: LayoutAuth,
    children: [
      {
        path: "",
        name: "login",
        component: Login,
        meta: {
          breadcrumb: "Login",
          requiresAuth: false,
        },
      },
    ],
  },
];

export default auth;
