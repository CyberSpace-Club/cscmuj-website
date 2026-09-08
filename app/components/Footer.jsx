import React from "react";
import { MapPin, Phone, Mail, Instagram, Linkedin, Handshake } from "lucide-react";
import Image from "next/image";
import Logo from "../../assets/cs.svg";

const Footer = () => {
  return (
    <footer className="bg-[#0e0e0e] text-[#f2f2f2] py-16 border-t border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 space-y-16">
        
        {/* Main Footer Layout */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* 1. Brand Section */}
          <div className="space-y-6 text-center md:text-left flex flex-col items-center md:items-start justify-center">
            <div className="w-32 h-32 opacity-90 rounded-lg flex items-center justify-center text-white font-bold">
              <Image
                src={Logo}
                alt="Cyber Space Club Logo"
                className="filter drop-shadow-2xl object-contain"
              />
            </div>
            <h2 className="text-xl font-bold tracking-wide">
              CYBER SPACE CLUB
            </h2>
            <p className="text-xs text-neutral-400 max-w-xs text-center md:text-left">
              Uplifting cybersecurity culture and fostering innovation at MUJ.
            </p>
          </div>

          {/* 2. Executive Contact Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-[#ff8000] border-b border-[#ff8000]/20 pb-2">
              Contact Us
            </h3>

            <div className="space-y-6">
              {/* Chairperson */}
              <div className="space-y-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <Phone className="w-4 h-4 text-[#ff8000] shrink-0" />
                  <a
                    href="tel:9599415311"
                    className="hover:text-[#ff8000] transition-colors text-sm font-medium"
                  >
                    +91 95994 15311
                  </a>
                </div>
                <div className="text-xs opacity-80 pl-6">
                  <p className="font-semibold text-white">Abhinav Trikha</p>
                  <p className="text-[#ff8000]">Chairperson</p>
                </div>
              </div>

              {/* Vice Chairperson */}
              <div className="space-y-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <Phone className="w-4 h-4 text-[#ff8000] shrink-0" />
                  <a
                    href="tel:9235285754"
                    className="hover:text-[#ff8000] transition-colors text-sm font-medium"
                  >
                    +91 92352 85754
                  </a>
                </div>
                <div className="text-xs opacity-80 pl-6">
                  <p className="font-semibold text-white">Ambika Seth</p>
                  <p className="text-[#ff8000]">Vice Chairperson</p>
                </div>
              </div>

              {/* Club Email */}
              <div className="flex items-center justify-center md:justify-start space-x-2 pt-2">
                <Mail className="w-4 h-4 text-[#ff8000] shrink-0" />
                <a
                  href="mailto:cyber.space@muj.manipal.edu"
                  className="text-xs hover:text-[#ff8000] transition-colors"
                >
                  cyber.space@muj.manipal.edu
                </a>
              </div>
            </div>
          </div>

          {/* 3. Sponsorships & Collaborations Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-[#ff8000] border-b border-[#ff8000]/20 pb-2 flex items-center justify-center md:justify-start gap-2">
              <Handshake className="w-5 h-5" />
              <span>Partnerships</span>
            </h3>

            <div className="space-y-6">
              {/* Sponsorship Lead */}
              <div className="space-y-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <Phone className="w-4 h-4 text-[#ff8000] shrink-0" />
                  <a
                    href="tel:9876543210"
                    className="hover:text-[#ff8000] transition-colors text-sm font-medium"
                  >
                    +91 98102 08341
                  </a>
                </div>
                <div className="text-xs opacity-80 pl-6">
                  <p className="font-semibold text-white">Amritansh Srivastava</p>
                  <p className="text-[#ff8000]">General Secretary</p>
                </div>
              </div>

              {/* Collaborations Lead */}
              <div className="space-y-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <Phone className="w-4 h-4 text-[#ff8000] shrink-0" />
                  <a
                    href="tel:9876543211"
                    className="hover:text-[#ff8000] transition-colors text-sm font-medium"
                  >
                    +91 9555 672750
                  </a>
                </div>
                <div className="text-xs opacity-80 pl-6">
                  <p className="font-semibold text-white">Harshit Raj Singh</p>
                  <p className="text-[#ff8000]">Executive Secretary</p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Address & Social Section */}
          <div className="space-y-6 text-center md:text-left">
            <div>
              <h3 className="text-xl font-bold text-[#ff8000] border-b border-[#ff8000]/20 pb-2 mb-4">
                Location
              </h3>
              <div className="flex items-start justify-center md:justify-start space-x-3">
                <MapPin className="w-5 h-5 text-[#ff8000] mt-1 shrink-0" />
                <p className="text-xs opacity-80 leading-relaxed">
                  Manipal University Jaipur, Dehmi Kalan, Near GVK Toll Plaza,
                  Jaipur-Ajmer Expressway, Jaipur, Rajasthan 303007
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white mb-3">Connect With Us</h3>
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <a
                  href="https://www.instagram.com/csc_muj/"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-neutral-900 border border-neutral-800 hover:border-[#ff8000] hover:text-[#ff8000] rounded-full transition-all"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/company/cyber-space-club/"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-neutral-900 border border-neutral-800 hover:border-[#ff8000] hover:text-[#ff8000] rounded-full transition-all"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-neutral-900 text-center text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Cyber Space Club, MUJ. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;