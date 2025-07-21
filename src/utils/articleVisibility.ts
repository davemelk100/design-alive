export const getVisibleArticles = (
  articles: readonly any[],
  type: "mainPage" | "archive" = "mainPage"
) => {
  return articles; // All articles are always visible since admin controls were removed
};
