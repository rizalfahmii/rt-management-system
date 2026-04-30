<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreHouseRequest;
use App\Http\Requests\UpdateHouseRequest;
use App\Models\House;
use App\Models\HouseOccupancy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HouseController extends Controller
{
    public function index()
    {
        $house = House::all();
        return response()->json([
            'success' => true,
            'message' => 'Data House',
            'data'    => $house,
        ]);
    }

    public function store(StoreHouseRequest $request)
    {
        $house = House::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Rumah ditambahkan',
            'data'    => $house,
        ], 201);
    }

    public function update(UpdateHouseRequest $request, $id)
    {
        $house = House::find($id);
        if (! $house) {
            return response()->json([
                'success' => false,
                'message' => 'Rumah tidak ditemukan',
            ], 404);
        }
        $house->update($request->validated());
        return response()->json([
            'success' => true,
            'message' => 'House berhasil diupdate',
            'data'    => $house,
        ]);
    }

    public function show($id)
    {
        $house = House::find($id);
        return response()->json([
            'success' => true,
            'data'    => $house,
        ]);
    }

    public function destroy(string $id)
    {
        $house = House::destroy($id);
        if (! $house) {
            return response()->json([
                'success' => false,
                'message' => 'Rumah tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $house,

        ]);
    }

    public function assignResident(Request $request, $houseId)
    {
        $request->validate([
            'resident_id' => 'required|exists:residents,id',
            'start_date'  => 'required|date',
        ]);

        $house = House::find($houseId);

        if (! $house) {
            return response()->json([
                'success' => false,
                'message' => 'Rumah tidak ditemukan',
            ], 404);
        }

        if ($house->house_status === 'dihuni') {
            return response()->json([
                'success' => false,
                'message' => 'Rumah sedang dihuni',
            ], 422);
        }

        DB::beginTransaction();

        try {

            HouseOccupancy::create([
                'house_id'    => $house->id,
                'resident_id' => $request->resident_id,
                'start_date'  => $request->start_date,
                'is_active'   => true,
            ]);

            $house->update([
                'house_status' => 'dihuni',
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Penghuni berhasil ditempatkan ke rumah',
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Gagal assign penghuni',
            ], 500);
        }
    }

  public function checkoutResident(Request $request, $houseId)
{
    $request->validate([
        'end_date' => 'required|date'
    ]);

    $house = House::find($houseId);

    if (!$house) {
        return response()->json([
            'success' => false,
            'message' => 'Rumah tidak ditemukan'
        ], 404);
    }

    $occupancy = HouseOccupancy::where('house_id', $houseId)
        ->where('is_active', true)
        ->first();

    if (!$occupancy) {
        return response()->json([
            'success' => false,
            'message' => 'Tidak ada penghuni aktif di rumah ini'
        ], 422);
    }

    DB::beginTransaction();

    try {

        $occupancy->update([
            'end_date' => $request->end_date,
            'is_active' => false
        ]);

        $house->update([
            'house_status' => 'kosong'
        ]);

        DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'Penghuni berhasil checkout dan rumah menjadi kosong'
        ]);

    } catch (\Exception $e) {

        DB::rollBack();

        return response()->json([
            'success' => false,
            'message' => 'Gagal checkout penghuni'
        ], 500);
    }
}
}