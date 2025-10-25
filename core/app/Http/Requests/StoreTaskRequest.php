<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string', 'max:1000'],
            'priority' => ['required', 'in:low,medium,high'],
            'status' => ['required', 'in:pending,completed'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Title is required',
            'title.max' => 'Title cannot be more than 200 characters',
            'description.max' => 'Description cannot be more than 1000 characters',
            'priority.required' => 'Priority is required',
            'priority.in' => 'Priority must be low, medium, or high',
            'status.required' => 'Status is required',
            'status.in' => 'Status must be pending or completed',
        ];
    }
}
