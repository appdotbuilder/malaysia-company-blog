<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\Company;
use App\Models\Review;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the home page with featured content.
     */
    public function index()
    {
        $featuredPosts = BlogPost::published()
            ->with('author')
            ->latest('published_at')
            ->limit(6)
            ->get();

        $featuredCompanies = Company::active()
            ->partners()
            ->withCount('reviews')
            ->orderByDesc('average_rating')
            ->limit(8)
            ->get();

        $featuredReviews = Review::with(['company', 'user'])
            ->featured()
            ->verified()
            ->latest()
            ->limit(6)
            ->get();

        $stats = [
            'total_companies' => Company::active()->count(),
            'total_reviews' => Review::count(),
            'total_posts' => BlogPost::published()->count(),
            'partner_companies' => Company::active()->partners()->count(),
        ];

        return Inertia::render('welcome', [
            'featuredPosts' => $featuredPosts,
            'featuredCompanies' => $featuredCompanies,
            'featuredReviews' => $featuredReviews,
            'stats' => $stats,
        ]);
    }
}