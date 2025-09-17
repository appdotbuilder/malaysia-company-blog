import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppShell from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Building2, Globe, Search, Filter } from 'lucide-react';
import type { PaginatedData, PaginationLink } from '@/types/pagination';

interface Company {
    id: number;
    name: string;
    slug: string;
    description: string;
    industry: string;
    location: string;
    average_rating: number;
    reviews_count: number;
    is_partner: boolean;
}

interface Props {
    companies: PaginatedData<Company>;
    industries: string[];
    locations: string[];
    filters: {
        search?: string;
        industry?: string;
        location?: string;
    };
    [key: string]: unknown;
}

export default function CompaniesIndex({ companies, industries, locations, filters }: Props) {
    const [searchTerm, setSearchTerm] = React.useState(filters.search || '');
    const [selectedIndustry, setSelectedIndustry] = React.useState(filters.industry || '');
    const [selectedLocation, setSelectedLocation] = React.useState(filters.location || '');

    const handleFilter = () => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedIndustry) params.append('industry', selectedIndustry);
        if (selectedLocation) params.append('location', selectedLocation);
        
        router.get('/companies', Object.fromEntries(params), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedIndustry('');
        setSelectedLocation('');
        router.get('/companies');
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${
                    i < Math.floor(rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                }`}
            />
        ));
    };

    return (
        <AppShell>
            <Head title="Companies Directory - Find Malaysian Businesses">
                <meta name="description" content="Browse and discover Malaysian companies across various industries. Read reviews and find trusted businesses in Malaysia." />
            </Head>

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-4">🏢 Companies Directory</h1>
                    <p className="text-gray-600 text-lg">
                        Discover and explore Malaysian businesses across various industries
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Search Companies</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search by name or description..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-2">Industry</label>
                            <select
                                value={selectedIndustry}
                                onChange={(e) => setSelectedIndustry(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Industries</option>
                                {industries.map((industry) => (
                                    <option key={industry} value={industry}>
                                        {industry}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-2">Location</label>
                            <select
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Locations</option>
                                {locations.map((location) => (
                                    <option key={location} value={location}>
                                        {location}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="flex items-end gap-2">
                            <Button onClick={handleFilter} className="flex-1">
                                <Filter className="w-4 h-4 mr-2" />
                                Apply Filters
                            </Button>
                            <Button onClick={clearFilters} variant="outline">
                                Clear
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companies.data.map((company) => (
                        <Card key={company.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <CardTitle className="text-xl line-clamp-1">{company.name}</CardTitle>
                                        {company.is_partner && (
                                            <Badge className="mt-2 bg-yellow-100 text-yellow-800">
                                                ⭐ Partner
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="secondary">{company.industry}</Badge>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <div className="flex">
                                        {renderStars(company.average_rating)}
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        {company.average_rating.toFixed(1)} ({company.reviews_count} reviews)
                                    </span>
                                </div>
                            </CardHeader>
                            
                            <CardContent>
                                <p className="text-gray-600 line-clamp-3 mb-4">
                                    {company.description}
                                </p>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500 flex items-center">
                                        <Globe className="w-4 h-4 mr-1" />
                                        {company.location}
                                    </span>
                                    <Button asChild size="sm">
                                        <Link href={`/companies/${company.slug}`}>
                                            View Details
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {companies.data.length === 0 && (
                    <div className="text-center py-12">
                        <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No companies found</h3>
                        <p className="text-gray-500 mb-4">
                            Try adjusting your search criteria or browse all companies
                        </p>
                        <Button onClick={clearFilters}>Clear Filters</Button>
                    </div>
                )}

                {/* Pagination */}
                {companies.data.length > 0 && (
                    <div className="mt-8 flex justify-center">
                        <div className="flex gap-2">
                            {companies.links.map((link: PaginationLink, index: number) => (
                                <Button
                                    key={index}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppShell>
    );
}