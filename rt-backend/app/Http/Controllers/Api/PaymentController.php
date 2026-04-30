<?php
namespace App\Http\Controllers\Api;
use App\Models\House;
use App\Models\Payment;

use App\Http\Controllers\Controller;
use App\Models\PaymentType;
use App\Models\HouseOccupancy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function generate(Request $request)
{
    $request->validate([
        'month' => 'required|integer|min:1|max:12',
        'year' => 'required|integer'
    ]);

    $month = $request->month;
    $year = $request->year;

    DB::beginTransaction();

    try {

       
        $houses = House::where('house_status', 'dihuni')->get();

        $paymentTypes = PaymentType::all();

        foreach ($houses as $house) {

            
            $occupancy = HouseOccupancy::where('house_id', $house->id)
                ->where('is_active', true)
                ->first();

            if (!$occupancy) {
                continue;
            }

            foreach ($paymentTypes as $type) {

               
                $exists = Payment::where('house_id', $house->id)
                    ->where('payment_type_id', $type->id)
                    ->where('month', $month)
                    ->where('year', $year)
                    ->first();

                if ($exists) continue;

                Payment::create([
                    'house_id' => $house->id,
                    'resident_id' => $occupancy->resident_id,
                    'payment_type_id' => $type->id,
                    'month' => $month,
                    'year' => $year,
                    'amount' => $type->amount,
                    'status' => 'belum',
                    'payment_period' => 'bulanan',
                    'paid_at' => null
                ]);
            }
        }

        DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'Tagihan berhasil digenerate'
        ]);

    } catch (\Exception $e) {

        DB::rollBack();

        return response()->json([
            'success' => false,
            'message' => 'Gagal generate tagihan',
            'error' => $e->getMessage()
        ], 500);
    }
}


public function pay(Request $request, $id)
{
    DB::beginTransaction();

    try {

        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => 'Data pembayaran tidak ditemukan'
            ], 404);
        }

        if ($payment->status === 'lunas') {
            return response()->json([
                'success' => false,
                'message' => 'Pembayaran sudah lunas'
            ], 422);
        }

        $payment->update([
            'status' => 'lunas',
            'paid_at' => now()
        ]);

        DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'Pembayaran berhasil dikonfirmasi',
            'data' => $payment
        ]);

    } catch (\Exception $e) {

        DB::rollBack();

        return response()->json([
            'success' => false,
            'message' => 'Gagal konfirmasi pembayaran',
            'error' => $e->getMessage()
        ], 500);
    }
}
}
