import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookOpen, Search, Users, Clock, Book, Laptop } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Library = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="gradient-hero py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">Salem Library</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            A world of knowledge at your fingertips
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Library Overview */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-lg text-muted-foreground leading-relaxed">
              The Salem Group of Schools Library is a state-of-the-art learning resource center designed to support academic excellence and foster a love for reading. With over 10,000 volumes spanning various subjects and genres, our library serves as a hub for research, study, and intellectual exploration.
            </p>
          </div>

          {/* Library Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Book className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3">Extensive Collection</h3>
                <p className="text-muted-foreground">
                  Over 10,000 books covering curriculum subjects, reference materials, fiction, and non-fiction for all age groups.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Laptop className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Digital Resources</h3>
                <p className="text-muted-foreground">
                  Access to online databases, e-books, and educational websites to support modern learning needs.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3">Research Support</h3>
                <p className="text-muted-foreground">
                  Professional librarians available to assist with research projects and information literacy.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Reading Spaces</h3>
                <p className="text-muted-foreground">
                  Comfortable seating areas designed for individual study and group collaboration.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3">Extended Hours</h3>
                <p className="text-muted-foreground">
                  Open during school hours and after-school for students who need extra study time.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Reading Programs</h3>
                <p className="text-muted-foreground">
                  Regular reading clubs, book fairs, and literacy programs to encourage reading culture.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Library Hours */}
          <Card className="border-t-4 border-t-accent">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-6">Library Hours</h2>
              <div className="space-y-3 text-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Monday - Friday:</span>
                  <span className="text-muted-foreground">7:30 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Saturday:</span>
                  <span className="text-muted-foreground">9:00 AM - 1:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Sunday:</span>
                  <span className="text-muted-foreground">Closed</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Library Rules */}
          <Card className="mt-8 bg-muted">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">Library Guidelines</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Maintain silence and respect for other library users</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Return borrowed books on or before the due date</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Handle all library materials with care</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>No food or drinks allowed in the library</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Mobile phones must be on silent mode</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Library;
