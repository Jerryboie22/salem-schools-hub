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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [schoolsOpen, setSchoolsOpen] = useState(false);
  const [portalsOpen, setPortalsOpen] = useState(false);

  return (
    <nav className="bg-primary text-primary-foreground z-50 shadow-lg">
      {/* Top Contact Bar */}
      <div className="bg-primary/90 border-b border-primary-foreground/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center md:justify-end gap-4 py-2 text-xs">
            <a href="mailto:info@salemschools.edu.ng" className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <Mail size={14} />
              <span className="hidden sm:inline">info@salemschools.edu.ng</span>
            </a>
            <span className="hidden sm:inline text-primary-foreground/30">|</span>
            <a href="tel:+234 802 370 2107" className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <Phone size={14} />
              <span>+234 802 370 2107</span>
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center space-x-2 md:space-x-3">
            <img src={logo} alt="Salem Logo" className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover" />
            <div>
              <div className="font-bold text-sm md:text-xl">Salem Group of Schools</div>
              <div className="text-[10px] md:text-xs opacity-90">Excellence in Education</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-accent transition-colors font-medium">Home</Link>
            
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-primary/80 text-primary-foreground hover:text-accent">
                    About Us
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 bg-background">
                      <li><NavigationMenuLink asChild><Link to="/leadership" className="block p-3 rounded-md hover:bg-accent hover:text-accent-foreground"><div className="font-medium">Leadership Team</div></Link></NavigationMenuLink></li>
                      <li><NavigationMenuLink asChild><Link to="/vision-mission" className="block p-3 rounded-md hover:bg-accent hover:text-accent-foreground"><div className="font-medium">Vision & Mission</div></Link></NavigationMenuLink></li>
                      <li><NavigationMenuLink asChild><Link to="/library" className="block p-3 rounded-md hover:bg-accent hover:text-accent-foreground"><div className="font-medium">Library</div></Link></NavigationMenuLink></li>
                      <li><NavigationMenuLink asChild><Link to="/gallery" className="block p-3 rounded-md hover:bg-accent hover:text-accent-foreground"><div className="font-medium">Media & Gallery</div></Link></NavigationMenuLink></li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-primary/80 text-primary-foreground hover:text-accent">Our Schools</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[350px] gap-2 p-4 bg-background">
                      <li><NavigationMenuLink asChild><Link to="/schools/children" className="block p-3 rounded-md hover:bg-accent hover:text-accent-foreground"><div className="font-medium">Children School</div></Link></NavigationMenuLink></li>
                      <li><NavigationMenuLink asChild><Link to="/schools/primary" className="block p-3 rounded-md hover:bg-accent hover:text-accent-foreground"><div className="font-medium">Primary School</div></Link></NavigationMenuLink></li>
                      <li><NavigationMenuLink asChild><Link to="/schools/covenant" className="block p-3 rounded-md hover:bg-accent hover:text-accent-foreground"><div className="font-medium">Covenant College</div></Link></NavigationMenuLink></li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link to="/news" className="hover:text-accent transition-colors font-medium">News</Link>
            <Link to="/contact" className="hover:text-accent transition-colors font-medium">Contact</Link>
            
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-accent text-accent-foreground hover:bg-accent/90">Portal Login</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[250px] gap-2 p-4 bg-background">
                      <li><NavigationMenuLink asChild><Link to="/portal/student" className="block p-3 rounded-md hover:bg-accent hover:text-accent-foreground">Student Portal</Link></NavigationMenuLink></li>
                      <li><NavigationMenuLink asChild><Link to="/portal/teacher" className="block p-3 rounded-md hover:bg-accent hover:text-accent-foreground">Teacher Portal</Link></NavigationMenuLink></li>
                      <li><NavigationMenuLink asChild><Link to="/portal/admin" className="block p-3 rounded-md hover:bg-accent hover:text-accent-foreground">Admin Portal</Link></NavigationMenuLink></li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden fixed inset-0 top-20 bg-primary z-40 overflow-y-auto max-h-[calc(100vh-5rem)]">
            <div className="container mx-auto px-4 py-4 space-y-1">
              <Link 
                to="/" 
                className="block py-2.5 px-3 hover:bg-primary-foreground/10 rounded transition-colors border-b border-primary-foreground/10" 
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              
              <div className="border-b border-primary-foreground/10">
                <button 
                  onClick={() => setAboutOpen(!aboutOpen)}
                  className="w-full flex items-center justify-between py-2.5 px-3 hover:bg-primary-foreground/10 rounded transition-colors"
                >
                  <span className="font-medium">About Us</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${aboutOpen ? 'rotate-180' : ''}`} />
                </button>
                {aboutOpen && (
                  <div className="pl-4 pb-2 space-y-1">
                    <Link to="/leadership" className="block py-2 px-3 text-sm hover:bg-primary-foreground/10 rounded" onClick={() => setIsOpen(false)}>Leadership</Link>
                    <Link to="/vision-mission" className="block py-2 px-3 text-sm hover:bg-primary-foreground/10 rounded" onClick={() => setIsOpen(false)}>Vision & Mission</Link>
                    <Link to="/library" className="block py-2 px-3 text-sm hover:bg-primary-foreground/10 rounded" onClick={() => setIsOpen(false)}>Library</Link>
                    <Link to="/gallery" className="block py-2 px-3 text-sm hover:bg-primary-foreground/10 rounded" onClick={() => setIsOpen(false)}>Gallery</Link>
                  </div>
                )}
              </div>

              <div className="border-b border-primary-foreground/10">
                <button 
                  onClick={() => setSchoolsOpen(!schoolsOpen)}
                  className="w-full flex items-center justify-between py-2.5 px-3 hover:bg-primary-foreground/10 rounded transition-colors"
                >
                  <span className="font-medium">Our Schools</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${schoolsOpen ? 'rotate-180' : ''}`} />
                </button>
                {schoolsOpen && (
                  <div className="pl-4 pb-2 space-y-1">
                    <Link to="/schools/children" className="block py-2 px-3 text-sm hover:bg-primary-foreground/10 rounded" onClick={() => setIsOpen(false)}>Children School</Link>
                    <Link to="/schools/primary" className="block py-2 px-3 text-sm hover:bg-primary-foreground/10 rounded" onClick={() => setIsOpen(false)}>Primary School</Link>
                    <Link to="/schools/covenant" className="block py-2 px-3 text-sm hover:bg-primary-foreground/10 rounded" onClick={() => setIsOpen(false)}>Covenant College</Link>
                  </div>
                )}
              </div>

              <Link 
                to="/news" 
                className="block py-2.5 px-3 hover:bg-primary-foreground/10 rounded transition-colors border-b border-primary-foreground/10" 
                onClick={() => setIsOpen(false)}
              >
                News
              </Link>
              
              <Link 
                to="/contact" 
                className="block py-2.5 px-3 hover:bg-primary-foreground/10 rounded transition-colors border-b border-primary-foreground/10" 
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              
              <div>
                <button 
                  onClick={() => setPortalsOpen(!portalsOpen)}
                  className="w-full flex items-center justify-between py-2.5 px-3 bg-accent text-accent-foreground rounded transition-colors"
                >
                  <span className="font-medium">Portals</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${portalsOpen ? 'rotate-180' : ''}`} />
                </button>
                {portalsOpen && (
                  <div className="pl-4 pt-2 pb-2 space-y-1">
                    <Link to="/portal/student" className="block py-2 px-3 text-sm hover:bg-primary-foreground/10 rounded" onClick={() => setIsOpen(false)}>Student</Link>
                    <Link to="/portal/teacher" className="block py-2 px-3 text-sm hover:bg-primary-foreground/10 rounded" onClick={() => setIsOpen(false)}>Teacher</Link>
                    <Link to="/portal/admin" className="block py-2 px-3 text-sm hover:bg-primary-foreground/10 rounded" onClick={() => setIsOpen(false)}>Admin</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
