<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Resident extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'ktp_photo',
        'resident_status',
        'phone',
        'is_married'
    ];

    public function occupancies()
    {
        return $this->hasMany(HouseOccupancy::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}