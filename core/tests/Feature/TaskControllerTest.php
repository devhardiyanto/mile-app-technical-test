<?php

namespace Tests\Feature;

use App\Models\Task;
use Tests\TestCase;

class TaskControllerTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        
        // Clean up before each test
        Task::query()->delete();
    }

    /**
     * Test get all tasks with pagination
     */
    public function test_can_get_all_tasks_with_pagination(): void
    {
        // Create 15 tasks
        for ($i = 1; $i <= 15; $i++) {
            Task::create([
                'title' => "Task {$i}",
                'description' => "Description {$i}",
                'priority' => 'medium',
                'status' => 'pending',
                'user_id' => 'user_test_123',
            ]);
        }

        $response = $this->getJson('/api/tasks?page=1&limit=10');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data',
                'meta' => [
                    'current_page',
                    'per_page',
                    'total',
                    'last_page',
                ],
            ])
            ->assertJson([
                'success' => true,
                'meta' => [
                    'current_page' => 1,
                    'per_page' => 10,
                    'total' => 15,
                    'last_page' => 2,
                ],
            ]);

        $this->assertCount(10, $response->json('data'));
    }

    /**
     * Test filter tasks by status
     */
    public function test_can_filter_tasks_by_status(): void
    {
        Task::create([
            'title' => 'Pending Task',
            'priority' => 'high',
            'status' => 'pending',
            'user_id' => 'user_test_123',
        ]);

        Task::create([
            'title' => 'Completed Task',
            'priority' => 'low',
            'status' => 'completed',
            'user_id' => 'user_test_123',
        ]);

        $response = $this->getJson('/api/tasks?status=completed');

        $response->assertStatus(200);
        
        $tasks = $response->json('data');
        $this->assertCount(1, $tasks);
        $this->assertEquals('completed', $tasks[0]['status']);
    }

    /**
     * Test filter tasks by priority
     */
    public function test_can_filter_tasks_by_priority(): void
    {
        Task::create([
            'title' => 'High Priority Task',
            'priority' => 'high',
            'status' => 'pending',
            'user_id' => 'user_test_123',
        ]);

        Task::create([
            'title' => 'Low Priority Task',
            'priority' => 'low',
            'status' => 'pending',
            'user_id' => 'user_test_123',
        ]);

        $response = $this->getJson('/api/tasks?priority=high');

        $response->assertStatus(200);
        
        $tasks = $response->json('data');
        $this->assertCount(1, $tasks);
        $this->assertEquals('high', $tasks[0]['priority']);
    }

    /**
     * Test search tasks by title
     */
    public function test_can_search_tasks_by_title(): void
    {
        Task::create([
            'title' => 'Complete Laravel Project',
            'priority' => 'high',
            'status' => 'pending',
            'user_id' => 'user_test_123',
        ]);

        Task::create([
            'title' => 'Write Tests',
            'priority' => 'medium',
            'status' => 'pending',
            'user_id' => 'user_test_123',
        ]);

        $response = $this->getJson('/api/tasks?search=Laravel');

        $response->assertStatus(200);
        
        $tasks = $response->json('data');
        $this->assertCount(1, $tasks);
        $this->assertStringContainsString('Laravel', $tasks[0]['title']);
    }

    /**
     * Test sort tasks by created_at desc (default)
     */
    public function test_tasks_sorted_by_created_at_desc_by_default(): void
    {
        $task1 = Task::create([
            'title' => 'First Task',
            'priority' => 'medium',
            'status' => 'pending',
            'user_id' => 'user_test_123',
        ]);

        sleep(1); // Ensure different timestamps

        $task2 = Task::create([
            'title' => 'Second Task',
            'priority' => 'medium',
            'status' => 'pending',
            'user_id' => 'user_test_123',
        ]);

        $response = $this->getJson('/api/tasks');

        $response->assertStatus(200);
        
        $tasks = $response->json('data');
        
        // Most recent task should be first
        $this->assertEquals('Second Task', $tasks[0]['title']);
        $this->assertEquals('First Task', $tasks[1]['title']);
    }

    /**
     * Test get single task by ID
     */
    public function test_can_get_single_task_by_id(): void
    {
        $task = Task::create([
            'title' => 'Test Task',
            'description' => 'Test Description',
            'priority' => 'high',
            'status' => 'pending',
            'user_id' => 'user_test_123',
        ]);

        $response = $this->getJson("/api/tasks/{$task->_id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Task retrieved successfully',
                'data' => [
                    'title' => 'Test Task',
                    'description' => 'Test Description',
                    'priority' => 'high',
                    'status' => 'pending',
                ],
            ]);
    }

    /**
     * Test get task returns 404 for non-existent ID
     */
    public function test_get_task_returns_404_for_nonexistent_id(): void
    {
        $response = $this->getJson('/api/tasks/507f1f77bcf86cd799439011');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Task not found',
            ]);
    }

    /**
     * Test create task with valid data
     */
    public function test_can_create_task_with_valid_data(): void
    {
        $response = $this->postJson('/api/tasks', [
            'title' => 'New Task',
            'description' => 'Task Description',
            'priority' => 'high',
            'status' => 'pending',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    '_id',
                    'title',
                    'description',
                    'priority',
                    'status',
                    'user_id',
                    'created_at',
                    'updated_at',
                ],
            ])
            ->assertJson([
                'success' => true,
                'message' => 'Task created successfully',
                'data' => [
                    'title' => 'New Task',
                    'priority' => 'high',
                    'status' => 'pending',
                ],
            ]);

        // Assert task exists in database
        $this->assertDatabaseHas('tasks', [
            'title' => 'New Task',
            'priority' => 'high',
        ]);
    }

    /**
     * Test create task fails with missing required fields
     */
    public function test_create_task_fails_with_missing_title(): void
    {
        $response = $this->postJson('/api/tasks', [
            'description' => 'Description without title',
            'priority' => 'medium',
            'status' => 'pending',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title']);
    }

    /**
     * Test create task fails with invalid priority
     */
    public function test_create_task_fails_with_invalid_priority(): void
    {
        $response = $this->postJson('/api/tasks', [
            'title' => 'Test Task',
            'priority' => 'invalid-priority',
            'status' => 'pending',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['priority']);
    }

    /**
     * Test create task fails with invalid status
     */
    public function test_create_task_fails_with_invalid_status(): void
    {
        $response = $this->postJson('/api/tasks', [
            'title' => 'Test Task',
            'priority' => 'medium',
            'status' => 'invalid-status',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['status']);
    }

    /**
     * Test update task with valid data
     */
    public function test_can_update_task_with_valid_data(): void
    {
        $task = Task::create([
            'title' => 'Original Title',
            'priority' => 'low',
            'status' => 'pending',
            'user_id' => 'user_test_123',
        ]);

        $response = $this->putJson("/api/tasks/{$task->_id}", [
            'title' => 'Updated Title',
            'priority' => 'high',
            'status' => 'completed',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Task updated successfully',
                'data' => [
                    'title' => 'Updated Title',
                    'priority' => 'high',
                    'status' => 'completed',
                ],
            ]);

        // Assert database is updated
        $this->assertDatabaseHas('tasks', [
            'title' => 'Updated Title',
            'priority' => 'high',
            'status' => 'completed',
        ]);
    }

    /**
     * Test update task returns 404 for non-existent ID
     */
    public function test_update_task_returns_404_for_nonexistent_id(): void
    {
        $response = $this->putJson('/api/tasks/507f1f77bcf86cd799439011', [
            'title' => 'Updated Title',
            'priority' => 'high',
            'status' => 'completed',
        ]);

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Task not found',
            ]);
    }

    /**
     * Test delete task successfully
     */
    public function test_can_delete_task(): void
    {
        $task = Task::create([
            'title' => 'Task to Delete',
            'priority' => 'medium',
            'status' => 'pending',
            'user_id' => 'user_test_123',
        ]);

        $response = $this->deleteJson("/api/tasks/{$task->_id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Task deleted successfully',
            ]);

        // Assert task is removed from database
        $this->assertDatabaseMissing('tasks', [
            '_id' => $task->_id,
        ]);
    }

    /**
     * Test delete task returns 404 for non-existent ID
     */
    public function test_delete_task_returns_404_for_nonexistent_id(): void
    {
        $response = $this->deleteJson('/api/tasks/507f1f77bcf86cd799439011');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Task not found',
            ]);
    }

    /**
     * Test title max length validation (200 chars)
     */
    public function test_create_task_fails_when_title_exceeds_max_length(): void
    {
        $response = $this->postJson('/api/tasks', [
            'title' => str_repeat('a', 201), // 201 characters
            'priority' => 'medium',
            'status' => 'pending',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title']);
    }

    /**
     * Test description max length validation (1000 chars)
     */
    public function test_create_task_fails_when_description_exceeds_max_length(): void
    {
        $response = $this->postJson('/api/tasks', [
            'title' => 'Test Task',
            'description' => str_repeat('a', 1001), // 1001 characters
            'priority' => 'medium',
            'status' => 'pending',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['description']);
    }
}
