import { Button } from "@material-tailwind/react";


const Home: React.FC = () => {
    return (
        <section id="home" className="bg-[#f0e7e1] relative h-screen flex flex-col items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="border border-darkGreen opacity-20 h-[510px] w-[510px] md:h-[650px] md:w-[650px] rounded-full"></div>
            </div>

            

            <img 
                src="a-min.jpg" 
                alt="Profile" 
                className="w-40 h-40 object-cover rounded-full border-4 border-gray-900 shadow-lg relative z-10"
            />
            <h1 className="mt-2 text-6xl font-bold">Lasserre Joris</h1>
            <p className="mt-4 text-2xl tracking-widest text-gray-500">DÉVELOPPEUR LOGICIEL</p>
            

            <div className="mt-6 flex gap-10 relative z-20">
                
                <a href="#experience" ><Button  placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>Expérience</Button> </a>
                <a href="#about" ><Button placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>À propos</Button> </a>
                <a href="#contact" ><Button placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>Contact</Button> </a>
            </div>

            
        </section>
    );
};

export default Home;
