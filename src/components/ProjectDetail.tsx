import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface Project {
  id: string;
  titre: string;
  description_breve: string;
  mots_cles: string[];
  date: string;
  equipe: number;
  informations: string;
  images: string[];
  fichiers?: string[];
}



const ProjectDetail: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    fetch("/projects.json")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const project = projects.find((p) => p.id === id);

  if (loading) {
    return <div className="text-center text-blue-500 text-xl">Chargement...</div>;
  }

  if (!project) {
    return <div className="text-center text-red-500 text-xl">Projet non trouvé</div>;
  }

  return (
    
    <div className="p-6 max-w-4xl w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
     <Link
        to="/"
        className="fixed top-4 right-4 bg-[#101829] text-white p-3 rounded-full shadow-lg transition-transform transform hover:scale-105"
        aria-label="Accueil"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path d="M10.5 21.75v-6a1.5 1.5 0 011.5-1.5h.002a1.5 1.5 0 011.498 1.5v6a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75V13.5h1.5a.75.75 0 00.494-1.32l-9-8a.75.75 0 00-.988 0l-9 8A.75.75 0 003 13.5h1.5V21a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75z" />
        </svg>
      </Link>
      <h1 className="text-3xl font-bold text-gray-900">{project.titre}</h1>
      <p className="mt-4 text-gray-700 text-lg">{project.description_breve}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {project.mots_cles.map((mot, index) => (
          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
            #{mot}
          </span>
        ))}
      </div>
      <p className="mt-2 text-gray-600"><strong>Date :</strong> {project.date}</p>
      <p className="mt-1 text-gray-600"><strong>Équipe :</strong> {project.equipe} personne(s)</p>
      {project.informations.split("\n").map((paragraph, index) => (
        <p key={index} className="mt-2 text-gray-700">{paragraph}</p>
      ))}

      {(
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {project.images.map((image, index) => (
             <img
              key={index}
              src={`/${image}`}
              alt={project.titre}
              className="w-full h-64 object-contain rounded-lg  cursor-pointer"

              onClick={() => setSelectedImage(`/${image}`)}
            />
          ))}
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="absolute inset-0 bg-black opacity-75"></div>
          <img
            src={selectedImage}
            alt="Agrandissement"
            className="relative max-w-full max-h-[80vh] rounded-lg shadow-lg"
          />
        </div>
      )}

      {project.fichiers && project.fichiers.length > 0 && (
  <div className="mt-6">
    <h2 className="text-2xl font-bold text-gray-900">Fichiers / Liens</h2>
    <ul className="mt-2 text-blue-600">
      {project.fichiers.map((fichier, index) => {
        const isALink = fichier.includes("https") || fichier.includes("http");

        return (
          <li key={index}>
            {isALink ? (
              <a href={fichier} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {fichier}
              </a>
            ) : (
              <a href={`/${fichier}`} download className="hover:underline">{fichier}</a>
            )}
          </li>
        );
      })}
    </ul>

    {project.fichiers[0].endsWith(".pdf") && (
      <div className="mt-4 w-full">
        <embed src={`/${project.fichiers[0]}`} type="application/pdf" className="w-full h-[600px]" />
      </div>
    )}

    {project.fichiers.map((fichier, index) => {
      if (fichier.includes("youtube.com") || fichier.includes("youtu.be")) {
        const videoId = fichier.includes("youtube.com")
          ? new URL(fichier).searchParams.get("v")
          : fichier.split("/").pop();

        return (
          <div key={index} className="mt-4 w-full aspect-video">
            <iframe
              className="w-full h-full rounded-lg shadow-lg"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video"
              allowFullScreen
            />
          </div>
        );
      }
      return null;
    })}
  </div>
)}
    </div>
  );
};

export default ProjectDetail;
