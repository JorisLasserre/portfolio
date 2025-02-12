import { Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Home from "./components/Section_home";
import Experience from "./components/Section_experience";
import Contact from "./components/Section_contact";
import ProjectDetail from "./components/ProjectDetail";
import About from "./components/Section_about";
import BurgerMenu from "./components/Menu";
import ScrollToAnchor from "./components/ScrollToAnchor"; 

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <div className="relative text-gray-900 scroll-smooth min-h-screen">
        <ScrollToAnchor /> {/* <-- Ajout ici */}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <BurgerMenu />
                <Home />
                <Experience />
                <About />
                <Contact />
              </>
            }
          />
          <Route path="/project/:id" element={<><ProjectDetail /> <BurgerMenu/></>} />
        </Routes>
      </div>
    </HelmetProvider>
  );
};

export default App;
