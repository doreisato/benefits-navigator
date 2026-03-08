"use client";

import { useState } from "react";
import { calculateBenefits, getTotalEstimatedBenefits, type UserInput, type BenefitResult } from "@/lib/benefits-engine";

export default function Home() {
  const [step, setStep] = useState<"form" | "results">("form");
  const [results, setResults] = useState<BenefitResult[]>([]);
  const [totalBenefits, setTotalBenefits] = useState(0);
  const [formData, setFormData] = useState<UserInput>({
    zip: "",
    householdSize: 1,
    monthlyIncome: 0,
    hasChildren: false,
    isPregnant: false,
    isDisabled: false,
    isElderly: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = calculateBenefits(formData);
    setResults(r);
    setTotalBenefits(getTotalEstimatedBenefits(r));
    setStep("results");
  };

  const eligibleResults = results.filter((r) => r.eligible);
  const ineligibleResults = results.filter((r) => !r.eligible);

  if (step === "results") {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-[640px] mx-auto px-6 py-12">
          <button
            onClick={() => setStep("form")}
            className="text-neutral-500 hover:text-neutral-900 mb-8 text-sm font-medium transition-colors duration-150"
          >
            ← Start over
          </button>

          {eligibleResults.length > 0 && (
            <>
              <div className="mb-12">
                <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
                  You may qualify for {eligibleResults.length} program{eligibleResults.length !== 1 ? "s" : ""}
                </h1>
                {totalBenefits > 0 && (
                  <p className="text-neutral-500">
                    Estimated{" "}
                    <span className="text-neutral-900 font-semibold text-lg">
                      ${totalBenefits.toLocaleString()}/mo
                    </span>{" "}
                    in combined benefits
                  </p>
                )}
              </div>

              <div className="space-y-6">
                {eligibleResults.map((r) => (
                  <div
                    key={r.programId}
                    className="border border-neutral-200 rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-neutral-900">{r.programName}</h3>
                        <span className="text-xs text-neutral-400 uppercase tracking-wide">
                          {r.programType}
                        </span>
                      </div>
                      {r.estimatedMonthlyBenefit && (
                        <p className="text-lg font-semibold text-neutral-900">
                          ${r.estimatedMonthlyBenefit}/mo
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-neutral-600 mb-4">{r.description}</p>
                    <p className="text-sm text-neutral-500 mb-4">
                      <span className="font-medium text-neutral-700">Next:</span> {r.nextSteps}
                    </p>
                    <a
                      href={r.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-neutral-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-neutral-700 transition-colors duration-150"
                    >
                      Apply now
                    </a>
                  </div>
                ))}
              </div>
            </>
          )}

          {eligibleResults.length === 0 && (
            <div className="mb-12">
              <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
                No matching programs found
              </h1>
              <p className="text-neutral-500">
                Based on the information you provided, you may not currently qualify
                for the programs in our database. This doesn&apos;t mean you&apos;re
                ineligible — contact your local office to learn about other options.
              </p>
            </div>
          )}

          {ineligibleResults.length > 0 && (
            <div className="mt-12">
              <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-wide mb-4">
                Other programs
              </h2>
              <div className="space-y-3">
                {ineligibleResults.map((r) => (
                  <div
                    key={r.programId}
                    className="border border-neutral-100 rounded-lg p-4"
                  >
                    <h3 className="text-sm font-medium text-neutral-500">{r.programName}</h3>
                    <p className="text-xs text-neutral-400 mt-1">{r.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 text-xs text-neutral-400 border-t border-neutral-100 pt-6">
            <p>
              Estimates based on federal guidelines. Actual eligibility determined
              by your state or local office. We don&apos;t store your information.
            </p>
          </div>
        </div>

        <footer className="border-t border-neutral-100 py-6 text-center text-xs text-neutral-400">
          Built by{" "}
          <a href="https://infinitemachines.ai" className="text-neutral-500 hover:text-neutral-900 transition-colors duration-150">
            Infinite Machines
          </a>
        </footer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <div className="flex-1">
        {/* Hero */}
        <div className="max-w-[640px] mx-auto px-6 pt-16 pb-8">
          <h1 className="text-3xl font-semibold text-neutral-900 mb-3">
            Find benefits you qualify for
          </h1>
          <p className="text-neutral-500 max-w-md">
            Answer a few questions. We&apos;ll show you government programs that
            could help. Free, private, 30 seconds.
          </p>
        </div>

        {/* Form */}
        <div className="max-w-[640px] mx-auto px-6 pb-16">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* ZIP */}
            <div>
              <label htmlFor="zip" className="block text-sm font-medium text-neutral-700 mb-2">
                ZIP code
              </label>
              <input
                id="zip"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{5}"
                maxLength={5}
                required
                placeholder="60601"
                value={formData.zip}
                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 text-base outline-none transition-all duration-150"
              />
              <p className="mt-1.5 text-xs text-neutral-400">
                Used to find local programs near you
              </p>
            </div>

            {/* Household Size */}
            <div>
              <label htmlFor="household" className="block text-sm font-medium text-neutral-700 mb-2">
                Household size
              </label>
              <select
                id="household"
                value={formData.householdSize}
                onChange={(e) =>
                  setFormData({ ...formData, householdSize: parseInt(e.target.value) })
                }
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 text-base outline-none transition-all duration-150"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "person" : "people"}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-neutral-400">
                Everyone who lives and eats together
              </p>
            </div>

            {/* Monthly Income */}
            <div>
              <label htmlFor="income" className="block text-sm font-medium text-neutral-700 mb-2">
                Monthly household income
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                  $
                </span>
                <input
                  id="income"
                  type="number"
                  min={0}
                  required
                  placeholder="2,000"
                  value={formData.monthlyIncome || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, monthlyIncome: parseInt(e.target.value) || 0 })
                  }
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 text-base outline-none transition-all duration-150"
                />
              </div>
              <p className="mt-1.5 text-xs text-neutral-400">
                Before taxes — wages, tips, Social Security, all sources
              </p>
            </div>

            {/* Situation */}
            <div>
              <p className="block text-sm font-medium text-neutral-700 mb-3">
                Your situation
              </p>
              <div className="space-y-2">
                {[
                  { key: "hasChildren", label: "I have children under 18" },
                  { key: "isPregnant", label: "Pregnant or recently had a baby" },
                  { key: "isElderly", label: "60 years or older" },
                  { key: "isDisabled", label: "Have a disability" },
                ].map(({ key, label }) => (
                  <label
                    key={key}
                    className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 hover:border-neutral-400 cursor-pointer transition-colors duration-150"
                  >
                    <input
                      type="checkbox"
                      checked={!!formData[key as keyof UserInput]}
                      onChange={(e) =>
                        setFormData({ ...formData, [key]: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                    />
                    <span className="text-sm text-neutral-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-neutral-900 text-white py-3.5 rounded-lg text-sm font-medium hover:bg-neutral-700 transition-colors duration-150"
            >
              Show my benefits
            </button>

            <p className="text-center text-xs text-neutral-400">
              Your data stays in your browser. Nothing is stored.
            </p>
          </form>
        </div>
      </div>

      <footer className="border-t border-neutral-100 py-6 text-center text-xs text-neutral-400">
        Built by{" "}
        <a href="https://infinitemachines.ai" className="text-neutral-500 hover:text-neutral-900 transition-colors duration-150">
          Infinite Machines
        </a>
      </footer>
    </main>
  );
}
