import { Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Home from "./components/Section_home";
import Experience from "./components/Section_experience";
import Contact from "./components/Section_contact";
import ProjectDetail from "./components/ProjectDetail";
import About from "./components/Section_about";
import BurgerMenu from "./components/Menu";
import ScrollToAnchor from "./components/ScrollToAnchor"; 
import ToolsPage from "./components/Page_Tools";
import QRCodeGenerator from "./components/Tools/qr-codegenerator";
import ImageConverter from "./components/Tools/picture_format_converter";

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <div className="relative text-gray-900 scroll-smooth min-h-screen">
        <ScrollToAnchor /> 
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
          <Route path="/tools" element={<><ToolsPage/><BurgerMenu/></>} />
          <Route path="*" element={<div>404 - Page non trouvée</div>} />
          <Route path="/tools/qr_code_generator" element={<><QRCodeGenerator/><BurgerMenu/></>} />
          <Route path="/tools/picture_converter" element={<><ImageConverter/><BurgerMenu/></>} />
        </Routes>
      </div>
    </HelmetProvider>
  );
};

export default App;
