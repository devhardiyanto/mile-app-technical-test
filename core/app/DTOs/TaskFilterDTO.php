<?php

namespace App\DTOs;

class TaskFilterDTO
{
    public function __construct(
        public readonly ?string $status = null,
        public readonly ?string $priority = null,
        public readonly ?string $search = null,
        public readonly string $sortBy = 'created_at',
        public readonly string $sortOrder = 'desc',
        public readonly int $page = 1,
        public readonly int $perPage = 10,
    ) {
    }

    public static function fromRequest(array $data): self
    {
        return new self(
            status: $data['status'] ?? null,
            priority: $data['priority'] ?? null,
            search: $data['search'] ?? null,
            sortBy: $data['sortBy'] ?? 'created_at',
            sortOrder: $data['sortOrder'] ?? 'desc',
            page: (int) ($data['page'] ?? 1),
            perPage: (int) ($data['limit'] ?? 10),
        );
    }

    public function toArray(): array
    {
        return [
            'status' => $this->status,
            'priority' => $this->priority,
            'search' => $this->search,
            'sortBy' => $this->sortBy,
            'sortOrder' => $this->sortOrder,
            'page' => $this->page,
            'perPage' => $this->perPage,
        ];
    }
}
