/* ============================================================================
   SITE CONTENT — edit this file to change anything written on the website.

   How it works:
   - Every piece of text has an English (en) and French (fr) version.
   - Text that is the same in both languages can be a plain "string".
   - Wrap a word in *asterisks* to give it the copper serif accent,
     e.g. "Let's build *something*."
   - Save the file and the site updates. No animation code to touch.
   ========================================================================== */

import type { Text } from "@/lib/i18n";

/* ---------------------------------------------------------------- basics */

export const person = {
  name: "Gregory Sutjian",
  firstName: "Gregory",
  lastName: "Sutjian",
  email: "gregory.sutjian@mail.mcgill.ca",
  // Put your CV in /public/cv/ and keep this path in sync.
  cv: "/cv/Gregory_Sutjian_CV.pdf",
  timezone: "America/Toronto", // Montreal time
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/gregorysutjian" },
    { label: "GitHub", href: "https://github.com/gregorysudjian-ui" },
  ],
  // Photo shown in the datasheet card (About section). Put the file in /public/images/.
  photo: {
    src: "/images/gregory.webp",
    alt: { en: "Portrait of Gregory Sutjian", fr: "Portrait de Gregory Sutjian" },
  } as null | { src: string; alt: Text },
};

/* ------------------------------------------------------ search & sharing */

export const meta = {
  title: {
    en: "Gregory Sutjian — Computer Engineering at McGill",
    fr: "Gregory Sutjian — Génie informatique à McGill",
  },
  description: {
    en: "Gregory Sutjian is a Computer Engineering student at McGill in Montreal who builds AI agents and full-stack web apps, and is looking for internships.",
    fr: "Gregory Sutjian est étudiant en génie informatique à McGill, à Montréal. Il développe des agents IA et des applications web complètes, et cherche un stage.",
  },
};

/* -------------------------------------------------------------- interface */

export const ui = {
  skipToContent: { en: "Skip to content", fr: "Aller au contenu" },
  menu: { en: "Menu", fr: "Menu" },
  close: { en: "Close", fr: "Fermer" },
  switchLanguage: { en: "Voir le site en français", fr: "View the site in English" },
  nav: [
    { id: "about", label: { en: "About", fr: "À propos" } },
    { id: "projects", label: { en: "Projects", fr: "Projets" } },
    { id: "experience", label: { en: "Experience", fr: "Parcours" } },
    { id: "contact", label: { en: "Contact", fr: "Contact" } },
  ],
} satisfies Record<string, unknown>;

/* ------------------------------------------------------------------- hero */

export const hero = {
  eyebrow: {
    en: "Computer Engineering — McGill University",
    fr: "Génie informatique — Université McGill",
  },
  tagline: {
    en: "I like building things, from AI agents to full websites, and I'm always up for learning something new.",
    fr: "J'aime construire des choses, des agents IA aux sites web complets, et j'ai toujours envie d'apprendre quelque chose de nouveau.",
  },
  status: { en: "Open to internships", fr: "Ouvert aux stages" },
  ctaProjects: { en: "View projects", fr: "Voir les projets" },
  ctaCv: { en: "Download CV", fr: "Télécharger le CV" },
  scrollHint: { en: "Scroll", fr: "Défiler" },
};

/* -------------------------------------------------------------- statement */

export const statement: Text = {
  en: "My favourite part of building something is the moment I understand how it *actually* works. I chase that feeling everywhere: in code, in math, and in whatever I haven't tried yet.",
  fr: "Mon moment préféré quand je construis quelque chose, c'est celui où je comprends comment ça marche *vraiment*. Je cours après ce moment partout : dans le code, dans les maths, et dans tout ce que je n'ai pas encore essayé.",
};

/* ------------------------------------------------------------------ about */

