import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">Salem Group of Schools</h3>
            <p className="text-sm opacity-90 mb-4">
              Building a generation rooted in knowledge, discipline, and excellence. Quality education from nursery to secondary level.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link to="/children-school" className="hover:text-accent transition-colors">Children School</Link></li>
              <li><Link to="/primary-school" className="hover:text-accent transition-colors">Primary School</Link></li>
              <li><Link to="/covenant-college" className="hover:text-accent transition-colors">Covenant College</Link></li>
              <li><Link to="/gallery" className="hover:text-accent transition-colors">Gallery</Link></li>
              <li><Link to="/news" className="hover:text-accent transition-colors">News & Updates</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>No. 17 Bolanle Awosika Street, Off Ilogbo Road, Ojuore, Ota, Ogun State</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>+234 XXX XXX XXXX</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>info@salemschools.edu.ng</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-90">
          <p>&copy; {new Date().getFullYear()} Salem Group of Schools. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
