interface ContentVisibility {
  designWork: { [key: string]: boolean };
}

// Get saved visibility settings from localStorage
const getVisibilitySettings = (): ContentVisibility => {
  try {
    const saved = localStorage.getItem("contentVisibility");
    return saved ? JSON.parse(saved) : { designWork: {} };
  } catch (error) {
    return { designWork: {} };
  }
};

// Check if a specific design work project is visible
export const isDesignWorkVisible = (projectTitle: string): boolean => {
  const visibilitySettings = getVisibilitySettings();
  const projectSettings = visibilitySettings.designWork[projectTitle];

  // Default to true if no setting is found
  return projectSettings !== false;
};

// Get all visible design work projects
export const getVisibleDesignWork = (projects: readonly any[]): any[] => {
  return projects.filter((project) => isDesignWorkVisible(project.title));
};