export const about = {
  label: { en: "About", fr: "À propos" },
  heading: { en: "Hi, I'm *Gregory*.", fr: "Bonjour, moi c'est *Gregory*." },
  paragraphs: [
    {
      en: "I grew up in Lebanon and moved to Montreal for university at McGill. What I enjoy most is taking an idea all the way to something that works in the real world, and picking up whatever I need to learn along the way.",
      fr: "J'ai grandi au Liban et je suis venu à Montréal pour mes études à McGill. Ce que j'aime le plus, c'est mener une idée jusqu'à quelque chose qui fonctionne dans le monde réel, en apprenant en chemin tout ce qu'il faut.",
    },
    {
      en: "Before university, I spent a lot of my time teaching: basic coding with LEGO WeDo and SPIKE kits to kids at NinjaCO, then math to students in Beirut and Montreal. Explaining a hard idea simply is still the best way I know to understand it myself.",
      fr: "Avant l'université, j'ai passé beaucoup de temps à enseigner : les bases du code avec des kits LEGO WeDo et SPIKE à des enfants chez NinjaCO, puis les maths à des élèves à Beyrouth et à Montréal. Expliquer simplement une idée difficile reste la meilleure façon que je connaisse de la comprendre moi-même.",
    },
    {
      en: "Lately I've been building projects with AI tools like Claude Code: an AI lead agent, a website for my math tutoring, and this site. Now I'm looking for an internship where I can work next to people who know more than I do, take on whatever the team needs, and learn as fast as I can.",
      fr: "Dernièrement, j'ai développé des projets avec des outils d'IA comme Claude Code : un agent IA de prospection, un site pour mon tutorat en maths, et ce site. Aujourd'hui, je cherche un stage où travailler aux côtés de gens qui en savent plus que moi, prendre en charge ce dont l'équipe a besoin et apprendre le plus vite possible.",
    },
  ],
  facts: [
    { label: { en: "Based in", fr: "Basé à" }, value: { en: "Montreal, Canada", fr: "Montréal, Canada" } },
    { label: { en: "School", fr: "Université" }, value: { en: "McGill University", fr: "Université McGill" } },
    {
      label: { en: "Looking for", fr: "Je cherche" },
      value: { en: "Internships and co-op roles", fr: "Des stages et des stages coop" },
    },
    {
      label: { en: "Next up", fr: "La suite" },
      value: { en: "Whatever I haven't learned yet", fr: "Tout ce que je n'ai pas encore appris" },
    },
  ],
  // The interactive "component datasheet" card next to the About text.
  // (When you add person.photo above, your photo appears inside it.)
  datasheet: {
    title: { en: "Datasheet", fr: "Fiche technique" },
    part: "GS-26",
    rows: [
      { label: { en: "Model", fr: "Modèle" }, value: "Gregory Sutjian" },
      { label: { en: "Type", fr: "Type" }, value: { en: "Curious builder", fr: "Bâtisseur curieux" } },
      { label: { en: "Origin", fr: "Origine" }, value: { en: "Lebanon → Montreal", fr: "Liban → Montréal" } },
      { label: { en: "Status", fr: "Statut" }, value: { en: "Always learning", fr: "Toujours en apprentissage" } },
    ],
    footer: {
      en: "Designed in Lebanon. Assembled in Montreal.",
      fr: "Conçu au Liban. Assemblé à Montréal.",
    },
  },
};

/* ------------------------------------------------------------------ focus */

export const focus = {
  label: { en: "Focus", fr: "Domaines" },
  heading: {
    en: "Three things I keep *coming back* to.",
    fr: "Trois domaines auxquels je *reviens* toujours.",
  },
  // id picks the drawing: "software" = code, "ai" = network, "math" = function plot
  items: [
    {
      id: "software",
      title: { en: "Software", fr: "Logiciel" },
      text: {
        en: "I started with Python and Java, and I'm learning data structures and algorithms at McGill. Every project I build teaches me something new.",
        fr: "J'ai commencé avec Python et Java, et j'apprends les structures de données et les algorithmes à McGill. Chaque projet m'apprend quelque chose de nouveau.",
      },
      keywords: { en: "Python · Java · Algorithms", fr: "Python · Java · Algorithmes" },
    },
    {
      id: "ai",
      title: { en: "AI", fr: "IA" },
      text: {
        en: "I use AI tools like Claude Code every day to build faster, and I'm learning how to make agents that take real work off people's plates.",
        fr: "J'utilise chaque jour des outils d'IA comme Claude Code pour avancer plus vite, et j'apprends à créer des agents qui prennent en charge du vrai travail.",
      },
      keywords: { en: "Claude Code · Agents · Automation", fr: "Claude Code · Agents · Automatisation" },
    },
    {
      id: "math",
      title: { en: "Math", fr: "Maths" },
      text: {
        en: "Years of tutoring algebra, geometry and calculus made math the way I think through problems: break it down, find the pattern, check the answer.",
        fr: "Des années de tutorat en algèbre, en géométrie et en calcul ont fait des maths ma façon d'aborder les problèmes : décomposer, trouver la logique, vérifier la réponse.",
      },
      keywords: { en: "Algebra · Calculus · Problem solving", fr: "Algèbre · Calcul · Résolution de problèmes" },
    },
  ],
};

