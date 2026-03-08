"use client";

import { useState } from "react";
import { ds } from "@/lib/design-system";
import benefitNodes from "@/data/benefit-nodes.json";

type BenefitNode = {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  url: string;
};

const categories = ["All", ...Array.from(new Set(benefitNodes.map(node => node.category)))];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredNodes = activeCategory === "All"
    ? benefitNodes
    : benefitNodes.filter(node => node.category === activeCategory);

  return (
    <main className={ds.page}>
      <div className={`${ds.shell} py-12 md:py-16`}>
        <header className="text-center mb-12">
          <p className={ds.badgeLive}>Benefits Navigator</p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mt-3 mb-4">
            Find the support you need.
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            A directory of public benefits and services. No screening, no tracking. Just direct links to official resources.
          </p>
        </header>

        <div className="flex items-center justify-center gap-2 mb-10">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                activeCategory === category
                  ? "bg-white text-black"
                  : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800"
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
                <p className="text-sm text-neutral-400 leading-relaxed mb-4">
                  {node.description}
                </p>
              </div>
              <p className="text-xs text-neutral-500">{node.category}</p>
            </a>
          ))}
        </div>
      </div>
      <footer className={ds.footer}>
        Built by{" "}
        <a href="https://infinite-machines-production.up.railway.app" className="text-neutral-400 hover:text-white transition">
          Infinite Machines
        </a>
      </footer>
    </main>
  );
}