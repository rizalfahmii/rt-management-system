<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ResidentController;
use App\Http\Controllers\Api\HouseController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ExpenseController;
use App\Http\Controllers\Api\DashboardController;



Route::post('/login', [AuthController::class, 'login']); 

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('residents', ResidentController::class);
    Route::apiResource('houses', HouseController::class);
    Route::post('/houses/{house}/assign-resident', [HouseController::class, 'assignResident']);
    Route::post('/houses/{house}/checkout-resident', [HouseController::class, 'checkoutResident']);
    Route::post('/payments/generate', [PaymentController::class, 'generate']);
    Route::post('/payments/{payment}/pay', [PaymentController::class, 'pay']);
    Route::apiResource('expenses', ExpenseController::class);
    Route::get('/dashboard', [DashboardController::class, 'index']);
});