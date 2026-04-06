import DashboardPage from "./page";
import { BarLoader } from "react-spinners";
import { Suspense } from "react";

export default function Layout() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight gradient-title">
          Dashboard
        </h1>
      </header>

      <main>
        <Suspense
          fallback={
            <div className="mt-6 flex justify-center">
              <BarLoader width={"100%"} color="#9333ea" />
            </div>
          }
        >
          <DashboardPage />
        </Suspense>
      </main>
    </div>
  );
}
