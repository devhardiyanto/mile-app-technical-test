<?php

namespace App\Http\Controllers\Api;

use App\DTOs\TaskDTO;
use App\DTOs\TaskFilterDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @tags Tasks
 */
class TaskController extends Controller
{
    /**
     * Get all tasks
     *
     * Retrieve paginated list of tasks with optional filtering and sorting.
     *
     * @queryParam page integer Page number for pagination. Example: 1
     * @queryParam limit integer Number of items per page. Example: 10
     * @queryParam status string Filter by status (pending, completed). Example: pending
     * @queryParam priority string Filter by priority (low, medium, high). Example: high
     * @queryParam search string Search in title and description. Example: task
     * @queryParam sortBy string Sort by field (created_at, updated_at, title, priority, status). Example: created_at
     * @queryParam sortOrder string Sort order (asc, desc). Example: desc
     *
     * @response 200 {
     *   "success": true,
     *   "message": "Tasks retrieved successfully",
     *   "data": [{
     *     "_id": "507f1f77bcf86cd799439011",
     *     "title": "Complete project",
     *     "description": "Finish the technical test",
     *     "priority": "high",
     *     "status": "pending",
     *     "user_id": "user_123",
     *     "created_at": "2024-01-01T00:00:00.000000Z",
     *     "updated_at": "2024-01-01T00:00:00.000000Z"
     *   }],
     *   "meta": {
     *     "current_page": 1,
     *     "per_page": 10,
     *     "total": 50,
     *     "last_page": 5,
     *     "from": 1,
     *     "to": 10
     *   }
     * }
     */
    public function index(Request $request): JsonResponse
    {
        $filterDTO = TaskFilterDTO::fromRequest($request->all());

        // Mock user ID (in real app, get from auth)
        $userId = $request->header('X-User-Id', 'user_mock_123');

        $query = Task::query()
            ->userId($userId)
            ->status($filterDTO->status)
            ->priority($filterDTO->priority)
            ->search($filterDTO->search);

        // Sorting
        $query->orderBy($filterDTO->sortBy, $filterDTO->sortOrder);

        // Pagination
        $tasks = $query->paginate(
            perPage: $filterDTO->perPage,
            page: $filterDTO->page
        );

        return response()->json([
            'success' => true,
            'message' => 'Tasks retrieved successfully',
            'data' => $tasks->items(),
            'meta' => [
                'current_page' => $tasks->currentPage(),
                'per_page' => $tasks->perPage(),
                'total' => $tasks->total(),
                'last_page' => $tasks->lastPage(),
                'from' => $tasks->firstItem(),
                'to' => $tasks->lastItem(),
            ],
        ], 200);
    }

    /**
     * Get single task
     *
     * Retrieve a specific task by ID.
     *
     * @urlParam id string required The task ID. Example: 507f1f77bcf86cd799439011
     *
     * @response 200 {
     *   "success": true,
     *   "message": "Task retrieved successfully",
     *   "data": {
     *     "_id": "507f1f77bcf86cd799439011",
     *     "title": "Complete project",
     *     "description": "Finish the technical test",
     *     "priority": "high",
     *     "status": "pending",
     *     "user_id": "user_123",
     *     "created_at": "2024-01-01T00:00:00.000000Z",
     *     "updated_at": "2024-01-01T00:00:00.000000Z"
     *   }
     * }
     * @response 404 {
     *   "success": false,
     *   "message": "Task not found"
     * }
     */
    public function show(string $id): JsonResponse
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json([
                'success' => false,
                'message' => 'Task not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Task retrieved successfully',
            'data' => $task,
        ], 200);
    }

    /**
     * Create new task
     *
     * Create a new task with provided details.
     *
     * @bodyParam title string required Task title (max 200 chars). Example: Complete Laravel project
     * @bodyParam description string Task description (max 1000 chars). Example: Implement all CRUD operations
     * @bodyParam priority string required Priority level (low, medium, high). Example: high
     * @bodyParam status string required Task status (pending, completed). Example: pending
     *
     * @response 201 {
     *   "success": true,
     *   "message": "Task created successfully",
     *   "data": {
     *     "_id": "507f1f77bcf86cd799439011",
     *     "title": "Complete Laravel project",
     *     "description": "Implement all CRUD operations",
     *     "priority": "high",
     *     "status": "pending",
     *     "user_id": "user_123",
     *     "created_at": "2024-01-01T00:00:00.000000Z",
     *     "updated_at": "2024-01-01T00:00:00.000000Z"
     *   }
     * }
     * @response 422 {
     *   "success": false,
     *   "message": "Validation failed",
     *   "errors": {
     *     "title": ["The title field is required."]
     *   }
     * }
     */
    public function store(StoreTaskRequest $request): JsonResponse
    {
        // Mock user ID (in real app, get from auth)
        $userId = $request->header('X-User-Id', 'user_mock_123');

        $taskDTO = TaskDTO::fromRequest($request->validated(), $userId);

        $task = Task::create($taskDTO->toArray());

        return response()->json([
            'success' => true,
            'message' => 'Task created successfully',
            'data' => $task->fresh(),
        ], 201);
    }

    /**
     * Update task
     *
     * Update an existing task by ID.
     *
     * @urlParam id string required The task ID. Example: 507f1f77bcf86cd799439011
     * @bodyParam title string Task title (max 200 chars). Example: Updated task title
     * @bodyParam description string Task description (max 1000 chars). Example: Updated description
     * @bodyParam priority string Priority level (low, medium, high). Example: medium
     * @bodyParam status string Task status (pending, completed). Example: completed
     *
     * @response 200 {
     *   "success": true,
     *   "message": "Task updated successfully",
     *   "data": {
     *     "_id": "507f1f77bcf86cd799439011",
     *     "title": "Updated task title",
     *     "description": "Updated description",
     *     "priority": "medium",
     *     "status": "completed",
     *     "user_id": "user_123",
     *     "created_at": "2024-01-01T00:00:00.000000Z",
     *     "updated_at": "2024-01-02T00:00:00.000000Z"
     *   }
     * }
     * @response 404 {
     *   "success": false,
     *   "message": "Task not found"
     * }
     */
    public function update(UpdateTaskRequest $request, string $id): JsonResponse
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json([
                'success' => false,
                'message' => 'Task not found',
            ], 404);
        }

        $task->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Task updated successfully',
            'data' => $task->fresh(),
        ], 200);
    }

    /**
     * Delete task
     *
     * Delete a task by ID.
     *
     * @urlParam id string required The task ID. Example: 507f1f77bcf86cd799439011
     *
     * @response 200 {
     *   "success": true,
     *   "message": "Task deleted successfully"
     * }
     * @response 404 {
     *   "success": false,
     *   "message": "Task not found"
     * }
     */
    public function destroy(string $id): JsonResponse
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json([
                'success' => false,
                'message' => 'Task not found',
            ], 404);
        }

        $task->delete();

        return response()->json([
            'success' => true,
            'message' => 'Task deleted successfully',
        ], 200);
    }
}
