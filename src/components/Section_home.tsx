import { useState, useEffect } from "react";
import { Button } from "@material-tailwind/react";
import { Helmet } from "react-helmet-async";

const messages = [
  "Développeur Full-stack 🖥️",
  "Étudiant en informatique🎓",
  "Cuisinier du Dimanche 🍳",
  "Course à pied 🏃‍♂️",
  "Lecteur assidu 📚",
];

const Home: React.FC = () => {
  
  const [variant] = useState(Math.random() < 0.5 ? "variantA" : "variantB");

  const [currentMessage, setCurrentMessage] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseBeforeDelete = 1500;

    const handleTyping = () => {
      const fullMessage = messages[messageIndex];

      if (!isDeleting) {
        setCurrentMessage(fullMessage.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);

        if (charIndex + 1 === fullMessage.length) {
          setTimeout(() => setIsDeleting(true), pauseBeforeDelete);
        }
      } else {
        setCurrentMessage(fullMessage.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);

        if (charIndex === 0) {
          setIsDeleting(false);
          setMessageIndex((prev) => (prev + 1) % messages.length);
        }
      }
    };

    const typingTimeout = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(typingTimeout);
  }, [charIndex, isDeleting, messageIndex]);

  return (
    <section
      id="home"
      className={`relative h-screen flex flex-col items-center justify-center px-4 bg-gray-100`}
    >
      <Helmet>
        <title>Lasserre Joris - Développeur Full-stack - Portfolio :desktop:</title>
        <meta
            name="description"
            content="Portfolio de Joris Lasserre, développeur Full-stack. Découvrez mes projets, mon expertise en développement et mes expériences professionnelles."
        />
        <meta name="keywords" content="Développeur Full-stack, Portfolio, Joris Lasserre, Développement web, React, Symfony, Java, C#, Bordeaux, Pays basque, développeur, ingénieur" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Lasserre Joris - Portfolio Développeur Full-stack :desktop:" />
        <meta
            property="og:description"
            content="Portfolio de Joris Lasserre, développeur Full-stack. Explorez mes projets, compétences et expériences professionnelles."
        />
        <meta property="og:image" content="logo_jl.webp" />
        <meta property="og:url" content="https://jorislasserre.netlify.app/" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:title" content="Lasserre Joris - Portfolio Développeur Full-stack :desktop:" />
        <meta
            name="twitter:description"
            content="Portfolio de Joris Lasserre, développeur Full-stack. Explorez mes projets et compétences en développement web."
        />
        <meta name="twitter:image" content="logo_jl.webp" />
        <meta name="twitter:card" content="summary_large_image" />

        <link rel="icon" href="jl.png" type="image/jpeg" />
        </Helmet>


      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="border border-darkGreen opacity-20 rounded-full w-[70vw] h-[70vw] max-w-[650px] max-h-[650px] min-w-[300px] min-h-[300px]"></div>
      </div>

      {variant === "variantA" ? (
        // 🔵 Version A
        <>
          <img
            src="a-min.webp"
            alt="Profile"
            className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-full border-4 bg-[#171717] shadow-lg relative z-10"
          />
          <h1 className="mt-2 text-4xl sm:text-6xl font-bold text-center text-gray-900">Lasserre Joris</h1>
          <p className="mt-4 text-lg sm:text-2xl tracking-widest text-gray-500 text-center h-10">
            {currentMessage}
            <span className="animate-blink">|</span>
          </p>
        </>
      ) : (
        // 🔴 Version B
        <>
          <img
            src="logo_jl.webp"
            alt="Profile"
            className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-full shadow-lg relative z-10"
          />
          <h1 className="mt-2 text-4xl sm:text-6xl font-bold text-center ">Joris Lasserre</h1>
          <p className="mt-4 text-lg sm:text-2xl tracking-widest text-center h-10">
            {currentMessage}
            <span className="animate-blink">|</span>
          </p>
        </>
      )}

      <div className="mt-6 flex flex-wrap gap-4 sm:gap-10 justify-center relative z-20">
        <a href="#experience"><Button placeholder="">Expérience</Button></a>
        <a href="#about"><Button placeholder="">À propos</Button></a>
        <a href="#contact"><Button placeholder="">Me contacter</Button></a>
      </div>
    </section>
  );
};

export default Home;
