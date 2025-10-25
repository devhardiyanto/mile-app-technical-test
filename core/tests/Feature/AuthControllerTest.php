<?php

namespace Tests\Feature;

use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    /**
     * Test successful login with valid credentials
     */
    public function test_login_successful_with_valid_credentials(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'token',
                    'user' => [
                        'id',
                        'email',
                        'name',
                    ],
                ],
            ])
            ->assertJson([
                'success' => true,
                'message' => 'Login successful',
            ]);

        // Assert token is returned
        $this->assertNotEmpty($response->json('data.token'));
        
        // Assert user data matches
        $this->assertEquals('test@example.com', $response->json('data.user.email'));
    }

    /**
     * Test login fails with invalid email format
     */
    public function test_login_fails_with_invalid_email(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'invalid-email',
            'password' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /**
     * Test login fails with missing email
     */
    public function test_login_fails_with_missing_email(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'password' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /**
     * Test login fails with missing password
     */
    public function test_login_fails_with_missing_password(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    /**
     * Test login fails with short password (less than 6 characters)
     */
    public function test_login_fails_with_short_password(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => '12345', // 5 characters
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    /**
     * Test login response contains valid token structure
     */
    public function test_login_token_is_base64_encoded(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $token = $response->json('data.token');
        
        // Assert token can be base64 decoded
        $decoded = base64_decode($token, true);
        $this->assertNotFalse($decoded);
    }

    /**
     * Test user name is generated from email
     */
    public function test_user_name_generated_from_email(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'john.doe@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200);
        
        // Name should be generated from email username part
        $userName = $response->json('data.user.name');
        $this->assertStringContainsString('John', $userName);
    }
}
