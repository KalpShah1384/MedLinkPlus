import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const CookiePolicy = () => {
  return (
    <div className="max-w-screen container-auto mx-auto top-0 left-0 right-0 z-50">
      <Navbar />
      <main className="flex-grow py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 md:p-12 transition-colors duration-300">
          <h1 className="text-4xl font-bold mb-8 text-[#1c7856] dark:text-green-400 text-center">
            Cookie Policy
          </h1>

          <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            <section>
              <h2 className="text-2xl font-semibold mb-2 text-[#1c7856] dark:text-green-400">1. What are Cookies?</h2>
              <p>
                Cookies are small text files that are stored on your device when you visit our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2 text-[#1c7856] dark:text-green-400">2. Types of Cookies We Use</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for basic functionality of our website.</li>
                <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our website.</li>
                <li><strong>Functionality Cookies:</strong> Remember your preferences and settings.</li>
                <li><strong>Targeting Cookies:</strong> Used for advertising and personalization.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2 text-[#1c7856] dark:text-green-400">3. How We Use Cookies</h2>
              <p>We use cookies to:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Improve your user experience</li>
                <li>Track website usage</li>
                <li>Provide personalized content</li>
                <li>Ensure security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2 text-[#1c7856] dark:text-green-400">4. Managing Cookies</h2>
              <p>You can manage cookies through your browser settings:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Accept all cookies</li>
                <li>Reject all cookies</li>
                <li>Select specific cookies to accept</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2 text-[#1c7856] dark:text-green-400">5. Third Party Cookies</h2>
              <p>We may use third-party services that also use cookies:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Analytics providers</li>
                <li>Advertising networks</li>
                <li>Social media platforms</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2 text-[#1c7856] dark:text-green-400">6. Changes to Cookie Policy</h2>
              <p>
                We may update this Cookie Policy from time to time. We will notify you of any significant changes.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CookiePolicy;
