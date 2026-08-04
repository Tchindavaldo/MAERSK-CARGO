import { useEffect, useMemo, useRef, useState } from 'react';
import { COUNTRIES } from '../lib/countries';

interface CountrySelectProps {
  value: string;
  onChange: (code: string) => void;
  placeholder?: string;
  hasError?: boolean;
}

// Normalise pour une recherche insensible aux accents et à la casse.
const norm = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export default function CountrySelect({
  value,
  onChange,
  placeholder = '-- Sélectionner un pays --',
  hasError = false,
}: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = COUNTRIES.find((c) => c.code === value);

  const filtered = useMemo(() => {
    const q = norm(query.trim());
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) => norm(c.name).includes(q) || norm(c.code).includes(q)
    );
  }, [query]);

  // Ferme la liste au clic extérieur.
  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const select = (code: string) => {
    onChange(code);
    setOpen(false);
    setQuery('');
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full px-4 py-2 border rounded-lg text-left focus:outline-none focus:ring-2 ${
          hasError
            ? 'border-red-500 focus:ring-red-600'
            : 'border-gray-300 focus:ring-blue-600'
        } ${selected ? 'text-gray-900' : 'text-gray-500'}`}
      >
        {selected ? `${selected.name} (${selected.code})` : placeholder}
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="p-2 border-b border-gray-200">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setOpen(false);
                  setQuery('');
                } else if (e.key === 'Enter' && filtered.length > 0) {
                  e.preventDefault();
                  select(filtered[0].code);
                }
              }}
              placeholder="Rechercher un pays..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <ul className="max-h-60 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-4 py-2 text-sm text-gray-500">Aucun pays trouvé</li>
            )}
            {filtered.map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => select(c.code)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 ${
                    c.code === value ? 'bg-blue-100 font-medium' : ''
                  }`}
                >
                  {c.name} ({c.code})
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
