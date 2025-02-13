import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Tool {
  id: string;
  titre: string;
  description_breve: string;
  lien: string;
  image: string[];
}

const ToolsPage: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    fetch("/Tools/tools.json")
      .then((response) => response.json())
      .then((data) => setTools(data))
      .catch((error) => console.error("Erreur lors du chargement des outils:", error));
  }, []);

  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="text-4xl font-bold">
        Mes Outils
      </h1>
      <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
        Découvrez mes différentes applications conçues pour faciliter divers aspects du développement et du design.
      </p>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12 px-4 md:px-16 py-6">
        {tools
          .sort((a, b) => parseInt(b.id) - parseInt(a.id))
          .map((tool) => (
            <Link
              to={tool.lien}
              key={tool.id}
              rel="noopener noreferrer"
              className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white flex flex-col h-full transform transition duration-300 hover:scale-95"
            >
              <img className="w-full h-64 object-cover" src={`${tool.image[0]}`} alt={tool.titre} />
              <div className="px-6 py-4 flex-grow">
                <h3 className="font-bold text-xl mb-2 text-gray-800">{tool.titre}</h3>
                <p className="text-gray-700 text-base">{tool.description_breve}</p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default ToolsPage;
