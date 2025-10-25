<?php

namespace App\Http\Controllers\Api;

use App\DTOs\LoginDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use Illuminate\Http\JsonResponse;

/**
 * @tags Auth
 */
class AuthController extends Controller
{
    /**
     * Mock Login
     *
     * Authenticate user with mock token generation.
     * Accept any email/password combination (password min 6 characters).
     *
     * @response 200 {
     *   "success": true,
     *   "message": "Login successful",
     *   "data": {
     *     "token": "mock_token_base64_encoded",
     *     "user": {
     *       "id": "user_mock_id",
     *       "email": "test@example.com",
     *       "name": "Test User"
     *     }
     *   }
     * }
     * @response 422 {
     *   "success": false,
     *   "message": "Validation failed",
     *   "errors": {
     *     "email": ["The email field is required."]
     *   }
     * }
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $loginDTO = LoginDTO::fromRequest($request->validated());

        // Mock token generation (base64 encode email:timestamp)
        $mockToken = base64_encode($loginDTO->email . ':' . now()->timestamp);

        // Mock user data
        $user = [
            'id' => 'user_' . md5($loginDTO->email),
            'email' => $loginDTO->email,
            'name' => $this->generateNameFromEmail($loginDTO->email),
        ];

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'token' => $mockToken,
                'user' => $user,
            ],
        ], 200);
    }

    /**
     * Generate name from email (for mock user)
     */
    private function generateNameFromEmail(string $email): string
    {
        $username = explode('@', $email)[0];
        return ucwords(str_replace(['.', '_', '-'], ' ', $username));
    }
}
