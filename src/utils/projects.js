import projectsData from '../data/projects.json'
import impulsoStudioImg from '../assets/impulso-studio-app.webp'
import portfolioCover from '../assets/portfolio-cover.webp'
import robleisTourImg from '../assets/robleis-tour-2024.webp'

// Date Mapping based on Memento Mori
export const projectDates = {
    // Academic / Early
    "project-nanofig": "December 2020",
    "project-nico": "December 2022",

    // 2023
    "project-exec-el-demente": "August 2023",

    // 2024
    "project-iso-el-club-1": "March 2024",
    "project-iso-el-club-2": "March 2024",
    "project-iso-el-club-stream": "March 2024",
    "project-iso-mariano-mellino": "January 2025",
    "project-iso-santutu": "May 2024",
    "project-exec-eli": "May 2024",
    "project-exec-ana-bello": "May 2024",
    "project-iso-robleis": "May 2024",
    "project-iso-bambi": "June 2024",
    "project-iso-calipso": "May 2024",
    "project-iso-esteban": "July 2024",
    "project-iso-new-york": "August 2024",

    "project-iso-estani-y-fmk": "September 2024",
    "project-iso-unicornio": "August 2024",
    "project-iso-tokyo": "September 2024",
    "project-iso-levy": "November 2024",

    // 2025
    "project-iso-luck-ra": "January 2025",
    "project-exec-big-one": "May 2025",
    "project-exec-mawz": "May 2025",
    "project-exec-maxi-espindola": "June 2025",
    "project-exec-planeta-analogico": "June 2025",
    "project-exec-yami-safdie": "June 2025",

    "project-exec-antezana-247": "July 2025",
    "project-exec-lit-killah": "July 2025",
    "project-exec-estani-fmk-estudio-nuevo": "December 2025",
    "project-exec-zuriana": "October 2025",
    "project-exec-robleis-en-olga": "October 2025",
    "project-exec-robleis-c-art-media": "November 2025",
    "project-exec-robleis-rosario": "September 2025",
    "project-exec-pablo-cadelago": "May 2025",
    "project-impulso-studio": "September 2025",
};

// Helper to extract images for background
export const getBackgroundImages = (data) => {
    const images = [];
    const traverse = (items) => {
        items.forEach(item => {
            if (item.type === 'file' && item.name.match(/\.(webp)$/i) && item.path.includes('Isometric_Views')) {
                images.push(item.path);
            }
            if (item.children) {
                traverse(item.children);
            }
        });
    };
    traverse(data);
    return images;
};

