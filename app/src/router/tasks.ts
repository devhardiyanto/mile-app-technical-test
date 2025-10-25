// Layouts
import LayoutDefault from "@/layouts/default.vue";

// Pages
const Tasks = () => import("@/views/tasks").then(m => m.Tasks);

const tasks = [
  {
    path: "/tasks",
    component: LayoutDefault,
    children: [
      {
        path: "",
        name: "tasks",
        component: Tasks,
        meta: {
          breadcrumb: "Tasks",
          requiresAuth: true,
        },
      },
    ],
  },
];

export default tasks;
