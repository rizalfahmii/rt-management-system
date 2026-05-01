<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateResidentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
{
    return [
        'full_name' => 'required|string|max:255',
        // UBAH: Jangan gunakan 'string' kalau yang dikirim adalah file/gambar
        'ktp_photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', 
        'resident_status' => 'required|in:tetap,kontrak',
        'phone' => 'nullable|string|max:25',
        // TIPS: Kadang boolean dari FormData terbaca sebagai string "0" atau "1"
        'is_married' => 'required', 
    ];
}
}