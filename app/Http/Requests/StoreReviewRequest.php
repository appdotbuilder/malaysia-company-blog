<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check(); // Only authenticated users can create reviews
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
            'content' => 'required|string|min:50',
            'rating' => 'required|integer|between:1,5',
            'pros' => 'nullable|array',
            'pros.*' => 'string|max:255',
            'cons' => 'nullable|array',
            'cons.*' => 'string|max:255',
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
            'title.required' => 'Review title is required.',
            'content.required' => 'Review content is required.',
            'content.min' => 'Review content must be at least 50 characters.',
            'rating.required' => 'Please provide a rating.',
            'rating.between' => 'Rating must be between 1 and 5 stars.',
            'pros.*.max' => 'Each pro point must not exceed 255 characters.',
            'cons.*.max' => 'Each con point must not exceed 255 characters.',
        ];
    }
}