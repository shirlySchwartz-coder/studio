import { Heart, Search, MapPin, Calendar, Ruler } from 'lucide-react';
import { Button } from '../Ui/button';
import { Input } from '../Ui/input';
import { Badge } from '../Ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../Ui/select';

const pets = [
  {
    id: 1,
    name: 'מקס',
    age: '3 שנים',
    breed: 'גולדן רטריבר',
    location: 'תל אביב',
    status: 'זמין לאימוץ',
    image:
      'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjByZXRyaWV2ZXJ8ZW58MXx8fHwxNzYyMzA1OTgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 2,
    name: 'לונה',
    age: 'שנתיים',
    breed: 'חתול פרסי',
    location: 'ירושלים',
    status: 'דחוף',
    image:
      'https://images.unsplash.com/photo-1585137173132-cf49e10ad27d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzaWFuJTIwY2F0fGVufDF8fHx8MTc2MjI4NDIwMHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 3,
    name: 'רוקי',
    age: '6 חודשים',
    breed: 'גור מעורב',
    location: 'חיפה',
    status: 'זמין לאימוץ',
    image:
      'https://images.unsplash.com/photo-1643260218499-ffb487553b6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdXBweSUyMHBsYXlpbmd8ZW58MXx8fHwxNzYyMzUxNzQxfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 4,
    name: 'מיילו',
    age: '4 שנים',
    breed: 'חתול רחוב',
    location: 'ראשון לציון',
    status: 'זמין לאימוץ',
    image:
      'https://images.unsplash.com/photo-1701448536107-40c53b693383?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGNhdCUyMHNpdHRpbmd8ZW58MXx8fHwxNzYyMzc5NDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 5,
    name: 'בלה',
    age: 'שנה',
    breed: 'כלב מעורב',
    location: 'נתניה',
    status: 'זמין לאימוץ',
    image:
      'https://images.unsplash.com/photo-1629130646965-e86223170abc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBvdXRkb29yfGVufDF8fHx8MTc2MjMzMjk5MXww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 6,
    name: 'שוקו',
    age: '8 חודשים',
    breed: 'ארנב',
    location: 'פתח תקווה',
    status: 'זמין לאימוץ',
    image:
      'https://images.unsplash.com/photo-1609151354448-c4a53450c6e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjByYWJiaXR8ZW58MXx8fHwxNzYyMzQxNjE0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

export function HomePage() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Hero Section */}

      {/* Search Section */}
      <section className="search-section">
        <div className="search-container">
          <div className="search-header">
            <h3 className="search-title">מצא את החבר המושלם 🔍</h3>
            <p className="search-subtitle">
              השתמש בפילטרים כדי למצוא בדיוק מה שאתה מחפש
            </p>
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            <div className="search-input-wrapper">
              <Search className="search-input-icon" size={24} />
              <Input
                type="text"
                placeholder="חפש חיה לפי סוג / עיר / גזע... 🐶🐱"
              />
            </div>
            <div className="search-filters">
              <Select>
                <SelectTrigger
                  style={{
                    borderRadius: '9999px',
                    height: '3.5rem',
                    border: '2px solid var(--color-gray-200)',
                    boxShadow: 'var(--shadow-md)',
                    background: 'white',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                    }}
                  >
                    <MapPin size={20} style={{ color: 'var(--color-cyan)' }} />
                    <SelectValue placeholder="📍 בחר מיקום" />
                  </div>
                </SelectTrigger>
                <SelectContent style={{ borderRadius: '1rem' }}>
                  <SelectItem value="tel-aviv">תל אביב</SelectItem>
                  <SelectItem value="jerusalem">ירושלים</SelectItem>
                  <SelectItem value="haifa">חיפה</SelectItem>
                  <SelectItem value="all">כל הארץ</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger
                  style={{
                    borderRadius: '9999px',
                    height: '3.5rem',
                    border: '2px solid var(--color-gray-200)',
                    boxShadow: 'var(--shadow-md)',
                    background: 'white',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                    }}
                  >
                    <Calendar
                      size={20}
                      style={{ color: 'var(--color-violet)' }}
                    />
                    <SelectValue placeholder="🎂 בחר גיל" />
                  </div>
                </SelectTrigger>
                <SelectContent style={{ borderRadius: '1rem' }}>
                  <SelectItem value="puppy">גור/גורה (0-1)</SelectItem>
                  <SelectItem value="young">צעיר (1-3)</SelectItem>
                  <SelectItem value="adult">בוגר (3+)</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger
                  style={{
                    borderRadius: '9999px',
                    height: '3.5rem',
                    border: '2px solid var(--color-gray-200)',
                    boxShadow: 'var(--shadow-md)',
                    background: 'white',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                    }}
                  >
                    <Ruler size={20} style={{ color: 'var(--color-orange)' }} />
                    <SelectValue placeholder="📏 בחר גודל" />
                  </div>
                </SelectTrigger>
                <SelectContent style={{ borderRadius: '1rem' }}>
                  <SelectItem value="small">קטן (עד 10 ק״ג)</SelectItem>
                  <SelectItem value="medium">בינוני (10-25 ק״ג)</SelectItem>
                  <SelectItem value="large">גדול (25+ ק״ג)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Pet Gallery */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="floating-shape floating-shape-violet w-64 h-64 top-0 left-0"></div>
        <div className="floating-shape w-96 h-96 bg-gradient-to-tl from-cyan-400/10 to-transparent bottom-0 right-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="section-header">
            <div className="section-badge">✨ מיוחד בשבילך</div>
            <h2 className="section-title">חיות מחכות לאימוץ 🐾</h2>
            <p className="section-subtitle">כל אחד מהם מחכה למישהו כמוך</p>
          </div>

          <div className="pet-gallery">
            {pets.map((pet) => (
              <div key={pet.id} className="pet-card">
                <div className="pet-card-image">
                  <img src={pet.image} alt={pet.name} />
                  <button className="pet-card-heart">
                    <Heart className="text-orange-400" size={22} />
                  </button>
                  <div
                    className={
                      pet.status === 'דחוף'
                        ? 'pet-card-badge urgent'
                        : 'pet-card-badge available'
                    }
                  >
                    {pet.status}
                  </div>
                </div>
                <div className="pet-card-content">
                  <h3 className="pet-card-title">{pet.name} ❤️</h3>
                  <div className="pet-card-details">
                    <p>🐕 {pet.breed}</p>
                    <p>
                      📍 {pet.age} • {pet.location}
                    </p>
                  </div>
                  <Button className="btn-primary" style={{ width: '100%' }}>
                    צפה בפרטים ✨
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-16 mt-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-cyan-400 text-[32px]">🐾</span>
                <span className="text-gray-900 text-[24px]">Pet-Net</span>
              </div>
              <p className="text-gray-600 text-[16px] leading-relaxed mb-6">
                מחברים בין חיות לבתים חמים ואוהבים.
                <br />
                כי כל חיה מגיעה למשפחה.
              </p>
              <div className="flex gap-4">
                <button className="btn-icon">
                  <span>📘</span>
                </button>
                <button className="btn-icon">
                  <span>📷</span>
                </button>
                <button className="btn-icon">
                  <span>🐦</span>
                </button>
              </div>
            </div>
            <div>
              <h4 className="text-gray-900 text-[18px] mb-4">קישורים מהירים</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-cyan-400 transition-colors"
                  >
                    אודות
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-cyan-400 transition-colors"
                  >
                    איך זה עובד
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-cyan-400 transition-colors"
                  >
                    עמותות שותפות
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-cyan-400 transition-colors"
                  >
                    תנאי שימוש
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 text-[18px] mb-4">יצירת קשר</h4>
              <ul className="space-y-3">
                <li className="text-gray-600">📧 info@pet-net.co.il</li>
                <li className="text-gray-600">📞 03-1234567</li>
                <li className="text-gray-600">📍 תל אביב, ישראל</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-500">
              © 2025 Pet-Net. כל הזכויות שמורות. נוצר עם ❤️ למען בעלי החיים
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
