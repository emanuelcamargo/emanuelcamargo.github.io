
import React, { useState } from 'react';
import './ProjectModal.css'; // Import the new CSS

const ProjectModal = ({ project, onClose, lang, t }) => {
    if (!project) return null;

    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    // Lock body scroll when modal is open
    React.useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);


    // Get all images (carousel)
    const isGroup = project.type === 'project-group';
    const images = isGroup && project.originalFolder?.children
        ? project.originalFolder.children.filter(c => c.name.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)).map(c => c.path)
        : [project.fullImage || project.path]; // Prefer fullImage for modal

    const handleNext = (e) => {
        e.stopPropagation();
        setCurrentImgIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="modal-overlay fade-in" onClick={onClose}>
            <div
                className="modal-container glass-panel"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header / Close */}
                <div className="modal-header">
                    <div className="modal-title">
                        <h2>
                            {project.projectType ? project.projectType[lang] : (project.displayName || project.name)}
                        </h2>
                        {project.projectType && (
                            <p className="modal-subtitle">
                                {project.displayName || project.name}
                            </p>
                        )}
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    {/* Left: Gallery */}
                    <div className="modal-gallery">
                        <img
                            src={images[currentImgIndex]}
                            alt={project.name}
                        />

                        {images.length > 1 && (
                            <>
                                <button onClick={handlePrev} className="gallery-nav-btn gallery-prev">‹</button>
                                <button onClick={handleNext} className="gallery-nav-btn gallery-next">›</button>
                                <div className="gallery-counter">
                                    {currentImgIndex + 1} / {images.length}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right: Details */}
                    <div className="modal-details">
                        <div style={{ marginBottom: '1rem' }}>
                            <h3 className="modal-project-date">
                                {project.date || "Project"}
                            </h3>
                            <div className="modal-tags">
                                {project.features && (typeof project.features === 'object' ? project.features[lang] : project.features).map((f, i) => (
                                    <span key={i} className="tag-badge">
                                        {f}
                                    </span>
                                ))}
                            </div>

                            <div
                                className="project-description-content"
                                dangerouslySetInnerHTML={{
                                    __html: (project.description ? (typeof project.description === 'object' ? project.description[lang] : project.description) : '')
                                        .replace(/^### (.+)$/gm, '<h3 style="color: #fff; font-size: 1.1rem; margin-top: 0.5rem; margin-bottom: 0.75rem; font-weight: 700;">$1</h3>')
                                        .replace(/\*\*(.+?)\*\*/g, '<strong style="color: var(--color-accent); font-weight: 600;">$1</strong>')
                                        .replace(/^- (.+)$/gm, '<li style="margin-bottom: 0.4rem; list-style-type: none; padding-left: 1rem; position: relative;"><span style="position: absolute; left: 0; color: var(--color-accent);">•</span>$1</li>')
                                        .replace(/\n\n/g, '<div style="margin-bottom: 1rem;"></div>')
                                        || (project.scope && project.scope.length > 0
                                            ? `<strong>${lang === 'es' ? "Alcance del trabajo:" : "Scope of work:"}</strong><ul style="margin-top: 0.5rem; padding-left: 0;">${project.scope.map(s => `<li style="margin-bottom: 0.3rem; list-style-type: none; padding-left: 1rem; position: relative;"><span style="position: absolute; left: 0; color: var(--color-accent);">•</span>${t.scopes[s] || s}</li>`).join('')}</ul>`
                                            : (lang === 'es' ? "Imágenes del proyecto." : "Project gallery."))
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectModal;
