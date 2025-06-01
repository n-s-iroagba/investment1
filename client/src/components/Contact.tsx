import React from 'react';
import { EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';

// Constants
const companySupportEmail = "wealthfundingtradestation@gmail.com";

interface ContactCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  children: React.ReactNode;
}

const ContactCard: React.FC<ContactCardProps> = ({ icon: Icon, children }) => {
  return (
    <div className="group bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-green-100 hover:border-green-200 hover:scale-105">
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
          <Icon className="w-10 h-10 text-white" />
        </div>
        <div className="space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
};

const SocialMediaButton: React.FC = () => {
  const socialIcons = [
    { name: 'Facebook', color: 'from-blue-500 to-blue-600', emoji: '📘' },
    { name: 'Twitter', color: 'from-blue-400 to-blue-500', emoji: '🐦' },
    { name: 'LinkedIn', color: 'from-blue-600 to-blue-700', emoji: '💼' },
    { name: 'Instagram', color: 'from-pink-500 to-purple-600', emoji: '📸' },
  ];

  return (
    <div className="flex space-x-3">
      {socialIcons.map((social, index) => (
        <button
          key={index}
          className={`group w-12 h-12 bg-gradient-to-br ${social.color} rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:scale-110`}
          title={`Follow us on ${social.name}`}
        >
          <span className="text-lg group-hover:scale-110 transition-transform duration-200">
            {social.emoji}
          </span>
        </button>
      ))}
    </div>
  );
};

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 px-4 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-16">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent mb-4">
              We&apos;ll Be Happy To Hear From You.
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto mb-6"></div>
          </div>
          <p className="text-xl text-gray-700 text-center max-w-2xl leading-relaxed">
            Let&apos;s talk! We&apos;re happy to answer any questions you have.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Email Contact */}
          <ContactCard icon={EnvelopeIcon} title="Email Us">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-800">Email Support</h3>
              <p className="text-green-600 font-semibold text-lg hover:text-green-700 transition-colors cursor-pointer">
                {companySupportEmail}
              </p>
              <p className="text-gray-600 leading-relaxed">
                We reply immediately in less than 24hrs on week days.
              </p>
            </div>
          </ContactCard>

          {/* Social Media */}
          <ContactCard icon={() => <div className="text-2xl">🌐</div>} title="Social Media">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800">Follow Us</h3>
              <SocialMediaButton />
              <p className="text-gray-600 leading-relaxed">
                Connect with us on social media for updates and news.
              </p>
            </div>
          </ContactCard>

          {/* Office Location */}
          <ContactCard icon={MapPinIcon} title="Visit Us">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-800">Our Office</h3>
              <p className="text-gray-700 leading-relaxed">
                1015 15th St NW 6th Floor,<br />
                Washington, DC, 20005, USA.
              </p>
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <p className="font-semibold text-green-700 mb-2">Business Hours</p>
                <p className="text-gray-700">Monday - Friday</p>
                <p className="text-gray-700">9:00 AM - 3:00 PM</p>
                <p className="text-sm text-gray-600 mt-2">EDT Timezone</p>
              </div>
            </div>
          </ContactCard>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-green-100 mb-6 text-lg">
              Don&apos;t hesitate to reach out. We&apos;re here to help you achieve your financial goals.
            </p>
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;