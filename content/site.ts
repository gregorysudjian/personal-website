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
  // Add a photo later: put it in /public/images/ and set, for example:
  // photo: { src: "/images/gregory.jpg", alt: { en: "Portrait of Gregory", fr: "Portrait de Gregory" } },
  photo: null as null | { src: string; alt: Text },
};

/* ------------------------------------------------------ search & sharing */

export const meta = {
  title: {
    en: "Gregory Sutjian — Computer Engineering at McGill",
    fr: "Gregory Sutjian — Génie informatique à McGill",
  },
  description: {
    en: "Gregory Sutjian is a Computer Engineering student at McGill University in Montreal, building AI agents, robots and software.",
    fr: "Gregory Sutjian est étudiant en génie informatique à l'Université McGill, à Montréal. Il conçoit des agents IA, des robots et des logiciels.",
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
    en: "Engineering student in Montreal. I build AI agents, robots and the software that connects them.",
    fr: "Étudiant en ingénierie à Montréal. Je conçois des agents IA, des robots et les logiciels qui les relient.",
  },
  status: { en: "Open to internships", fr: "Ouvert aux stages" },
  ctaProjects: { en: "View projects", fr: "Voir les projets" },
  ctaCv: { en: "Download CV", fr: "Télécharger le CV" },
  scrollHint: { en: "Scroll", fr: "Défiler" },
};

/* -------------------------------------------------------------- statement */

export const statement: Text = {
  en: "I like building things that *think* for themselves: robots that sense the world around them, and AI agents that keep working long after I've closed my laptop.",
  fr: "J'aime construire des choses qui *pensent* par elles-mêmes : des robots qui perçoivent le monde autour d'eux, et des agents IA qui continuent de travailler bien après que j'ai fermé mon ordinateur.",
};

/* ------------------------------------------------------------------ about */

