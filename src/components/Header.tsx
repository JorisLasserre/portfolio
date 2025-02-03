import { FaLinkedin, FaGithub } from "react-icons/fa";

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between p-4 bg-transparent">
      <div className="flex gap-4">
        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
          <FaLinkedin className="text-white text-2xl hover:text-gray-400" />
        </a>
        <a href="https://www.github.com" target="_blank" rel="noopener noreferrer">
          <FaGithub className="text-white text-2xl hover:text-gray-400" />
        </a>
      </div>
      <button className="px-4 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-black transition">
        Contact
      </button>
    </header>
  );
};

export default Header;
