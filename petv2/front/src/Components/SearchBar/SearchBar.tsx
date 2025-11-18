import { ChevronDown, Search } from 'lucide-react';

export function SearchBar() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
      <div className="card-base p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search
                size={20}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                style={{ color: 'var(--blue-gray)' }}
              />
              <input
                type="text"
                placeholder="חפש לפי שם, גזע..."
                className="input-base pr-10"
              />
            </div>
          </div>

          <div className="relative">
            <select className="input-base appearance-none cursor-pointer">
              <option>סוג החיה</option>
              <option>כלב</option>
              <option>חתול</option>
              <option>ארנב</option>
            </select>
            <ChevronDown
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--blue-gray)' }}
            />
          </div>

          <div className="relative">
            <select className="input-base appearance-none cursor-pointer">
              <option>גודל</option>
              <option>קטן</option>
              <option>בינוני</option>
              <option>גדול</option>
            </select>
            <ChevronDown
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--blue-gray)' }}
            />
          </div>

          <button
            className="btn-primary"
            style={{ background: 'var(--cyan)', color: 'var(--white)' }}
          >
            חפש
          </button>
        </div>
      </div>
    </section>
  );
}
