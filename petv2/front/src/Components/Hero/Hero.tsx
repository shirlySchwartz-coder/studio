//import '../../styles/hero.css';
export function Hero() {
  return (
    <section className="relative bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Text Content - Right side for RTL */}
          <div className="p-8 md:p-16 order-2 md:order-1">
            <h1
              className="mb-6 animate-fade-in"
              style={{ color: 'var(--navy)' }}
            >
              אולי נהיה חברים?
            </h1>
            <p className="mb-8 text-xl" style={{ color: 'var(--blue-gray)' }}>
              אני רק רוצה בית חם, לא כלוב ❤️
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
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
          <div className="order-1 md:order-2 h-96 md:h-[500px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1653356161497-9c2a3ca47022?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGRvZyUyMGNhdCUyMGFkb3B0aW9ufGVufDF8fHx8MTc2Mjc5ODc2MHww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Pet adoption"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
