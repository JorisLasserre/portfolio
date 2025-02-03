import { Routes, Route } from "react-router-dom";
import Home from "./components/Section_home";
import Experience from "./components/Section_experience";
import Contact from "./components/Section_contact";
import ProjectDetail from "./components/ProjectDetail";
import About from "./components/Section_about";
const App: React.FC = () => {
  return (
    <div className="relative text-gray-900 scroll-smooth min-h-screen">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
              <Experience />
              <About />
              <Contact />
            </>
          }
        />
        <Route path="/project/:id" element={<ProjectDetail />} />
      </Routes>
    </div>
  );
};

export default App;
