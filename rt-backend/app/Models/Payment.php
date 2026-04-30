<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'house_id',
        'resident_id',
        'payment_type_id',
        'month',
        'year',
        'amount',
        'paid_at',
        'status',
        'payment_period'
    ];

    public function house()
    {
        return $this->belongsTo(House::class);
    }

    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }

    public function paymentType()
    {
        return $this->belongsTo(PaymentType::class);
    }
}