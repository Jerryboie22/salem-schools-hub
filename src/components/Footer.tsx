import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/salem-logo-new.jpg";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-primary via-primary/95 to-[hsl(var(--gold-dark))] text-white">
      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img src={logo} alt="Salem Logo" className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover" />
              <div>
                <h3 className="text-base md:text-lg font-bold">Salem Group of Schools</h3>
                <p className="text-xs opacity-90">Excellence in Education</p>
              </div>
            </div>
            <p className="text-xs md:text-sm opacity-95">
              Building a generation rooted in knowledge, discipline, and excellence. Quality education from nursery to secondary level.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base md:text-lg font-bold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-xs md:text-sm">
              <li><Link to="/about" className="hover:text-secondary transition-colors opacity-95 hover:opacity-100">About Us</Link></li>
              <li><Link to="/schools/children" className="hover:text-secondary transition-colors opacity-95 hover:opacity-100">Children School</Link></li>
              <li><Link to="/schools/primary" className="hover:text-secondary transition-colors opacity-95 hover:opacity-100">Primary School</Link></li>
              <li><Link to="/schools/covenant" className="hover:text-secondary transition-colors opacity-95 hover:opacity-100">Covenant College</Link></li>
              <li><Link to="/gallery" className="hover:text-secondary transition-colors opacity-95 hover:opacity-100">Gallery</Link></li>
              <li><Link to="/news" className="hover:text-secondary transition-colors opacity-95 hover:opacity-100">News & Updates</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base md:text-lg font-bold mb-3">Contact Us</h3>
            <ul className="space-y-2 text-xs md:text-sm">
              <li className="flex items-start gap-2 opacity-95">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>No. 17 Bolanle Awosika Street, Off Ilogbo Road, Ojuore, Ota, Ogun State</span>
              </li>
              <li className="flex items-center gap-2 opacity-95">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+234 XXX XXX XXXX</span>
              </li>
              <li className="flex items-center gap-2 opacity-95">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>info@salemschools.edu.ng</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-xs md:text-sm opacity-95">
          <p>&copy; {new Date().getFullYear()} Salem Group of Schools. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
