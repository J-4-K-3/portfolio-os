const projectDetails = {
  auri: "Auri is Jacob's full-stack social platform and mobile ecosystem. It includes React Native and Expo apps, backend services, authentication, notifications, and custom offline-aware media caching.",
  natter: "Natter is one of Jacob's product projects. I can open its project overview so you can explore the work.",
  groa: "G.R.O.A. is a global risk observation and analysis platform bringing together crisis, earthquake, weather, and other risk information from external providers.",
  normal: "N.O.R.M.A.L. is Jacob's AI platform project, built around modular services, generation workflows, persistence, rate limiting, and safety controls.",
  appgrade: "Appgrade is one of the products in Jacob's portfolio. I can open its project overview.",
};

function normalizeCommand(input) {
  return input.trim().toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u00df/g, "ss")
    .replace(/[.!?,]/g, " ")
    .replace(/\s+/g, " ");
}

function projectTarget(text) {
  return Object.keys(projectDetails).find((name) => {
    if (name === "normal") return /\bnormal\b|n o r m a l/.test(text);
    if (name === "groa") return /\bgroa\b|g r o a/.test(text);
    return new RegExp(`\\b${name}\\b`).test(text);
  });
}

export function interpretVoiceCommand(input, pending = null) {
  const text = normalizeCommand(input);
  if (!text) return { response: "I didn't catch a command. Try saying, open VS Code." };

  if (/^(hello|hi|hey|good morning|good afternoon|good evening|greetings|hello normal|hi normal|hey normal|guten tag normal|hallo|guten morgen|guten tag|guten abend|guten tag normal|hallo normal|moin|how are you|whats up)$/.test(text)) {
    return { response: "Hello. I'm Telvin, Jacob's portfolio assistant. What would you like to explore?" };
  }
  if (/^(thank you|thanks|thanks normal|danke|vielen dank)$/.test(text)) {
    return { response: "You're welcome. Let me know what you'd like to explore next." };
  }
  if (/^(who are you|what are you|wer bist du)$/.test(text)) {
    return { response: "I'm Telvin, a small rule-based assistant that helps you explore Jacob's portfolio." };
  }
  if (/^(yes|yeah|yep|sure|open it|go ahead|ja|genau|bitte)$/.test(text) && pending) {
    return { action: "open_project", target: pending, response: `Opening ${pending.toUpperCase()}.`, clearPending: true };
  }
  if (/^(no|no thanks|not now|nein|lieber nicht)$/.test(text) && pending) {
    return { response: "No problem. What would you like to explore instead?", clearPending: true };
  }
  if (/who (built|made|created) you|who is your creator|wer hat dich (gebaut|entwickelt)|wer ist dein entwickler/.test(text)) {
    return { response: "Jacob. He apparently decided a portfolio website wasn't enough." };
  }
  if (/close (this|the|current) window|close window|close it|schliess(e)? (dieses|das) fenster|mach (dieses|das) fenster zu/.test(text)) {
    return { action: "close_window", response: "Closing the active window." };
  }
  if (/open (my )?(projects|project folder)|show (me )?(my )?projects|zeig(e)? mir (meine )?projekte|(?:offne|oeffne) (meine )?projekte/.test(text)) {
    return { action: "open_projects", response: "Sure. Opening the projects folder." };
  }
  if (/open (vs ?code|visual studio code)|start (vs ?code|visual studio code)|(?:offne|oeffne) (vs ?code|visual studio code)/.test(text)) {
    return { action: "open_app", target: "vscode", response: "Opening VS Code." };
  }
  if (/open (edge|microsoft edge|browser)|start (edge|the browser)|(?:offne|oeffne) (microsoft )?edge/.test(text)) {
    return { action: "open_app", target: "browser", response: "Opening Microsoft Edge." };
  }
  if (/open (files|file explorer|finder)|show (me )?(the )?files|(?:offne|oeffne) (den )?(datei )?explorer|(?:offne|oeffne) finder/.test(text)) {
    return { action: "open_app", target: "files", response: "Opening Files." };
  }
  if (/open (notepad|text editor)|show (me )?(my )?(resume|cv)|open (my )?(resume|cv)|(?:offne|oeffne) (den )?lebenslauf/.test(text)) {
    return { action: "open_resume", response: "Opening Jacob's resume in Notepad." };
  }
  if (/open (settings|system settings)|(?:offne|oeffne) (die )?einstellungen/.test(text)) {
    return { action: "open_app", target: "settings", response: "Opening Settings." };
  }
  if (/open (terminal|command line)|(?:offne|oeffne) das terminal/.test(text)) {
    return { action: "open_app", target: "terminal", response: "Opening Terminal." };
  }
  if (/open github|show (me )?github|(?:offne|oeffne) github/.test(text)) {
    return { action: "open_url", target: "https://github.com", response: "Opening Jacob's GitHub profile." };
  }
  if (/show (me )?(his )?experience|open (his )?experience|work history|zeig(e)? mir (seine )?erfahrung|berufserfahrung/.test(text)) {
    return { action: "open_profile", target: "experience", response: "Here is Jacob's engineering experience." };
  }
  if (/what technologies|which technologies|tech stack|technical skills|welche technologien|technologien nutzt/.test(text)) {
    return { action: "open_profile", target: "skills", response: "Jacob works across full-stack development, mobile, backend, and AI engineering. I've opened his technical profile." };
  }
  if (/tell me about jacob|about jacob|who is jacob|open (the )?profile|show (me )?(his )?profile|(?:erzahl|erzaehl) mir von jacob|wer ist jacob/.test(text)) {
    return { action: "open_profile", target: "about", response: "Jacob B Mon is a self-taught full-stack and AI engineer, and the creator of Innoxation. I've opened his profile." };
  }

  const project = projectTarget(text);
  if (project && /tell me about|what is|describe|explain|(?:erzahl|erzaehl) mir von|was ist|beschreib/.test(text)) {
    return { response: `${projectDetails[project]} Would you like me to open the project?`, pending: project };
  }
  if (project && /show|open|go to|launch|zeig(e)? mir|offne/.test(text)) {
    return { action: "open_project", target: project, response: `Opening the ${project.toUpperCase()} project overview.` };
  }
  if (/help|what can you do|commands|hilfe|was kannst du/.test(text)) {
    return { response: "Try: open VS Code, open Edge, open my projects, show me Auri, tell me about Jacob, open GitHub, or close this window." };
  }
  return { response: "I don't know that command yet. Try opening an app, project, or Jacob's profile." };
}
