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
    Route::get('/dashboard/chart', [DashboardController::class, 'chart']);
    Route::get('/reports/payments/export-csv', [DashboardController::class, 'exportPaymentsCsv']);
    Route::get('/reports/monthly-detail', [DashboardController::class, 'monthlyDetail']);
    Route::post('/payments/pay-yearly-cleaning', [PaymentController::class, 'payYearlyCleaning']);
     Route::get('/residents/available',
    [HouseController::class, 'availableResidents']);
    Route::get(
    '/houses/{id}/history',
    [HouseController::class, 'history']
);
    Route::apiResource('residents', ResidentController::class);
    Route::apiResource('houses', HouseController::class);
    Route::post('/houses/{house}/assign-resident', [HouseController::class, 'assignResident']);
    Route::post('/houses/{house}/checkout-resident', [HouseController::class, 'checkoutResident']);
    Route::post('/payments/generate', [PaymentController::class, 'generate']);
    Route::post('/payments/{payment}/pay', [PaymentController::class, 'pay']);
    Route::apiResource('payments', PaymentController::class);
    Route::apiResource('expenses', ExpenseController::class);
Route::get('/dashboard/summary', [DashboardController::class, 'summary']);

});