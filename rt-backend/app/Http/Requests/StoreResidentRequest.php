<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreResidentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name' => 'required|string|max:255',
            'ktp_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:4096',
            'resident_status' => 'required|in:tetap,kontrak',
            'phone' => 'nullable|string|max:25',
            'is_married' => 'required|boolean',
        ];
    }
}