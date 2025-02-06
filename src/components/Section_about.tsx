

const technologies = [
  "Java", "C#", "Python", "React", "TypeScript", "Node.js", "Express", "MongoDB", "Bash", "CI/CD", "SQL", "Symfony", "HTML/CSS", "Tailwind", "Git", "Linux", "Android"
];

const About: React.FC = () => {
  return (
    <section id="about" className="min-h-screen flex items-center justify-center bg-gray-100 px-6 py-10">
      <div className="max-w-5xl w-full flex flex-col md:flex-row items-center gap-12">
        
        <img 
          src="a-min.jpg" 
          alt="Moi" 
          className="w-96 h-96 sm:w-128 sm:h-128 object-cover shadow-lg md:mr-8 rounded-t-4xl rounded-b-4xl" 
         
        />

        <div className="text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">À propos de moi</h2>
<p className="mt-4 text-base sm:text-lg text-gray-700 max-w">
  Je suis un développeur full-stack originaire des contrées verdoyantes et des plages du Pays Basque 🌶️. Après l'obtention de mon BUT Informatique, je souhaite poursuivre mes études pour allier mes compétences techniques à d'autres domaines tels que les relations humaines, l'intégration humain-système et la gestion de projet.
  Durant mon temps libre, j'adore cuisiner et découvrir de nouvelles recettes, j'apprécie courir pour me défouler, lire de la fantasy (💖 pour la série Les Salauds gentilhommes) ou encore faire du bowling entre amis. Ma formation m’a donné des bases solides, mais c’est mon dynamisme, mon enthousiasme et ma curiosité qui me poussent à toujours aller plus loin ! 🚀
</p>

          <a 
            href="/CV_Lasserre_Joris.pdf" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Afficher mon CV
          </a>

          <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
            {technologies.map((tech, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gray-200 text-gray-900 text-sm font-semibold rounded-full shadow-md"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
