<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCompanyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check(); // Only authenticated users can update companies
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('companies', 'name')->ignore($this->route('company')->id)
            ],
            'url' => 'nullable|url|max:255',
            'description' => 'required|string|min:50',
            'logo' => 'nullable|image|max:2048', // 2MB max
            'industry' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'is_partner' => 'boolean',
            'is_active' => 'boolean',
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
            'name.required' => 'Company name is required.',
            'name.unique' => 'A company with this name already exists.',
            'description.required' => 'Company description is required.',
            'description.min' => 'Description must be at least 50 characters.',
            'url.url' => 'Please provide a valid website URL.',
            'logo.image' => 'Logo must be an image file.',
            'logo.max' => 'Logo file size must not exceed 2MB.',
        ];
    }
}