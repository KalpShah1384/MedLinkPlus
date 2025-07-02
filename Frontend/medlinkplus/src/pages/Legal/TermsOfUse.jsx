import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const TermsOfUse = () => {
  return (
    <div className="max-w-screen container-auto mx-auto top-0 left-0 right-0 z-50">
      <Navbar />
      <main className="flex-grow py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 md:p-12 transition-colors duration-300">
          <h1 className="text-4xl font-bold mb-10 text-[#1c7856] dark:text-green-400 text-center">
            Terms of Use
          </h1>

          <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            <section>
              <h2 className="text-2xl font-semibold mb-2 text-[#1c7856] dark:text-green-400">1. Acceptance of Terms</h2>
              <p>
                By accessing or using MediLink Plus, you agree to be bound by these Terms of Use.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2 text-[#1c7856] dark:text-green-400">2. User Obligations</h2>
              <ol className="list-decimal ml-6 space-y-2">
                <li>You must be at least 18 years old to use our services.</li>
                <li>You must provide accurate and complete information when creating an account.</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2 text-[#1c7856] dark:text-green-400">3. Intellectual Property</h2>
              <p>
                All content on MediLink Plus, including text, images, and software, is protected by copyright.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2 text-[#1c7856] dark:text-green-400">4. Privacy</h2>
              <p>
                Your privacy is important to us. Please review our Privacy Policy for details on how we handle your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2 text-[#1c7856] dark:text-green-400">5. Medical Information</h2>
              <p>
                The information provided on MediLink Plus is for general informational purposes only and should not be considered medical advice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2 text-[#1c7856] dark:text-green-400">6. Modifications</h2>
              <p>
                We reserve the right to modify these Terms of Use at any time without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2 text-[#1c7856] dark:text-green-400">7. Termination</h2>
              <p>
                We may terminate your access to MediLink Plus at any time if you violate these Terms of Use.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2 text-[#1c7856] dark:text-green-400">8. Governing Law</h2>
              <p>
                These Terms of Use shall be governed by and construed in accordance with the laws of India.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfUse;
