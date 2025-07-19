export const isArticleVisible = (articleTitle: string, type: 'mainPage' | 'archive' = 'mainPage'): boolean => {
  try {
    const savedVisibility = localStorage.getItem("contentVisibility");
    if (savedVisibility) {
      const visibilitySettings = JSON.parse(savedVisibility);
      const articleSettings = visibilitySettings.articles?.[articleTitle];
      
      if (articleSettings && typeof articleSettings === 'object') {
        return articleSettings[type] !== false; // Default to true if not explicitly set to false
      }
      
      return true; // Default to visible if not found
    }
    return true; // Default to visible if no settings exist
  } catch (error) {
    return true; // Default to visible on error
  }
};

export const getVisibleArticles = (articles: readonly any[], type: 'mainPage' | 'archive' = 'mainPage') => {
  return articles.filter((article) => isArticleVisible(article.title, type));
};
