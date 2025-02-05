import { Button } from "@material-tailwind/react";

const Home: React.FC = () => {
    return (
        <section id="home" className="bg-gray-100 relative h-screen flex flex-col items-center justify-center px-4">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="border border-darkGreen opacity-20 rounded-full w-[70vw] h-[70vw] max-w-[650px] max-h-[650px] min-w-[300px] min-h-[300px]"></div>
            </div>

            <img 
                src="a-min.jpg" 
                alt="Profile" 
                className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-full border-4 border-gray-900 shadow-lg relative z-10"
            />
            <h1 className="mt-2 text-4xl sm:text-6xl font-bold text-center">Lasserre Joris</h1>
            <p className="mt-4 text-lg sm:text-2xl tracking-widest text-gray-500 text-center">DÉVELOPPEUR LOGICIEL</p>

            <div className="mt-6 flex flex-wrap gap-4 sm:gap-10 justify-center relative z-20">
                <a href="#experience"><Button placeholder="">Expérience</Button></a>
                <a href="#about"><Button placeholder="">À propos</Button></a>
                <a href="#contact"><Button placeholder="">Me contacter</Button></a>
            </div>
        </section>
    );
};

export default Home;
