import { defineStore } from 'pinia';
import type { Task, CreateTaskInput, UpdateTaskInput, GetTasksQuery } from '@/types/task';
// import type { PaginatedResponse } from '@/types/api';
import { TaskService } from '@/services/task.service';
import { toast } from 'sonner';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  currentPage: number;
  limit: number;
  total: number;
  totalPages: number;
  filters: Partial<GetTasksQuery>;
}

export const useTaskStore = defineStore('tasks', {
  state: (): TaskState => ({
    tasks: [],
    loading: false,
    currentPage: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    filters: {},
  }),

  getters: {
    allTasks: (state) => state.tasks,
    pendingTasks: (state) => state.tasks.filter((t) => t.status === 'pending'),
    completedTasks: (state) => state.tasks.filter((t) => t.status === 'completed'),
    isLoading: (state) => state.loading,
    pagination: (state) => ({
      page: state.currentPage,
      limit: state.limit,
      total: state.total,
      totalPages: state.totalPages,
    }),
  },

  actions: {
    async fetchTasks(query?: GetTasksQuery) {
      this.loading = true;
      try {
        const params: GetTasksQuery = {
          page: query?.page || this.currentPage,
          limit: query?.limit || this.limit,
          ...this.filters,
          ...query,
        };

        const response = await TaskService.getTasks(params);
        this.tasks = response.data;
        this.currentPage = response.page;
        this.limit = response.limit;
        this.total = response.total;
        this.totalPages = response.totalPages;
      } catch (error: any) {
        toast.error(error.message || 'Failed to fetch tasks');
      } finally {
        this.loading = false;
      }
    },

    async createTask(input: CreateTaskInput) {
      try {
        const newTask = await TaskService.createTask(input);
        toast.success('Task created successfully!');
        await this.fetchTasks(); // Refresh list
        return newTask;
      } catch (error: any) {
        toast.error(error.message || 'Failed to create task');
        throw error;
      }
    },

    async updateTask(id: string, input: UpdateTaskInput) {
      try {
        const updatedTask = await TaskService.updateTask(id, input);
        // Update in local state
        const index = this.tasks.findIndex((t) => t._id === id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
        toast.success('Task updated successfully!');
        return updatedTask;
      } catch (error: any) {
        toast.error(error.message || 'Failed to update task');
        throw error;
      }
    },

    async deleteTask(id: string) {
      try {
        await TaskService.deleteTask(id);
        // Remove from local state
        this.tasks = this.tasks.filter((t) => t._id !== id);
        this.total--;
        toast.success('Task deleted successfully!');
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete task');
        throw error;
      }
    },

    async toggleTaskStatus(id: string) {
      const task = this.tasks.find((t) => t._id === id);
      if (!task) return;

      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await this.updateTask(id, { status: newStatus });
    },

    setFilters(filters: Partial<GetTasksQuery>) {
      this.filters = { ...this.filters, ...filters };
      this.currentPage = 1; // Reset to first page when filters change
    },

    clearFilters() {
      this.filters = {};
      this.currentPage = 1;
    },

    setPage(page: number) {
      this.currentPage = page;
    },
  },
});
