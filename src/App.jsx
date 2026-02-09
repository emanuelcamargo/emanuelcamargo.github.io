import React, { useState, useEffect, createContext, useContext } from 'react'
import ProjectModal from './ProjectModal'
import projectsData from './data/projects.json'
import experienceData from './data/experience.json'
import translations from './data/translations.json'
import impulsoLogo from './assets/impulso_logo.webp'
import profilePic from './assets/profile.webp'
import InteractiveSkills from './InteractiveSkills'
import skillsData from './data/skills.json'
import { getPortfolioItems, getBackgroundImages } from './utils/projects'

// Language context
const LanguageContext = createContext({ lang: 'es', setLang: () => { }, t: translations.es });
const useLang = () => useContext(LanguageContext);

// Date Mapping based on Memento Mori
// See src/utils/projects.js for details

// Helper to get portfolio items with specific logic
// See src/utils/projects.js for details

const BackgroundSlideshow = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const imgs = getBackgroundImages(projectsData);
    const shuffled = imgs.sort(() => 0.5 - Math.random());
    setImages(shuffled);
  }, []);

  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [images]);

  if (images.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100dvh', // Use dynamic viewport height for mobile stability
      zIndex: -1,
      overflow: 'hidden',
      background: '#0a0a0a'
    }}>
      {images.map((img, index) => {
        // Only render the current image and the next one to minimize DOM and network load
        const isCurrent = index === currentIndex;
        const isNext = index === (currentIndex + 1) % images.length;

        if (!isCurrent && !isNext) return null;

        return (
          <div
            key={img}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url("${img}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: isCurrent ? 1 : 0,
              transition: 'opacity 2s ease-in-out',
              filter: 'brightness(0.9) blur(1px) contrast(1.1) saturate(1.1)'
            }}
          />
        );
      })}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'var(--overlay-dark)',
        backdropFilter: 'blur(2px)'
      }} />
    </div>
  );
};

const FlagUS = () => (
  <svg viewBox="0 0 60 30" width="24" height="12" style={{ display: 'block' }}>
    <rect width="60" height="30" fill="#bf0a30" />
    <rect width="60" height="3.8" y="3.8" fill="#fff" />
    <rect width="60" height="3.8" y="11.4" fill="#fff" />
    <rect width="60" height="3.8" y="19" fill="#fff" />
    <rect width="60" height="3.8" y="26.6" fill="#fff" />
    <rect width="24" height="16" fill="#002868" />
  </svg>
);

const FlagES = () => (
  <svg viewBox="0 0 60 30" width="24" height="12" style={{ display: 'block' }}>
    <rect width="60" height="30" fill="#AA151B" />
    <rect width="60" height="15" y="7.5" fill="#F1BF00" />
  </svg>
);

const Navbar = () => {
  const { lang, setLang, t } = useLang();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => scrollToSection('home')}>
        Emanuel <span style={{ color: 'var(--color-accent)' }}>Camargo</span>
      </div>
      <div className="navbar-links">
        <button className="nav-link" onClick={() => scrollToSection('home')}>{t.nav.home}</button>
        <button className="nav-link" onClick={() => scrollToSection('about')}>{t.nav.about}</button>
        <button className="nav-link" onClick={() => scrollToSection('resume')}>{t.nav.resume}</button>
        <button className="nav-link" onClick={() => scrollToSection('portfolio')}>{t.nav.portfolio}</button>
        <button className="nav-link" onClick={() => scrollToSection('impulso')}>Impulso</button>
        <button
          className="lang-toggle"
          onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
          title={lang === 'es' ? "Switch to English" : "Cambiar a Español"}
        >
          {lang === 'en' ? <FlagUS /> : <FlagES />}
        </button>
      </div>
    </nav>
  );
};


