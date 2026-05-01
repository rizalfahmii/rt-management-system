<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Models\Payment;
use App\Models\Expense;
use Carbon\Carbon;
use App\Exports\MonthlyReportExport;
use Maatwebsite\Excel\Facades\Excel;

class DashboardController extends Controller
{
 public function exportPaymentsCsv()
{
    $filename = "laporan-pembayaran-" . date('Y-m-d') . ".csv";

    $headers = [
        'Content-Type' => 'text/csv',
        'Content-Disposition' => "attachment; filename=\"$filename\"",
        'Pragma' => 'no-cache',
        'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
        'Expires' => '0',
    ];

    $callback = function () {
        $file = fopen('php://output', 'w');

        // Header kolom
        fputcsv($file, [
            'ID',
            'Rumah',
            'Penghuni',
            'Jenis Iuran',
            'Bulan',
            'Tahun',
            'Nominal',
            'Status',
            'Tanggal Bayar'
        ]);

        $payments = \App\Models\Payment::with([
            'house',
            'resident',
            'paymentType'
        ])->latest()->get();

        foreach ($payments as $item) {
            fputcsv($file, [
                $item->id,
                $item->house?->house_number,
                $item->resident?->full_name,
                $item->paymentType?->name,
                $item->month,
                $item->year,
                $item->amount,
                $item->status,
                $item->paid_at,
            ]);
        }

        fclose($file);
    };

    return response()->stream($callback, 200, $headers);
}
    
    public function summary()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'income' => 500000,
                'expense' => 200000,
                'balance' => 300000,
                'total_house' => 20,
                'occupied_house' => 15,
                'empty_house' => 5,
                'recent_payments' => [],
                'recent_expenses' => []
            ]
        ]);
    }
     public function chart()
    {
        $year = request('year', now()->year);

        $months = collect(range(1, 12))->map(function ($month) use ($year) {

            $income = Payment::where('status', 'lunas')
                ->whereYear('paid_at', $year)
                ->whereMonth('paid_at', $month)
                ->sum('amount');

            $expense = Expense::whereYear('expense_date', $year)
                ->whereMonth('expense_date', $month)
                ->sum('amount');

            return [
                'month' => Carbon::create()->month($month)->format('M'),
                'income' => (int) $income,
                'expense' => (int) $expense,
                'balance' => (int) ($income - $expense),
            ];
        });

        return response()->json([
            'success' => true,
            'year' => $year,
            'summary' => [
                'income' => $months->sum('income'),
                'expense' => $months->sum('expense'),
                'balance' => $months->sum('balance'),
            ],
            'chart' => $months
        ]);
    }
    public function monthlyDetail()
{
    $month = request('month');
    $year  = request('year');

    $payments = Payment::with(['resident', 'house', 'paymentType'])
        ->where('status', 'lunas')
        ->whereMonth('paid_at', $month)
        ->whereYear('paid_at', $year)
        ->get();

    $expenses = Expense::whereMonth('created_at', $month)
        ->whereYear('created_at', $year)
        ->get();

    $income = $payments->sum('amount');
    $expense = $expenses->sum('amount');

    return response()->json([
        'success' => true,
        'summary' => [
            'income' => $income,
            'expense' => $expense,
            'balance' => $income - $expense,
        ],
        'payments' => $payments,
        'expenses' => $expenses,
    ]);
}
}