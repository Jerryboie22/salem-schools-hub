import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown, Mail, Phone } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import logo from "@/assets/salem-logo-new.jpg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [schoolsOpen, setSchoolsOpen] = useState(false);
  const [portalsOpen, setPortalsOpen] = useState(false);

  // Lock scroll when mobile menu opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

  return (
    <nav className="fixed top-0 left-0 w-full bg-primary text-primary-foreground z-50 shadow-lg">
      {/* 🔹 Top Contact Bar */}
      <div className="w-full bg-primary/90 border-b border-primary-foreground/10">
        <div className="w-full px-6">
          <div className="flex items-center justify-center md:justify-end gap-4 py-2 text-xs">
            <a
              href="mailto:salemcovenantsecondaryschool@gmail.com"
              className="flex items-center gap-1.5 hover:text-accent transition-colors"
            >
              <Mail size={14} />
              <span className="hidden sm:inline">
                salemcovenantsecondaryschool@gmail.com
              </span>
            </a>
            <span className="hidden sm:inline text-primary-foreground/30">|</span>
            <a
              href="tel:+2348100510611"
              className="flex items-center gap-1.5 hover:text-accent transition-colors"
            >
              <Phone size={14} />
              <span>+234 810 051 0611</span>
            </a>
          </div>
        </div>
      </div>

      {/* 🔹 Main Navigation Bar */}
      <div className="w-full px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center space-x-2 md:space-x-3">
            <img
              src={logo}
              alt="Salem Logo"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
            />
            <div>
              <div className="font-bold text-sm md:text-xl">
                Salem Group of Schools
              </div>
              <div className="text-[10px] md:text-xs opacity-90">
                Excellence in Education
              </div>
            </div>
          </Link>

          {/* 🔸 Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-accent transition-colors font-medium">
              Home
            </Link>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-primary/80 text-primary-foreground hover:text-accent">
                    About Us
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 bg-background">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/leadership"
                            className="block p-3 rounded-md hover:bg-accent hover:text-accent-foreground"
                          >
                            Leadership Team
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/vision-mission"
                            className="block p-3 rounded-md hover:bg-accent hover:text-accent-foreground"
                          >
                            Vision & Mission
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/library"
                            className="block p-3 rounded-md hover:bg-accent hover:text-accent-foreground"
                          >
                            Library
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/gallery"
                            className="block p-3 rounded-md hover:bg-accent hover:text-accent-foreground"
                          >
                            Media & Gallery
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-primary/80 text-primary-foreground hover:text-accent">
                    Our Schools
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[350px] gap-2 p-4 bg-background">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/schools/children"
                            className="block p-3 rounded-md hover:bg-accent hover:text-accent-foreground"
                          >
                            Children School
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/schools/primary"
                            className="block p-3 rounded-md hover:bg-accent hover:text-accent-foreground"
                          >
                            Primary School
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/schools/covenant"
                            className="block p-3 rounded-md hover:bg-accent hover:text-accent-foreground"
                          >
                            Covenant College
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link to="/news" className="hover:text-accent transition-colors font-medium">
              News
            </Link>
            <Link to="/contact" className="hover:text-accent transition-colors font-medium">
              Contact
            </Link>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Portal Login
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[250px] gap-2 p-4 bg-background">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/portal/student"
                            className="block p-3 rounded-md hover:bg-accent hover:text-accent-foreground"
                          >
                            Student Portal
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/portal/teacher"
                            className="block p-3 rounded-md hover:bg-accent hover:text-accent-foreground"
                          >
                            Teacher Portal
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/portal/admin"
                            className="block p-3 rounded-md hover:bg-accent hover:text-accent-foreground"
                          >
                            Admin Portal
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* 🔸 Mobile Menu Toggle */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown (Full Width Too) */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-20 bg-primary z-40 overflow-y-auto max-h-[calc(100vh-5rem)] w-full">
          {/* ... same mobile menu code as yours ... */}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