/* --------------------------------------------------------------- projects */

export type Project = {
  slug: string;
  kicker: Text; // small line above the title, e.g. "AI lead agent"
  title: Text;
  summary: Text;
  highlights: Text[]; // 2–3 short points shown on the card
  status: "in-progress" | "ready" | "live";
  year: string;
  role: Text;
  stack: Text[];
  // The "How it's built" panel. Use null to hide a part.
  problem: Text | null;
  solution: Text | null;
  how: Text | null;
  // Pictures in /public/projects/.
  //  - "image": one screenshot            - "scroll": a tall full-page screenshot that scrolls on hover
  //  - "slides": a few screens that step through how it works, each with a short label and caption
  // src can differ per language: { en: "/projects/a-en.webp", fr: "/projects/a-fr.webp" }
  media:
    | null
    | { type: "image" | "scroll" | "video"; src: Text; alt: Text }
    | {
        type: "slides";
        // fit "contain" shows the whole screen; scroll: true glides down a tall full-page screenshot
        // duration (ms) sets how long a slide stays up; src can differ per language
        slides: {
          src: Text;
          label: Text;
          caption: Text;
          alt: Text;
          fit?: "cover" | "contain";
          scroll?: boolean;
          duration?: number;
        }[];
      };
  links: { label: Text; href: string }[];
  privateRepo?: boolean; // shows "Private repository" instead of a code link
};

const soloBuild = { en: "Solo project, built with Claude Code", fr: "Projet solo, développé avec Claude Code" };
const viewCode = { en: "View code", fr: "Voir le code" };
const viewSite = { en: "View website", fr: "Voir le site" };

