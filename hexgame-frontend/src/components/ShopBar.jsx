export default function ShopBar() {
    return (
      <div className="flex justify-around items-center h-full px-6">
        <button className="bg-emerald-700 px-4 py-2 rounded-xl shadow hover:bg-emerald-600">
          Buy Road
        </button>
        <button className="bg-emerald-700 px-4 py-2 rounded-xl shadow hover:bg-emerald-600">
          Buy Settlement
        </button>
        <button className="bg-emerald-700 px-4 py-2 rounded-xl shadow hover:bg-emerald-600">
          Buy City
        </button>
      </div>
    );
  }
  