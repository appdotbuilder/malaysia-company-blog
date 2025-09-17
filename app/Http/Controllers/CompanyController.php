<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCompanyRequest;
use App\Http\Requests\UpdateCompanyRequest;
use App\Models\Company;
use Inertia\Inertia;

class CompanyController extends Controller
{
    /**
     * Display a listing of companies.
     */
    public function index()
    {
        $companies = Company::active()
            ->withCount('reviews')
            ->when(request('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
            })
            ->when(request('industry'), function ($query, $industry) {
                $query->where('industry', $industry);
            })
            ->when(request('location'), function ($query, $location) {
                $query->where('location', $location);
            })
            ->orderByDesc('average_rating')
            ->paginate(12);

        $industries = Company::active()
            ->distinct()
            ->pluck('industry')
            ->filter()
            ->sort()
            ->values();

        $locations = Company::active()
            ->distinct()
            ->pluck('location')
            ->filter()
            ->sort()
            ->values();

        return Inertia::render('companies/index', [
            'companies' => $companies,
            'industries' => $industries,
            'locations' => $locations,
            'filters' => [
                'search' => request('search'),
                'industry' => request('industry'),
                'location' => request('location'),
            ],
        ]);
    }

    /**
     * Show the form for creating a new company.
     */
    public function create()
    {
        return Inertia::render('companies/create');
    }

    /**
     * Store a newly created company.
     */
    public function store(StoreCompanyRequest $request)
    {
        $company = Company::create($request->validated());

        return redirect()->route('companies.show', $company)
            ->with('success', 'Company created successfully.');
    }

    /**
     * Display the specified company.
     */
    public function show(Company $company)
    {
        $company->load([
            'reviews' => function ($query) {
                $query->with('user')->latest()->limit(10);
            }
        ]);

        $relatedCompanies = Company::active()
            ->where('industry', $company->industry)
            ->where('id', '!=', $company->id)
            ->withCount('reviews')
            ->limit(4)
            ->get();

        return Inertia::render('companies/show', [
            'company' => $company,
            'relatedCompanies' => $relatedCompanies,
        ]);
    }

    /**
     * Show the form for editing the company.
     */
    public function edit(Company $company)
    {
        return Inertia::render('companies/edit', [
            'company' => $company,
        ]);
    }

    /**
     * Update the specified company.
     */
    public function update(UpdateCompanyRequest $request, Company $company)
    {
        $company->update($request->validated());

        return redirect()->route('companies.show', $company)
            ->with('success', 'Company updated successfully.');
    }

    /**
     * Remove the company.
     */
    public function destroy(Company $company)
    {
        $company->delete();

        return redirect()->route('companies.index')
            ->with('success', 'Company deleted successfully.');
    }


}