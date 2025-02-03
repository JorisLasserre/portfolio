import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";

interface Project {
  id: string;
  titre: string;
  images: string[];
  mots_cles: string[];
  description_breve: string;
}

const Experience: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch("/projects.json")
      .then((res) => res.json())
      .then((data) => setProjects(data));
  }, []);

  const toggleShowProjects = () => {
    setShowAll((prev) => !prev);
  };

  return (
    <section
      id="experience"
      className={`flex flex-col items-center p-6 transition-all duration-500 ${showAll ? "h-auto" : "h-screen"}`}
    >
      <h2 className="text-4xl font-bold">Expérience</h2>
      <p className="mt-4 text-lg max-w-2xl text-center">
        Vous trouverez ici différents projets que j'ai réalisé
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {projects.slice(0, showAll ? projects.length : 6).map((project) => (
          <Card key={project.id} className="w-full max-w-[48rem] flex-row" placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
            <CardHeader
              shadow={false}
              floated={false}
              className="m-0 w-2/5 shrink-0 rounded-r-none"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              <img
                src={project.images[0]}
                alt={project.titre}
                className="h-full w-full object-cover"
              />
            </CardHeader>
            <CardBody placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
              <Typography variant="h4" color="blue-gray" className="mb-2" placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
                {project.titre}
              </Typography>
              <div className="mb-2 uppercase text-gray-500">
                {project.mots_cles.map((mot) => `#${mot}`).join(", ")}
              </div>
              <Typography color="gray" className="mb-8 font-normal" placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
                {project.description_breve}
              </Typography>
              <Link
                to={`/project/${project.id}`}
                className="mt-0.5 inline-flex items-center text-blue-500 hover:underline"
              >
                Voir plus
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-4 w-4 ml-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  />
                </svg>
              </Link>
            </CardBody>
          </Card>
        ))}
      </div>
      <button
        onClick={toggleShowProjects}
        className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-all"
      >
        {showAll ? "Afficher moins" : "Afficher Tout"}
      </button>
    </section>
  );
};

export default Experience;
