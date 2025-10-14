import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import childrenSchoolImg from "@/assets/children-school.jpg";
import primarySchoolImg from "@/assets/primary-school.jpg";
import covenantCollegeImg from "@/assets/covenant-college.jpg";

const schools = [
  {
    title: "Salem Children School",
    description: "Early foundation and moral upbringing for your little ones. A nurturing environment where children develop essential life skills.",
    image: childrenSchoolImg,
    link: "/schools/children"
  },
  {
    title: "Salem Nursery & Primary School",
    description: "Academic growth and character development. Building strong foundations in literacy, numeracy, and social skills.",
    image: primarySchoolImg,
    link: "/schools/primary"
  },
  {
    title: "Salem Covenant College",
    description: "Secondary education with leadership and Christian values. Preparing students for higher education and life beyond.",
    image: covenantCollegeImg,
    link: "/schools/covenant"
  }
];

const SchoolsSection = () => {
  return (
    <section className="py-20 bg-soft-green">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Our Schools</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the perfect educational environment for your child at any stage of their development
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {schools.map((school, index) => (
            <Card 
              key={index} 
              className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="h-56 overflow-hidden">
                <img 
                  src={school.image} 
                  alt={school.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-3">{school.title}</h3>
                <p className="text-muted-foreground">{school.description}</p>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button variant="outline" className="w-full" asChild>
                  <Link to={school.link}>Learn More</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SchoolsSection;
