import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const PrivacyPolicy = () => {
  return (
   <div className="max-w-screen container-auto mx-auto top-0 left-0 right-0 z-50">
      <Navbar />
      <main className="flex-grow py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 md:p-12 transition-colors duration-300">
          <h1 className="text-4xl font-bold mb-8 text-[#1c7856] dark:text-green-400 text-center">
            Privacy Policy
          </h1>

          <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            <section>
              <h2 className="text-2xl font-semibold mb-2 text-[#1c7856] dark:text-green-400">1. Information We Collect</h2>
              <p>We collect personal information when you use our services, including:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Contact information (name, email, phone number)</li>
                <li>Medical information (with your consent)</li>
                <li>Usage data (how you interact with our platform)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2 text-[#1c7856] dark:text-green-400">2. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Provide and improve our services</li>
                <li>Communicate with you about your healthcare</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2 text-[#1c7856] dark:text-green-400">3. Data Protection</h2>
              <p>We implement security measures to protect your personal information from unauthorized access.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2 text-[#1c7856] dark:text-green-400">4. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2 text-[#1c7856] dark:text-green-400">5. Medical Information</h2>
              <p>We handle medical information with the highest level of confidentiality and security.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2 text-[#1c7856] dark:text-green-400">6. Third Parties</h2>
              <p>We may share your information with healthcare providers and other authorized third parties.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2 text-[#1c7856] dark:text-green-400">7. Children's Privacy</h2>
              <p>Our services are not intended for children under 18 years old.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2 text-[#1c7856] dark:text-green-400">8. Updates to Privacy Policy</h2>
              <p>We may update this Privacy Policy from time to time.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
