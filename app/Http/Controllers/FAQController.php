<?php

namespace App\Http\Controllers;

use App\Models\FAQ;
use Inertia\Inertia;

class FAQController extends Controller
{
    /**
     * Display the FAQ page.
     */
    public function index()
    {
        $faqs = FAQ::active()
            ->when(request('category'), function ($query, $category) {
                $query->byCategory($category);
            })
            ->orderBy('order')
            ->orderBy('question')
            ->get()
            ->groupBy('category');

        $categories = FAQ::active()
            ->distinct()
            ->pluck('category')
            ->filter()
            ->sort()
            ->values();

        return Inertia::render('faq/index', [
            'faqs' => $faqs,
            'categories' => $categories,
            'selectedCategory' => request('category'),
        ]);
    }
}