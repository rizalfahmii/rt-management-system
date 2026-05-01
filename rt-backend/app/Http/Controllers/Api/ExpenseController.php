<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreExpenseRequest;
use App\Models\Expense;
use App\Http\Requests\UpdateExpanseRequest;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index()
    {
      $expenses = Expense::latest()->paginate(10);
      return response()->json([
            'success' => true,
            'message' => 'Datae Expense',
            'data'    => $expenses,
        ]);
    }

    public function store(StoreExpenseRequest $request)
    {
        $expense = Expense::create($request->validated());

       return response()->json([
            'success' => true,
            'message' => 'Pengeluaran ditambahkan',
            'data'    => $expense,
        ], 201);
    }

    public function show($id)
    {
      $expense = Expense::find($id);

      if (!$expense) {
            return response()->json([
                'success' => false,
                'message' => 'Expense tidak ditemukan',
            ], 404);
        }
         return response()->json([
                'success' => true,
                'data' => $expense
            ]);
    }

    public function destroy($id)
    {
        $expense = Expense::destroy($id);
         if (!$expense) {
            return response()->json([
                'success' => false,
                'message' => 'id tidak valid',
            ], 404);
        }
         return response()->json([
                'success' => true,
                'data' => $expense
            ]);
    }

    public function update(UpdateExpanseRequest $request, $id)
    {
      $expense = Expense::find($id);
      if (!$expense) {
            return response()->json([
                'success' => false,
                'message' => 'id tidak valid',
            ], 404);
        }
        $expense->update($request->validated());
        return response()->json([
            'success' => true,
            'message' => 'Expense berhasil diupdate',
            'data'    => $expense,
        ]);
    }
}
