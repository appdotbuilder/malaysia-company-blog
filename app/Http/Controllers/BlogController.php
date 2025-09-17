<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBlogPostRequest;
use App\Http\Requests\UpdateBlogPostRequest;
use App\Models\BlogPost;
use Inertia\Inertia;

class BlogController extends Controller
{
    /**
     * Display a listing of blog posts.
     */
    public function index()
    {
        $posts = BlogPost::published()
            ->with('author')
            ->when(request('search'), function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                      ->orWhere('content', 'like', "%{$search}%");
            })
            ->when(request('category'), function ($query, $category) {
                $query->where('category', $category);
            })
            ->latest('published_at')
            ->paginate(12);

        $categories = BlogPost::published()
            ->distinct()
            ->pluck('category')
            ->sort()
            ->values();

        $recentPosts = BlogPost::published()
            ->with('author')
            ->latest('published_at')
            ->limit(5)
            ->get();

        return Inertia::render('blog/index', [
            'posts' => $posts,
            'categories' => $categories,
            'recentPosts' => $recentPosts,
            'filters' => [
                'search' => request('search'),
                'category' => request('category'),
            ],
        ]);
    }

    /**
     * Show the form for creating a new blog post.
     */
    public function create()
    {
        $categories = BlogPost::distinct()
            ->pluck('category')
            ->filter()
            ->sort()
            ->values();

        return Inertia::render('blog/create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created blog post in storage.
     */
    public function store(StoreBlogPostRequest $request)
    {
        $post = BlogPost::create($request->validated());

        return redirect()->route('blog.show', $post)
            ->with('success', 'Blog post created successfully.');
    }

    /**
     * Display the specified blog post.
     */
    public function show(BlogPost $post)
    {
        if ($post->status !== 'published' || $post->published_at > now()) {
            abort(404);
        }

        $post->load('author');
        $post->incrementViews();

        $relatedPosts = BlogPost::published()
            ->with('author')
            ->where('category', $post->category)
            ->where('id', '!=', $post->id)
            ->latest('published_at')
            ->limit(4)
            ->get();

        return Inertia::render('blog/show', [
            'post' => $post,
            'relatedPosts' => $relatedPosts,
        ]);
    }

    /**
     * Show the form for editing the specified blog post.
     */
    public function edit(BlogPost $post)
    {
        $categories = BlogPost::distinct()
            ->pluck('category')
            ->filter()
            ->sort()
            ->values();

        return Inertia::render('blog/edit', [
            'post' => $post,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified blog post in storage.
     */
    public function update(UpdateBlogPostRequest $request, BlogPost $post)
    {
        $post->update($request->validated());

        return redirect()->route('blog.show', $post)
            ->with('success', 'Blog post updated successfully.');
    }

    /**
     * Remove the specified blog post from storage.
     */
    public function destroy(BlogPost $post)
    {
        $post->delete();

        return redirect()->route('blog.index')
            ->with('success', 'Blog post deleted successfully.');
    }
}