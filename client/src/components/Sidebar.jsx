import { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { RxDashboard } from "react-icons/rx";
import { BsJournalCheck } from "react-icons/bs";
import { TbMessageChatbot } from "react-icons/tb";
import { MdLogout } from "react-icons/md";
import { FaRegCircleUser } from "react-icons/fa6";
import { LOGO } from "../utils/Constants";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { login } from "../utils/redux/userSlice";
import { Link, useNavigate } from "react-router-dom";

const SidebarComponent = () => {
  const [collapsed, setCollapsed] = useState(true);
  const username = useSelector((state) => state?.user?.currentUser?.username);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout=async()=>{
    try {
      await fetch(`${import.meta.env.VITE_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      dispatch(login(null));
      toast.success("Logout successful!");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  }

  return (
    <div className="h-[100vh] w-24 text-white" onMouseEnter={() => setCollapsed(false)} onMouseLeave={() => setCollapsed(true)}>
      <Sidebar collapsed={collapsed} backgroundColor="#101828" className="h-full transition-all duration-350 ease-in-out">
        <div className="flex items-center justify-between p-4 border-b border-white">
          {!collapsed && (
            <img src={LOGO} alt="Logo" className="transition-all duration-300 w-44" />
          )}

          {collapsed && (
            <img src="SmallLogo.png" alt="Logo" className="w-10 h-auto transition-all duration-300" />
          )}
        </div>

        <div className="flex flex-col justify-between h-[85%] mt-5">
          <Menu
            menuItemStyles={{
              button: ({ level, active, disabled }) => {
                if (level === 0) {
                  return {
                    color: '#fff',
                    backgroundColor: active ? '#374151' : 'transparent',
                    '&:hover': {
                      backgroundColor: '#374151',
                    },
                  };
                }
              },
            }}
          >
            <MenuItem icon={<BsJournalCheck className="text-2xl"/>} component={<Link to="/journal" />}>
              Journal
            </MenuItem>
            <MenuItem icon={<TbMessageChatbot className="text-2xl"/>} component={<Link to="/chatbot" />}>
              Chatbot
            </MenuItem>
            <MenuItem icon={<RxDashboard className="text-2xl"/>} component={<Link to="/dashboard" />}>
              Dashboard
            </MenuItem>
          </Menu>

          <Menu
            menuItemStyles={{
              button: ({ level }) => {
                if (level === 0) {
                  return {
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#374151',
                    },
                  };
                }
              },
            }}
          >
            <MenuItem icon={<FaRegCircleUser className="text-2xl"/>}>
              {`Hello ${username}`}
            </MenuItem>
            <MenuItem
              icon={<MdLogout className="text-2xl"/>}
              onClick={handleLogout}
              style={{
                color: '#fff',
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </div>
      </Sidebar>

    </div>
  
  );
};

export default SidebarComponent;
