<?php
namespace Database\Seeders;

use App\Models\Expense;
use App\Models\House;
use App\Models\Payment;
use App\Models\PaymentType;
use App\Models\Resident;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        // =========================
        // RESET
        // =========================
        Payment::query()->delete();
        Expense::query()->delete();
        House::query()->delete();
        Resident::query()->delete();
        PaymentType::query()->delete();
        User::query()->delete();

        // =========================
        // ADMIN
        // =========================
        User::create([
            'name'     => 'Admin RT',
            'email'    => 'adminrt@gmail.com',
            'password' => Hash::make('admin123'),
        ]);

        // =========================
        // PAYMENT TYPE (FIXED SESUAI SOAL)
        // =========================
        $cleaning = PaymentType::create([
            'name'   => 'Iuran Kebersihan',
            'amount' => 15000,
        ]);

        $security = PaymentType::create([
            'name'   => 'Iuran Satpam',
            'amount' => 100000,
        ]);

        // =========================
        // HOUSES (50 TOTAL)
        // =========================
        $houses = [];

        for ($i = 1; $i <= 50; $i++) {

            $isEmptyHouse = $i > 45; // 5 rumah kosong/kontrak

            $houses[$i] = House::create([
                'house_number' => 'A-' . $i,
                'house_status' => 'kosong', // 👈 DEFAULT SEMUA KOSONG
                'notes'        => 'Belum ada penghuni',
            ]);
        }

        // =========================
        // RESIDENTS (45 TETAP + 5 KONTRAK)
        // =========================
        $residents = [];

        for ($i = 1; $i <= 45; $i++) {
            $residents[$i] = Resident::create([
                'full_name'       => 'Warga Tetap ' . $i,
                'ktp_photo'       => null,
                'resident_status' => 'tetap',
                'phone'           => '0812' . rand(100000000, 999999999),
                'is_married'      => rand(0, 1),
            ]);
        }

        for ($i = 46; $i <= 50; $i++) {
            $residents[$i] = Resident::create([
                'full_name'       => 'Warga Kontrak ' . $i,
                'ktp_photo'       => null,
                'resident_status' => 'kontrak',
                'phone'           => '0812' . rand(100000000, 999999999),
                'is_married'      => rand(0, 1),
            ]);
        }

        // =========================
        // PAYMENTS
        // =========================
        $year = now()->year;

        foreach ($residents as $index => $resident) {

            $house = $houses[$index];

            for ($m = 1; $m <= 12; $m++) {

                $isPaid = $m <= now()->month;

                // KEBERSIHAN
                Payment::create([
                    'house_id'        => $house->id,
                    'resident_id'     => $resident->id,
                    'payment_type_id' => $cleaning->id,
                    'month'           => $m,
                    'year'            => $year,
                    'amount'          => 15000,
                    'paid_at'         => $isPaid ? Carbon::create($year, $m, 5) : null,
                    'status'          => $isPaid ? 'lunas' : 'belum',
                    'payment_period'  => 'bulanan',
                ]);

                // SATPAM
                Payment::create([
                    'house_id'        => $house->id,
                    'resident_id'     => $resident->id,
                    'payment_type_id' => $security->id,
                    'month'           => $m,
                    'year'            => $year,
                    'amount'          => 100000,
                    'paid_at'         => $isPaid ? Carbon::create($year, $m, 10) : null,
                    'status'          => $isPaid ? 'lunas' : 'belum',
                    'payment_period'  => 'bulanan',
                ]);
            }
        }

        // =========================
        // EXPENSES
        // =========================
        for ($m = 1; $m <= 12; $m++) {

            Expense::create([
                'title'        => 'Gaji Satpam',
                'description'  => 'Gaji bulanan satpam',
                'amount'       => 3000000,
                'expense_date' => Carbon::create($year, $m, 1),
                'category'     => 'Keamanan',
            ]);

            Expense::create([
                'title'        => 'Kebersihan Lingkungan',
                'description'  => 'Operasional kebersihan',
                'amount'       => 1000000,
                'expense_date' => Carbon::create($year, $m, 5),
                'category'     => 'Kebersihan',
            ]);

            if ($m % 3 == 0) {
                Expense::create([
                    'title'        => 'Perbaikan Infrastruktur',
                    'description'  => 'Jalan / selokan / lampu',
                    'amount'       => 2000000,
                    'expense_date' => Carbon::create($year, $m, 20),
                    'category'     => 'Perawatan',
                ]);
            }
        }
    }
}
