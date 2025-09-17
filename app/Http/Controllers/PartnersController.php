<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Inertia\Inertia;

class PartnersController extends Controller
{
    /**
     * Display partner companies.
     */
    public function index()
    {
        $partners = Company::active()
            ->partners()
            ->withCount('reviews')
            ->orderByDesc('average_rating')
            ->paginate(12);

        return Inertia::render('companies/partners', [
            'partners' => $partners,
        ]);
    }
}