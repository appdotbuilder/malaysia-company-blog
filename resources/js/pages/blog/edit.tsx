import React from 'react';
import { router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface BlogPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image: string | null;
    category: string;
    tags: string[] | null;
    status: 'draft' | 'published' | 'scheduled';
    published_at: string | null;
}

interface BlogPostFormData {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image: string;
    category: string;
    tags: string[];
    status: 'draft' | 'published' | 'scheduled';
    published_at: string;
    [key: string]: string | string[] | boolean | number | null | undefined;
}

interface Props {
    post: BlogPost;
    categories: string[];
    [key: string]: unknown;
}

export default function EditBlogPost({ post, categories }: Props) {
    const { data, setData, patch, processing, errors } = useForm<BlogPostFormData>({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        featured_image: post.featured_image || '',
        category: post.category,
        tags: post.tags || [],
        status: post.status,
        published_at: post.published_at ? new Date(post.published_at).toISOString().slice(0, 16) : '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('blog.update', post.id));
    };

    const handleTitleChange = (value: string) => {
        setData(prev => ({
            ...prev,
            title: value,
            slug: value.toLowerCase()
                .replace(/[^a-zA-Z0-9 ]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '')
        }));
    };

    const handleTagsChange = (value: string) => {
        const tagArray = value.split(',').map(tag => tag.trim()).filter(tag => tag);
        setData('tags', tagArray);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this blog post?')) {
            router.delete(route('blog.destroy', post.id));
        }
    };

    return (
        <AppLayout>
            <div className="container mx-auto p-6 max-w-4xl">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">✏️ Edit Blog Post</h1>
                        <p className="text-gray-600 mt-2">Update your blog post</p>
                    </div>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        className="ml-4"
                    >
                        🗑️ Delete Post
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>📝 Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => handleTitleChange(e.target.value)}
                                        placeholder="Enter blog post title"
                                        className={errors.title ? 'border-red-500' : ''}
                                    />
                                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input
                                        id="slug"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        placeholder="url-friendly-slug"
                                        className={errors.slug ? 'border-red-500' : ''}
                                    />
                                    {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="excerpt">Excerpt *</Label>
                                <textarea
                                    id="excerpt"
                                    value={data.excerpt}
                                    onChange={(e) => setData('excerpt', e.target.value)}
                                    placeholder="Brief summary of your blog post"
                                    rows={3}
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.excerpt ? 'border-red-500' : ''}`}
                                />
                                {errors.excerpt && <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>}
                            </div>

                            <div>
                                <Label htmlFor="content">Content *</Label>
                                <textarea
                                    id="content"
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    placeholder="Write your blog post content here..."
                                    rows={12}
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.content ? 'border-red-500' : ''}`}
                                />
                                {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>🎨 Media & Categorization</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="featured_image">Featured Image URL</Label>
                                <Input
                                    id="featured_image"
                                    value={data.featured_image}
                                    onChange={(e) => setData('featured_image', e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                    className={errors.featured_image ? 'border-red-500' : ''}
                                />
                                {errors.featured_image && <p className="text-red-500 text-sm mt-1">{errors.featured_image}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="category">Category *</Label>
                                    <Input
                                        id="category"
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        placeholder="Technology, Business, etc."
                                        list="category-suggestions"
                                        className={errors.category ? 'border-red-500' : ''}
                                    />
                                    <datalist id="category-suggestions">
                                        {categories.map((cat, index) => (
                                            <option key={index} value={cat} />
                                        ))}
                                    </datalist>
                                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="tags">Tags</Label>
                                    <Input
                                        id="tags"
                                        value={data.tags.join(', ')}
                                        onChange={(e) => handleTagsChange(e.target.value)}
                                        placeholder="tag1, tag2, tag3"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">Separate tags with commas</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>🚀 Publishing Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="status">Status *</Label>
                                    <Select value={data.status} onValueChange={(value) => setData('status', value as 'draft' | 'published' | 'scheduled')}>
                                        <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">📝 Draft</SelectItem>
                                            <SelectItem value="published">🚀 Published</SelectItem>
                                            <SelectItem value="scheduled">⏰ Scheduled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="published_at">Published At</Label>
                                    <Input
                                        id="published_at"
                                        type="datetime-local"
                                        value={data.published_at}
                                        onChange={(e) => setData('published_at', e.target.value)}
                                        className={errors.published_at ? 'border-red-500' : ''}
                                    />
                                    {errors.published_at && <p className="text-red-500 text-sm mt-1">{errors.published_at}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Separator />

                    <div className="flex gap-3 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.get(`/blog/${post.slug}`)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : '💾 Update Post'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}