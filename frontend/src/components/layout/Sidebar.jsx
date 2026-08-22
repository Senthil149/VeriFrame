import {
  LayoutDashboard,
  Image,
  Newspaper,
  History,
  Shield,
  Settings,
  LogOut,
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";


function Sidebar() {

  const location =
    useLocation();

  const navigate =
    useNavigate();


  // ==========================================
  // SIDEBAR MENU
  // ==========================================

  const menu = [

    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },

    {
      name: "Analyze Image",
      icon: Image,
      path: "/upload",
    },

    // ========================================
    // FAKE NEWS
    // ========================================

    {
      name: "Fake News",
      icon: Newspaper,
      path: "/fake-news",
    },

    {
      name: "History",
      icon: History,
      path: "/history",
    },

    {
      name: "Threat Feed",
      icon: Shield,
      path: "/threat-feed",
    },

    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
    },

  ];


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    navigate("/");

  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <aside
      className="
        w-72
        bg-slate-900/70
        backdrop-blur-xl
        border-r
        border-slate-700
        flex
        flex-col
        shadow-2xl
      "
    >


      {/* ======================================
          LOGO
      ====================================== */}

      <div
        className="
          p-6
          border-b
          border-slate-800
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              w-11
              h-11
              rounded-xl
              bg-emerald-500
              flex
              items-center
              justify-center
              text-black
              font-bold
              text-xl
              shadow-lg
              shadow-emerald-500/30
            "
          >

            V

          </div>


          <div>

            <h1
              className="
                text-2xl
                font-bold
                text-white
              "
            >

              Veri
              <span className="text-emerald-400">
                Frame
              </span>

            </h1>


            <p
              className="
                text-xs
                text-gray-500
              "
            >

              AI Detection Platform

            </p>

          </div>

        </div>

      </div>



      {/* ======================================
          NAVIGATION
      ====================================== */}

      <nav
        className="
          flex-1
          p-4
          space-y-2
        "
      >

        {menu.map((item) => {

          const Icon =
            item.icon;


          return (

            <Link

              key={
                item.name
              }

              to={
                item.path
              }

              className={`
                flex
                items-center
                gap-4
                p-4
                rounded-xl
                transition-all
                duration-300

                ${
                  location.pathname ===
                  item.path

                    ? `
                      bg-emerald-500/15
                      border
                      border-emerald-500
                      text-white
                      shadow-lg
                      shadow-emerald-500/20
                    `

                    : `
                      text-gray-400
                      hover:bg-slate-800
                      hover:text-white
                      hover:translate-x-2
                    `
                }
              `}
            >

              <div
                className="
                  transition-transform
                  duration-300
                  hover:scale-110
                "
              >

                <Icon
                  size={20}
                />

              </div>


              <span>

                {item.name}

              </span>

            </Link>

          );

        })}

      </nav>



      {/* ======================================
          LOGOUT
      ====================================== */}

      <div
        className="
          p-4
          border-t
          border-slate-800
        "
      >

        <button

          onClick={
            handleLogout
          }

          className="
            w-full
            flex
            items-center
            gap-4
            p-4
            rounded-xl
            text-red-400
            hover:bg-red-500/10
            hover:text-red-300
            transition-all
          "
        >

          <LogOut
            size={20}
          />

          Logout

        </button>

      </div>

    </aside>

  );

}


export default Sidebar;