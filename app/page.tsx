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
      <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <button
            onClick={() => setStep("form")}
            className="text-emerald-700 hover:text-emerald-900 mb-6 flex items-center gap-1 text-sm font-medium"
          >
            ← Check again with different info
          </button>

          {eligibleResults.length > 0 && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Great news!
                </h1>
                <p className="text-lg text-slate-600">
                  Based on your info, you may qualify for{" "}
                  <span className="font-bold text-emerald-700">
                    {eligibleResults.length} program{eligibleResults.length !== 1 ? "s" : ""}
                  </span>
                </p>
                {totalBenefits > 0 && (
                  <div className="mt-4 inline-block bg-emerald-100 rounded-2xl px-6 py-3">
                    <p className="text-sm text-emerald-800 font-medium">
                      Estimated monthly benefits
                    </p>
                    <p className="text-4xl font-bold text-emerald-900">
                      ${totalBenefits.toLocaleString()}
                      <span className="text-lg font-normal text-emerald-700">/mo</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {eligibleResults.map((r) => (
                  <div
                    key={r.programId}
                    className="bg-white rounded-xl border border-emerald-200 shadow-sm p-5"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{r.icon}</span>
                        <div>
                          <h3 className="font-semibold text-slate-900">{r.programName}</h3>
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            {r.programType}
                          </span>
                        </div>
                      </div>
                      {r.estimatedMonthlyBenefit && (
                        <div className="text-right">
                          <p className="text-xl font-bold text-emerald-700">
                            ${r.estimatedMonthlyBenefit}
                          </p>
                          <p className="text-xs text-slate-500">est./month</p>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{r.description}</p>
                    <div className="bg-emerald-50 rounded-lg p-3 mb-3">
                      <p className="text-sm text-emerald-900">
                        <span className="font-medium">Next steps:</span> {r.nextSteps}
                      </p>
                    </div>
                    <a
                      href={r.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                    >
                      Apply Now →
                    </a>
                  </div>
                ))}
              </div>
            </>
          )}

          {ineligibleResults.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-slate-700 mb-3">
                Programs you may not currently qualify for
              </h2>
              <div className="space-y-2">
                {ineligibleResults.map((r) => (
                  <div
                    key={r.programId}
                    className="bg-white rounded-lg border border-slate-200 p-4 opacity-70"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{r.icon}</span>
                      <h3 className="font-medium text-slate-700">{r.programName}</h3>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{r.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 text-center text-sm text-slate-500 bg-slate-100 rounded-lg p-4">
            <p className="font-medium text-slate-700 mb-1">Important</p>
            <p>
              These are estimates based on federal guidelines. Actual eligibility
              is determined by your state or local office. We don&apos;t store any of
              your information.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero */}
      <div className="max-w-2xl mx-auto px-4 pt-12 pb-8 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-3">
          Find Benefits You Qualify For
        </h1>
        <p className="text-lg text-slate-600 max-w-lg mx-auto">
          Answer a few questions and we&apos;ll show you government programs that
          could put money back in your pocket. Free, private, takes 30 seconds.
        </p>
      </div>

      {/* Form */}
      <div className="max-w-lg mx-auto px-4 pb-16">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-6">
          {/* ZIP */}
          <div>
            <label htmlFor="zip" className="block text-sm font-medium text-slate-700 mb-1">
              ZIP Code
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
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg"
            />
            <p className="mt-1 text-xs text-slate-500">
              We use this to find local programs near you
            </p>
          </div>

          {/* Household Size */}
          <div>
            <label htmlFor="household" className="block text-sm font-medium text-slate-700 mb-1">
              Household Size
            </label>
            <select
              id="household"
              value={formData.householdSize}
              onChange={(e) =>
                setFormData({ ...formData, householdSize: parseInt(e.target.value) })
              }
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "person" : "people"}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-500">
              Count everyone who lives and eats together
            </p>
          </div>

          {/* Monthly Income */}
          <div>
            <label htmlFor="income" className="block text-sm font-medium text-slate-700 mb-1">
              Monthly Household Income (before taxes)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
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
                className="w-full pl-8 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg"
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Include wages, tips, Social Security, child support — all sources
            </p>
          </div>

          {/* Situation Checkboxes */}
          <div>
            <p className="block text-sm font-medium text-slate-700 mb-2">
              Check any that apply
            </p>
            <div className="space-y-2">
              {[
                { key: "hasChildren", label: "I have children under 18", emoji: "👶" },
                { key: "isPregnant", label: "Pregnant or recently had a baby", emoji: "🤰" },
                { key: "isElderly", label: "60 years or older", emoji: "👵" },
                { key: "isDisabled", label: "Have a disability", emoji: "♿" },
              ].map(({ key, label, emoji }) => (
                <label
                  key={key}
                  className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={!!formData[key as keyof UserInput]}
                    onChange={(e) =>
                      setFormData({ ...formData, [key]: e.target.checked })
                    }
                    className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-lg">{emoji}</span>
                  <span className="text-sm text-slate-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg"
          >
            Show My Benefits →
          </button>

          <p className="text-center text-xs text-slate-400">
            🔒 We don&apos;t store your data. Everything stays in your browser.
          </p>
        </form>
      </div>
    </main>
  );
}
