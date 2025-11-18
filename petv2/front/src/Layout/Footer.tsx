import '../styles/globals.css';

export function Footer() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐾</span>
          <span
            className="text-xl"
            style={{ fontWeight: 700, color: 'var(--navy)' }}
          >
            Pet-Net
          </span>
        </div>
        <div className="flex gap-6">
          <a
            href="#"
            className="transition-colors hover:text-cyan-500"
            style={{ color: 'var(--blue-gray)' }}
          >
            Facebook
          </a>
          <a
            href="#"
            className="transition-colors hover:text-cyan-500"
            style={{ color: 'var(--blue-gray)' }}
          >
            Instagram
          </a>
          <a
            href="#"
            className="transition-colors hover:text-cyan-500"
            style={{ color: 'var(--blue-gray)' }}
          >
            Twitter
          </a>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--blue-gray)' }}>
          © 2025 Pet-Net. כל הזכויות שמורות.
        </p>
      </div>
    </div>
  );
}
