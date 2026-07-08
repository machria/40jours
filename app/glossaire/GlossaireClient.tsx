'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  glossaire,
  CATEGORIES,
  CATEGORIE_COLORS,
  type GlossaireCategorie,
} from '@/data/glossaire';

export default function GlossaireClient() {
  const [query, setQuery] = useState('');
  const [activeCategorie, setActiveCategorie] = useState<GlossaireCategorie | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return glossaire
      .filter((t) => {
        const matchCategorie = !activeCategorie || t.categorie === activeCategorie;
        const matchSearch =
          !q ||
          t.terme.toLowerCase().includes(q) ||
          t.transliteration.toLowerCase().includes(q) ||
          t.definition.toLowerCase().includes(q) ||
          t.arabe.includes(q);
        return matchCategorie && matchSearch;
      })
      .sort((a, b) => a.terme.localeCompare(b.terme, 'fr'));
  }, [query, activeCategorie]);

  const toggleCategorie = (cat: GlossaireCategorie) => {
    setActiveCategorie((prev) => (prev === cat ? null : cat));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/90 backdrop-blur border-b">
        <div className="container max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="p-2 hover:bg-muted rounded-full shrink-0">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher un terme, une définition…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 rounded-full bg-muted/60 border border-transparent focus:border-primary/30 focus:bg-background focus:outline-none text-sm transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filtres catégories */}
        <div className="container max-w-3xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategorie(cat)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                activeCategorie === cat
                  ? CATEGORIE_COLORS[cat]
                  : 'bg-muted/50 text-muted-foreground border-transparent hover:bg-muted'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Résultats */}
      <main className="container max-w-3xl mx-auto px-4 py-6 space-y-3">
        <p className="text-xs text-muted-foreground mb-4">
          {filtered.length} terme{filtered.length !== 1 ? 's' : ''}
          {activeCategorie ? ` · ${activeCategorie}` : ''}
          {query ? ` · "${query}"` : ''}
        </p>

        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 text-muted-foreground"
            >
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-medium">Aucun terme trouvé</p>
              <p className="text-sm mt-1">Essayez un autre mot ou effacez les filtres</p>
            </motion.div>
          ) : (
            filtered.map((term) => (
              <motion.article
                key={term.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.18 }}
                className="bg-card border rounded-2xl p-5 space-y-3 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h2 className="text-base font-bold text-foreground">{term.terme}</h2>
                      <span className="text-sm text-muted-foreground italic">{term.transliteration}</span>
                    </div>
                    <p className="font-kufi text-xl text-primary mt-0.5">{term.arabe}</p>
                  </div>
                  <span
                    className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${CATEGORIE_COLORS[term.categorie]}`}
                  >
                    {term.categorie}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{term.definition}</p>
              </motion.article>
            ))
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
