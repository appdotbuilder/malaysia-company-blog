<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Company>
 */
class CompanyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->company();
        
        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'url' => fake()->url(),
            'description' => fake()->paragraphs(3, true),
            'logo' => null,
            'industry' => fake()->randomElement(['Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Retail', 'Education', 'Real Estate', 'Food & Beverage']),
            'location' => fake()->randomElement(['Kuala Lumpur', 'Johor Bahru', 'Penang', 'Ipoh', 'Shah Alam', 'Petaling Jaya', 'Cyberjaya', 'Putrajaya']),
            'is_partner' => fake()->boolean(20), // 20% chance of being partner
            'is_active' => fake()->boolean(95), // 95% chance of being active
            'average_rating' => fake()->randomFloat(2, 1, 5),
            'total_reviews' => fake()->numberBetween(0, 100),
            'meta_data' => [
                'seo_title' => $name . ' - Malaysian Company Review',
                'seo_description' => 'Read reviews and learn about ' . $name . ', a leading company in Malaysia.',
                'founded_year' => fake()->year(),
                'employee_count' => fake()->randomElement(['1-10', '11-50', '51-200', '201-500', '500+']),
            ],
        ];
    }

    /**
     * Indicate that the company is a partner.
     */
    public function partner(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_partner' => true,
        ]);
    }

    /**
     * Indicate that the company is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}