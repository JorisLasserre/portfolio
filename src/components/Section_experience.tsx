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
    Vous trouverez ici différents projets que j'ai réalisé
  </p>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12 px-4 md:px-16 py-6">
  {projects.slice(0, showAll ? projects.length : 6).map((project) => (
    <div key={project.id} className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white flex flex-col h-full">
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
      <div className="px-6 py-4 mt-auto">
        <Link to={`/project/${project.id}`} className="inline-flex items-center text-blue-500 hover:underline">
          Voir plus
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            className="h-4 w-4 ml-1"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
          </svg>
        </Link>
      </div>
    </div>
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
