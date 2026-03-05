import { Link } from "react-router-dom";
import SiteFooter, { SiteFooterBranding } from "../components/SiteFooter";

export default function PrivacyPolicy() {
  return (
    <div className="flex-1 flex flex-col" style={{ backgroundColor: "hsl(var(--background))" }}>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Link
          to="/editor"
          className="inline-flex items-center gap-1 text-[14px] font-medium mb-6 hover:opacity-70 transition-opacity"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          &larr; Back to Editor
        </Link>

        <h1 className="text-3xl sm:text-4xl font-light mb-2" style={{ color: "hsl(var(--foreground))" }}>
          Themal's Privacy Policy
        </h1>
        <p className="text-[14px] mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
          Last updated: March 3, 2026
        </p>

        <div className="space-y-6 text-[14px] leading-relaxed" style={{ color: "hsl(var(--foreground))" }}>
          <section>
            <h2 className="text-xl font-medium mb-2">1. Information We Collect</h2>
            <p>When you use Themal, we may collect the following information:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Account information:</strong> If you create an account via Clerk, we collect your email address and profile information you provide during sign-up.</li>
              <li><strong>Usage data:</strong> We collect anonymous usage data such as pages visited, features used, and interaction patterns to improve our service.</li>
              <li><strong>Design preferences:</strong> Color selections and design system configurations are stored locally in your browser via localStorage.</li>
              <li><strong>Payment information:</strong> If you subscribe to a paid plan, payment processing is handled by Stripe. We do not store your full credit card details.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-2">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To provide and maintain our service</li>
              <li>To manage your account and subscription</li>
              <li>To process payments through Stripe</li>
              <li>To communicate with you about service updates</li>
              <li>To improve and optimize the user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-2">3. Third-Party Services</h2>
            <p>We use the following third-party services that may collect data:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Clerk</strong> - Authentication and user management. Clerk may set cookies to maintain your session. See <a href="https://clerk.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70">Clerk's Privacy Policy</a>.</li>
              <li><strong>Stripe</strong> - Payment processing for subscriptions. See <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70">Stripe's Privacy Policy</a>.</li>
              <li><strong>Google Fonts</strong> - Font loading for typography previews. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70">Google's Privacy Policy</a>.</li>
              <li><strong>GitHub API</strong> - Used when submitting pull requests for design system changes. Only accessed when you explicitly initiate a PR.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-2">4. Data Storage</h2>
            <p>Your design system configurations are stored locally in your browser using localStorage. We do not transmit your design choices to our servers unless you explicitly create a pull request or use a feature that requires server communication.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-2">5. Data Retention</h2>
            <p>Account data is retained for as long as your account is active. You may request deletion of your account and associated data at any time by contacting us.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-2">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent for data processing</li>
              <li>Export your data in a portable format</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-2">7. Contact</h2>
            <p>For privacy-related inquiries, please contact us at <a href="mailto:privacy@theemel.com" className="underline hover:opacity-70">privacy@theemel.com</a>.</p>
          </section>
        </div>
      </div>
      <SiteFooterBranding />
      <SiteFooter />
    </div>
  );
}