export const projects = {
  label: { en: "Projects", fr: "Projets" },
  heading: { en: "Things I've *built*.", fr: "Ce que j'ai *construit*." },
  intro: {
    en: "Three projects I've built with AI tools like Claude Code: an AI lead agent, the website for my math tutoring, and this site.",
    fr: "Trois projets que j'ai développés avec des outils d'IA comme Claude Code : un agent IA de prospection, le site de mon tutorat en maths et ce site.",
  },
  labels: {
    "in-progress": { en: "In development", fr: "En développement" },
    ready: { en: "Deploy-ready", fr: "Prêt à déployer" },
    live: { en: "Live", fr: "En ligne" },
    problem: { en: "Problem", fr: "Problème" },
    solution: { en: "Solution", fr: "Solution" },
    how: { en: "How it works", fr: "Fonctionnement" },
    stack: { en: "Stack", fr: "Technologies" },
    role: { en: "Role", fr: "Rôle" },
    specs: { en: "How it's built", fr: "Sous le capot" },
    privateRepo: { en: "Private repository", fr: "Dépôt privé" },
    cursorScroll: { en: "Hover to scroll", fr: "Survoler pour défiler" },
    cursorImage: { en: "Preview", fr: "Aperçu" },
    cursorSlides: { en: "Real screens", fr: "Vrais écrans" },
    slidesBadge: { en: "Real app screens", fr: "Écrans réels" },
  },
  /* To add a project, copy one of the blocks below and edit it. */
  items: [
    {
      slug: "lead-finder",
      kicker: { en: "AI lead agent", fr: "Agent IA de prospection" },
      title: "Lead Finder",
      summary: {
        en: "Finds Montreal hair and beauty businesses that have no website, ranks them with a transparent score, researches each one and drafts a unique bilingual demo site for a person to review.",
        fr: "Repère les salons de coiffure et d'esthétique montréalais sans site web, les classe avec un score transparent, étudie chacun d'eux et prépare un site démo bilingue unique, à valider par une personne.",
      },
      highlights: [
        {
          en: "2,800+ businesses pulled from Overture Maps with DuckDB and stored in Supabase, ranked by a rule-based 0–100 score (no AI in the ranking)",
          fr: "Plus de 2 800 commerces extraits d'Overture Maps avec DuckDB et stockés dans Supabase, classés par un score de 0 à 100 fondé sur des règles (sans IA)",
        },
        {
          en: "Claude writes the analysis and demo copy as schema-validated structured output",
          fr: "Claude rédige l'analyse et les textes des démos en sortie structurée, validée par un schéma",
        },
        {
          en: "Every demo site gets its own design “genome”: 10 art directions, contrast-tested palettes and 29 typefaces",
          fr: "Chaque site démo a son propre « génome » de design : 10 directions artistiques, des palettes testées pour le contraste et 29 polices",
        },
      ],
      status: "live",
      year: "2026",
      role: soloBuild,
      stack: ["Next.js", "TypeScript", "Supabase", "Claude API", "DuckDB", "Vitest"],
      problem: {
        en: "The best prospects for a web designer are small businesses with no website, but they're hard to find and you know almost nothing about them when you reach out.",
        fr: "Les meilleurs prospects pour un designer web sont les petites entreprises sans site, mais elles sont difficiles à trouver et on sait très peu de choses sur elles au moment de les contacter.",
      },
      solution: {
        en: "A pipeline that finds and scores businesses, reads their public pages for facts, and prepares tailored demo sites and outreach drafts. Nothing is ever sent automatically: a person reviews everything.",
        fr: "Un outil qui trouve et évalue les commerces, lit leurs pages publiques pour en tirer des faits, et prépare des sites démo et des brouillons de prise de contact sur mesure. Rien n'est envoyé automatiquement : une personne valide tout.",
      },
      how: {
        en: "Catalog → lead → homepage research → analysis → demo site → outreach draft. Web research is sandboxed (private addresses blocked, robots.txt honoured, rate-limited) and every external service has a mock, so the whole pipeline runs offline and is covered by about 80 test files.",
        fr: "Catalogue → prospect → recherche sur le site → analyse → site démo → brouillon de message. La recherche web est encadrée (adresses privées bloquées, robots.txt respecté, débit limité) et chaque service externe a une version simulée : tout tourne hors ligne et est couvert par environ 80 fichiers de tests.",
      },
      // Real screens from the app, stepped through in order.
      media: {
        type: "slides",
        slides: [
          {
            src: "/projects/lead-finder-search.webp",
            fit: "contain",
            label: { en: "Search", fr: "Recherche" },
            caption: {
              en: "Search and filter 2,800+ Montreal businesses, best prospects first",
              fr: "Rechercher et filtrer plus de 2 800 commerces montréalais, les meilleurs prospects en premier",
            },
            alt: { en: "Lead Finder's business search with trade and area filters", fr: "La recherche de commerces de Lead Finder avec filtres par métier et par secteur" },
          },
          {
            src: "/projects/lead-finder-generate.webp",
            fit: "contain",
            label: { en: "Generate", fr: "Génération" },
            caption: {
              en: "Each one gets its own generated design: layout, palette and typefaces",
              fr: "Chacun reçoit son propre design généré : mise en page, palette et polices",
            },
            alt: { en: "A grid of generated demo websites", fr: "Une grille de sites démo générés" },
          },
          {
            src: "/projects/lead-finder-demo.webp",
            scroll: true,
            label: { en: "Review", fr: "Validation" },
            caption: {
              en: "A finished demo site, in French and English, ready for a person to review before anything is sent",
              fr: "Un site démo terminé, en français et en anglais, à valider par une personne avant tout envoi",
            },
            alt: { en: "A generated demo website for a Montreal barbershop", fr: "Un site démo généré pour un barbier montréalais" },
          },
        ],
      },
      links: [
        { label: viewSite, href: "https://ai-lead-agent-lac.vercel.app" },
        { label: viewCode, href: "https://github.com/gregorysudjian-ui/ai-lead-agent" },
      ],
    },
    {
      slug: "clarte-math",
      kicker: { en: "Business website + owner dashboard", fr: "Site d'entreprise + tableau de bord" },
      title: "Clarté Math",
      summary: {
        en: "The bilingual website for my one-on-one math tutoring in Montreal, with a private dashboard where I run the business: requests, clients, lessons and payments.",
        fr: "Le site bilingue de mon service de tutorat individuel en maths à Montréal, avec un tableau de bord privé pour gérer l'entreprise : demandes, clients, cours et paiements.",
      },
      highlights: [
        {
          en: "Booking form that validates input, traps bots and notifies me by email",
          fr: "Formulaire de réservation qui valide les saisies, piège les robots et m'avertit par courriel",
        },
        {
          en: "Owner dashboard: one-click request → client, lesson calendar, payments, notes and Excel export",
          fr: "Tableau de bord : demande → client en un clic, calendrier des cours, paiements, notes et export Excel",
        },
        {
          en: "No database needed: an atomic, queued JSON store with backups, and an Excel export that uses no outside library",
          fr: "Aucune base de données : un stockage JSON atomique avec file d'attente et sauvegardes, et un export Excel sans aucune librairie externe",
        },
      ],
      status: "live",
      year: "2026",
      role: soloBuild,
      stack: ["Next.js", "React", "TypeScript", "Node.js", "Nodemailer"],
      problem: {
        en: "As a solo tutor I needed a professional, bilingual way for families to find me, plus one place to track requests, clients, lessons and payments, without paying for a SaaS tool.",
        fr: "En tant que tuteur indépendant, j'avais besoin d'une façon professionnelle et bilingue pour que les familles me trouvent, et d'un seul endroit pour suivre demandes, clients, cours et paiements, sans payer un logiciel en ligne.",
      },
      solution: {
        en: "One Next.js app does both: the public site sends requests straight into a private dashboard where I turn them into clients, schedule lessons and track who has paid.",
        fr: "Une seule application Next.js fait les deux : le site public envoie les demandes directement dans un tableau de bord privé où je les transforme en clients, planifie les cours et suis les paiements.",
      },
      how: {
        en: "Password-protected dashboard with a signed session cookie, timing-safe checks and a rate-limited login. Integration tests boot the real production build to check the auth redirects, a forged cookie, the bot trap and saved requests.",
        fr: "Tableau de bord protégé par mot de passe avec cookie de session signé, vérifications à temps constant et connexion limitée en tentatives. Des tests d'intégration lancent la vraie version de production pour vérifier les redirections, un cookie falsifié, le piège à robots et l'enregistrement des demandes.",
      },
      // The public site scrolls top to bottom, then the owner dashboard (shown with made-up demo data).
      media: {
        type: "slides",
        slides: [
          {
            src: { en: "/projects/clarte-en.webp", fr: "/projects/clarte-fr.webp" },
            scroll: true,
            duration: 13000,
            label: { en: "Website", fr: "Site web" },
            caption: {
              en: "The public site families see, in English and French, with the request form at the bottom",
              fr: "Le site public que voient les familles, en anglais et en français, avec le formulaire de demande en bas",
            },
            alt: { en: "The Clarté Math homepage", fr: "La page d'accueil de Clarté Math" },
          },
          {
            src: "/projects/clarte-dashboard.webp",
            label: { en: "Dashboard", fr: "Tableau de bord" },
            caption: {
              en: "My private dashboard: requests, upcoming lessons and payments at a glance (demo data)",
              fr: "Mon tableau de bord privé : demandes, cours à venir et paiements en un coup d'œil (données de démo)",
            },
            alt: {
              en: "The Clarté HQ overview with requests, upcoming lessons and payments",
              fr: "La vue d'ensemble de Clarté HQ avec demandes, cours à venir et paiements",
            },
          },
        ],
      },
      links: [{ label: viewSite, href: "https://clarte-math.vercel.app" }],
      privateRepo: true,
    },
    {
      slug: "personal-website",
      kicker: { en: "Personal website", fr: "Site personnel" },
      title: { en: "This website", fr: "Ce site" },
      summary: {
        en: "The site you're on: a scroll-driven story where one copper circuit trace runs from the first screen to the contact section. Built with Claude Code, in English and French.",
        fr: "Le site sur lequel vous êtes : une histoire guidée par le défilement, où une piste de cuivre relie le premier écran à la section contact. Développé avec Claude Code, en anglais et en français.",
      },
      highlights: [
        {
          en: "The trace is computed from the live page layout and drawn in step with your scroll",
          fr: "La piste est calculée à partir de la mise en page réelle et se dessine au rythme du défilement",
        },
        {
          en: "A procedurally generated circuit board that lights up when the signal arrives",
          fr: "Un circuit imprimé généré par programme qui s'allume à l'arrivée du signal",
        },
        {
          en: "Animates only transforms and opacity for smooth motion, with a calm reduced-motion version",
          fr: "N'anime que les transformations et l'opacité pour des mouvements fluides, avec une version sans animation",
        },
      ],
      status: "live",
      year: "2026",
      role: soloBuild,
      stack: ["Next.js", "TypeScript", "GSAP", "Tailwind CSS", "Lenis"],
      problem: {
        en: "Most student portfolios look alike. I wanted a site that shows how I think as an engineer before anyone reads a word.",
        fr: "La plupart des portfolios étudiants se ressemblent. Je voulais un site qui montre ma façon de penser en ingénieur avant même qu'on lise un mot.",
      },
      solution: {
        en: "One visual idea, a circuit being powered on, carried through every section, with all the text kept in a single file so it's easy to update.",
        fr: "Une seule idée visuelle, un circuit qu'on met sous tension, portée à travers chaque section, avec tout le texte réuni dans un seul fichier pour le mettre à jour facilement.",
      },
      how: {
        en: "Next.js App Router with static English and French pages, GSAP ScrollTrigger and SplitText for the motion, Lenis for smooth scrolling, and a generated share image for social links.",
        fr: "Next.js (App Router) avec des pages statiques en anglais et en français, GSAP ScrollTrigger et SplitText pour les animations, Lenis pour le défilement fluide, et une image d'aperçu générée pour les réseaux sociaux.",
      },
      media: {
        type: "image",
        src: { en: "/projects/website-en.webp", fr: "/projects/website-fr.webp" },
        alt: { en: "The opening screen of this website", fr: "L'écran d'ouverture de ce site" },
      },
      links: [{ label: viewCode, href: "https://github.com/gregorysudjian-ui/personal-website" }],
    },
  ] satisfies Project[],
};

