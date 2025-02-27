import { useState, createContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IconArrowLeft, IconBrandTabler, IconSettings, IconUserBolt } from "@tabler/icons-react";

const SidebarContext = createContext();

const SidebarComponent = () => {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Dashboard", href: "/", icon: <IconBrandTabler className="h-6 w-6" /> },
    { label: "Profile", href: "/user-profile", icon: <IconUserBolt className="h-6 w-6" /> },
    { label: "Settings", href: "/settings", icon: <IconSettings className="h-6 w-6" /> },
    { label: "Logout", href: "/logout", icon: <IconArrowLeft className="h-6 w-6" /> },
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
        {/* Sidebar Header */}
        <Link to="#" className="flex items-center space-x-3 text-lg font-bold text-black dark:text-white">
          <div className="h-8 w-8 bg-black dark:bg-white rounded" />
          {open && <motion.span animate={{ opacity: 1 }} className="whitespace-nowrap">Zenloop</motion.span>}
        </Link>

        {/* Sidebar Links */}
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

        {/* Footer Profile */}
        <div className="mt-auto">
          <Link to="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-700">
            <img src="https://assets.aceternity.com/manu.png" className="h-8 w-8 rounded-full" alt="Avatar" />
            {open && (
              <motion.span animate={{ opacity: 1 }} className="text-neutral-800 dark:text-neutral-200 whitespace-nowrap">
                Manu Arora
              </motion.span>
            )}
          </Link>
        </div>
      </motion.div>
    </SidebarContext.Provider>
  );
};

export default SidebarComponent;
