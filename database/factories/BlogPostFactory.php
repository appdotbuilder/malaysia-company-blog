<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BlogPost>
 */
class BlogPostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->sentence(6, true);
        $categories = ['News', 'Reviews', 'Industry Insights', 'Company Spotlights', 'Market Analysis'];
        $tags = ['malaysia', 'business', 'technology', 'startup', 'finance', 'review'];
        
        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'excerpt' => fake()->paragraph(2),
            'content' => fake()->paragraphs(8, true),
            'featured_image' => null,
            'category' => fake()->randomElement($categories),
            'tags' => fake()->randomElements($tags, random_int(2, 4)),
            'status' => fake()->randomElement(['published', 'draft', 'scheduled']),
            'author_id' => User::factory(),
            'published_at' => fake()->dateTimeBetween('-1 year', '+1 month'),
            'views' => fake()->numberBetween(0, 5000),
            'meta_data' => [
                'seo_title' => $title . ' - Malaysian Business Blog',
                'seo_description' => fake()->sentence(20),
                'reading_time' => fake()->numberBetween(3, 10) . ' min read',
            ],
        ];
    }

    /**
     * Indicate that the post is published.
     */
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
            'published_at' => fake()->dateTimeBetween('-6 months', 'now'),
        ]);
    }

    /**
     * Indicate that the post is a draft.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
            'published_at' => null,
        ]);
    }
}