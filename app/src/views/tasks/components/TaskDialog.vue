<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>{{ mode === 'create' ? 'Create New Task' : 'Edit Task' }}</DialogTitle>
        <DialogDescription>
          {{ mode === 'create' ? 'Add a new task to your list' : 'Update task details' }}
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="title">Title *</Label>
          <Input
            id="title"
            v-model="formData.title"
            placeholder="Take out the trash"
            required
            maxlength="200"
          />
        </div>

        <div class="space-y-2">
          <Label for="description">Description</Label>
          <Textarea
            id="description"
            v-model="formData.description"
            placeholder="It's very important to take the trash otherwise it's ruined"
            rows="3"
            maxlength="1000"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="priority">Priority</Label>
            <Select id="priority" v-model="formData.priority">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>

          <div class="space-y-2">
            <Label for="status">Status</Label>
            <Select id="status" v-model="formData.status">
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="emit('update:open', false)">
            Cancel
          </Button>
          <Button type="submit" :disabled="loading">
            {{ loading ? 'Saving...' : 'Save Task' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTaskStore } from '@/stores/tasks';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { Task, TaskPriority, TaskStatus } from '@/types/task';

interface Props {
  open: boolean;
  task?: Task | null;
  mode: 'create' | 'edit';
}

interface Emits {
  (e: 'update:open', value: boolean): void;
  (e: 'save'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const taskStore = useTaskStore();

const loading = ref(false);

interface FormData {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
}

const formData = ref<FormData>({
  title: '',
  description: '',
  priority: 'medium',
  status: 'pending',
});

// Reset form when dialog opens/closes or task changes
watch(() => [props.open, props.task], () => {
  if (props.open) {
    if (props.task) {
      formData.value = {
        title: props.task.title,
        description: props.task.description || '',
        priority: props.task.priority,
        status: props.task.status,
      };
    } else {
      formData.value = {
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
      };
    }
  }
}, { immediate: true });

const handleSubmit = async () => {
  loading.value = true;
  try {
    if (props.mode === 'create') {
      await taskStore.createTask({
        title: formData.value.title,
        description: formData.value.description || undefined,
        priority: formData.value.priority,
        status: formData.value.status,
      });
    } else if (props.task) {
      await taskStore.updateTask(props.task._id, {
        title: formData.value.title,
        description: formData.value.description || undefined,
        priority: formData.value.priority,
        status: formData.value.status,
      });
    }
    emit('save');
  } finally {
    loading.value = false;
  }
};
</script>
