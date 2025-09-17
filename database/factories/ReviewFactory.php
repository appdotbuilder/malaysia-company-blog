<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Review>
 */
class ReviewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $pros = ['Great customer service', 'Competitive pricing', 'Quality products', 'Fast delivery', 'Professional staff'];
        $cons = ['Limited options', 'Slow response times', 'High prices', 'Poor communication', 'Limited locations'];
        
        return [
            'company_id' => Company::factory(),
            'user_id' => User::factory(),
            'title' => fake()->sentence(4, true),
            'content' => fake()->paragraphs(3, true),
            'rating' => fake()->numberBetween(1, 5),
            'is_verified' => fake()->boolean(70), // 70% chance of being verified
            'is_featured' => fake()->boolean(10), // 10% chance of being featured
            'pros' => fake()->randomElements($pros, random_int(1, 3)),
            'cons' => fake()->randomElements($cons, random_int(0, 2)),
        ];
    }

    /**
     * Indicate that the review is verified.
     */
    public function verified(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_verified' => true,
        ]);
    }

    /**
     * Indicate that the review is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }

    /**
     * Create a high-rating review.
     */
    public function highRating(): static
    {
        return $this->state(fn (array $attributes) => [
            'rating' => fake()->numberBetween(4, 5),
        ]);
    }
}