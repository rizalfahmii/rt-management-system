<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Expense;
use App\Models\House;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $month = $request->month ?? now()->month;
        $year  = $request->year ?? now()->year;

        // SUMMARY
        $income = Payment::where('month', $month)
            ->where('year', $year)
            ->where('status', 'lunas')
            ->sum('amount');

        $expense = Expense::whereMonth('expense_date', $month)
            ->whereYear('expense_date', $year)
            ->sum('amount');

        $occupiedHouses = House::where('house_status', 'dihuni')->count();
        $emptyHouses = House::where('house_status', 'kosong')->count();

        $paidBills = Payment::where('month', $month)
            ->where('year', $year)
            ->where('status', 'lunas')
            ->count();

        $unpaidBills = Payment::where('month', $month)
            ->where('year', $year)
            ->where('status', 'belum')
            ->count();

        // CHART 12 BULAN
        $chart = [];

        for ($i = 1; $i <= 12; $i++) {

            $monthlyIncome = Payment::where('month', $i)
                ->where('year', $year)
                ->where('status', 'lunas')
                ->sum('amount');

            $monthlyExpense = Expense::whereMonth('expense_date', $i)
                ->whereYear('expense_date', $year)
                ->sum('amount');

            $chart[] = [
                'month' => date('M', mktime(0,0,0,$i,1)),
                'income' => $monthlyIncome,
                'expense' => $monthlyExpense,
                'balance' => $monthlyIncome - $monthlyExpense
            ];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'summary' => [
                    'month' => (int)$month,
                    'year' => (int)$year,
                    'income' => $income,
                    'expense' => $expense,
                    'balance' => $income - $expense,
                    'occupied_houses' => $occupiedHouses,
                    'empty_houses' => $emptyHouses,
                    'paid_bills' => $paidBills,
                    'unpaid_bills' => $unpaidBills
                ],
                'chart' => $chart
            ]
        ]);
    }
}