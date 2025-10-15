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
    <section className="py-12 md:py-20 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">Our Schools</h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Quality education from early childhood to secondary school
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {schools.map((school, index) => (
            <Card 
              key={index} 
              className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
            >
              <div className="h-48 md:h-56 overflow-hidden">
                <img 
                  src={school.image} 
                  alt={school.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4 md:p-6 flex-1 flex flex-col">
                <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">{school.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground flex-1">{school.description}</p>
              </CardContent>
              <CardFooter className="p-4 md:p-6 pt-0">
                <Button variant="outline" className="w-full touch-target" asChild>
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
