"use client";

import { FormEvent, useMemo, useState } from "react";
import { ds } from "@/lib/design-system";
import benefitNodes from "@/data/benefit-nodes.json";
import { calculateBenefits, getTotalEstimatedBenefits, type BenefitResult } from "@/lib/benefits-engine";

type BenefitNode = {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  url: string;
};

const categories = ["All", ...Array.from(new Set(benefitNodes.map((node) => node.category)))];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [zip, setZip] = useState("60601");
  const [householdSize, setHouseholdSize] = useState(3);
  const [monthlyIncome, setMonthlyIncome] = useState(2000);
  const [hasChildren, setHasChildren] = useState(true);
  const [results, setResults] = useState<BenefitResult[] | null>(null);

  const filteredNodes =
    activeCategory === "All"
      ? benefitNodes
      : benefitNodes.filter((node) => node.category === activeCategory);

  const likelyEligibleCount = useMemo(
    () => (results ? results.filter((item) => item.eligible).length : 0),
    [results],
  );

  const onRunEstimate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const sanitizedZip = zip.trim();
    const nextResults = calculateBenefits({
      zip: sanitizedZip,
      householdSize: Math.max(1, householdSize),
      monthlyIncome: Math.max(0, monthlyIncome),
      hasChildren,
      childrenUnder5: hasChildren ? 1 : 0,
    });

    setResults(nextResults);
  };

  return (
    <main className={ds.page}>
      <div className={`${ds.shell} py-12 md:py-16 space-y-10`}>
        <header className="text-center">
          <p className={ds.badgeLive}>Benefits Navigator</p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mt-3 mb-4">Find the support you need.</h1>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Estimate likely programs in less than a minute, then continue with official application links.
          </p>
        </header>

        <section className={ds.card}>
          <div className="mb-6">
            <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 mb-2">Quick estimate</p>
            <h2 className="text-xl font-semibold">Benefits calculator</h2>
          </div>

          <form onSubmit={onRunEstimate} className="space-y-4">
            <div>
              <label htmlFor="zip" className={ds.label}>
                ZIP code
              </label>
              <input
                id="zip"
                inputMode="numeric"
                maxLength={5}
                value={zip}
                onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                className={ds.input}
                placeholder="60601"
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="household" className={ds.label}>
                  Household size
                </label>
                <input
                  id="household"
                  type="number"
                  min={1}
                  max={12}
                  value={householdSize}
                  onChange={(e) => setHouseholdSize(Number(e.target.value || 1))}
                  className={ds.input}
                  required
                />
              </div>

              <div>
                <label htmlFor="income" className={ds.label}>
                  Monthly income (USD)
                </label>
                <input
                  id="income"
                  type="number"
                  min={0}
                  step={50}
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value || 0))}
                  className={ds.input}
                  required
                />
              </div>
            </div>

            <label className="flex items-center gap-3 text-sm text-neutral-300">
              <input
                type="checkbox"
                checked={hasChildren}
                onChange={(e) => setHasChildren(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-700 bg-neutral-900"
              />
              Household includes children
            </label>

            <button type="submit" className={ds.buttonPrimary}>
              Run estimate
            </button>
          </form>

          {results && (
            <div className="mt-8 space-y-4">
              <div className="border border-neutral-800 rounded-lg bg-neutral-950/60 p-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">Summary</p>
                <p className="mt-2 text-neutral-100">
                  Likely eligible for <span className="font-semibold">{likelyEligibleCount}</span> programs.
                </p>
                <p className="text-sm text-neutral-400 mt-1">
                  Estimated monthly value: <span className="text-neutral-200 font-medium">${getTotalEstimatedBenefits(results)}</span>
                </p>
              </div>

              <div className="space-y-3">
                {results
                  .filter((item) => item.eligible)
                  .map((item) => (
                    <a
                      key={item.programId}
                      href={item.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block border border-neutral-800 rounded-lg bg-neutral-950/50 p-4 hover:border-neutral-600 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm uppercase tracking-[0.16em] text-neutral-500">Likely eligible</p>
                          <h3 className="font-semibold text-white mt-1">{item.programName}</h3>
                          <p className="text-sm text-neutral-400 mt-2 leading-relaxed">{item.description}</p>
                        </div>
                        {item.estimatedMonthlyBenefit ? (
                          <p className="text-sm text-neutral-200 whitespace-nowrap">${item.estimatedMonthlyBenefit}/mo</p>
                        ) : null}
                      </div>
                    </a>
                  ))}
              </div>
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors border ${
                  activeCategory === category
                    ? "bg-white text-black border-white"
                    : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:bg-neutral-800"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNodes.map((node: BenefitNode) => (
              <a
                key={node.id}
                href={node.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${ds.card} flex flex-col justify-between hover:border-neutral-700 transition-all`}
              >
                <div>
                  <h2 className="font-semibold text-white mb-2">{node.name}</h2>
                  <p className="text-sm text-neutral-400 leading-relaxed mb-4">{node.description}</p>
                </div>
                <p className="text-xs text-neutral-500">{node.category}</p>
              </a>
            ))}
          </div>
        </section>
      </div>

      <footer className={ds.footer}>
        Built by{" "}
        <a href="https://infinitemachines.ai" className="text-neutral-400 hover:text-white transition">
          Infinite Machines
        </a>
      </footer>
    </main>
  );
}
