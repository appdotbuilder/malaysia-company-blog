import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppShell from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Search, Eye, User, Calendar, Star, Building2, Award, Plus, Edit } from 'lucide-react';
import type { PaginatedData, PaginationLink } from '@/types/pagination';

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

interface Props {
    posts: PaginatedData<BlogPost>;
    categories: string[];
    recentPosts: BlogPost[];
    filters: {
        search?: string;
        category?: string;
    };
    [key: string]: unknown;
}

export default function BlogIndex({ posts, categories, recentPosts, filters }: Props) {
    const { auth } = usePage<{ auth: { user: { id: number; name: string } | null } }>().props;
    const [searchTerm, setSearchTerm] = React.useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = React.useState(filters.category || '');

    const handleFilter = () => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedCategory) params.append('category', selectedCategory);
        
        router.get('/blog', Object.fromEntries(params), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        router.get('/blog');
    };

    return (
        <AppShell>
            <Head title="Business Blog - Malaysian Industry Insights & News">
                <meta name="description" content="Stay updated with the latest business news, industry insights, and company reviews from Malaysia's leading business blog." />
            </Head>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Header */}
                        <div className="mb-8 flex justify-between items-center">
                            <div>
                                <h1 className="text-4xl font-bold mb-4">📰 Business Blog</h1>
                                <p className="text-gray-600 text-lg">
                                    Stay updated with the latest business insights and industry news from Malaysia
                                </p>
                            </div>
                            {auth.user && (
                                <Button asChild>
                                    <Link href={route('blog.create')}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        New Post
                                    </Link>
                                </Button>
                            )}
                        </div>

                        {/* Filters */}
                        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-2">Search Articles</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search articles..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-2">Category</label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            
                            <div className="flex gap-2">
                                <Button onClick={handleFilter}>
                                    Apply Filters
                                </Button>
                                <Button onClick={clearFilters} variant="outline">
                                    Clear
                                </Button>
                            </div>
                        </div>

                        {/* Articles */}
                        <div className="space-y-6">
                            {posts.data.map((post) => (
                                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="outline">{post.category}</Badge>
                                            <span className="text-sm text-gray-500 flex items-center">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                {new Date(post.published_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <CardTitle className="text-2xl">
                                            <Link 
                                                href={`/blog/${post.slug}`}
                                                className="hover:text-blue-600 transition-colors"
                                            >
                                                {post.title}
                                            </Link>
                                        </CardTitle>
                                    </CardHeader>
                                    
                                    <CardContent>
                                        <p className="text-gray-600 mb-4 line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                        
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span className="flex items-center">
                                                    <User className="w-4 h-4 mr-1" />
                                                    By {post.author.name}
                                                </span>
                                                <span className="flex items-center">
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    {post.views.toLocaleString()} views
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                {auth.user && (
                                                    <Button asChild size="sm" variant="outline">
                                                        <Link href={route('blog.edit', post.id)}>
                                                            <Edit className="w-4 h-4 mr-1" />
                                                            Edit
                                                        </Link>
                                                    </Button>
                                                )}
                                                <Button asChild size="sm">
                                                    <Link href={`/blog/${post.slug}`}>
                                                        Read More →
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Empty State */}
                        {posts.data.length === 0 && (
                            <div className="text-center py-12">
                                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
                                <p className="text-gray-500 mb-4">
                                    Try adjusting your search criteria or browse all articles
                                </p>
                                <Button onClick={clearFilters}>Clear Filters</Button>
                            </div>
                        )}

                        {/* Pagination */}
                        {posts.data.length > 0 && (
                            <div className="mt-8 flex justify-center">
                                <div className="flex gap-2">
                                    {posts.links.map((link: PaginationLink, index: number) => (
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

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Recent Posts */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">📝 Recent Articles</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {recentPosts.map((post) => (
                                    <div key={post.id} className="border-b border-gray-200 pb-3 last:border-0">
                                        <h4 className="font-medium line-clamp-2 mb-2">
                                            <Link 
                                                href={`/blog/${post.slug}`}
                                                className="hover:text-blue-600 transition-colors"
                                            >
                                                {post.title}
                                            </Link>
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Badge variant="outline" className="text-xs">
                                                {post.category}
                                            </Badge>
                                            <span>{new Date(post.published_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Categories */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">🏷️ Categories</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {categories.map((category) => (
                                        <Button
                                            key={category}
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedCategory(category);
                                                setSearchTerm('');
                                                router.get('/blog', { category });
                                            }}
                                            className="w-full justify-start"
                                        >
                                            {category}
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Links */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">🔗 Quick Links</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                                    <Link href="/companies">
                                        <Building2 className="w-4 h-4 mr-2" />
                                        Browse Companies
                                    </Link>
                                </Button>
                                <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                                    <Link href="/reviews">
                                        <Star className="w-4 h-4 mr-2" />
                                        Read Reviews
                                    </Link>
                                </Button>
                                <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                                    <Link href="/partners">
                                        <Award className="w-4 h-4 mr-2" />
                                        Partner Companies
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