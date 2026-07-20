import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardCard from "./components/DashboardCard";
import QuickActions from "./components/QuickActions";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 p-8">
          <h2 className="mb-2 text-3xl font-bold text-slate-800">
            Welcome back, Raj 👋
          </h2>

          <p className="mb-8 text-slate-600">
            Here's a quick overview of your Atlas Recruiter OS.
          </p>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Side */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                <DashboardCard
                  title="Companies"
                  value="245"
                  icon="🏢"
                />

                <DashboardCard
                  title="Skills"
                  value="520"
                  icon="🧠"
                />

                <DashboardCard
                  title="Certifications"
                  value="84"
                  icon="🎓"
                />

                <DashboardCard
                  title="Conferences"
                  value="37"
                  icon="📅"
                />
              </div>
            </div>

            {/* Right Side */}
            <div>
              <QuickActions />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}