// Inside HeroAbout
const HeroAbout = ({ scrollToSection, setHighlightedIds, highlightedIds }) => {
  const { lang, t } = useLang();

  return (
    <>
      <section id="home" className="hero-grid fade-in" style={{
        minHeight: 'auto',
        padding: '5rem 1rem 2rem 1rem',
        maxWidth: '1800px',
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}>
        {/* Left: Hero Content */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px' }}>
          <h1 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', fontWeight: '800', lineHeight: '1.2', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
            {t.hero.title1} <span style={{
              background: 'linear-gradient(to right, var(--color-accent), #a1a1a6)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>{t.hero.title2}</span> {t.hero.title3}
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#e0e0e0', marginBottom: '0.75rem', fontWeight: '300', lineHeight: '1.5' }}>
            {t.hero.subtitle}
          </p>
          <p style={{ fontSize: '0.8rem', color: '#b0b0b0', marginBottom: '1rem' }}>
            {t.hero.founderText} <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('impulso'); }} style={{ color: '#fff', borderBottom: '1px solid var(--text-accent)' }}>Impulso Studio</a>
            <img src={impulsoLogo} alt="Impulso Studio" style={{ height: '16px', verticalAlign: 'middle', marginLeft: '5px', opacity: 0.9 }} />
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => scrollToSection('portfolio')}>{t.hero.viewPortfolio}</button>
            <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: 'rgba(255,255,255,0.05)' }} onClick={() => scrollToSection('resume')}>{t.hero.viewResume}</button>
            <a
              href="/assets/Emanuel_Camargo_Resume.pdf"
              download="Emanuel_Camargo_Resume.pdf"
              className="btn-secondary"
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.85rem',
                background: 'rgba(50, 200, 50, 0.15)',
                border: '1px solid rgba(50, 200, 50, 0.3)',
                color: '#88ff88',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              {lang === 'es' ? "📄 Descargar CV" : "📄 Download CV"}
            </a>
          </div>
          <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
            {[
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>, link: experienceData.socials.linkedin, label: "LinkedIn" },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>, link: experienceData.socials.github, label: "GitHub" },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>, link: experienceData.socials.email, label: "Email" }
            ].map((social, idx) => (
              <a
                key={idx}
                href={social.link}
                target="_blank"
                rel="noreferrer"
                className="glass-panel"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  color: '#b0b0b0',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  fontSize: '0.85rem',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.borderColor = 'var(--text-accent)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = '#b0b0b0';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {social.icon}
                <span>{social.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Right: About + Skills */}
        <div id="about" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '100%' }}>
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-start',
            flexWrap: 'wrap' // Ensure wrapping on mobile
          }}>
            <div className="glass-panel" style={{ flex: '1 1 300px', padding: '1rem', minWidth: '0' }}>
              <h2 className="section-title" style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{t.about.title}</h2>
              <div style={{ fontSize: '0.85rem', color: '#d0d0d0', lineHeight: '1.5' }}>
                <p style={{ marginBottom: '0.5rem' }}>{t.about.p1}</p>
                <p>{t.about.p2}</p>
              </div>
            </div>
            <div style={{
              width: '120px',
              height: '120px',
              flexShrink: 0,
              background: 'var(--bg-card)',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              overflow: 'hidden',
              margin: '0 auto' // Center profile pic on wrap
            }}>
              <img src={profilePic} alt="Emanuel Camargo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const Resume = ({ highlightedIds = [], setHighlightedIds, onProjectClick }) => {
  const { lang, t } = useLang();

  // Get All Projects once needed for filtering logic
  const allProjects = getPortfolioItems(projectsData);
  // Checking line 2: `import projectsData...` `import experienceData...`
  // `skillsData` is MISSING from imports! 
  // Good catch. I need to add `import skillsData from './data/skills.json'`

  // Unique emoji per experience type
  const emojiMap = {
    1: '🔧', // Impulso - Wrench/Engineering
    2: '🎛️', // Team Robleis - Mixer/Console
    3: '🌐', // ElSurhost - Web
    4: '🖥️', // Atos (Stellantis) - PC
    5: '🖥️', // Experis (Peugeot) - PC
    6: '🎓'  // UNTREF - Education
  };
  const colors = ['#0ea5e9', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'];

  // Timeline setup
  const startYear = 2016;
  const now = new Date();
  const endYear = 2027; // Fixed to 2027 as requested
  const totalMonths = (endYear - startYear) * 12 + 12; // Scale covers full 2027

  // Calculate "Today" position
  const currentMonthIdx = (now.getFullYear() - startYear) * 12 + (now.getMonth() + 1);
  const currentRatio = currentMonthIdx / totalMonths;

  const parseToRelativeMonths = (dateStr) => {
    if (!dateStr) return 0;
    if (dateStr.toLowerCase().includes('present') || dateStr.toLowerCase().includes('actualidad')) {
      return (now.getFullYear() - startYear) * 12 + (now.getMonth() + 1);
    }

    const parts = dateStr.split(' ');
    if (parts.length >= 2) {
      const monthStr = parts[0].substring(0, 3).toLowerCase();
      const year = parseInt(parts[1]);
      const monthMap = {
        'jan': 1, 'ene': 1, 'feb': 2, 'mar': 3, 'apr': 4, 'abr': 4,
        'may': 5, 'jun': 6, 'jul': 7, 'aug': 8, 'ago': 8,
        'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12, 'dic': 12
      };
      const month = monthMap[monthStr] || 1;
      return (year - startYear) * 12 + month;
    }

    const yearOnly = parseInt(dateStr.match(/\d{4}/)?.[0]);
    if (yearOnly) return (yearOnly - startYear) * 12 + 1;

    return 0;
  };

  // Generate year markers
  const years = [];
  for (let y = startYear; y <= endYear; y++) {
    years.push(y);
  }

  // Reverse Lookup Helper
  const getLinkedIds = (expId) => {
    let ids = [expId];

    // 1. Get Base Skills from skillsData
    if (skillsData && skillsData.categories) {
      skillsData.categories.forEach(cat => {
        cat.skills.forEach(skill => {
          if (skill.experiences && skill.experiences.includes(expId)) {
            if (skill.projects) ids.push(...skill.projects);
          }
        });
      });
    }

    // 2. Apply Custom Business Rules

    // Exp 1: Impulso Studio (Audio/Acoustics) -> EXCLUDE Playback/Robleis, INCLUDE all Acoustic/Calculations
    if (expId === 1) {
      // 1. Filter existing ids to remove Robleis
      ids = ids.filter(id => {
        if (typeof id === 'number') return true;
        return !id.includes('robleis');
      });

      // 2. Add all projects that look like Acoustic/Studio/Iso/Exec that are NOT Robleis
      const acousticProjects = allProjects.filter(p => {
        if (p.id.includes('robleis')) return false; // Safety check

        // Check ID prefixes
        if (p.id.startsWith('project-iso-')) return true;

        // Check Features for keywords
        const keywords = ['treatment', 'tratamiento', 'tr60', 'acoustic', 'acústica', 'studio', 'estudio', 'calculation', 'cálculo'];
        const hasKeyword = (lang) => p.features && p.features[lang] && p.features[lang].some(f =>
          keywords.some(k => f.toLowerCase().includes(k))
        );

        if (hasKeyword('en') || hasKeyword('es')) return true;

        // Check specific known acoustic execution projects
        const knownAcoustic = ['zuriana', 'estani', 'mawz', 'yami', 'lit-killah', 'big-one', 'maxi-espindola', 'planeta-analogico', 'fifty-emanero', 'antezana', 'pablo-cadelago'];
        if (knownAcoustic.some(k => p.id.includes(k))) return true;

        return false;
      }).map(p => p.id);

      ids.push(...acousticProjects);
    }

    // Exp 2: Team Robleis -> SHOW ONLY Playback and Tour
    if (expId === 2) {
      // Fetch ALL robleis projects (including the new tour one)
      const robleisProjects = allProjects
        .filter(p => p.id.includes('robleis'))
        .map(p => p.id);
      // Return expId + Robleis projects
      return [expId, ...robleisProjects];
    }

    // Exp 3: ElSurhost (Web Admin) -> ADD Portfolio Site
    if (expId === 3) {
      ids.push('project-portfolio-site');
    }

    return [...new Set(ids)];
  };

  // --- Filtering Logic ---
  const hasHighlight = highlightedIds.length > 0;

  // Filter Experiences: Show ONLY if in highlightedIds (or show ALL if no highlight)
  const visibleExperiences = hasHighlight
    ? experienceData.experience.filter(item => highlightedIds.includes(item.id))
    : experienceData.experience;

  // Get Related Projects
  // We need to fetch project details for highlighted items that match project IDs
  // Get Related Projects
  // We need to fetch project details for highlighted items that match project IDs
  // allProjects is already defined at top of component
  const visibleProjects = hasHighlight
    ? allProjects.filter(p => highlightedIds.includes(p.id))
    : [];

  return (
    <section id="resume" className="fade-in" style={{ padding: '3rem 1rem' }}>

      {/* Education First (Reordered) */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>🎓 {t.resume.education}</h2>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          {experienceData.education.map(item => (
            <div key={item.id} className="glass-panel" style={{ minWidth: '300px', flex: 1 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>{typeof item.degree === 'object' ? item.degree[lang] : item.degree}</h3>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-accent)' }}>{item.institution} | {item.period}</h4>
              <p style={{ fontSize: '0.85rem', color: '#ccc', marginTop: '0.5rem' }}>
                {typeof item.description === 'object' ? item.description[lang] : item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Show Title if we have experiences OR active projects to show */}
      {(visibleExperiences.length > 0 || visibleProjects.length > 0) && (
        <h2 id="experience-section" className="section-title" style={{ fontSize: '2rem', marginBottom: '1.5rem', scrollMarginTop: '100px' }}>{t.resume.experience}</h2>
      )}

      {/* Timeline Container - Only show if NOT filtering (timeline looks weird with missing chunks) OR show full? 
          User said "las que no estan seleccionadas no aparezcan". 
          Hiding timeline bars might be weird. Let's Hide the timeline entirely if we are filtering, 
          OR assume the user just wants the Detail Cards to filter. 
          "suma los proyectos... a la seccion de experiencia como un listado".
          This implies a "List Mode". 
          Let's HIDE the timeline if filtered, to focus on the cards.
      */}
      {/* Timeline Container */}
      <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto', marginBottom: '3rem', position: 'relative' }}>

        {/* Today Indicator */}
        <div style={{
          position: 'absolute',
          left: `calc(120px + (100% - 150px) * ${currentRatio})`, // 120px label + padding fix
          top: '3.5rem', // Below headers
          bottom: '1.5rem', // Match padding
          width: '2px', // Vertical bar
          background: '#fff', // White Bar
          boxShadow: '0 0 10px rgba(255, 255, 255, 0.8), 0 0 2px rgba(255, 255, 255, 1)', // White Glow
          zIndex: 10,
          pointerEvents: 'none',
          borderRadius: '2px'
        }}>
          <div style={{
            position: 'absolute',
            top: '-24px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#fff', // White Badge
            color: '#000',
            fontSize: '0.7rem',
            fontWeight: '800',
            padding: '2px 8px',
            borderRadius: '12px',
            whiteSpace: 'nowrap',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
          }}>
            TODAY
          </div>
        </div>

        {/* Year Headers */}
        <div style={{ display: 'flex', marginBottom: '0.5rem', marginLeft: '120px' }}>
          {years.map(year => (
            <div key={year} style={{
              flex: 1,
              textAlign: 'left',
              fontSize: '0.7rem',
              color: 'var(--text-secondary)',
              minWidth: '40px'
            }}>
              {year}
            </div>
          ))}
        </div>

        {/* Timeline Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {experienceData.experience.map((item, idx) => {
            const dateParts = item.period.split('-').map(s => s.trim());
            const startM = parseToRelativeMonths(dateParts[0]);
            const endM = parseToRelativeMonths(dateParts.length > 1 ? dateParts[1] : 'Present');

            const leftPct = Math.max(0, (startM / totalMonths) * 100);
            const widthPct = Math.max(2, ((endM - startM) / totalMonths) * 100);

            return (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', height: '22px' }}>
                {/* Label */}
                <div style={{
                  width: '120px',
                  minWidth: '120px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  paddingRight: '8px'
                }}>
                  <span style={{ fontSize: '0.9rem' }}>{emojiMap[item.id] || '📋'}</span>
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.company}
                  </span>
                </div>

                {/* Bar Container */}
                <div style={{
                  flex: 1,
                  position: 'relative',
                  height: '14px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '3px'
                }}>
                  <div style={{
                    position: 'absolute',
                    left: `${leftPct}%`,
                    width: `${widthPct}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${colors[(item.id - 1) % colors.length]}, ${colors[(item.id - 1) % colors.length]}bb)`,
                    borderRadius: '3px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const linkedIds = getLinkedIds(item.id);
                      if (setHighlightedIds) setHighlightedIds(linkedIds);
                      const element = document.getElementById(`exp-${item.id}`);
                      if (element) {
                        const y = element.getBoundingClientRect().top + window.scrollY - 120;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                      }
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scaleY(1.3)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scaleY(1)'}
                    title={`${typeof item.role === 'object' ? item.role[lang] : item.role}\n${item.company}\n${item.period}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filtered Content: Experiences + Projects */}
      {/* Unified Content Grid: Experiences + Projects */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>

        {/* Experiences */}
        {visibleExperiences.filter(item => item.type !== 'education').map((item, idx) => (
          <div key={item.id} className="glass-panel"
            id={`exp-${item.id}`}
            style={{
              borderLeft: `5px solid ${colors[(item.id - 1) % colors.length]}`,
              padding: '1.5rem',
              transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
              cursor: 'pointer',
              animation: 'fadeIn 0.4s ease'
            }}
            onClick={(e) => {
              e.stopPropagation();
              const linkedIds = getLinkedIds(item.id);
              if (setHighlightedIds) setHighlightedIds(linkedIds);
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>{emojiMap[item.id] || '📋'}</span>
              <h3 style={{ fontSize: '0.9rem', fontWeight: '700', whiteSpace: 'nowrap' }}>{typeof item.role === 'object' ? item.role[lang] : item.role}</h3>
              {item.mode && (
                <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                  {item.mode}
                </span>
              )}
            </div>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-accent)', marginBottom: '0.75rem', fontWeight: '600' }}>{item.company} | {item.period}</h4>
            <div
              style={{ fontSize: '0.85rem', color: '#ccc', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}
              dangerouslySetInnerHTML={{
                __html: (typeof item.description === 'object' ? item.description[lang] : item.description)
                  .replace(/\*\*(.+?)\*\*/g, '<strong style="color: #fff; font-weight: 600;">$1</strong>')
              }}
            />
          </div>
        ))}

        {/* Projects (Acting as sibling cards) */}
        {visibleProjects.map((item, index) => (
          <ProjectCard key={`rel-${item.name}-${index}`} item={item} highlightedIds={highlightedIds} onProjectClick={onProjectClick} />
        ))}
      </div>
    </section>
  );
}

const FileIcon = ({ name }) => {
  if (name.endsWith('.pdf')) return '📄';
  if (name.endsWith('.jpg') || name.endsWith('.png')) return '🖼️';
  if (name.endsWith('.mp4')) return '🎬';
  return '📝';
}

const ProjectCard = ({ item, highlightedIds = [], onProjectClick }) => {
  const { lang, t } = useLang();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const isGroup = item.type === 'project-group';

  // Calculate highlight state
  const isHighlighted = highlightedIds.includes(item.id);
  const isDimmed = highlightedIds.length > 0 && !isHighlighted;

  // Get all valid images from project folder
  const images = isGroup && item.originalFolder?.children
    ? item.originalFolder.children.filter(c => c.name.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)).map(c => c.path)
    : [item.path];

  // Cycle images for groups
  useEffect(() => {
    if (!isGroup || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isGroup, images.length]);

  return (
    <div
      title={`ID: ${item.id} - ${item.name}`}
      className="card"
      style={{
        background: isHighlighted ? 'rgba(30, 30, 35, 0.8)' : 'var(--bg-card)',
        borderRadius: '16px',
        overflow: 'hidden',
        border: isHighlighted ? '1px solid var(--text-accent)' : '1px solid var(--border-subtle)',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backdropFilter: 'blur(10px)',
        opacity: isDimmed ? 0.6 : 1, // Subtle dimming
        transform: isHighlighted ? 'scale(1.005)' : 'none', // Subtle scale
        boxShadow: isHighlighted ? '0 8px 30px -5px rgba(0,0,0,0.3)' : 'none'
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (onProjectClick) {
          onProjectClick(item);
        } else {
          window.open(item.path, '_blank');
        }
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)';
        e.currentTarget.style.borderColor = 'var(--text-accent)';
        e.currentTarget.style.background = 'rgba(40, 40, 45, 0.8)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = isHighlighted ? 'scale(1.005)' : 'none';
        e.currentTarget.style.boxShadow = isHighlighted ? '0 8px 30px -5px rgba(0,0,0,0.3)' : 'none';
        e.currentTarget.style.borderColor = isHighlighted ? 'var(--text-accent)' : 'var(--border-subtle)';
        e.currentTarget.style.background = isHighlighted ? 'rgba(30, 30, 35, 0.8)' : 'var(--bg-card)';
      }}
    >
      <div style={{
        aspectRatio: '16/9',
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {images.map((imgPath, idx) => (
          <img
            key={imgPath}
            src={imgPath}
            alt={item.name}
            loading="lazy"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'opacity 0.8s ease-in-out',
              opacity: idx === currentImgIndex ? 1 : 0
            }}
          />
        ))}
        {isGroup && images.length > 1 && (
          <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '8px', fontSize: '0.7rem', color: '#fff' }}>
            {currentImgIndex + 1}/{images.length}
          </div>
        )}
        {/* Card Overlay (New) */}
        <div className="card-overlay">
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
            {item.projectType ? item.projectType[lang] : (item.displayName || item.name)}
          </h2>
        </div>
      </div>

      <div style={{ padding: '1rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.1rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {item.projectType ? item.projectType[lang] : (item.displayName || item.name.replace(/\.[^/.]+$/, ""))}
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: '500' }}>
          {item.displayName || item.name}
        </p>
        {(item.displayDate || item.date) && (
          <p style={{ fontSize: '0.8rem', color: 'var(--accent-color)', marginBottom: '0.25rem' }}>
            {item.displayDate || item.date}
          </p>
        )}
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {item.features
            ? (typeof item.features === 'object' ? item.features[lang] : item.features).map((f, i) => (
              <span key={i} style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '2px 8px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#d0d0d0',
                fontSize: '0.7rem'
              }}>
                {f}
              </span>
            ))
            : (isGroup ? `Project • ${images.length} photos` : 'Design / Render')}
        </div>
      </div>
    </div>
  );
};

const Portfolio = ({ highlightedIds = [], onProjectClick }) => {
  const { t } = useLang();
  const [allItems, setAllItems] = useState([]);

  useEffect(() => {
    setAllItems(getPortfolioItems(projectsData));
  }, []);

  return (
    <section id="portfolio" className="fade-in" style={{ padding: '4rem 0' }}>
      <h2 className="section-title" style={{ marginBottom: '2rem', fontSize: '2rem' }}>
        {t.portfolio.title}
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {allItems.map((item, index) => (
          <ProjectCard key={`${item.name}-${index}`} item={item} highlightedIds={highlightedIds} onProjectClick={onProjectClick} />
        ))}
      </div>
    </section>
  )
}

const ImpulsoStudio = () => (
  <section id="impulso" className="fade-in" style={{ padding: '4rem 0', height: '90vh', display: 'flex', flexDirection: 'column' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
      <h2 className="section-title" style={{ margin: 0, fontSize: '2rem' }}>Impulso Studio</h2>
      <a href="https://impulso.studio" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
        Open in New Tab ↗
      </a>
    </div>

    <div style={{
      flex: 1,
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid var(--border-subtle)',
      background: 'white'
    }}>
      <iframe
        src="https://impulso.studio"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Impulso Studio"
      />
    </div>
  </section>
)

function App() {
  const [lang, setLang] = useState('en');
  const [highlightedIds, setHighlightedIds] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const t = translations[lang];

  // Global click handler to deselect
  useEffect(() => {
    const handleGlobalClick = (e) => {
      // If clicking inside a card or interactive element, let that handler take care of it via stopPropagation.
      // If the event bubbles up here, it means we clicked on background or 'safe' area, so we clear.

      // We don't want to clear highlighting if we just closed a modal or something similar,
      // but for now this behavior is acceptable.
      setHighlightedIds([]);
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <BackgroundSlideshow />
      <Navbar />
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} lang={lang} t={t} />
      <div className="container">
        <main style={{ paddingTop: '0' }}>
          <HeroAbout scrollToSection={scrollToSection} setHighlightedIds={setHighlightedIds} highlightedIds={highlightedIds} />
          <section id="skills" className="fade-in" style={{ padding: '2rem 0' }}>
            <InteractiveSkills
              lang={lang}
              highlightedIds={highlightedIds}
              onSkillClick={(ids) => {
                setHighlightedIds(ids);
                if (ids.length > 0) {
                  setTimeout(() => {
                    const element = document.getElementById('experience-section');
                    if (element) {
                      const y = element.getBoundingClientRect().top + window.scrollY - 100;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }, 50);
                }
              }}
            />
          </section>
          <Resume highlightedIds={highlightedIds} setHighlightedIds={setHighlightedIds} onProjectClick={setSelectedProject} />
          <Portfolio highlightedIds={highlightedIds} onProjectClick={setSelectedProject} />
          <ImpulsoStudio />
        </main>
        <footer style={{ padding: '2rem 3rem', textAlign: 'center', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)', marginTop: '4rem', background: 'var(--bg-card)', backdropFilter: 'blur(10px)' }}>
          <p>&copy; {new Date().getFullYear()} Emanuel Camargo. <br /><span style={{ fontSize: '0.8rem' }}>{t.footer.powered}</span></p>
        </footer>
      </div>
    </LanguageContext.Provider>
  )
}

// Basic Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: 'red' }}>
          <h1>Something went wrong.</h1>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppWrapper = () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

export default AppWrapper;