// Helper to get portfolio items with specific logic
export const getPortfolioItems = (data) => {
    let items = [];
    const fallidos = ['project-iso-luck-ra'];

    // 1. Get Academic Projects -> Nanofig & Nico Cotton (Grouped)

    // 1. Get Academic Projects -> Nico Cotton
    const academicSection = data.find(d => d.name === "Academic Projects");
    if (academicSection) {
        // Nico Cotton
        const nico = academicSection.children?.find(c => c.name.includes("Nico Cotton"));
        if (nico) {
            items.push({
                id: 'project-nico',
                name: nico.name,
                path: '/assets/Executed_Studios/Nico Cotton.webp',
                type: 'project-group',
                originalFolder: nico,
                date: projectDates["project-nico"],
                scope: nico.scope,
                features: {
                    en: ["Cálculo de Tratamiento", "Análisis TR60", "Implementación", "Obra Acústica"],
                    es: ["Cálculo de Tratamiento", "Análisis TR60", "Implementación", "Obra Acústica"]
                },
                description: nico.description,
                projectType: nico.projectType
            });
        }
    }

    // 2. Get Professional Portfolio
    const professionalSection = data.find(d => d.name === "Professional Portfolio");
    if (professionalSection) {
        // Nanofig (Now in Professional Portfolio)
        const nanofig = professionalSection.children?.find(c => c.name.includes("Nanofig"));
        if (nanofig) {
            items.push({
                id: 'project-nanofig',
                name: "Nanofig Project (Nanoleaf)",
                path: '/assets/Executed_Studios/Nanofig project (Nanoleaf).webp', // Verify if this path is correct alias or if I need to use the one in JSON
                // Actually the path in JSON is "G:..." but usually we map it to local asset.
                // In the previous code it was hardcoded: path: '/assets/Executed_Studios/Nanofig project (Nanoleaf).webp'
                // But wait, the JSON has "children" with specific images. 
                // Nanofig is a "project-group" so it uses its children for images.
                // The thumbnail path matches what was there before.
                type: 'project-group',
                originalFolder: nanofig,
                date: projectDates['project-nanofig'],
                scope: nanofig.scope,
                features: {
                    en: ["IoT Lighting", "3D Design", "PCB Design", "Voice Control"],
                    es: ["Iluminación IoT", "Diseño 3D", "Diseño PCB", "Control por Voz"]
                },
                description: nanofig.description, // Use the description from JSON
                projectType: nanofig.projectType,
                link: "https://www.youtube.com/watch?v=VIDEO_ID_HERE"
            });
        }

        const isometric = professionalSection.children?.find(c => c.name === "Isometric_Views");
        if (isometric && isometric.children) {
            // Add REVERSED list of isometric views
            [...isometric.children].reverse().forEach(img => {
                const simpleName = img.name.replace("Vista Isometrica - ", "").replace(".webp", "");
                const id = `project-iso-${simpleName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

                const isFallido = fallidos.includes(id);
                const features = isFallido
                    ? {
                        en: ["Acoustic Design", "3D Rendering", "Interior Design"],
                        es: ["Diseño Acústico", "Renderizado 3D", "Interiorismo"]
                    }
                    : {
                        en: ["Acoustic Design", "Treatment Calculation", "TR60 Analysis", "Implementation", "Construction"],
                        es: ["Diseño Acústico", "Cálculo de Tratamiento", "Análisis TR60", "Implementación", "Obra Acústica"]
                    };

                items.push({
                    ...img,
                    id,
                    type: 'file',
                    displayName: simpleName,
                    date: projectDates[id] || null,
                    features,
                    link: "https://impulso.studio", // General link for now
                    projectType: img.projectType
                });
            });
        }

        // 3. Process Executed_Studios
        try {
            const executed = professionalSection && professionalSection.children
                ? professionalSection.children.find(c => c.name === "Executed_Studios")
                : null;

            if (executed && executed.children) {
                executed.children.forEach(project => {
                    if (!project || !project.name) return;
                    if (project.name === "Eli") return; // Skip Eli as requested

                    // Fallidos List for new items
                    const fallidosList = ["Mawz", "Yami Safdie", "Lit Killah"];
                    const isFallidoProject = fallidosList.some(f => project.name.includes(f));

                    // Features
                    let features;
                    if (isFallidoProject) {
                        features = {
                            en: ["Acoustic Design", "3D Rendering", "Interior Design"],
                            es: ["Diseño Acústico", "Renderizado 3D", "Interiorismo"]
                        };
                    } else if (project.name.toLowerCase().includes("robleis")) {
                        features = {
                            en: ["Live Show Operation", "Playback", "Stage Manager"],
                            es: ["Operación en Vivo", "Playback", "Stage Manager"]
                        };
                    } else {
                        features = {
                            en: ["Treatment Calculation", "TR60 Analysis", "Implementation", "Construction"],
                            es: ["Cálculo de Tratamiento", "Análisis TR60", "Implementación", "Obra Acústica"]
                        };
                    }

                    // Construct ID and Asset Path from the original folder name (last part of path)
                    const originalFolderName = project.path.split(/[\\/]/).filter(Boolean).pop();
                    const safeName = originalFolderName.toLowerCase().replace(/[^a-z0-9]/g, '-');
                    const id = `project-exec-${safeName}`;

                    // Asset Path uses the original folder name to match the .webp file
                    const assetPath = `/assets/Executed_Studios/${originalFolderName}.webp`;

                    items.push({
                        id,
                        name: project.name, // This is the customized name (e.g., "Robleis")
                        displayName: project.name,
                        type: 'file',
                        path: project.thumbnail || assetPath, // Use thumbnail for card if available
                        fullImage: assetPath, // Always use original .webp for modal
                        date: projectDates[id] || null,
                        scope: project.scope,
                        features,
                        description: project.description,
                        projectType: project.projectType
                    });
                });
            }
        } catch (e) {
            console.error("Error processing Executed Studios:", e);
        }
    }

    // 4. Process Personal_Apps
    const personalAppsSection = data.find(c => c.name === "Personal_Apps");
    if (personalAppsSection && personalAppsSection.children) {
        personalAppsSection.children.forEach(app => {
            let id = `project-${app.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
            let path = app.path;
            let displayName = app.name;

            // Overrides for specific apps
            if (app.name === "Portfolio") {
                path = portfolioCover;
                displayName = "Portfolio (This Website)";
                id = "project-portfolio-site";
            } else if (app.name === "Impulso.studio") {
                path = impulsoStudioImg;
                displayName = "Impulso.studio (Web App)";
                id = "project-impulso-studio";
            }

            items.push({
                id,
                name: app.name,
                displayName,
                type: 'file',
                path,
                date: projectDates[id] || (app.name === "Portfolio" ? "February 2026" : null),
                scope: app.scope,
                features: {
                    en: ["React", "Web App", "Software Development"], // Fallback if description parsing fails, but description should be used by component
                    es: ["React", "Web App", "Desarrollo de Software"]
                },
                projectType: app.projectType,
                description: app.description, // IMPORTANT: Pass the description from JSON
                link: app.name === "Portfolio" ? "https://github.com/emanuelcamargo/emanuelcamargo.github.io" : "https://impulso.studio"
            });
        });
    }

    // 5. Manually Add 'Robleis Tour 2024'
    items.push({
        id: 'project-exec-robleis-tour',
        name: "Robleis",
        type: 'file',
        displayName: "Robleis",
        projectType: {
            es: "Gira Nacional e Internacional",
            en: "National & International Tour"
        },
        date: "August 2024",
        displayDate: "Abril - Agosto 2024",
        path: robleisTourImg,
        features: {
            en: ["Live Sound", "Playback Engineering", "Tour Management", "Stage Tech"],
            es: ["Sonido en Vivo", "Ingeniería de Playback", "Gestión de Gira", "Técnica de Escenario"]
        }
    });

    // Sort: Missing dates first, then Newest -> Oldest
    items.sort((a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return -1;
        if (!b.date) return 1;
        return new Date(b.date) - new Date(a.date);
    });

    return items;
};

