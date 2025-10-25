<?php

namespace App\DTOs;

class TaskDTO
{
    public function __construct(
        public readonly string $title,
        public readonly ?string $description,
        public readonly string $priority,
        public readonly string $status,
        public readonly ?string $userId = null,
    ) {
    }

    public static function fromRequest(array $data, ?string $userId = null): self
    {
        return new self(
            title: $data['title'],
            description: $data['description'] ?? null,
            priority: $data['priority'] ?? 'medium',
            status: $data['status'] ?? 'pending',
            userId: $userId,
        );
    }

    public function toArray(): array
    {
        $data = [
            'title' => $this->title,
            'description' => $this->description,
            'priority' => $this->priority,
            'status' => $this->status,
        ];

        if ($this->userId) {
            $data['user_id'] = $this->userId;
        }

        return $data;
    }
}
