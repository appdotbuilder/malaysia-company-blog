import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppShell from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, User, Eye, ArrowLeft, Edit, Trash2, Clock, Share } from 'lucide-react';

interface BlogPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image?: string;
    category: string;
    tags?: string[];
    status: string;
    published_at: string;
    views: number;
    author: {
        id: number;
        name: string;
    };
}

interface Props {
    post: BlogPost;
    relatedPosts: BlogPost[];
    [key: string]: unknown;
}

export default function BlogShow({ post, relatedPosts }: Props) {
    const { auth } = usePage<{ auth: { user: { id: number; name: string } | null } }>().props;

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this blog post?')) {
            router.delete(route('blog.destroy', post.id));
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: post.title,
                text: post.excerpt,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <AppShell>
            <Head title={post.title}>
                <meta name="description" content={post.excerpt} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.excerpt} />
                {post.featured_image && (
                    <meta property="og:image" content={post.featured_image} />
                )}
                <meta property="og:type" content="article" />
            </Head>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <div className="mb-6">
                        <Button asChild variant="ghost" size="sm">
                            <Link href={route('blog.index')}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Blog
                            </Link>
                        </Button>
                    </div>

                    {/* Article Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Badge variant="secondary">{post.category}</Badge>
                            {post.tags && post.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                            <span className="flex items-center">
                                <User className="w-4 h-4 mr-2" />
                                By {post.author.name}
                            </span>
                            <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {new Date(post.published_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                            <span className="flex items-center">
                                <Eye className="w-4 h-4 mr-2" />
                                {post.views.toLocaleString()} views
                            </span>
                            <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                {Math.ceil(post.content.split(' ').length / 200)} min read
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mb-6">
                            <Button onClick={handleShare} variant="outline" size="sm">
                                <Share className="w-4 h-4 mr-2" />
                                Share
                            </Button>
                            {auth.user && (
                                <>
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={route('blog.edit', post.id)}>
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit
                                        </Link>
                                    </Button>
                                    <Button 
                                        onClick={handleDelete} 
                                        variant="destructive" 
                                        size="sm"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                    </Button>
                                </>
                            )}
                        </div>

                        {post.featured_image && (
                            <div className="mb-8">
                                <img 
                                    src={post.featured_image} 
                                    alt={post.title}
                                    className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                                />
                            </div>
                        )}

                        <p className="text-xl text-gray-600 leading-relaxed">
                            {post.excerpt}
                        </p>
                    </div>

                    <Separator className="mb-8" />

                    {/* Article Content */}
                    <div className="prose prose-lg max-w-none mb-12">
                        <div 
                            className="text-gray-800 leading-relaxed"
                            dangerouslySetInnerHTML={{ 
                                __html: post.content.replace(/\n/g, '<br />') 
                            }}
                        />
                    </div>

                    <Separator className="mb-8" />

                    {/* Related Posts */}
                    {relatedPosts.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold mb-6">📚 Related Articles</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {relatedPosts.map((relatedPost) => (
                                    <Card key={relatedPost.id} className="hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <Badge variant="outline" className="w-fit mb-2">
                                                {relatedPost.category}
                                            </Badge>
                                            <CardTitle className="text-lg">
                                                <Link 
                                                    href={`/blog/${relatedPost.slug}`}
                                                    className="hover:text-blue-600 transition-colors"
                                                >
                                                    {relatedPost.title}
                                                </Link>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-600 mb-4 line-clamp-3">
                                                {relatedPost.excerpt}
                                            </p>
                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <span className="flex items-center">
                                                    <User className="w-3 h-3 mr-1" />
                                                    {relatedPost.author.name}
                                                </span>
                                                <span className="flex items-center">
                                                    <Eye className="w-3 h-3 mr-1" />
                                                    {relatedPost.views.toLocaleString()}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-center">
                        <Button asChild>
                            <Link href={route('blog.index')}>
                                📰 Browse More Articles
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}