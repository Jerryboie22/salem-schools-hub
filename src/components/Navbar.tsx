import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3">
            <div className="text-2xl font-bold">Salem Group of Schools</div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <Link to="/about" className="hover:text-accent transition-colors">About</Link>
            <div className="relative group">
              <button className="hover:text-accent transition-colors">Our Schools</button>
              <div className="absolute hidden group-hover:block pt-2 w-64">
                <div className="bg-card text-card-foreground shadow-lg rounded-lg p-4 space-y-2">
                  <Link to="/children-school" className="block hover:text-accent transition-colors py-2">Salem Children School</Link>
                  <Link to="/primary-school" className="block hover:text-accent transition-colors py-2">Salem Nursery & Primary</Link>
                  <Link to="/covenant-college" className="block hover:text-accent transition-colors py-2">Salem Covenant College</Link>
                </div>
              </div>
            </div>
            <Link to="/gallery" className="hover:text-accent transition-colors">Gallery</Link>
            <Link to="/news" className="hover:text-accent transition-colors">News</Link>
            <Link to="/contact" className="hover:text-accent transition-colors">Contact</Link>
            <Button variant="secondary" asChild>
              <Link to="/contact">Apply Now</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-4">
            <Link to="/" className="block hover:text-accent transition-colors py-2">Home</Link>
            <Link to="/about" className="block hover:text-accent transition-colors py-2">About</Link>
            <Link to="/children-school" className="block hover:text-accent transition-colors py-2 pl-4">Salem Children School</Link>
            <Link to="/primary-school" className="block hover:text-accent transition-colors py-2 pl-4">Salem Nursery & Primary</Link>
            <Link to="/covenant-college" className="block hover:text-accent transition-colors py-2 pl-4">Salem Covenant College</Link>
            <Link to="/gallery" className="block hover:text-accent transition-colors py-2">Gallery</Link>
            <Link to="/news" className="block hover:text-accent transition-colors py-2">News</Link>
            <Link to="/contact" className="block hover:text-accent transition-colors py-2">Contact</Link>
            <Button variant="secondary" className="w-full" asChild>
              <Link to="/contact">Apply Now</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
