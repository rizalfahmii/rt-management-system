<?php

namespace App\Exports;

use App\Models\Payment;
use App\Models\Expense;
use Maatwebsite\Excel\Concerns\FromArray;

class MonthlyReportExport implements FromArray
{
    protected $month;
    protected $year;

    public function __construct($month, $year)
    {
        $this->month = $month;
        $this->year = $year;
    }

    public function array(): array
    {
        $payments = Payment::with(['resident', 'house', 'paymentType'])
            ->where('status', 'lunas')
            ->whereMonth('paid_at', $this->month)
            ->whereYear('paid_at', $this->year)
            ->get();

        $expenses = Expense::whereMonth('created_at', $this->month)
            ->whereYear('created_at', $this->year)
            ->get();

        $income = $payments->sum('amount');
        $expense = $expenses->sum('amount');
        $balance = $income - $expense;

        $rows = [];

        $rows[] = ['LAPORAN BULANAN'];
        $rows[] = ['Bulan', $this->month];
        $rows[] = ['Tahun', $this->year];
        $rows[] = [];

        $rows[] = ['SUMMARY'];
        $rows[] = ['Pemasukan', $income];
        $rows[] = ['Pengeluaran', $expense];
        $rows[] = ['Saldo', $balance];
        $rows[] = [];

        $rows[] = ['DETAIL PEMASUKAN'];
        $rows[] = ['Nama', 'Rumah', 'Tipe', 'Nominal'];

        foreach ($payments as $item) {
            $rows[] = [
                $item->resident?->full_name,
                $item->house?->house_number,
                $item->paymentType?->name,
                $item->amount
            ];
        }

        $rows[] = [];
        $rows[] = ['DETAIL PENGELUARAN'];
        $rows[] = ['Judul', 'Nominal'];

        foreach ($expenses as $item) {
            $rows[] = [
                $item->title,
                $item->amount
            ];
        }

        return $rows;
    }
}