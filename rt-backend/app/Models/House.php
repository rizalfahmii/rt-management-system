<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class House extends Model
{
    use HasFactory;

    protected $fillable = [
        'house_number',
        'house_status',
        'notes'
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