/* ------------------------------------------------------------- experience */

export const experience = {
  label: { en: "Experience", fr: "Parcours" },
  heading: { en: "What I've done *so far*.", fr: "Ce que j'ai fait *jusqu'ici*." },
  workLabel: { en: "Work", fr: "Expérience" },
  educationLabel: { en: "Education", fr: "Formation" },
  work: [
    {
      org: "AGBU Montreal",
      role: { en: "Math Tutor", fr: "Tuteur en mathématiques" },
      dates: { en: "Jul — Sep 2026", fr: "juil. — sept. 2026" },
      place: { en: "Montreal", fr: "Montréal" },
      text: {
        en: "Tutored algebra, geometry and calculus, adapting each session to the student's level. Built practice sets and review sessions around the problems that kept coming back.",
        fr: "Tutorat en algèbre, géométrie et calcul différentiel, en adaptant chaque séance au niveau de l'élève. Préparation d'exercices et de révisions ciblant les difficultés récurrentes.",
      },
    },
    {
      org: { en: "Independent Tutoring", fr: "Tutorat indépendant" },
      role: { en: "Math Tutor", fr: "Tuteur en mathématiques" },
      dates: { en: "2025 — 2026", fr: "2025 — 2026" },
      place: { en: "Beirut", fr: "Beyrouth" },
      text: {
        en: "One-on-one tutoring in algebra, calculus and geometry for high school students, breaking complex ideas into clear, step-by-step reasoning.",
        fr: "Tutorat individuel en algèbre, calcul et géométrie pour des élèves du secondaire, en décomposant les notions complexes en raisonnements clairs, étape par étape.",
      },
    },
    {
      org: { en: "Saint Joseph University", fr: "Université Saint-Joseph" },
      role: { en: "Entrepreneurship Competition", fr: "Concours d'entrepreneuriat" },
      dates: { en: "Feb — May 2024", fr: "févr. — mai 2024" },
      place: { en: "Beirut", fr: "Beyrouth" },
      text: {
        en: "Built a business plan with a team and pitched it to a panel of judges, sharing the market research, financial estimates and final presentation under a fixed deadline.",
        fr: "Élaboration d'un plan d'affaires en équipe, présenté devant un jury : étude de marché, estimations financières et présentation finale, dans un délai serré.",
      },
    },
    {
      org: "NinjaCO",
      role: { en: "Robotics Tutor", fr: "Tuteur en robotique" },
      dates: { en: "Jul — Aug 2023", fr: "juil. — août 2023" },
      place: { en: "Beirut", fr: "Beyrouth" },
      text: {
        en: "Taught kids the basics of coding and building with LEGO WeDo and SPIKE kits, and helped them test and fix their projects.",
        fr: "Initiation des enfants au code et à la construction avec des kits LEGO WeDo et SPIKE, en les aidant à tester et à corriger leurs projets.",
      },
    },
  ] satisfies { org: Text; role: Text; dates: Text; place: Text; text: Text }[],
  education: [
    {
      org: { en: "McGill University", fr: "Université McGill" },
      role: { en: "B.Eng. Computer Engineering", fr: "B.Ing. en génie informatique" },
      dates: { en: "2026 — 2031", fr: "2026 — 2031" },
      place: { en: "Montreal", fr: "Montréal" },
      text: {
        en: "Programming, data structures, mathematics and circuits.",
        fr: "Programmation, structures de données, mathématiques et circuits.",
      },
    },
    {
      org: "Collège Mariste Champville",
      role: { en: "Lebanese Baccalaureate", fr: "Baccalauréat libanais" },
      dates: { en: "Class of 2025", fr: "Promotion 2025" },
      place: { en: "Lebanon", fr: "Liban" },
      text: {
        en: "Graduated with an 18/20 average, on the honor roll.",
        fr: "Diplômé avec une moyenne de 18/20, au tableau d'honneur.",
      },
    },
  ] satisfies { org: Text; role: Text; dates: Text; place: Text; text: Text }[],
};

