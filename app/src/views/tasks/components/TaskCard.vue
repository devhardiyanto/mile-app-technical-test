<template>
  <Card class="hover:shadow-md transition-shadow">
    <CardContent class="p-4">
      <div class="flex items-start gap-3">
        <!-- Priority Icon -->
        <div class="shrink-0 mt-1">
          <Badge :variant="getPriorityVariant(task.priority)" class="h-6 w-6 rounded-full p-0 flex items-center justify-center">
            📌
          </Badge>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <h3 class="font-medium text-neutral-900 mb-1" :class="{ 'line-through text-neutral-500': task.status === 'completed' }">
            {{ task.title }}
          </h3>
          <p v-if="task.description" class="text-sm text-neutral-500 mb-2">
            {{ task.description }}
          </p>
        </div>

        <!-- Actions -->
        <div class="shrink-0 flex items-center gap-1">
          <Button variant="ghost" size="icon" @click="emit('edit', task)">
            <Pencil class="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            @click="emit('toggleStatus', task._id)"
            :class="{ 'text-green-600': task.status === 'completed' }"
          >
            <Check class="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" @click="emit('delete', task._id)">
            <Trash2 class="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>

      <!-- Footer with Date -->
      <div class="mt-3 flex items-center justify-between">
        <Badge variant="secondary" class="text-xs">
          {{ task.priority }}
        </Badge>
        <span class="text-xs text-neutral-400">
          {{ formatDate(task.createdAt) }}
        </span>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Check, Trash2 } from 'lucide-vue-next';
import type { Task, TaskPriority } from '@/types/task';

interface Props {
  task: Task;
}

interface Emits {
  (e: 'edit', task: Task): void;
  (e: 'delete', taskId: string): void;
  (e: 'toggleStatus', taskId: string): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const getPriorityVariant = (priority: TaskPriority) => {
  switch (priority) {
    case 'high':
      return 'destructive';
    case 'medium':
      return 'default';
    case 'low':
      return 'secondary';
    default:
      return 'default';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};
</script>
