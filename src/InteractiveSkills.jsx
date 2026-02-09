import { useState } from 'react';
import skillsData from './data/skills.json';

const InteractiveSkills = ({ lang = 'en', onSkillClick, highlightedIds = [] }) => {
    const categories = skillsData.categories;
    const hasHighlight = highlightedIds.length > 0;

    return (
        <div style={{ padding: '0 1rem', width: '100%', margin: '0 auto' }}>
            <h3 style={{
                fontSize: '1rem',
                marginBottom: '1.25rem',
                color: 'var(--text-accent)',
                fontWeight: '800',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                paddingBottom: '0.6rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
                {lang === 'es' ? 'Habilidades Técnicas' : 'Technical Skills'}
            </h3>

            {/* Optimized Grid of Categories */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.25rem',
                marginTop: '0.5rem'
            }}>
                {categories.map((cat) => (
                    <div key={cat.id} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        background: 'rgba(255,255,255,0.12)', // Increased from 0.04
                        padding: '1.25rem',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.15)', // Increased from 0.08
                        backdropFilter: 'blur(12px)'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            fontSize: '0.9rem',
                            fontWeight: '900',
                            color: '#fff',
                        }}>
                            <span style={{ fontSize: '1.2rem' }}>{cat.icon}</span>
                            <span style={{ letterSpacing: '0.03em' }}>{cat.name[lang]}</span>
                        </div>

                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.4rem'
                        }}>
                            {cat.skills.map(skill => {
                                const isActive = hasHighlight && (
                                    (skill.experiences && skill.experiences.some(id => highlightedIds.includes(id))) ||
                                    (skill.projects && skill.projects.some(id => highlightedIds.includes(id)))
                                );

                                // Logic: Dim if highlight is active BUT this skill is NOT related.
                                const opacityValue = (hasHighlight && !isActive) ? 0.25 : 1;
                                const isSkillSelected = hasHighlight && isActive;

                                return (
                                    <div
                                        key={skill.name}
                                        style={{
                                            background: isSkillSelected ? '#fff' : 'rgba(255,255,255,0.18)', // Increased from 0.06
                                            padding: '0.4rem 0.8rem',
                                            borderRadius: '24px',
                                            fontSize: '0.75rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.35rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
                                            border: isSkillSelected ? '1px solid #fff' : '1px solid rgba(255,255,255,0.25)', // Increased from 0.15
                                            transform: isSkillSelected ? 'scale(1.1)' : 'none',
                                            boxShadow: isSkillSelected ? '0 0 25px rgba(255,255,255,0.4)' : 'none',
                                            color: isSkillSelected ? '#000' : '#fff',
                                            opacity: opacityValue,
                                            fontWeight: '700'
                                        }}
                                        onMouseOver={(e) => {
                                            if (!isSkillSelected) {
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
                                                if (hasHighlight && !isActive) e.currentTarget.style.opacity = 1;
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            if (!isSkillSelected) {
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.18)';
                                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
                                                e.currentTarget.style.opacity = opacityValue;
                                            }
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (onSkillClick) {
                                                const ids = [...(skill.experiences || []), ...(skill.projects || [])];
                                                onSkillClick(ids);
                                            }
                                        }}
                                    >
                                        <span style={{ fontSize: '0.9rem' }}>{skill.icon}</span>
                                        <span>{skill.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InteractiveSkills;
