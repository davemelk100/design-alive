import PortfolioLayout from "../../components/PortfolioLayout";
import SectionHeader from "../../components/SectionHeader";
import { content } from "../../content";

export default function TestimonialsPage() {
  return (
    <PortfolioLayout currentPage="testimonials">
      <section className="py-4 sm:py-6 lg:py-8 xl:py-12 relative">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={content.testimonials.title}
            subtitle={content.testimonials.subtitle}
            className="mb-8 sm:mb-6"
          />
          <div className="space-y-6">
            {content.testimonials.items.map((testimonial, index) => (
              <div
                key={index}
                className="border-l-2 border-gray-300 dark:border-gray-600 pl-4"
              >
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
                <p className="mt-2 font-semibold text-gray-900 dark:text-white">
                  {testimonial.author}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {testimonial.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PortfolioLayout>
  );
}
