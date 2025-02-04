import { motion } from "framer-motion";

const technologies = [
  "Java", "C#", "Python", "React", "TypeScript", "Node.js", "Express", "MongoDB", "Bash", "CI/CD", "SQL", "Symfony", "HTML/CSS", "Tailwind", "Git", "Linux", "Android"
];

const About: React.FC = () => {
  return (
    <section id="about" className="min-h-screen flex items-center justify-center bg-gray-100 px-6 py-10">
      <div className="max-w-5xl w-full flex flex-col md:flex-row items-center gap-12">
        
        <motion.img 
          src="a-min.jpg" 
          alt="Moi" 
          className="w-72 h-72 sm:w-80 sm:h-80 object-cover shadow-lg mt-16 md:mt-0 rounded-t-4xl rounded-b-4xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        />

        <div className="text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">À propos de moi</h2>
          <p className="mt-4 text-base sm:text-lg text-gray-700 max-w-md">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt sapiente soluta debitis omnis culpa dolorem. Consequatur animi cumque, eum maxime aliquid accusantium iste suscipit voluptatem doloribus molestiae, ipsum, nulla tempore.
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
              <motion.span
                key={index}
                className="px-4 py-2 bg-gray-200 text-gray-900 text-sm font-semibold rounded-full shadow-md"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
