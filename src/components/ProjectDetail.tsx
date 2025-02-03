import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface Project {
  id: string;
  titre: string;
  description_breve: string;
  mots_cles: string[];
  date: string;
  equipe: number;
  informations: string;
  sansImage?: boolean;
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

      {!project.sansImage && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {project.images.map((image, index) => (
            <img
              key={index}
              src={`/${image}`}
              alt={project.titre}
              className="w-full h-64 object-cover rounded-lg shadow-md cursor-pointer"
              onClick={() => setSelectedImage(`/${image}`)}
            />
          ))}
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} alt="Agrandissement" className="max-w-3xl max-h-[80vh] rounded-lg shadow-lg" />
        </div>
      )}

      {/* Section fichiers */}
      {project.fichiers && project.fichiers.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-gray-900">Fichiers</h2>
          <ul className="mt-2 text-blue-600">
            {project.fichiers.map((fichier, index) => (
              <li key={index}>
                <a href={`/${fichier}`} download className="hover:underline">{fichier}</a>
              </li>
            ))}
          </ul>
          {project.fichiers[0].endsWith(".pdf") && (
            <div className="mt-4 w-full">
              <embed src={`/${project.fichiers[0]}`} type="application/pdf" className="w-full h-[600px]" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
