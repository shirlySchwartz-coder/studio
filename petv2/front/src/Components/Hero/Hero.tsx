//import '../../styles/hero.css';
export function Hero() {
  return (
    <div>
      <div
        className="floating-shape"
        style={{
          width: '80px',
          height: '80px',
          top: '80px',
          left: '80px',
          background:
            'linear-gradient(to bottom right, rgba(34, 211, 238, 0.2), rgba(251, 146, 60, 0.2))',
        }}
      ></div>
      <div
        className="floating-shape"
        style={{
          width: '128px',
          height: '128px',
          bottom: '80px',
          right: '160px',
          background:
            'linear-gradient(to bottom right, rgba(34, 211, 238, 0.2), rgba(251, 146, 60, 0.2))',
          animationDelay: '1s',
        }}
      ></div>

      <div className="hero-content">
        <div className="hero-grid">
          <div>
            <div className="hero-badge">
              <span
                className="animate-wiggle"
                style={{ display: 'inline-block' }}
              >
                🐾
              </span>{' '}
              מצא את החבר הכי טוב שלך
            </div>
            <h1 className="hero-title">
              מחפש/ת חבר? <br />
              <span className="gradient-text">גם אני.</span>
            </h1>
            <p className="hero-subtitle">
              אני רק רוצה בית חם, לא כלוב 💙
              <br />
              <span
                style={{ fontSize: '18px', color: 'var(--color-gray-500)' }}
              >
                הצטרפו לאלפי משפחות שמצאו אהבה אמיתית
              </span>
            </p>
            <div className="hero-actions">
              <button className="btn-primary" style={{ fontSize: '18px' }}>
                התחל את המסע שלך ✨
              </button>
              <button className="btn-secondary" style={{ fontSize: '18px' }}>
                למד עוד
              </button>
            </div>

            {/* Quick Stats */}
            <div className="hero-stats">
              <div>
                <div
                  className="hero-stat-value"
                  style={{ color: 'var(--color-cyan)' }}
                >
                  2,847
                </div>
                <div className="hero-stat-label">חיות מחכות</div>
              </div>
              <div>
                <div
                  className="hero-stat-value"
                  style={{ color: 'var(--color-violet)' }}
                >
                  1,234
                </div>
                <div className="hero-stat-label">משפחות מאושרות</div>
              </div>
              <div>
                <div
                  className="hero-stat-value"
                  style={{ color: 'var(--color-orange)' }}
                >
                  45
                </div>
                <div className="hero-stat-label">עמותות שותפות</div>
              </div>
            </div>
          </div>

          <div>
            <div className="hero-image">
              <img
                src="https://images.unsplash.com/photo-1554235386-82e08c80c3ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwZG9nJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYyMzA2Mzk3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Happy pet"
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
      </div>
    </div>
  );
}
