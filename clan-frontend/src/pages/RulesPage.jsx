import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';

export default function RulesPage() {
  const { t } = useLanguage();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />
      
      <div className="page-padding" style={{ padding: '40px 24px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <div className="wow-header-ornament" style={{ justifyContent: 'center' }}>
            <h1 className="font-wow gradient-gold" style={{ fontSize: 28, letterSpacing: '0.04em' }}>
              {t('rules.title')}
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, fontFamily: 'Cinzel, serif', marginTop: 8 }}>
            {t('rules.subtitle')}
          </p>
        </div>

        <div className="wow-card animate-fadeInUp" style={{ padding: '32px 40px', display: 'flex', flexDirection: 'column', gap: 32 }}>
          
          <section>
            <h2 className="font-wow" style={{ fontSize: 16, color: 'var(--gold-primary)', marginBottom: 12, borderBottom: '1px solid var(--border-gold)', paddingBottom: 8 }}>
              {t('rules.section1.title')}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, fontFamily: 'Inter, sans-serif' }}>
              {t('rules.section1.desc')}
            </p>
          </section>

          <section>
            <h2 className="font-wow" style={{ fontSize: 16, color: 'var(--gold-primary)', marginBottom: 12, borderBottom: '1px solid var(--border-gold)', paddingBottom: 8 }}>
              {t('rules.section2.title')}
            </h2>
            <div className="wow-alert-warning" style={{ marginBottom: 12 }}>
              {t('rules.section2.desc')}
            </div>
          </section>

          <section>
            <h2 className="font-wow" style={{ fontSize: 16, color: 'var(--gold-primary)', marginBottom: 12, borderBottom: '1px solid var(--border-gold)', paddingBottom: 8 }}>
              {t('rules.section3.title')}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, fontFamily: 'Inter, sans-serif' }}>
              {t('rules.section3.desc')}
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
