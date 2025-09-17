import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppShell from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Globe, MapPin, Building2, MessageCircle, ExternalLink, Calendar } from 'lucide-react';

interface Company {
    id: number;
    name: string;
    slug: string;
    description: string;
    url: string;
    industry: string;
    location: string;
    average_rating: number;
    total_reviews: number;
    is_partner: boolean;
    logo?: string;
    reviews: Review[];
}

interface Review {
    id: number;
    title: string;
    content: string;
    rating: number;
    created_at: string;
    user: {
        name: string;
    };
    pros?: string[];
    cons?: string[];
}

interface RelatedCompany {
    id: number;
    name: string;
    slug: string;
    industry: string;
    average_rating: number;
    reviews_count: number;
}

interface Props {
    company: Company;
    relatedCompanies: RelatedCompany[];
    [key: string]: unknown;
}

export default function CompanyShow({ company, relatedCompanies }: Props) {
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
            <Head title={`${company.name} - Company Profile & Reviews`}>
                <meta name="description" content={`Learn about ${company.name}, read customer reviews, and get company information. ${company.description.substring(0, 150)}...`} />
            </Head>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Company Header */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <CardTitle className="text-3xl">{company.name}</CardTitle>
                                            {company.is_partner && (
                                                <Badge className="bg-yellow-100 text-yellow-800">
                                                    ⭐ Partner
                                                </Badge>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex">
                                                    {renderStars(company.average_rating)}
                                                </div>
                                                <span className="font-medium">
                                                    {company.average_rating.toFixed(1)}
                                                </span>
                                                <span className="text-gray-600">
                                                    ({company.total_reviews} reviews)
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                            <span className="flex items-center">
                                                <Building2 className="w-4 h-4 mr-1" />
                                                {company.industry}
                                            </span>
                                            <span className="flex items-center">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                {company.location}
                                            </span>
                                            {company.url && (
                                                <a 
                                                    href={company.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center hover:text-blue-600"
                                                >
                                                    <Globe className="w-4 h-4 mr-1" />
                                                    Visit Website
                                                    <ExternalLink className="w-3 h-3 ml-1" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            
                            <CardContent>
                                <h3 className="font-semibold mb-3">About {company.name}</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    {company.description}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Reviews Section */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center">
                                        <MessageCircle className="w-5 h-5 mr-2" />
                                        Customer Reviews ({company.total_reviews})
                                    </CardTitle>
                                    <Button asChild>
                                        <Link href={`/companies/${company.slug}/reviews/create`}>
                                            Write Review
                                        </Link>
                                    </Button>
                                </div>
                            </CardHeader>
                            
                            <CardContent className="space-y-6">
                                {company.reviews.length > 0 ? (
                                    company.reviews.map((review) => (
                                        <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h4 className="font-medium text-lg">{review.title}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div className="flex">
                                                            {renderStars(review.rating)}
                                                        </div>
                                                        <span className="text-sm text-gray-600">
                                                            by {review.user.name}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-500 flex items-center">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    {new Date(review.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            
                                            <p className="text-gray-700 mb-4">{review.content}</p>
                                            
                                            {(review.pros && review.pros.length > 0) || (review.cons && review.cons.length > 0) && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {review.pros && review.pros.length > 0 && (
                                                        <div>
                                                            <h5 className="font-medium text-green-700 mb-2">👍 Pros</h5>
                                                            <ul className="text-sm text-gray-600 space-y-1">
                                                                {review.pros.map((pro, index) => (
                                                                    <li key={index}>• {pro}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                    {review.cons && review.cons.length > 0 && (
                                                        <div>
                                                            <h5 className="font-medium text-red-700 mb-2">👎 Cons</h5>
                                                            <ul className="text-sm text-gray-600 space-y-1">
                                                                {review.cons.map((con, index) => (
                                                                    <li key={index}>• {con}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-600 mb-2">No reviews yet</h3>
                                        <p className="text-gray-500 mb-4">
                                            Be the first to write a review for {company.name}
                                        </p>
                                        <Button asChild>
                                            <Link href={`/companies/${company.slug}/reviews/create`}>
                                                Write First Review
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                                
                                {company.reviews.length > 0 && (
                                    <div className="text-center pt-4">
                                        <Button asChild variant="outline">
                                            <Link href={`/reviews?company=${company.name}`}>
                                                View All Reviews →
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Company Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button asChild className="w-full">
                                    <Link href={`/companies/${company.slug}/reviews/create`}>
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        Write a Review
                                    </Link>
                                </Button>
                                {company.url && (
                                    <Button asChild variant="outline" className="w-full">
                                        <a href={company.url} target="_blank" rel="noopener noreferrer">
                                            <Globe className="w-4 h-4 mr-2" />
                                            Visit Website
                                        </a>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* Related Companies */}
                        {relatedCompanies.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Related Companies</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {relatedCompanies.map((relatedCompany) => (
                                        <div key={relatedCompany.id} className="border-b border-gray-200 pb-3 last:border-0">
                                            <h4 className="font-medium">
                                                <Link 
                                                    href={`/companies/${relatedCompany.slug}`}
                                                    className="hover:text-blue-600 transition-colors"
                                                >
                                                    {relatedCompany.name}
                                                </Link>
                                            </h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="flex">
                                                    {renderStars(relatedCompany.average_rating)}
                                                </div>
                                                <span className="text-sm text-gray-600">
                                                    ({relatedCompany.reviews_count} reviews)
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* Quick Links */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Browse</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                                    <Link href="/companies">
                                        <Building2 className="w-4 h-4 mr-2" />
                                        All Companies
                                    </Link>
                                </Button>
                                <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                                    <Link href={`/companies?industry=${company.industry}`}>
                                        <Building2 className="w-4 h-4 mr-2" />
                                        {company.industry} Companies
                                    </Link>
                                </Button>
                                <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                                    <Link href="/reviews">
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        All Reviews
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}