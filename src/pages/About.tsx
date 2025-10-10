import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="gradient-hero py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">About Salem Group of Schools</h1>
          <p className="text-xl opacity-90">Excellence in Education Since 1999</p>
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
