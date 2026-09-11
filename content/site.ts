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
  // Montreal coordinates, shown in the hero as a technical detail.
  coordinates: "45.5019° N — 73.5674° W",
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
  boot: [
    { en: "Initializing", fr: "Initialisation" },
    { en: "Loading modules", fr: "Chargement des modules" },
    { en: "Routing signal", fr: "Routage du signal" },
    { en: "System ready", fr: "Système prêt" },
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
  status: {
    en: "Now — building 2 AI agents",
    fr: "En ce moment — 2 agents IA en développement",
  },
  scrollHint: { en: "Scroll to power on", fr: "Défilez pour démarrer" },
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
  title: Text;
  summary: Text;
  status: "in-progress" | "live";
  year: string;
  role: Text;
  stack: Text[];
  // Leave these as null until you're ready. The card shows "Details coming soon".
  problem: Text | null;
  solution: Text | null;
  how: Text | null;
  // A built-in animated preview ("chat" or "leads"). Set to null when you use media instead.
  preview: "chat" | "leads" | null;
  // Screenshot or short video, stored in /public/projects/ (shown when preview is null).
  media: null | { type: "image" | "video"; src: string; alt: Text };
  links: { label: Text; href: string }[];
};

export const projects = {
  label: { en: "Projects", fr: "Projets" },
  heading: { en: "Currently *building*.", fr: "En *développement*." },
  intro: {
    en: "Two AI agents are on the workbench right now. Full breakdowns land here as they ship.",
    fr: "Deux agents IA sont sur l'établi en ce moment. Les détails arriveront ici au fil des lancements.",
  },
  labels: {
    "in-progress": { en: "In development", fr: "En développement" },
    live: { en: "Live", fr: "En ligne" },
    problem: { en: "Problem", fr: "Problème" },
    solution: { en: "Solution", fr: "Solution" },
    how: { en: "How it works", fr: "Fonctionnement" },
    stack: { en: "Stack", fr: "Technologies" },
    role: { en: "Role", fr: "Rôle" },
    year: { en: "Year", fr: "Année" },
    comingSoon: { en: "Details coming soon", fr: "Détails à venir" },
    specs: { en: "How it's built", fr: "Sous le capot" },
    codeSoon: { en: "Code coming soon", fr: "Code bientôt disponible" },
    preview: { en: "Live preview", fr: "Aperçu" },
    demo: { en: "Demo preview", fr: "Aperçu démo" },
  },
  // Text inside the animated previews.
  previews: {
    chat: {
      header: { en: "Assistant · online", fr: "Assistant · en ligne" },
      badge: { en: "Auto-reply", fr: "Réponse auto" },
      messages: [
        { from: "customer", text: { en: "Hi! Are you open tomorrow?", fr: "Bonjour ! Vous êtes ouverts demain ?" } },
        {
          from: "agent",
          text: {
            en: "Hi Sara! Yes, from 9 am to 7 pm. Want me to book you a time?",
            fr: "Bonjour Sara ! Oui, de 9 h à 19 h. Voulez-vous que je vous réserve un créneau ?",
          },
        },
        { from: "customer", text: { en: "Yes please, around 3?", fr: "Oui, vers 15 h ?" } },
        {
          from: "agent",
          text: {
            en: "Done: tomorrow at 3:00 pm. I'll send you a reminder in the morning.",
            fr: "C'est fait : demain à 15 h. Je vous enverrai un rappel le matin.",
          },
        },
      ] as { from: "customer" | "agent"; text: Text }[],
    },
    leads: {
      scanning: { en: "Scanning Montreal", fr: "Analyse de Montréal" },
      leads: { en: "Leads", fr: "Prospects" },
      building: { en: "Generating site", fr: "Génération du site" },
      statuses: [
        { en: "Found", fr: "Trouvé" },
        { en: "Saved", fr: "Enregistré" },
        { en: "Site ready", fr: "Site prêt" },
      ],
      businesses: [
        { en: "Bakery — Rue Bernard", fr: "Boulangerie — rue Bernard" },
        { en: "Bike shop — Av. du Parc", fr: "Atelier vélo — av. du Parc" },
        { en: "Florist — Rue Rachel", fr: "Fleuriste — rue Rachel" },
        { en: "Barber — St-Denis", fr: "Barbier — St-Denis" },
      ],
    },
  },
  /* DEMO PROJECTS — these are placeholders to show off the layout.
     Send me your real projects and they'll replace these. */
  items: [
    {
      slug: "whatsapp-agent",
      title: { en: "WhatsApp Automation Agent", fr: "Agent d'automatisation WhatsApp" },
      summary: {
        en: "An AI agent that handles WhatsApp conversations on its own: replying, following up and taking care of routine requests.",
        fr: "Un agent IA qui gère seul des conversations WhatsApp : il répond, relance et s'occupe des demandes courantes.",
      },
      status: "in-progress",
      year: "2026",
      role: { en: "Solo build", fr: "Projet solo" },
      stack: ["Claude Code", "WhatsApp", { en: "AI agents", fr: "Agents IA" }],
      problem: {
        en: "Small businesses get most of their customer messages on WhatsApp, and every unanswered one is a customer who might not come back.",
        fr: "Les petites entreprises reçoivent la plupart des messages de leurs clients sur WhatsApp, et chaque message sans réponse est un client qui risque de ne pas revenir.",
      },
      solution: {
        en: "An agent that replies in seconds, day or night: it answers common questions, books appointments, follows up, and hands the conversation to a human when it should.",
        fr: "Un agent qui répond en quelques secondes, jour et nuit : il répond aux questions courantes, prend des rendez-vous, fait les relances et passe la main à un humain quand il le faut.",
      },
      how: {
        en: "Each incoming message is read with the business's context. The agent decides whether to reply, act or escalate, and every conversation is logged.",
        fr: "Chaque message entrant est lu avec le contexte de l'entreprise. L'agent décide s'il faut répondre, agir ou transférer, et chaque conversation est enregistrée.",
      },
      preview: "chat",
      media: null,
      links: [],
    },
    {
      slug: "lead-agent",
      title: { en: "Local Business Lead Agent", fr: "Agent de prospection locale" },
      summary: {
        en: "An AI agent that finds local businesses, stores and tracks their data, then builds each one a personalized website.",
        fr: "Un agent IA qui repère des commerces locaux, enregistre et suit leurs données, puis crée pour chacun un site web personnalisé.",
      },
      status: "in-progress",
      year: "2026",
      role: { en: "Solo build", fr: "Projet solo" },
      stack: ["Claude Code", { en: "Web generation", fr: "Génération web" }, { en: "Data", fr: "Données" }],
      problem: {
        en: "Plenty of great local businesses still have no website, or one nobody has touched in years, and finding them by hand takes forever.",
        fr: "Beaucoup de bons commerces locaux n'ont toujours pas de site web, ou un site laissé à l'abandon depuis des années, et les trouver à la main prend un temps fou.",
      },
      solution: {
        en: "An agent that scouts an area, collects each business's details, tracks them as leads and generates a personalized website draft for each one.",
        fr: "Un agent qui explore un secteur, collecte les informations de chaque commerce, les suit comme prospects et génère une première version de site personnalisée pour chacun.",
      },
      how: {
        en: "Search → enrich → store → build. Each step is a tool the agent can call, so the whole pipeline runs from a single request.",
        fr: "Recherche → enrichissement → stockage → création. Chaque étape est un outil que l'agent peut appeler : tout le processus part d'une seule requête.",
      },
      preview: "leads",
      media: null,
      links: [],
    },
    /* To add a project, copy one of the blocks above and paste it here.
       Example of a finished one:
    {
      slug: "my-robot",
      title: { en: "Line-Following Robot", fr: "Robot suiveur de ligne" },
      summary: { en: "...", fr: "..." },
      status: "live",
      year: "2027",
      role: { en: "Team of 3 — software lead", fr: "Équipe de 3 — responsable logiciel" },
      stack: ["Python", "Arduino"],
      problem: { en: "...", fr: "..." },
      solution: { en: "...", fr: "..." },
      how: { en: "...", fr: "..." },
      preview: null,
      media: { type: "image", src: "/projects/my-robot.jpg", alt: { en: "The robot on its track", fr: "Le robot sur sa piste" } },
      links: [{ label: { en: "View code", fr: "Voir le code" }, href: "https://github.com/..." }],
    },
    */
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
