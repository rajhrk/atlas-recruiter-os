
export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Atlas Recruiter OS
        </h1>

        <p className="text-sm text-slate-500">
          Recruiter Intelligence Platform
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="rounded-lg bg-slate-100 px-3 py-2 hover:bg-slate-200">
          🔔
        </button>

        <div className="text-right">
          <p className="font-semibold">Raj</p>
          <p className="text-sm text-slate-500">Administrator</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
          R
        </div>
      </div>
    </header>
  );
}