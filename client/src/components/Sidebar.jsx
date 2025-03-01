import { useState, createContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IconLogout, IconHome, IconNotebook, IconMessageChatbot } from "@tabler/icons-react";
import { LOGO, SMALL_LOGO } from '../utils/Constants';

const SidebarContext = createContext();

const SidebarComponent = () => {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Dashboard", href: "/dashboard", icon: <IconHome className="h-6 w-6" /> },
    { label: "Journal", href: "/journal", icon: <IconNotebook className="h-6 w-6" /> },
    { label: "Chatbot", href: "/chatbot", icon: <IconMessageChatbot className="h-6 w-6" /> },
    { label: "Logout", href: "/login", icon: <IconLogout className="h-6 w-6" /> },
  ];

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      <motion.div
        className="fixed top-0 left-0 h-screen bg-gray-100 dark:bg-neutral-800 shadow-md flex flex-col p-4"
        animate={{ width: open ? 200 : 90 }}
        transition={{ duration: 0.3 }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <Link to="/dashboard" className="flex items-center space-x-3 text-lg font-bold text-black dark:text-white">
          <img 
            src={open ? LOGO : SMALL_LOGO} 
            alt="Zenloop Logo"
            
          />
        </Link>

        <div className="mt-8 flex flex-col space-y-3">
          {links.map((link, idx) => (
            <Link
              key={idx}
              to={link.href}
              className="flex items-center space-x-3 text-sm p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-700 transition-all"
            >
              <div className="h-6 w-6 flex items-center justify-center text-neutral-900 dark:text-white">
                {link.icon}
              </div>
              {open && (
                <motion.span animate={{ opacity: 1 }} className="text-neutral-800 dark:text-neutral-200 whitespace-nowrap">
                  {link.label}
                </motion.span>
              )}
            </Link>
          ))}
        </div>

        <div className="mt-auto">
          <Link to="/user-profile" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-700">
            <img src="https://assets.aceternity.com/manu.png" className="h-8 w-8 rounded-full" alt="Avatar" />
            {open && (
              <motion.span animate={{ opacity: 1 }} className="text-neutral-800 dark:text-neutral-200 whitespace-nowrap">
                User
              </motion.span>
            )}
          </Link>
        </div>
      </motion.div>
    </SidebarContext.Provider>
  );
};

export default SidebarComponent;
