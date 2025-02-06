import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface Project {
  id: string;
  titre: string;
  images: string[];
  mots_cles: string[];
  description_breve: string;
  miniature: string;
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
      className={`flex flex-col items-center p-6 pb-16 transition-all duration-500 ${showAll ? "h-auto" : "min-h-[110vh]"}`}
    >
      <h2 className="text-4xl font-bold">Expérience</h2>
      <p className="mt-4 text-lg max-w-2xl text-center">
        Vous trouverez ici différents projets que j'ai réalisés
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12 px-4 md:px-16 py-6">
        {projects.slice(0, showAll ? projects.length : 6).map((project) => (
          <Link 
            to={`/project/${project.id}`} 
            key={project.id} 
            className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white flex flex-col h-full transform transition duration-300 hover:scale-95"
          >
            <img className="w-full h-64 object-cover" src={project.miniature} alt={project.titre} />
            <div className="px-6 py-4 flex-grow">
              <h3 className="font-bold text-xl mb-2">{project.titre}</h3>
              <p className="text-gray-700 text-base">
                {project.description_breve}
              </p>
            </div>
            <div className="px-6 pt-4 pb-2">
              {project.mots_cles.map((mot) => (
                <span key={mot} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  #{mot}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      <div className="w-full flex justify-center mt-6">
        <button
          onClick={toggleShowProjects}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          {showAll ? "Afficher moins" : "Afficher Tout"}
        </button>
      </div>
    </section>
  );
};

export default Experience;
