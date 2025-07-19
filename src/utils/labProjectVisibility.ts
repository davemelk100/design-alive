interface ContentVisibility {
  labProjects: { [key: string]: boolean };
}

// Get saved visibility settings from localStorage
const getVisibilitySettings = (): ContentVisibility => {
  try {
    const saved = localStorage.getItem("contentVisibility");
    return saved ? JSON.parse(saved) : { labProjects: {} };
  } catch (error) {
    return { labProjects: {} };
  }
};

// Check if a specific lab project is visible
export const isLabProjectVisible = (projectTitle: string): boolean => {
  const visibilitySettings = getVisibilitySettings();
  const projectSettings = visibilitySettings.labProjects[projectTitle];

  // Default to true if no setting is found
  return projectSettings !== false;
};

// Get all visible lab projects
export const getVisibleLabProjects = (projects: readonly any[]): any[] => {
  return projects.filter((project) => isLabProjectVisible(project.title));
};
