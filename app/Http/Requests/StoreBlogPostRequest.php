<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBlogPostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:blog_posts,slug',
            'excerpt' => 'required|string|max:500',
            'content' => 'required|string',
            'featured_image' => 'nullable|string|max:255',
            'category' => 'required|string|max:100',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'status' => 'required|in:draft,published,scheduled',
            'published_at' => 'nullable|date',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Blog post title is required.',
            'title.max' => 'Title cannot exceed 255 characters.',
            'slug.unique' => 'This slug is already taken.',
            'excerpt.required' => 'Blog post excerpt is required.',
            'excerpt.max' => 'Excerpt cannot exceed 500 characters.',
            'content.required' => 'Blog post content is required.',
            'category.required' => 'Blog post category is required.',
            'status.required' => 'Blog post status is required.',
            'status.in' => 'Status must be draft, published, or scheduled.',
            'published_at.date' => 'Published date must be a valid date.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Set author_id to authenticated user
        $this->merge([
            'author_id' => auth()->id(),
        ]);

        // Auto-generate slug if not provided
        if (!$this->slug && $this->title) {
            $this->merge([
                'slug' => \Illuminate\Support\Str::slug($this->title),
            ]);
        }

        // Set published_at for published posts if not provided
        if ($this->status === 'published' && !$this->published_at) {
            $this->merge([
                'published_at' => now(),
            ]);
        }
    }
}