<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use App\Models\Company;
use App\Models\FAQ;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
        ]);

        // Create regular users
        $users = User::factory()->count(20)->create();

        // Create companies
        $companies = Company::factory()->count(50)->create();
        
        // Create some partner companies
        Company::factory()->count(10)->partner()->create();

        // Create blog posts
        BlogPost::factory()->count(30)->published()->create([
            'author_id' => $admin->id,
        ]);
        
        BlogPost::factory()->count(10)->draft()->create([
            'author_id' => $admin->id,
        ]);

        // Create reviews for companies
        $companies->each(function ($company) use ($users) {
            Review::factory()
                ->count(random_int(0, 8))
                ->create([
                    'company_id' => $company->id,
                    'user_id' => $users->random()->id,
                ]);
        });

        // Create FAQs
        FAQ::factory()->create([
            'question' => 'How do I add my company to this platform?',
            'answer' => 'You can add your company by creating an account and clicking the "Add Company" button. Fill in all required information including company name, description, website URL, and contact details.',
            'category' => 'General',
            'order' => 1,
        ]);

        FAQ::factory()->create([
            'question' => 'How are companies verified on this platform?',
            'answer' => 'Companies are verified through a multi-step process including document verification, website verification, and business registration checks. Verified companies display a verification badge.',
            'category' => 'Companies',
            'order' => 2,
        ]);

        FAQ::factory()->create([
            'question' => 'Can I edit or delete my review?',
            'answer' => 'Yes, you can edit or delete your reviews from your account dashboard. However, once a review has been verified by our moderators, editing may require re-verification.',
            'category' => 'Reviews',
            'order' => 3,
        ]);

        FAQ::factory()->create([
            'question' => 'What are the benefits of becoming a partner company?',
            'answer' => 'Partner companies receive featured placement on our homepage, priority in search results, detailed analytics, and direct contact with potential customers through our platform.',
            'category' => 'Partnership',
            'order' => 4,
        ]);

        FAQ::factory()->create([
            'question' => 'How do you ensure review authenticity?',
            'answer' => 'We use multiple verification methods including email verification, purchase verification (where applicable), and AI-powered content analysis to detect fake reviews. Suspicious reviews are manually reviewed by our team.',
            'category' => 'Reviews',
            'order' => 5,
        ]);

        FAQ::factory()->count(15)->create();
    }
}