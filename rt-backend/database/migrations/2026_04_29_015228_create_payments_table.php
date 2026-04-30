<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
    $table->id();

    $table->foreignId('house_id')->constrained('houses')->cascadeOnDelete();
    $table->foreignId('resident_id')->constrained('residents')->cascadeOnDelete();
    $table->foreignId('payment_type_id')->constrained('payment_types')->cascadeOnDelete();

    $table->integer('month');
    $table->integer('year');

    $table->decimal('amount', 12, 2);

    $table->date('paid_at')->nullable();

    $table->enum('status', ['lunas', 'belum'])->default('belum');

    $table->enum('payment_period', ['bulanan', 'tahunan'])->default('bulanan');

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
