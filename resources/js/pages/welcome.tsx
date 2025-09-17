import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppShell from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Building2, MessageCircle, FileText, Users, Award, Globe } from 'lucide-react';

interface Company {
    id: number;
    name: string;
    slug: string;
    description: string;
    industry: string;
    location: string;
    average_rating: number;
    reviews_count: number;
    logo?: string;
}

interface BlogPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    published_at: string;
    views: number;
    author: {
        name: string;
    };
    featured_image?: string;
}

interface Review {
    id: number;
    title: string;
    content: string;
    rating: number;
    created_at: string;
    company: {
        name: string;
        slug: string;
    };
    user: {
        name: string;
    };
}

interface Stats {
    total_companies: number;
    total_reviews: number;
    total_posts: number;
    partner_companies: number;
}

interface Props {
    featuredPosts: BlogPost[];
    featuredCompanies: Company[];
    featuredReviews: Review[];
    stats: Stats;
    [key: string]: unknown;
}

export default function Welcome({ featuredPosts, featuredCompanies, featuredReviews, stats }: Props) {
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
            <Head title="Malaysian Business Directory & Reviews - Your Trusted Source for Company Information" />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        🇲🇾 Malaysia Business Hub
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 opacity-90">
                        Your trusted source for company reviews, business insights, and industry news in Malaysia
                    </p>
                    <p className="text-lg mb-10 max-w-3xl mx-auto opacity-80">
                        Discover verified companies, read authentic reviews, and stay updated with the latest business news. 
                        Connect with Malaysia's top businesses and make informed decisions.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
                            <Link href="/companies">
                                <Building2 className="mr-2 h-5 w-5" />
                                Browse Companies
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3">
                            <Link href="/blog">
                                <FileText className="mr-2 h-5 w-5" />
                                Read Latest News
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <Building2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                            <div className="text-3xl font-bold text-gray-900">{stats.total_companies.toLocaleString()}</div>
                            <div className="text-gray-600">Companies Listed</div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <MessageCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                            <div className="text-3xl font-bold text-gray-900">{stats.total_reviews.toLocaleString()}</div>
                            <div className="text-gray-600">Customer Reviews</div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                            <div className="text-3xl font-bold text-gray-900">{stats.total_posts.toLocaleString()}</div>
                            <div className="text-gray-600">Blog Articles</div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                            <div className="text-3xl font-bold text-gray-900">{stats.partner_companies.toLocaleString()}</div>
                            <div className="text-gray-600">Partner Companies</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Companies */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">🏆 Top-Rated Companies</h2>
                        <p className="text-gray-600 text-lg">Discover Malaysia's most trusted and highly-rated businesses</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {featuredCompanies.slice(0, 8).map((company) => (
                            <Card key={company.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg line-clamp-1">{company.name}</CardTitle>
                                            <Badge variant="secondary" className="mt-1 text-xs">
                                                {company.industry}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="flex">
                                            {renderStars(company.average_rating)}
                                        </div>
                                        <span className="text-sm text-gray-600">
                                            ({company.reviews_count} reviews)
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                        {company.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500 flex items-center">
                                            <Globe className="w-3 h-3 mr-1" />
                                            {company.location}
                                        </span>
                                        <Button asChild size="sm" variant="outline">
                                            <Link href={`/companies/${company.slug}`}>
                                                View Details
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    
                    <div className="text-center">
                        <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                            <Link href="/companies">
                                View All Companies →
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Latest Blog Posts */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">📰 Latest Business News</h2>
                        <p className="text-gray-600 text-lg">Stay informed with the latest insights from Malaysia's business landscape</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                        {featuredPosts.slice(0, 6).map((post) => (
                            <Card key={post.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="outline">{post.category}</Badge>
                                        <span className="text-xs text-gray-500">
                                            {new Date(post.published_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 line-clamp-3 mb-4">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Users className="w-4 h-4" />
                                            <span>By {post.author.name}</span>
                                        </div>
                                        <Button asChild size="sm" variant="outline">
                                            <Link href={`/blog/${post.slug}`}>
                                                Read More
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    
                    <div className="text-center">
                        <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
                            <Link href="/blog">
                                Read All Articles →
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Recent Reviews */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">⭐ Recent Reviews</h2>
                        <p className="text-gray-600 text-lg">What our community is saying about Malaysian businesses</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {featuredReviews.slice(0, 6).map((review) => (
                            <Card key={review.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-lg line-clamp-1">{review.title}</CardTitle>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Review for <Link href={`/companies/${review.company.slug}`} className="text-blue-600 hover:underline">{review.company.name}</Link>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex">
                                            {renderStars(review.rating)}
                                        </div>
                                        <span className="text-sm text-gray-600">
                                            by {review.user.name}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-700 line-clamp-3">
                                        {review.content}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    
                    <div className="text-center">
                        <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                            <Link href="/reviews">
                                Read All Reviews →
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">🚀 Join Our Growing Community</h2>
                    <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                        Whether you're a business owner or a customer, be part of Malaysia's most comprehensive business directory and review platform.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
                            <Link href="/companies/create">
                                <Building2 className="mr-2 h-5 w-5" />
                                List Your Business
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-600">
                            <Link href="/register">
                                <Users className="mr-2 h-5 w-5" />
                                Join as Reviewer
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </AppShell>
    );
}