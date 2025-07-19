interface ContentVisibility {
  articles: { [key: string]: { mainPage: boolean; archive: boolean } };
  labProjects: { [key: string]: boolean };
  designWork: { [key: string]: boolean };
  testimonials: { [key: string]: boolean };
  sections: {
    articles: boolean;
    lab: boolean;
    designWork: boolean;
    testimonials: boolean;
    career: boolean;
    designSystem: boolean;
  };
}

export const getContentVisibility = (): ContentVisibility => {
  try {
    const saved = localStorage.getItem("contentVisibility");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    // Error loading content visibility
  }

  // Return default visibility (everything visible)
  return {
    articles: {},
    labProjects: {},
    designWork: {},
    testimonials: {},
    sections: {
      articles: true,
      lab: true,
      designWork: true,
      testimonials: true,
      career: true,
      designSystem: true,
    },
  };
};

export const isArticleVisible = (
  articleTitle: string,
  location: "mainPage" | "archive"
): boolean => {
  const visibility = getContentVisibility();
  const articleSettings = visibility.articles[articleTitle];

  if (!articleSettings) {
    return true; // Default to visible if no settings
  }

  return articleSettings[location];
};

export const isLabProjectVisible = (projectTitle: string): boolean => {
  const visibility = getContentVisibility();
  return visibility.labProjects[projectTitle] ?? true;
};

export const isDesignWorkVisible = (projectTitle: string): boolean => {
  const visibility = getContentVisibility();
  return visibility.designWork[projectTitle] ?? true;
};

export const isTestimonialVisible = (authorName: string): boolean => {
  const visibility = getContentVisibility();
  return visibility.testimonials[authorName] ?? true;
};

export const isSectionVisible = (
  sectionName: keyof ContentVisibility["sections"]
): boolean => {
  const visibility = getContentVisibility();
  return visibility.sections[sectionName] ?? true;
};
