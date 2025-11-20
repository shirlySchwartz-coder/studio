//import '../../styles/hero.css';
export function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-grid">
          {/* Text Content - Right side for RTL */}
          <div className="hero-badge">
            <h1 className="hero-title">אולי נהיה חברים?</h1>
            <p className="hero-subtitle">אני רוצה בית חם, לא כלוב ❤️</p>
            <div className="hero-actions">
              <button
                className="btn-primary"
                //onClick={() => onNavigate('user')}
              >
                התחל לאמץ עכשיו
              </button>
              <button className="btn-secondary">למד עוד</button>
            </div>
          </div>

          {/* Hero Image - Left side for RTL */}
          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1653356161497-9c2a3ca47022?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGRvZyUyMGNhdCUyMGFkb3B0aW9ufGVufDF8fHx8MTc2Mjc5ODc2MHww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Pet adoption"
              className="w-full h-full object-cover"
            />
            <div className="hero-image-overlay"></div>
            <div className="hero-image-badge">
              <span style={{ fontSize: '20px' }}>❤️</span>
              <span style={{ fontSize: '16px', marginRight: '0.5rem' }}>
                2,847 מחכים לך
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
