import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown, Phone, Mail } from "lucide-react";
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

  return (
    <>
      {/* Contact Info Bar - Desktop Only */}
      <div className="hidden lg:block bg-accent text-accent-foreground py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-end items-center gap-6 text-sm">
            <a href="tel:+234XXXXXXXXX" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Phone className="w-4 h-4" />
              <span>+234 XXX XXX XXXX</span>
            </a>
            <a href="mailto:info@salemschools.edu.ng" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Mail className="w-4 h-4" />
              <span>info@salemschools.edu.ng</span>
            </a>
          </div>
        </div>
      </div>

      <nav className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center space-x-2 lg:space-x-3">
              <img src={logo} alt="Salem Logo" className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover" />
              <div className="hidden sm:block">
                <div className="font-bold text-sm lg:text-xl">Salem Group of Schools</div>
                <div className="text-[10px] lg:text-xs opacity-90">Excellence in Education</div>
              </div>
            </Link>

            <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
              <Link to="/" className="hover:text-accent transition-colors font-medium text-sm">Home</Link>
              
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent hover:bg-primary/80 text-primary-foreground hover:text-accent text-sm">
                      About Us
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[350px] gap-2 p-4 bg-background">
                        <li><NavigationMenuLink asChild><Link to="/about" className="block p-3 rounded-md hover:bg-accent hover:text-accent-foreground"><div className="font-medium">Overview</div></Link></NavigationMenuLink></li>
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
                    <NavigationMenuTrigger className="bg-transparent hover:bg-primary/80 text-primary-foreground hover:text-accent text-sm">Our Schools</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[300px] gap-2 p-4 bg-background">
                        <li><NavigationMenuLink asChild><Link to="/schools/children" className="block p-3 rounded-md hover:bg-accent hover:text-accent-foreground"><div className="font-medium">Children School</div></Link></NavigationMenuLink></li>
                        <li><NavigationMenuLink asChild><Link to="/schools/primary" className="block p-3 rounded-md hover:bg-accent hover:text-accent-foreground"><div className="font-medium">Primary School</div></Link></NavigationMenuLink></li>
                        <li><NavigationMenuLink asChild><Link to="/schools/covenant" className="block p-3 rounded-md hover:bg-accent hover:text-accent-foreground"><div className="font-medium">Covenant College</div></Link></NavigationMenuLink></li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <Link to="/news" className="hover:text-accent transition-colors font-medium text-sm">News</Link>
              <Link to="/contact" className="hover:text-accent transition-colors font-medium text-sm">Contact</Link>
              
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-accent text-accent-foreground hover:bg-accent/90 text-sm">Portal Login</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[200px] gap-2 p-4 bg-background">
                        <li><NavigationMenuLink asChild><Link to="/portal/student" className="block p-3 rounded-md hover:bg-accent hover:text-accent-foreground">Student</Link></NavigationMenuLink></li>
                        <li><NavigationMenuLink asChild><Link to="/portal/teacher" className="block p-3 rounded-md hover:bg-accent hover:text-accent-foreground">Teacher</Link></NavigationMenuLink></li>
                        <li><NavigationMenuLink asChild><Link to="/portal/admin" className="block p-3 rounded-md hover:bg-accent hover:text-accent-foreground">Admin</Link></NavigationMenuLink></li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <button className="lg:hidden p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {isOpen && (
            <div className="lg:hidden absolute left-0 right-0 top-16 bg-primary border-t border-primary-foreground/20 shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="container mx-auto px-4 py-3 space-y-1">
                {/* Mobile Contact Info */}
                <div className="pb-3 mb-3 border-b border-primary-foreground/20">
                  <a href="tel:+234XXXXXXXXX" className="flex items-center gap-2 py-2 text-sm hover:text-accent">
                    <Phone className="w-4 h-4" />
                    <span>+234 XXX XXX XXXX</span>
                  </a>
                  <a href="mailto:info@salemschools.edu.ng" className="flex items-center gap-2 py-2 text-sm hover:text-accent">
                    <Mail className="w-4 h-4" />
                    <span>info@salemschools.edu.ng</span>
                  </a>
                </div>

                <Link to="/" className="block py-2.5 hover:text-accent border-b border-primary-foreground/10" onClick={() => setIsOpen(false)}>Home</Link>
                
                <div className="border-b border-primary-foreground/10">
                  <button 
                    onClick={() => setAboutOpen(!aboutOpen)}
                    className="w-full flex items-center justify-between py-2.5 font-medium"
                  >
                    About Us
                    <ChevronDown className={`w-4 h-4 transition-transform ${aboutOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {aboutOpen && (
                    <div className="pl-4 pb-2 space-y-1">
                      <Link to="/about" className="block py-2 text-sm hover:text-accent" onClick={() => setIsOpen(false)}>Overview</Link>
                      <Link to="/leadership" className="block py-2 text-sm hover:text-accent" onClick={() => setIsOpen(false)}>Leadership</Link>
                      <Link to="/vision-mission" className="block py-2 text-sm hover:text-accent" onClick={() => setIsOpen(false)}>Vision & Mission</Link>
                      <Link to="/library" className="block py-2 text-sm hover:text-accent" onClick={() => setIsOpen(false)}>Library</Link>
                      <Link to="/gallery" className="block py-2 text-sm hover:text-accent" onClick={() => setIsOpen(false)}>Gallery</Link>
                    </div>
                  )}
                </div>

                <div className="border-b border-primary-foreground/10">
                  <button 
                    onClick={() => setSchoolsOpen(!schoolsOpen)}
                    className="w-full flex items-center justify-between py-2.5 font-medium"
                  >
                    Our Schools
                    <ChevronDown className={`w-4 h-4 transition-transform ${schoolsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {schoolsOpen && (
                    <div className="pl-4 pb-2 space-y-1">
                      <Link to="/schools/children" className="block py-2 text-sm hover:text-accent" onClick={() => setIsOpen(false)}>Children School</Link>
                      <Link to="/schools/primary" className="block py-2 text-sm hover:text-accent" onClick={() => setIsOpen(false)}>Primary School</Link>
                      <Link to="/schools/covenant" className="block py-2 text-sm hover:text-accent" onClick={() => setIsOpen(false)}>Covenant College</Link>
                    </div>
                  )}
                </div>

                <Link to="/news" className="block py-2.5 hover:text-accent border-b border-primary-foreground/10" onClick={() => setIsOpen(false)}>News</Link>
                <Link to="/contact" className="block py-2.5 hover:text-accent border-b border-primary-foreground/10" onClick={() => setIsOpen(false)}>Contact</Link>
                
                <div className="border-b border-primary-foreground/10">
                  <button 
                    onClick={() => setPortalsOpen(!portalsOpen)}
                    className="w-full flex items-center justify-between py-2.5 font-medium"
                  >
                    Portals
                    <ChevronDown className={`w-4 h-4 transition-transform ${portalsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {portalsOpen && (
                    <div className="pl-4 pb-2 space-y-1">
                      <Link to="/portal/student" className="block py-2 text-sm hover:text-accent" onClick={() => setIsOpen(false)}>Student</Link>
                      <Link to="/portal/teacher" className="block py-2 text-sm hover:text-accent" onClick={() => setIsOpen(false)}>Teacher</Link>
                      <Link to="/portal/admin" className="block py-2 text-sm hover:text-accent" onClick={() => setIsOpen(false)}>Admin</Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