/* ----------------------------------------------------------------- skills */

export const skills = {
  label: { en: "Skills", fr: "Compétences" },
  heading: { en: "The *toolkit*.", fr: "La *boîte à outils*." },
  intro: {
    en: "What I've used so far. It keeps growing, and I'm always happy to pick up whatever a team works with.",
    fr: "Ce que j'ai utilisé jusqu'ici. La liste grandit sans cesse, et j'apprends volontiers les outils de l'équipe.",
  },
  // The big scrolling band of words above the skills.
  marquee: [
    "Python",
    "Java",
    "Claude Code",
    { en: "AI agents", fr: "Agents IA" },
    { en: "Math", fr: "Maths" },
    { en: "Automation", fr: "Automatisation" },
    { en: "Algorithms", fr: "Algorithmes" },
    { en: "Problem solving", fr: "Résolution de problèmes" },
  ] satisfies Text[],
  groups: [
    { title: { en: "Languages", fr: "Langages" }, items: ["Python", "Java"] },
    {
      title: { en: "Foundations", fr: "Fondamentaux" },
      items: [
        { en: "Data structures", fr: "Structures de données" },
        { en: "Algorithms", fr: "Algorithmes" },
        { en: "Mathematics", fr: "Mathématiques" },
      ],
    },
    {
      title: { en: "AI", fr: "IA" },
      items: ["Claude Code", "ChatGPT", "Codex", "Gemini"],
    },
  ] satisfies { title: Text; items: Text[] }[],
};

/* ---------------------------------------------------------------- contact */

export const contact = {
  label: { en: "Contact", fr: "Contact" },
  heading: { en: "Let's build *something*.", fr: "Construisons *quelque chose*." },
  text: {
    en: "I'm looking for an internship or co-op where I can learn fast, help wherever I'm needed and build things that matter. If that sounds like your team, I'd love to hear from you.",
    fr: "Je cherche un stage où apprendre vite, aider là où on a besoin de moi et construire des choses qui comptent. Si ça ressemble à votre équipe, j'aimerais beaucoup vous parler.",
  },
  emailLabel: { en: "Email", fr: "Courriel" },
  copy: { en: "Copy", fr: "Copier" },
  copied: { en: "Copied", fr: "Copié" },
  cvLabel: { en: "Download CV", fr: "Télécharger le CV" },
};

/* ----------------------------------------------------------------- footer */

export const footer = {
  builtIn: { en: "Made in Montreal", fr: "Fait à Montréal" },
  localTime: { en: "Local time", fr: "Heure locale" },
  backToTop: { en: "Back to top", fr: "Haut de page" },
};
