<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\House;
use App\Models\Resident;
use App\Models\Payment;
use App\Models\PaymentType;
use App\Models\Expense;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        // =========================
        // RESET DATA
        // =========================
        Payment::query()->delete();
        Expense::query()->delete();
        House::query()->delete();
        Resident::query()->delete();
        PaymentType::query()->delete();
        User::query()->delete();

        // =========================
        // ADMIN USER
        // =========================
        User::create([
            'name' => 'Admin RT',
            'email' => 'adminrt@gmail.com',
            'password' => Hash::make('admin123'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // =========================
        // PAYMENT TYPES
        // =========================
        $cleaning = PaymentType::create([
            'name' => 'Iuran Kebersihan',
            'amount' => 15000
        ]);

        $security = PaymentType::create([
            'name' => 'Iuran Satpam',
            'amount' => 25000
        ]);

        // =========================
        // HOUSES
        // =========================
        $houses = [];

        for ($i = 1; $i <= 8; $i++) {
            $houses[$i] = House::create([
                'house_number' => 'A-' . $i,
                'house_status' => $i <= 6 ? 'dihuni' : 'kosong',
                'notes' => $i <= 6 ? 'Sudah ditempati warga' : 'Belum ada penghuni'
            ]);
        }

        // =========================
        // RESIDENTS
        // =========================
        $residents = [];

        $names = [
            'Budi Santoso',
            'Andi Pratama',
            'Siti Aminah',
            'Dewi Lestari',
            'Rizky Ramadhan',
            'Agus Setiawan',
        ];

        foreach ($names as $index => $name) {
            $residents[$index + 1] = Resident::create([
                'full_name' => $name,
                'ktp_photo' => null,
                'resident_status' => $index % 2 == 0 ? 'tetap' : 'kontrak',
                'phone' => '08123' . rand(100000, 999999),
                'is_married' => rand(0, 1),
            ]);
        }

        // =========================
        // PAYMENTS
        // =========================
        $year = now()->year;

        foreach ($residents as $key => $resident) {

            $house = $houses[$key];

            // =========================
            // Resident 1 = yearly payment
            // =========================
            if ($resident->id == 1) {

                for ($m = 1; $m <= 12; $m++) {

                    Payment::create([
                        'house_id' => $house->id,
                        'resident_id' => $resident->id,
                        'payment_type_id' => $cleaning->id,
                        'month' => $m,
                        'year' => $year,
                        'amount' => 15000,
                        'paid_at' => Carbon::create($year, 1, 5),
                        'status' => 'lunas',
                        'payment_period' => 'tahunan'
                    ]);

                    Payment::create([
                        'house_id' => $house->id,
                        'resident_id' => $resident->id,
                        'payment_type_id' => $security->id,
                        'month' => $m,
                        'year' => $year,
                        'amount' => 25000,
                        'paid_at' => $m <= now()->month
                            ? Carbon::create($year, $m, 10)
                            : null,
                        'status' => $m <= now()->month ? 'lunas' : 'belum',
                        'payment_period' => 'bulanan'
                    ]);
                }

                continue;
            }

            // =========================
            // Other residents (monthly)
            // =========================
            for ($m = 1; $m <= 12; $m++) {

                $paid = $m < now()->month;

                Payment::create([
                    'house_id' => $house->id,
                    'resident_id' => $resident->id,
                    'payment_type_id' => $cleaning->id,
                    'month' => $m,
                    'year' => $year,
                    'amount' => 15000,
                    'paid_at' => $paid ? Carbon::create($year, $m, 8) : null,
                    'status' => $paid ? 'lunas' : 'belum',
                    'payment_period' => 'bulanan'
                ]);

                Payment::create([
                    'house_id' => $house->id,
                    'resident_id' => $resident->id,
                    'payment_type_id' => $security->id,
                    'month' => $m,
                    'year' => $year,
                    'amount' => 25000,
                    'paid_at' => $paid ? Carbon::create($year, $m, 10) : null,
                    'status' => $paid ? 'lunas' : 'belum',
                    'payment_period' => 'bulanan'
                ]);
            }
        }

        // =========================
        // EXPENSES
        // =========================
        for ($m = 1; $m <= 12; $m++) {

            Expense::create([
                'title' => 'Gaji Satpam Bulan ' . $m,
                'description' => 'Pembayaran honor satpam bulanan',
                'amount' => 1000000,
                'expense_date' => Carbon::create($year, $m, 1),
                'category' => 'Keamanan'
            ]);

            Expense::create([
                'title' => 'Kebersihan Bulan ' . $m,
                'description' => 'Biaya kebersihan lingkungan',
                'amount' => 500000,
                'expense_date' => Carbon::create($year, $m, 5),
                'category' => 'Kebersihan'
            ]);

            if ($m % 3 == 0) {
                Expense::create([
                    'title' => 'Perbaikan Fasilitas Bulan ' . $m,
                    'description' => 'Servis lampu / jalan / selokan',
                    'amount' => 750000,
                    'expense_date' => Carbon::create($year, $m, 20),
                    'category' => 'Perawatan'
                ]);
            }
        }
    }
}