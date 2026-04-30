export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-gray-500">Pemasukan</p>
          <h2 className="text-2xl font-bold">Rp 0</h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-gray-500">Pengeluaran</p>
          <h2 className="text-2xl font-bold">Rp 0</h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-gray-500">Saldo</p>
          <h2 className="text-2xl font-bold">Rp 0</h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-gray-500">Rumah Aktif</p>
          <h2 className="text-2xl font-bold">0</h2>
        </div>
      </div>
    </div>
  );
}