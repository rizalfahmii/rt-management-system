<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\House;
use App\Models\HouseOccupancy;
use App\Models\Payment;
use App\Models\PaymentType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
   public function index(Request $request)
{
    $query = Payment::with([
        'resident',
        'house',
        'paymentType',
    ]);

    if ($request->filled('month')) {
        $query->where('month', $request->month);
    }

    if ($request->filled('year')) {
        $query->where('year', $request->year);
    }

    $data = $query->latest()->paginate(10); 

    return response()->json($data); 
 
}
public function payYearlyCleaning(Request $request)
{
    try {
        $request->validate([
            'resident_id' => 'required',
            'house_id' => 'required',
            'year' => 'required'
        ]);

        $payments = Payment::where('resident_id', $request->resident_id)
            ->where('house_id', $request->house_id)
            ->where('year', $request->year)
            ->whereHas('paymentType', function ($q) {
                $q->where('name', 'Kebersihan');
            })
            ->where('status', 'belum')
            ->get();

        foreach ($payments as $pay) {
            $pay->update([
                'status' => 'lunas',
                'paid_at' => now(),
                'period' => 'tahunan'
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Pembayaran tahunan berhasil'
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ], 500);
    }
}
    public function generate(Request $request)
    {
        $request->validate([
            'month' => 'required|integer|min:1|max:12',
            'year'  => 'required|integer',
        ]);

        $month = $request->month;
        $year  = $request->year;

        DB::beginTransaction();

        try {

            $houses = House::where('house_status', 'dihuni')->get();

            $paymentTypes = PaymentType::all();

            foreach ($houses as $house) {

                $occupancy = HouseOccupancy::where('house_id', $house->id)
                    ->where('is_active', true)
                    ->first();

                if (! $occupancy) {
                    continue;
                }

                foreach ($paymentTypes as $type) {

                    $exists = Payment::where('house_id', $house->id)
                        ->where('payment_type_id', $type->id)
                        ->where('month', $month)
                        ->where('year', $year)
                        ->first();

                    if ($exists) {
                        continue;
                    }

                    Payment::create([
                        'house_id'        => $house->id,
                        'resident_id'     => $occupancy->resident_id,
                        'payment_type_id' => $type->id,
                        'month'           => $month,
                        'year'            => $year,
                        'amount'          => $type->amount,
                        'status'          => 'belum',
                        'payment_period'  => 'bulanan',
                        'paid_at'         => null,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Tagihan berhasil digenerate',
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Gagal generate tagihan',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function pay(Request $request, $id)
    {
        DB::beginTransaction();

        try {

            $payment = Payment::find($id);

            if (! $payment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data pembayaran tidak ditemukan',
                ], 404);
            }

            if ($payment->status === 'lunas') {
                return response()->json([
                    'success' => false,
                    'message' => 'Pembayaran sudah lunas',
                ], 422);
            }

            $payment->update([
                'status'  => 'lunas',
                'paid_at' => now(),
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Pembayaran berhasil dikonfirmasi',
                'data'    => $payment,
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Gagal konfirmasi pembayaran',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
