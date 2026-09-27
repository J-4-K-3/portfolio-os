export const browserPages = [
  {
    url: "innoxation://home",
    title: "Innoxation",
    heading:
      "Push the limitations of what exists.",
    description:
      "Innoxation is a technology company building software, artificial intelligence, connected experiences, and products designed to go beyond what already exists.",
    category: "Innoxation",
    icon: "◇",
    featured: true,

    action: {
      label: "Explore projects",
      url: "innoxation://projects",
    },

    sections: [
      {
        label: "Mission",
        title:
          "Beyond the existing.",
        description:
          "Innoxation exists to push the limitations of what exists or create something beyond what exists.",
      },
      {
        label: "Ecosystem",
        title:
          "Technology that connects.",
        description:
          "Products across the Innoxation ecosystem are designed to work together through shared technology, identity, and infrastructure.",
      },
    ],
  },

  {
    url: "innoxation://projects",
    title: "Projects — Innoxation",
    heading:
      "A universe of products.",
    description:
      "Explore the software and technology being developed across the Innoxation ecosystem.",
    category: "Projects",
    icon: "🚀",
    featured: true,

    sections: [
      {
        label: "Social",
        title: "Natter",
        description:
          "A privacy-focused social experience built around meaningful communication rather than endless engagement loops.",
      },
      {
        label: "Experience",
        title: "Auri",
        description:
          "A calm social and entertainment environment designed without the traditional pressure of endless feeds.",
      },
      {
        label: "Artificial Intelligence",
        title: "Telvin",
        description:
          "The official Innoxation AI experience.",
      },
      {
        label: "Risk Intelligence",
        title: "G.R.O.A.",
        description:
          "Global Risk Observation & Analysis, bringing together information, observation, reporting, and human moderation.",
      },
    ],
  },

  {
    url: "innoxation://techid",
    title: "TechID — Innoxation",
    heading:
      "One identity. Multiple experiences.",
    description:
      "TechID is Innoxation's personalized identity system, allowing users to connect with multiple Innoxation experiences while keeping each product independent.",
    category: "Technology",
    icon: "🔐",
    featured: true,

    sections: [
      {
        label: "Identity",
        title:
          "Your TechID belongs to you.",
        description:
          "A single credential can connect users across participating Innoxation services without forcing every product to become the same application.",
      },
      {
        label: "Infrastructure",
        title:
          "Built for the ecosystem.",
        description:
          "TechID is designed as a foundation for deeper integration between Innoxation products.",
      },
    ],
  },

  {
    url: "innoxation://iic",
    title: "IIC — Innoxation",
    heading:
      "The ecosystem can communicate.",
    description:
      "The Innoxation Internet Connector enables participating Innoxation applications to communicate and appear online with each other while external applications and services can remain offline.",
    category: "Technology",
    icon: "🌐",

    sections: [
      {
        label: "IIC",
        title:
          "Innoxation Internet Connector",
        description:
          "A communication layer designed around the Innoxation ecosystem.",
      },
    ],
  },

  {
    url: "innoxation://natter",
    title: "Natter — Innoxation",
    heading:
      "Social, without giving up privacy.",
    description:
      "Natter is an Innoxation social platform focused on privacy, communication, and a more intentional social experience.",
    category: "Product",
    icon: "💬",

    action: {
      label: "View projects",
      url: "innoxation://projects",
    },

    sections: [
      {
        label: "AI",
        title: "Natalie",
        description:
          "Natter's conversational AI experience is designed to communicate naturally with users rather than simply behaving like a traditional assistant interface.",
      },
    ],
  },

  {
    url: "innoxation://auri",
    title: "Auri — Innoxation",
    heading:
      "A calmer place on the internet.",
    description:
      "Auri is designed around calm interaction, entertainment, community, and discovery without relying on endless scrolling or engagement-driven feeds.",
    category: "Product",
    icon: "✨",

    sections: [
      {
        label: "Experience",
        title:
          "No endless scroll.",
        description:
          "Auri focuses on intentional interaction and a cleaner experience.",
      },
      {
        label: "Games",
        title:
          "Play inside Auri.",
        description:
          "Auri includes interactive games and experiences designed as part of the platform.",
      },
    ],
  },

  {
    url: "innoxation://telvin",
    title: "Telvin — Innoxation",
    heading:
      "Intelligence, built into the ecosystem.",
    description:
      "Telvin is the official Innoxation AI experience, designed to interact with users and participate across the broader technology ecosystem.",
    category: "Artificial Intelligence",
    icon: "🤖",

    sections: [
      {
        label: "AI",
        title:
          "More than a text box.",
        description:
          "Telvin is designed as an interactive intelligence rather than simply a static chat interface.",
      },
    ],
  },

  {
    url: "innoxation://appgrade",
    title: "Appgrade — Innoxation",
    heading:
      "Build software with intelligence.",
    description:
      "Appgrade is an Innoxation product focused on helping users create and develop software through AI-assisted building.",
    category: "Product",
    icon: "🛠️",

    sections: [
      {
        label: "Creation",
        title:
          "From idea to application.",
        description:
          "Appgrade brings intelligent tooling into the software creation process.",
      },
    ],
  },

  {
    url: "innoxation://groa",
    title: "G.R.O.A. — Innoxation",
    heading:
      "Observe. Understand. Respond.",
    description:
      "Global Risk Observation & Analysis is designed to bring together risk information, reports, observation, and human moderation.",
    category: "Risk Intelligence",
    icon: "🌍",

    sections: [
      {
        label: "Observation",
        title:
          "A wider view.",
        description:
          "G.R.O.A. combines multiple information sources into a unified observation environment.",
      },
    ],
  },
];

export function getPage(url) {
  if (!url) {
    return null;
  }

  const cleanUrl =
    url.split("?")[0];

  return (
    browserPages.find(
      (page) =>
        page.url === cleanUrl
    ) || null
  );
}

export function browserSearch(query) {
  const normalized =
    query
      .trim()
      .toLowerCase();

  if (!normalized) {
    return [];
  }

  return browserPages
    .filter((page) => {
      const searchable = [
        page.title,
        page.heading,
        page.description,
        page.category,
        ...(page.sections || []).map(
          (section) =>
            `${section.title} ${section.description}`
        ),
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(
        normalized
      );
    })
    .slice(0, 8);
}