interface ContentVisibility {
  testimonials: { [key: string]: boolean };
}

// Get saved visibility settings from localStorage
const getVisibilitySettings = (): ContentVisibility => {
  try {
    const saved = localStorage.getItem("contentVisibility");
    return saved ? JSON.parse(saved) : { testimonials: {} };
  } catch (error) {
    return { testimonials: {} };
  }
};

// Check if a specific testimonial is visible
export const isTestimonialVisible = (authorName: string): boolean => {
  const visibilitySettings = getVisibilitySettings();
  const testimonialSettings = visibilitySettings.testimonials[authorName];

  // Default to true if no setting is found
  return testimonialSettings !== false;
};

// Get all visible testimonials
export const getVisibleTestimonials = (testimonials: readonly any[]): any[] => {
  return testimonials.filter((testimonial) =>
    isTestimonialVisible(testimonial.author)
  );
};
