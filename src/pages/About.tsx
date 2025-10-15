import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import aboutHero from "@/assets/about-hero.jpg";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="relative h-[400px] overflow-hidden">
        <img src={aboutHero} alt="About Salem Schools" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-accent/70"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center text-primary-foreground">
            <h1 className="text-5xl font-bold mb-4">About Salem Group of Schools</h1>
            <p className="text-xl opacity-90">Excellence in Education Since 1999</p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h2>Our Vision</h2>
          <p>To be a leading educational institution that nurtures excellence, discipline, and godly character in every student.</p>
          <h2>Our Mission</h2>
          <p>Building a generation rooted in knowledge, discipline, and excellence through quality education and Christian values.</p>
          <h2>Our History</h2>
          <p>Founded over 25 years ago, Salem Group of Schools has grown from a small nursery school to a comprehensive educational institution serving over 3,000 students across three campuses.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
