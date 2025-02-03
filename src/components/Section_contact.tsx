import { FaLinkedin, FaGithub } from "react-icons/fa";
import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

const Contact: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [message, setMessage] = useState("");

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.current) {
      emailjs
        .sendForm(
          "service_1xmu1gm", 
          "template_50ykfne",
          form.current,
          "gaboQ0B2_Fuaz6BBa" 
        )
        .then(
          () => {
            setMessage("Message envoyé avec succès !");
            form.current?.reset();
          },
          (error) => {
            setMessage("Une erreur s'est produite. Réessayez plus tard.");
            console.error(error);
          }
        );
    }
  };

  return (
    <div id="contact" className="min-h-screen w-full flex items-center justify-center bg-white font-[sans-serif] overflow-x-hidden">
      <div className="grid sm:grid-cols-2 items-start gap-8 p-4 mx-auto max-w-4xl">
        <div>
          <h1 className="text-gray-800 text-4xl font-extrabold">Besoin de plus d'informations ?</h1>
          <p className="text-base text-gray-500 mt-4">Si mon profil vous intéresse et que vous souhaitez que l'on travaille ensemble alors envoyez-moi un message.</p>

          <div className="mt-12">
            <h2 className="text-gray-800 text-lg font-bold">Email</h2>
            <ul className="mt-4">
              <li className="flex items-center">
                <div className="bg-[#e6e6e6cf] h-12 w-12 rounded-full flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill='#007bff' viewBox="0 0 479.058 479.058">
                    <path d="M434.146 59.882H44.912C20.146 59.882 0 80.028 0 104.794v269.47c0 24.766 20.146 44.912 44.912 44.912h389.234c24.766 0 44.912-20.146 44.912-44.912v-269.47c0-24.766-20.146-44.912-44.912-44.912zm0 29.941c2.034 0 3.969.422 5.738 1.159L239.529 264.631 39.173 90.982a14.902 14.902 0 0 1 5.738-1.159zm0 299.411H44.912c-8.26 0-14.971-6.71-14.971-14.971V122.615l199.778 173.141c2.822 2.441 6.316 3.655 9.81 3.655s6.988-1.213 9.81-3.655l199.778-173.141v251.649c-.001 8.26-6.711 14.97-14.971 14.97z" data-original="#000000" />
                  </svg>
                </div>
                <a href="mailto:jl.jorislasserre@gmail.com" className="text-[#007bff] text-base ml-4">
                  <small className="block">E-Mail</small>
                  <strong>jl.jorislasserre@gmail.com</strong>
                </a>
              </li>
            </ul>
          </div>

          <div className="mt-12">
            <h2 className="text-gray-800 text-lg font-bold">Socials</h2>
            <ul className="flex mt-4 space-x-4">
              <li className="bg-[#e6e6e6cf] h-12 w-12 rounded-full flex items-center justify-center shrink-0">
                <a href="https://github.com/JorisLasserre" target="_blank">
                  <FaGithub />
                </a>
              </li>
              <li className="bg-[#e6e6e6cf] h-12 w-12 rounded-full flex items-center justify-center shrink-0">
                <a href="https://www.linkedin.com/in/joris-lasserre-dev/" target="_blank">
                  <FaLinkedin />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <form ref={form} onSubmit={sendEmail} className="ml-auto space-y-6 w-full">
          <input type='text' name='user_name' placeholder='Nom' className="w-full rounded-md py-4 px-5 bg-gray-100 text-gray-800 text-base outline-blue-500 focus:bg-transparent" required />
          <input type='email' name='user_email' placeholder='E-mail' className="w-full rounded-md py-4 px-5 bg-gray-100 text-gray-800 text-base outline-blue-500 focus:bg-transparent" required />
          <input type='text' name='subject' placeholder='Sujet' className="w-full rounded-md py-4 px-5 bg-gray-100 text-gray-800 text-base outline-blue-500 focus:bg-transparent" required />
          <textarea name='message' placeholder='Message' rows={6} className="w-full rounded-md px-5 bg-gray-100 text-gray-800 text-base pt-4 outline-blue-500 focus:bg-transparent" required></textarea>
          <button type='submit' className="text-white bg-blue-500 hover:bg-blue-600 tracking-wide rounded-md text-base px-5 py-4 w-full !mt-6">Envoyer !</button>
          {message && <p className="text-center text-green-500 font-semibold">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default Contact;
