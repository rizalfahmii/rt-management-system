<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Resident;
use App\Http\Requests\StoreResidentRequest;
use App\Http\Requests\UpdateResidentRequest;

class ResidentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $resident = Resident::latest()->paginate(10);

        return response()->json([
            'success' => true,
            'message' => 'Daftar penghuni',
            'data' => $resident
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
     public function store(StoreResidentRequest $request)
    {
        $resident = Resident::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Penghuni berhasil ditambahkan',
            'data' => $resident
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $resident = Resident::find($id);

        if (!$resident) {
            return response()->json([
                'success' => false,
                'message' => 'Penghuni tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $resident
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateResidentRequest $request, $id)
    {
        $resident = Resident::find($id);
           if (!$resident) {
            return response()->json([
                'success' => false,
                'message' => 'Penghuni tidak ditemukan'
            ], 404);
        }
        $resident->update($request->validate());
     return response()->json([
            'success' => true,
            'message' => 'Penghuni berhasil diupdate',
            'data' => $resident
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $resident = Resident::destroy($id);

        if (!$resident) {
            return response()->json([
                'success' => false,
                'message' => 'Penghuni tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $resident

        ]);
    }
}
