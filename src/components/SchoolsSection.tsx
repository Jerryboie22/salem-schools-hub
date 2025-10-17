import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import childrenSchoolImg from "@/assets/IMG-20251016-WA0010.jpg";
import primarySchoolImg from "@/assets/IMG-20251016-WA0008.jpg";
import covenantCollegeImg from "@/assets/IMG-20251016-WA0016.jpg";

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
    <section className="py-6 md:py-10 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3">Our Schools</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Quality education from early childhood to secondary school
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {schools.map((school, index) => (
            <Card 
              key={index} 
              className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
            >
              <div className="h-40 md:h-48 overflow-hidden">
                <img 
                  src={school.image} 
                  alt={school.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4 md:p-5 flex-1 flex flex-col">
                <h3 className="text-lg md:text-xl font-bold mb-2">{school.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground flex-1">{school.description}</p>
              </CardContent>
              <CardFooter className="p-4 md:p-5 pt-0">
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