export const about = {
  label: { en: "About", fr: "À propos" },
  heading: { en: "Hi, I'm *Gregory*.", fr: "Bonjour, moi c'est *Gregory*." },
  paragraphs: [
    {
      en: "I grew up in Lebanon and moved to Montreal to study Computer Engineering at McGill. I'm most interested in the space where hardware, software and AI meet, where code stops being text on a screen and starts doing something in the real world.",
      fr: "J'ai grandi au Liban et je suis venu à Montréal pour étudier le génie informatique à McGill. Ce qui m'intéresse le plus, c'est le point de rencontre entre le matériel, le logiciel et l'IA : là où le code cesse d'être du texte à l'écran et commence à agir dans le monde réel.",
    },
    {
      en: "Before university, I spent a lot of my time teaching: robotics to kids at NinjaCO, then math to students in Beirut and Montreal. Explaining a hard idea simply is still the best way I know to understand it myself.",
      fr: "Avant l'université, j'ai passé beaucoup de temps à enseigner : la robotique à des enfants chez NinjaCO, puis les maths à des élèves à Beyrouth et à Montréal. Expliquer simplement une idée difficile reste la meilleure façon que je connaisse de la comprendre moi-même.",
    },
    {
      en: "Right now I'm building two AI agents: one that runs WhatsApp conversations on its own, and one that finds local businesses, keeps track of them and builds each one a website of its own.",
      fr: "En ce moment, je développe deux agents IA : l'un gère seul des conversations sur WhatsApp, l'autre repère des commerces locaux, garde une trace de leurs données et crée pour chacun un site web sur mesure.",
    },
  ],
  facts: [
    { label: { en: "Based in", fr: "Basé à" }, value: { en: "Montreal, Canada", fr: "Montréal, Canada" } },
    {
      label: { en: "Studying", fr: "Études" },
      value: { en: "B.Eng. Computer Engineering, McGill", fr: "B.Ing. génie informatique, McGill" },
    },
    {
      label: { en: "Focus", fr: "Domaines" },
      value: { en: "Robotics · Software · AI", fr: "Robotique · Logiciel · IA" },
    },
    {
      label: { en: "Currently", fr: "En ce moment" },
      value: { en: "Building 2 AI agents", fr: "2 agents IA en développement" },
    },
  ],
  // The interactive "component datasheet" card next to the About text.
  // (When you add person.photo above, your photo appears inside it.)
  datasheet: {
    title: { en: "Datasheet", fr: "Fiche technique" },
    part: "GS-26",
    rows: [
      { label: { en: "Model", fr: "Modèle" }, value: "Gregory Sutjian" },
      {
        label: { en: "Type", fr: "Type" },
        value: { en: "Computer engineer, in progress", fr: "Ingénieur informatique, en cours" },
      },
      { label: { en: "Origin", fr: "Origine" }, value: { en: "Lebanon → Montreal", fr: "Liban → Montréal" } },
      { label: { en: "Status", fr: "Statut" }, value: { en: "Building", fr: "En construction" } },
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
  items: [
    {
      id: "robotics",
      title: { en: "Robotics", fr: "Robotique" },
      text: {
        en: "Machines that sense, decide and move. I first learned robotics by teaching it: sensors, motors and the code that makes them work together.",
        fr: "Des machines qui perçoivent, décident et bougent. J'ai appris la robotique en l'enseignant : capteurs, moteurs, et le code qui les fait fonctionner ensemble.",
      },
      keywords: { en: "Sensors · Motors · Control", fr: "Capteurs · Moteurs · Contrôle" },
    },
    {
      id: "software",
      title: { en: "Software", fr: "Logiciel" },
      text: {
        en: "Clear, structured code that holds up. Python, Java, data structures and algorithms: the foundations everything else runs on.",
        fr: "Du code clair et structuré, qui tient la route. Python, Java, structures de données et algorithmes : les fondations sur lesquelles tout le reste repose.",
      },
      keywords: { en: "Python · Java · Algorithms", fr: "Python · Java · Algorithmes" },
    },
    {
      id: "ai",
      title: { en: "AI", fr: "IA" },
      text: {
        en: "Agents that don't just answer, they act. I'm building autonomous AI agents with Claude Code that take real work off people's plates.",
        fr: "Des agents qui ne se contentent pas de répondre : ils agissent. Je développe avec Claude Code des agents IA autonomes qui prennent en charge du vrai travail.",
      },
      keywords: { en: "Agents · Automation · Claude", fr: "Agents · Automatisation · Claude" },
    },
  ],
};

/* --------------------------------------------------------------- projects */

export type Project = {
  slug: string;
  kicker: Text; // small line above the title, e.g. "AI agent · Claude + WhatsApp"
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
  // A built-in animated preview ("chat" or "leads"). Set to null when you use media instead.
  preview: "chat" | "leads" | null;
  // A picture in /public/projects/. "scroll" = a tall full-page screenshot that scrolls on hover.
  // src can differ per language: { en: "/projects/a-en.webp", fr: "/projects/a-fr.webp" }
  media: null | { type: "image" | "scroll" | "video"; src: Text; alt: Text };
  links: { label: Text; href: string }[];
  privateRepo?: boolean; // shows "Private repository" instead of a code link
};

const soloBuild = { en: "Designed & built solo", fr: "Conçu et développé seul" };
const viewCode = { en: "View code", fr: "Voir le code" };

export const projects = {
  label: { en: "Projects", fr: "Projets" },
  heading: { en: "Things I've *built*.", fr: "Ce que j'ai *construit*." },
  intro: {
    en: "Four projects I designed and built on my own: two AI agents, the website for my tutoring business, and this site.",
    fr: "Quatre projets que j'ai conçus et développés seul : deux agents IA, le site de mon entreprise de tutorat et ce site.",
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
    demo: { en: "Illustrative demo", fr: "Démo illustrative" },
    cursorDemo: { en: "Live demo", fr: "Démo animée" },
    cursorScroll: { en: "Hover to scroll", fr: "Survoler pour défiler" },
    cursorImage: { en: "Preview", fr: "Aperçu" },
  },
  // Text inside the animated previews.
  previews: {
    chat: {
      header: { en: "Ninja Co · Assistant", fr: "Ninja Co · Assistant" },
      badge: { en: "AI agent", fr: "Agent IA" },
      messages: [
        {
          from: "customer",
          text: {
            en: "Hi! Do you have robotics classes for a 10 year old?",
            fr: "Bonjour ! Vous avez des cours de robotique pour un enfant de 10 ans ?",
          },
        },
        {
          from: "agent",
          text: {
            en: "Yes! Our robotics class is 60 minutes, Monday to Friday between 8 am and 3 pm. Would you like to book a trial?",
            fr: "Oui ! Notre cours de robotique dure 60 minutes, du lundi au vendredi entre 8 h et 15 h. Voulez-vous réserver un cours d'essai ?",
          },
        },
        { from: "customer", text: { en: "Tuesday at 10 please", fr: "Mardi à 10 h, s'il vous plaît" } },
        {
          from: "agent",
          text: {
            en: "Booked: Tuesday at 10:00 for the robotics class. See you then!",
            fr: "C'est réservé : mardi à 10 h pour le cours de robotique. À bientôt !",
          },
        },
      ] as { from: "customer" | "agent"; text: Text }[],
    },
    leads: {
      scanning: { en: "Catalog · Montreal", fr: "Catalogue · Montréal" },
      leads: { en: "Leads · score", fr: "Prospects · score" },
      building: { en: "Generating demo site", fr: "Génération du site démo" },
      statuses: [
        { en: "Scored", fr: "Évalué" },
        { en: "Researched", fr: "Analysé" },
        { en: "Demo ready", fr: "Démo prête" },
      ],
      businesses: [
        { en: "Hair salon — Rue Bernard", fr: "Salon de coiffure — rue Bernard" },
        { en: "Barber — St-Denis", fr: "Barbier — St-Denis" },
        { en: "Nail studio — Av. du Parc", fr: "Studio d'ongles — av. du Parc" },
        { en: "Esthetics — Rue Rachel", fr: "Esthétique — rue Rachel" },
      ],
      scores: [92, 88, 74, 67],
    },
  },
  /* To add a project, copy one of the blocks below and edit it. */
  items: [
    {
      slug: "whatsapp-ai-agent",
      kicker: { en: "AI agent · Claude + WhatsApp", fr: "Agent IA · Claude + WhatsApp" },
      title: { en: "WhatsApp AI Agent", fr: "Agent IA WhatsApp" },
      summary: {
        en: "A WhatsApp assistant for small businesses: it answers customers, books appointments and hands the chat to a person when it should. One server runs it for many businesses, each with its own bilingual dashboard.",
        fr: "Un assistant WhatsApp pour les petites entreprises : il répond aux clients, prend des rendez-vous et passe la conversation à un humain quand il le faut. Un seul serveur le fait tourner pour plusieurs entreprises, chacune avec son propre tableau de bord bilingue.",
      },
      highlights: [
        {
          en: "Claude with strict tool calling to check availability, book, reschedule and escalate",
          fr: "Claude avec des appels d'outils stricts pour vérifier les disponibilités, réserver, déplacer et transférer",
        },
        {
          en: "Multi-business by design: every record scoped to its business, credentials encrypted with AES-256-GCM",
          fr: "Multi-entreprise dès la conception : chaque donnée liée à son entreprise, identifiants chiffrés en AES-256-GCM",
        },
        {
          en: "Live inbox with human takeover, booking calendar, monthly PDF reports and Quebec Law 25 privacy tools",
          fr: "Boîte de réception en direct avec reprise par un humain, calendrier des réservations, rapports PDF mensuels et outils de conformité à la Loi 25",
        },
      ],
      status: "ready",
      year: "2026",
      role: soloBuild,
      stack: ["TypeScript", "Node.js", "Express", "Claude API", "Meta Cloud API", "React", "SQLite"],
      problem: {
        en: "Small businesses get questions, bookings and reschedules on WhatsApp at all hours. Answering by hand is slow, and a naive chatbot makes up facts or double-books.",
        fr: "Les petites entreprises reçoivent questions, réservations et changements sur WhatsApp à toute heure. Répondre à la main est lent, et un chatbot naïf invente des informations ou réserve deux fois le même créneau.",
      },
      solution: {
        en: "Claude answers only from the owner's saved settings and from tool results, and books through tools that refuse overlapping slots. The owner follows every conversation from a live inbox and can take over at any moment.",
        fr: "Claude répond uniquement à partir des paramètres enregistrés par le propriétaire et des résultats de ses outils, et réserve via des outils qui refusent les chevauchements. Le propriétaire suit chaque conversation en direct et peut reprendre la main à tout moment.",
      },
      how: {
        en: "Meta webhook → signature check → one queue per conversation → Claude picks tools in a capped loop → reply. The business and customer IDs come from the verified webhook, never from the model, so it can't be talked into touching another client's data.",
        fr: "Webhook Meta → vérification de signature → une file par conversation → Claude choisit ses outils dans une boucle limitée → réponse. Les identifiants de l'entreprise et du client viennent du webhook vérifié, jamais du modèle : impossible de le convaincre d'accéder aux données d'un autre client.",
      },
      preview: "chat",
      media: null,
      links: [{ label: viewCode, href: "https://github.com/gregorysudjian-ui/whatsapp-ai-agent" }],
    },
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
          en: "2,843 businesses loaded from Overture Maps with DuckDB, ranked by a rule-based 0–100 score (no AI in the ranking)",
          fr: "2 843 commerces chargés depuis Overture Maps avec DuckDB, classés par un score de 0 à 100 fondé sur des règles (sans IA)",
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
      status: "in-progress",
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
      preview: "leads",
      media: null,
      links: [{ label: viewCode, href: "https://github.com/gregorysudjian-ui/ai-lead-agent" }],
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
          en: "No database needed: an atomic, queued JSON store with backups, and an .xlsx exporter written from scratch",
          fr: "Aucune base de données : un stockage JSON atomique avec file d'attente et sauvegardes, et un export .xlsx écrit de zéro",
        },
      ],
      status: "ready",
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
      preview: null,
      media: {
        type: "scroll",
        src: { en: "/projects/clarte-en.webp", fr: "/projects/clarte-fr.webp" },
        alt: { en: "The Clarté Math homepage", fr: "La page d'accueil de Clarté Math" },
      },
      links: [],
      privateRepo: true,
    },
    {
      slug: "personal-website",
      kicker: { en: "Personal website", fr: "Site personnel" },
      title: { en: "This website", fr: "Ce site" },
      summary: {
        en: "The site you're on: a scroll-driven story where one copper circuit trace runs from the first screen to the contact section. Designed and built from scratch, in English and French.",
        fr: "Le site sur lequel vous êtes : une histoire guidée par le défilement, où une piste de cuivre relie le premier écran à la section contact. Conçu et développé de zéro, en anglais et en français.",
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
      status: "ready",
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
      preview: null,
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
        en: "Taught hands-on robotics: basic programming, sensors and mechanical parts. Guided students through building, testing and debugging their own robots.",
        fr: "Enseignement pratique de la robotique : programmation de base, capteurs et pièces mécaniques. Accompagnement des élèves dans la construction, les tests et le débogage de leurs robots.",
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
  // The big scrolling band of words above the skills.
  marquee: [
    "Python",
    "Java",
    "Claude Code",
    { en: "AI agents", fr: "Agents IA" },
    { en: "Robotics", fr: "Robotique" },
    { en: "Automation", fr: "Automatisation" },
    { en: "Algorithms", fr: "Algorithmes" },
    { en: "Circuits", fr: "Circuits" },
  ] satisfies Text[],
  groups: [
    { title: { en: "Languages", fr: "Langages" }, items: ["Python", "Java"] },
    {
      title: { en: "Foundations", fr: "Fondamentaux" },
      items: [
        { en: "Data structures", fr: "Structures de données" },
        { en: "Algorithms", fr: "Algorithmes" },
        { en: "Robotics programming", fr: "Programmation robotique" },
      ],
    },
    {
      title: { en: "AI", fr: "IA" },
      items: ["Claude Code", { en: "AI agents", fr: "Agents IA" }],
    },
  ] satisfies { title: Text; items: Text[] }[],
};

/* ---------------------------------------------------------------- contact */

export const contact = {
  label: { en: "Contact", fr: "Contact" },
  heading: { en: "Let's build *something*.", fr: "Construisons *quelque chose*." },
  text: {
    en: "Open to internships, collaborations and good conversations about robotics, software and AI.",
    fr: "Ouvert aux stages, aux collaborations et aux bonnes discussions sur la robotique, le logiciel et l'IA.",
  },
  emailLabel: { en: "Email", fr: "Courriel" },
  copy: { en: "Copy", fr: "Copier" },
  copied: { en: "Copied", fr: "Copié" },
  cvLabel: { en: "Download CV", fr: "Télécharger le CV" },
};

/* ----------------------------------------------------------------- footer */

export const footer = {
  builtIn: { en: "Designed & built in Montreal", fr: "Conçu et développé à Montréal" },
  localTime: { en: "Local time", fr: "Heure locale" },
  backToTop: { en: "Back to top", fr: "Haut de page" },
};
