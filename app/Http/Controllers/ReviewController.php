<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReviewRequest;
use App\Models\Company;
use App\Models\Review;
use Inertia\Inertia;

class ReviewController extends Controller
{
    /**
     * Display a listing of reviews.
     */
    public function index()
    {
        $reviews = Review::with(['company', 'user'])
            ->when(request('search'), function ($query, $search) {
                $query->whereHas('company', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            })
            ->when(request('rating'), function ($query, $rating) {
                $query->where('rating', $rating);
            })
            ->latest()
            ->paginate(12);

        return Inertia::render('reviews/index', [
            'reviews' => $reviews,
            'filters' => [
                'search' => request('search'),
                'rating' => request('rating'),
            ],
        ]);
    }

    /**
     * Show the form for creating a new review.
     */
    public function create(Company $company)
    {
        // Check if user already has a review for this company
        if (auth()->check()) {
            $existingReview = Review::where('company_id', $company->id)
                ->where('user_id', auth()->id())
                ->first();

            if ($existingReview) {
                return redirect()->route('companies.show', $company)
                    ->with('error', 'You have already reviewed this company.');
            }
        }

        return Inertia::render('reviews/create', [
            'company' => $company,
        ]);
    }

    /**
     * Store a newly created review.
     */
    public function store(StoreReviewRequest $request, Company $company)
    {
        $review = Review::create([
            ...$request->validated(),
            'company_id' => $company->id,
            'user_id' => auth()->id(),
        ]);

        return redirect()->route('companies.show', $company)
            ->with('success', 'Review submitted successfully.');
    }

    /**
     * Display the specified review.
     */
    public function show(Review $review)
    {
        $review->load(['company', 'user']);

        return Inertia::render('reviews/show', [
            'review' => $review,
        ]);
    }
}