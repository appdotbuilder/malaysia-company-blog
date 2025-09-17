<?php

namespace App\Http\Controllers;

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
}