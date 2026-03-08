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
      <main className="min-h-screen bg-[#0A0A0A] text-white">
        <div className="max-w-[640px] mx-auto px-6 py-12">
          <button
            onClick={() => setStep("form")}
            className="text-neutral-500 hover:text-white mb-10 text-sm font-medium transition-colors duration-150"
          >
            ← Start over
          </button>

          {eligibleResults.length > 0 && (
            <>
              <div className="mb-12">
                <p className="text-sm text-neutral-500 uppercase tracking-widest mb-3">Your results</p>
                <h1 className="text-3xl font-semibold text-white mb-3">
                  You could be getting <span className="text-emerald-400">${totalBenefits.toLocaleString()}/mo</span>
                </h1>
                <p className="text-neutral-400 text-lg">
                  {eligibleResults.length} program{eligibleResults.length !== 1 ? "s" : ""} matched your profile. Here&apos;s what you may qualify for and how to apply today.
                </p>
              </div>

              <div className="space-y-4">
                {eligibleResults.map((r) => (
                  <div
                    key={r.programId}
                    className="border border-neutral-800 rounded-lg p-6 hover:border-neutral-600 transition-colors duration-150"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h3 className="font-medium text-white">{r.programName}</h3>
                        <span className="text-xs text-neutral-600 uppercase tracking-wide">
                          {r.programType}
                        </span>
                      </div>
                      {r.estimatedMonthlyBenefit && (
                        <p className="text-lg font-semibold text-emerald-400">
                          ${r.estimatedMonthlyBenefit}/mo
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-neutral-400 mt-3 mb-4 leading-relaxed">{r.description}</p>
                    <p className="text-sm text-neutral-500 mb-5 leading-relaxed">
                      {r.nextSteps}
                    </p>
                    <a
                      href={r.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-white text-black px-5 py-2.5 rounded text-sm font-medium hover:bg-neutral-200 transition-colors duration-150"
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
              <h1 className="text-2xl font-semibold text-white mb-3">
                No matching programs right now
              </h1>
              <p className="text-neutral-400 leading-relaxed">
                Based on what you shared, you may not currently qualify for the programs
                we track. But eligibility changes — and there may be local options
                we haven&apos;t indexed yet. Reach out to your local benefits office
                to explore everything available.
              </p>
            </div>
          )}

          {ineligibleResults.length > 0 && (
            <div className="mt-16">
              <p className="text-xs text-neutral-600 uppercase tracking-widest mb-4">
                Not currently eligible
              </p>
              <div className="space-y-2">
                {ineligibleResults.map((r) => (
                  <div
                    key={r.programId}
                    className="border border-neutral-900 rounded-lg p-4"
                  >
                    <h3 className="text-sm font-medium text-neutral-600">{r.programName}</h3>
                    <p className="text-xs text-neutral-700 mt-1">{r.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-16 text-xs text-neutral-600 border-t border-neutral-800 pt-6 leading-relaxed">
            These are estimates based on federal guidelines. Actual eligibility is
            determined when you apply. We never store your information.
          </div>
        </div>

        <footer className="border-t border-neutral-900 py-6 text-center text-xs text-neutral-600">
          Built by{" "}
          <a href="https://infinitemachines.ai" className="text-neutral-500 hover:text-white transition-colors duration-150">
            Infinite Machines
          </a>
        </footer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      <div className="flex-1">
        {/* Hero */}
        <div className="max-w-[640px] mx-auto px-6 pt-20 pb-4">
          <p className="text-sm text-neutral-500 uppercase tracking-widest mb-4">Benefits Navigator</p>
          <h1 className="text-4xl font-semibold text-white mb-4 leading-tight">
            You might be leaving<br />money on the table.
          </h1>
          <p className="text-neutral-400 text-lg max-w-md leading-relaxed">
            Millions qualify for government programs and never apply.
            Answer 4 questions — we&apos;ll tell you what you&apos;re missing in 30 seconds.
          </p>
        </div>

        {/* Form */}
        <div className="max-w-[640px] mx-auto px-6 pt-10 pb-20">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* ZIP */}
            <div>
              <label htmlFor="zip" className="block text-sm font-medium text-neutral-300 mb-2">
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
                className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 focus:ring-1 focus:ring-neutral-500 focus:border-neutral-500 text-base outline-none transition-all duration-150"
              />
              <p className="mt-1.5 text-xs text-neutral-600">
                Used to find local programs near you
              </p>
            </div>

            {/* Household Size */}
            <div>
              <label htmlFor="household" className="block text-sm font-medium text-neutral-300 mb-2">
                How many people in your household?
              </label>
              <select
                id="household"
                value={formData.householdSize}
                onChange={(e) =>
                  setFormData({ ...formData, householdSize: parseInt(e.target.value) })
                }
                className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-800 text-white focus:ring-1 focus:ring-neutral-500 focus:border-neutral-500 text-base outline-none transition-all duration-150"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "person" : "people"}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-neutral-600">
                Everyone who lives and eats together
              </p>
            </div>

            {/* Monthly Income */}
            <div>
              <label htmlFor="income" className="block text-sm font-medium text-neutral-300 mb-2">
                Monthly household income (before taxes)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600">
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
                  className="w-full pl-8 pr-4 py-3 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 focus:ring-1 focus:ring-neutral-500 focus:border-neutral-500 text-base outline-none transition-all duration-150"
                />
              </div>
              <p className="mt-1.5 text-xs text-neutral-600">
                Wages, tips, Social Security, child support — all sources
              </p>
            </div>

            {/* Situation */}
            <div>
              <p className="block text-sm font-medium text-neutral-300 mb-3">
                Check anything that applies
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
                    className="flex items-center gap-3 p-3 rounded-lg border border-neutral-800 hover:border-neutral-600 cursor-pointer transition-colors duration-150"
                  >
                    <input
                      type="checkbox"
                      checked={!!formData[key as keyof UserInput]}
                      onChange={(e) =>
                        setFormData({ ...formData, [key]: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-neutral-600 bg-neutral-900 text-white focus:ring-neutral-500"
                    />
                    <span className="text-sm text-neutral-300">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black py-3.5 rounded-lg text-sm font-semibold hover:bg-neutral-200 transition-colors duration-150"
            >
              Show what I qualify for
            </button>

            <p className="text-center text-xs text-neutral-600">
              Everything stays in your browser. Nothing stored. Ever.
            </p>
          </form>
        </div>
      </div>

      <footer className="border-t border-neutral-900 py-6 text-center text-xs text-neutral-600">
        Built by{" "}
        <a href="https://infinitemachines.ai" className="text-neutral-500 hover:text-white transition-colors duration-150">
          Infinite Machines
        </a>
      </footer>
    </main>
  );
}
