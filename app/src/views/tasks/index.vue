<template>
  <div class="min-h-screen bg-neutral-50">
    <!-- Header -->
    <header class="bg-white border-b border-neutral-200">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 class="text-2xl font-semibold">My Tasks</h1>
        <div class="flex items-center gap-4">
          <span class="text-sm text-neutral-600">{{ authStore.user?.name }}</span>
          <Button variant="ghost" size="sm" @click="handleLogout">
            Logout
          </Button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6">
      <!-- Filters & Actions -->
      <div class="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Select v-model="filters.status" @change="handleFilterChange" class="w-full sm:w-40">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </Select>
          <Select v-model="filters.priority" @change="handleFilterChange" class="w-full sm:w-40">
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </div>
        <Button @click="openCreateDialog">
          <Plus class="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      <!-- Loading State -->
      <div v-if="taskStore.isLoading" class="flex justify-center py-12">
        <div class="text-neutral-500">Loading tasks...</div>
      </div>

      <!-- Empty State -->
      <div v-else-if="taskStore.allTasks.length === 0" class="text-center py-12">
        <p class="text-neutral-500 mb-4">No tasks found</p>
        <Button @click="openCreateDialog">Create your first task</Button>
      </div>

      <!-- Task List -->
      <div v-else class="space-y-3">
        <TaskCard
          v-for="task in taskStore.allTasks"
          :key="task._id"
          :task="task"
          @edit="openEditDialog"
          @delete="handleDelete"
          @toggle-status="handleToggleStatus"
        />
      </div>

      <!-- Pagination -->
      <div v-if="taskStore.totalPages > 1" class="mt-6 flex justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="taskStore.pagination.page === 1"
          @click="handlePageChange(taskStore.pagination.page - 1)"
        >
          Previous
        </Button>
        <span class="flex items-center px-4 text-sm text-neutral-600">
          Page {{ taskStore.pagination.page }} of {{ taskStore.pagination.totalPages }}
        </span>
        <Button
          variant="outline"
          size="sm"
          :disabled="taskStore.pagination.page === taskStore.pagination.totalPages"
          @click="handlePageChange(taskStore.pagination.page + 1)"
        >
          Next
        </Button>
      </div>
    </main>

    <!-- Task Dialog -->
    <TaskDialog
      v-model:open="dialogOpen"
      :task="selectedTask"
      :mode="dialogMode"
      @save="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useTaskStore } from '@/stores/tasks';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Plus } from 'lucide-vue-next';
import TaskCard from './components/TaskCard.vue';
import TaskDialog from './components/TaskDialog.vue';
import type { Task } from '@/types/task';

const router = useRouter();
const authStore = useAuthStore();
const taskStore = useTaskStore();

const dialogOpen = ref(false);
const dialogMode = ref<'create' | 'edit'>('create');
const selectedTask = ref<Task | null>(null);

const filters = ref({
  status: '',
  priority: '',
});

onMounted(() => {
  taskStore.fetchTasks();
});

const handleFilterChange = () => {
  const filterParams: any = {};
  if (filters.value.status) filterParams.status = filters.value.status;
  if (filters.value.priority) filterParams.priority = filters.value.priority;
  
  taskStore.setFilters(filterParams);
  taskStore.fetchTasks();
};

const handlePageChange = (page: number) => {
  taskStore.setPage(page);
  taskStore.fetchTasks({ page });
};

const openCreateDialog = () => {
  selectedTask.value = null;
  dialogMode.value = 'create';
  dialogOpen.value = true;
};

const openEditDialog = (task: Task) => {
  selectedTask.value = task;
  dialogMode.value = 'edit';
  dialogOpen.value = true;
};

const handleSave = async () => {
  dialogOpen.value = false;
  selectedTask.value = null;
};

const handleDelete = async (taskId: string) => {
  if (confirm('Are you sure you want to delete this task?')) {
    await taskStore.deleteTask(taskId);
  }
};

const handleToggleStatus = async (taskId: string) => {
  await taskStore.toggleTaskStatus(taskId);
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
