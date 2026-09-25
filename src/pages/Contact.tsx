import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, Instagram, Facebook, Twitter, Youtube, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const Contact: React.FC = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill out all required fields', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setIsSubmitting(false);
      setIsSubmitted(true);
      showToast(data.message || 'Concierge message received');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setIsSubmitting(false);
      setIsSubmitted(true);
      showToast('Thank you! Our concierge team will respond within 24 hours.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <div className="bg-[#faf9f5] min-h-screen">
      {/* 1. Header Banner - Exact Match to Wireframe Panel 08 */}
      <div className="bg-[#111111] text-white py-14 px-4 sm:px-6 lg:px-8 text-center border-b border-stone-800">
        <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">
          Contact Us
        </h1>
        <p className="text-stone-300 text-xs sm:text-sm font-light mt-2 max-w-md mx-auto">
          We’d love to hear from you. Inquire about custom flacons, bridal orders, or fragrance consults.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Get In Touch Card - Wireframe Panel 08 */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
              <h2 className="font-serif-luxury text-2xl font-bold text-stone-900 pb-3 border-b border-stone-200">
                Get in Touch
              </h2>

              <div className="space-y-5 text-xs">
                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f4f2ee] flex items-center justify-center text-[#c5a880] shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-stone-900 text-sm font-semibold">
                      +91 96765 43210
                    </strong>
                    <span className="text-stone-500">Mon - Sat, 10:00 AM - 7:00 PM IST</span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f4f2ee] flex items-center justify-center text-[#c5a880] shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-stone-900 text-sm font-semibold">
                      support@auraperfumes.com
                    </strong>
                    <span className="text-stone-500">Concierge response within 24 hours</span>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f4f2ee] flex items-center justify-center text-[#c5a880] shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-stone-900 text-sm font-semibold">
                      AURA Flagship Ateliér
                    </strong>
                    <span className="text-stone-500">
                      Bandra West, Mumbai, Maharashtra 400050, India
                    </span>
                  </div>
                </div>
              </div>

              {/* Social icons */}
              <div className="pt-4 border-t border-stone-200 flex items-center gap-4 text-stone-600">
                <span className="text-xs uppercase tracking-wider font-semibold text-stone-800">
                  Follow Us:
                </span>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Stylized Location Map Graphic - Wireframe Panel 08 */}
            <div className="bg-[#f0ece5] border border-stone-300 p-6 text-center space-y-2 relative overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-black text-[#c5a880] flex items-center justify-center mx-auto shadow-md">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="font-serif-luxury text-base font-bold text-stone-900">
                Boutique Fragrance Consultation
              </h4>
              <p className="text-xs text-stone-600 max-w-xs mx-auto">
                Visit our bespoke scent bar in Bandra West for private bottle engraving and bespoke
                fragrance profiling.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form - Wireframe Panel 08 */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 border border-stone-200 shadow-xs">
            <h2 className="font-serif-luxury text-2xl font-bold text-stone-900 pb-3 border-b border-stone-200 mb-6">
              Send a Concierge Message
            </h2>

            {isSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-6 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
                <h3 className="font-serif-luxury text-xl font-bold">Message Sent Successfully</h3>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Thank you for reaching out to AURA Perfumes. Our fragrance specialist will review your
                  inquiry and contact you via email shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="bg-stone-900 text-white text-xs uppercase tracking-wider font-semibold px-5 py-2 mt-2"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-stone-800 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full bg-[#faf9f5] border border-stone-300 p-3 text-xs text-stone-900 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-stone-800 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                    className="w-full bg-[#faf9f5] border border-stone-300 p-3 text-xs text-stone-900 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-stone-800 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Bespoke Scent Discovery, Order Query, Wholesale"
                    className="w-full bg-[#faf9f5] border border-stone-300 p-3 text-xs text-stone-900 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-stone-800 mb-1">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can our fragrance curators assist you today?"
                    className="w-full bg-[#faf9f5] border border-stone-300 p-3 text-xs text-stone-900 focus:outline-none focus:border-black"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#111111] hover:bg-[#252525] text-white text-xs uppercase tracking-widest font-semibold py-3.5 transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
