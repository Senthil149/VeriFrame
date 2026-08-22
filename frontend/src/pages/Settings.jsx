import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";

function Settings() {

  const navigate = useNavigate();

  // =====================================================
  // USER
  // =====================================================

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("user") || "{}"
      );
    } catch {
      return {};
    }
  });

  const [name, setName] = useState(
    user?.name || ""
  );

  const [email, setEmail] = useState(
    user?.email || ""
  );

  const [savingProfile, setSavingProfile] =
    useState(false);


  // =====================================================
  // TABS
  // =====================================================

  const [activeTab, setActiveTab] =
    useState("profile");


  // =====================================================
  // APPEARANCE
  // =====================================================

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  const [accentColor, setAccentColor] =
    useState(
      localStorage.getItem("accentColor") ||
        "emerald"
    );

  const [animations, setAnimations] =
    useState(
      localStorage.getItem("animations") !==
        "false"
    );

  const [compactMode, setCompactMode] =
    useState(
      localStorage.getItem("compactMode") ===
        "true"
    );


  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const [emailAlerts, setEmailAlerts] =
    useState(
      localStorage.getItem("emailAlerts") !==
        "false"
    );

  const [
    threatNotifications,
    setThreatNotifications,
  ] = useState(
    localStorage.getItem(
      "threatNotifications"
    ) !== "false"
  );

  const [weeklyReports, setWeeklyReports] =
    useState(
      localStorage.getItem("weeklyReports") ===
        "true"
    );


  // =====================================================
  // BROWSER NOTIFICATION PERMISSION
  // =====================================================

  const getNotificationPermission = () => {

    if (!("Notification" in window)) {
      return "unsupported";
    }

    return Notification.permission;

  };


  const [
    notificationPermission,
    setNotificationPermission,
  ] = useState(
    getNotificationPermission
  );


  const [
    browserNotifications,
    setBrowserNotifications,
  ] = useState(() => {

    if (!("Notification" in window)) {
      return false;
    }

    return (
      localStorage.getItem(
        "browserNotifications"
      ) === "true" &&
      Notification.permission ===
        "granted"
    );

  });


  // =====================================================
  // SECURITY
  // =====================================================

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    changingPassword,
    setChangingPassword,
  ] = useState(false);


  // =====================================================
  // ACCOUNT
  // =====================================================

  const [
    processingAccount,
    setProcessingAccount,
  ] = useState(false);


  // =====================================================
  // ACTIVE SESSION
  // =====================================================

  const [sessionInfo, setSessionInfo] =
    useState({
      browser: "Unknown browser",
      platform: "Unknown device",
      language: "Unknown",
      sessionStarted: "Current session",
    });


  // =====================================================
  // AUTH CHECK
  // =====================================================

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }


    const detectBrowser = () => {

      const ua =
        navigator.userAgent;

      if (ua.includes("Edg/"))
        return "Microsoft Edge";

      if (ua.includes("Chrome/"))
        return "Google Chrome";

      if (ua.includes("Firefox/"))
        return "Mozilla Firefox";

      if (
        ua.includes("Safari/") &&
        !ua.includes("Chrome/")
      ) {
        return "Safari";
      }

      return "Unknown browser";

    };


    const detectPlatform = () => {

      const ua =
        navigator.userAgent;

      if (/Windows/i.test(ua))
        return "Windows";

      if (/Macintosh|Mac OS X/i.test(ua))
        return "macOS";

      if (/Android/i.test(ua))
        return "Android";

      if (/iPhone|iPad|iPod/i.test(ua))
        return "iOS";

      if (/Linux/i.test(ua))
        return "Linux";

      return "Unknown device";

    };


    let sessionStarted =
      "Current session";


    try {

      const payload =
        JSON.parse(
          atob(
            token
              .split(".")[1]
              .replace(/-/g, "+")
              .replace(/_/g, "/")
          )
        );


      if (payload?.iat) {

        sessionStarted =
          new Date(
            payload.iat * 1000
          ).toLocaleString("en-IN");

      }

    } catch {
      // Keep fallback text.
    }


    setSessionInfo({

      browser:
        detectBrowser(),

      platform:
        detectPlatform(),

      language:
        navigator.language ||
        "Unknown",

      sessionStarted,

    });

  }, [navigate]);


  // =====================================================
  // UPDATE NOTIFICATION PERMISSION
  // =====================================================

  useEffect(() => {

    const updatePermission = () => {

      const permission =
        getNotificationPermission();

      setNotificationPermission(
        permission
      );


      if (
        permission !== "granted"
      ) {

        setBrowserNotifications(
          false
        );

      }

    };


    updatePermission();


    window.addEventListener(
      "focus",
      updatePermission
    );


    return () => {

      window.removeEventListener(
        "focus",
        updatePermission
      );

    };

  }, []);


  // =====================================================
  // APPLY APPEARANCE
  // =====================================================

  useEffect(() => {

    localStorage.setItem(
      "theme",
      theme
    );

    localStorage.setItem(
      "accentColor",
      accentColor
    );

    localStorage.setItem(
      "animations",
      String(animations)
    );

    localStorage.setItem(
      "compactMode",
      String(compactMode)
    );


    document.body.classList.remove(
      "dark-mode",
      "light-mode"
    );

    document.body.classList.add(
      theme === "light"
        ? "light-mode"
        : "dark-mode"
    );


    document.body.dataset.accent =
      accentColor;


    if (animations) {

      document.body.classList.remove(
        "disable-animations"
      );

    } else {

      document.body.classList.add(
        "disable-animations"
      );

    }


    if (compactMode) {

      document.body.classList.add(
        "compact-mode"
      );

    } else {

      document.body.classList.remove(
        "compact-mode"
      );

    }

  }, [
    theme,
    accentColor,
    animations,
    compactMode,
  ]);


  // =====================================================
  // PROFILE
  // =====================================================

  const handleSaveProfile =
    async () => {

      if (!name.trim()) {

        alert(
          "Please enter your name."
        );

        return;
      }


      if (!email.trim()) {

        alert(
          "Please enter your email."
        );

        return;
      }


      try {

        setSavingProfile(true);


        const token =
          localStorage.getItem(
            "token"
          );


        const response =
          await fetch(
            "http://localhost:5000/api/auth/profile",
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                name: name.trim(),
                email: email.trim(),
              }),
            }
          );


        const data =
          await response.json();


        if (!data.success) {

          alert(
            data.message ||
              "Failed to update profile."
          );

          return;
        }


        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );


        setUser(data.user);


        setName(
          data.user.name
        );


        setEmail(
          data.user.email
        );


        alert(
          "Profile updated successfully ✅"
        );

      } catch (error) {

        console.error(
          "❌ Profile Update Error:",
          error
        );


        alert(
          "Failed to update profile."
        );

      } finally {

        setSavingProfile(false);

      }

    };


  // =====================================================
  // CHANGE PASSWORD
  // =====================================================

  const handleChangePassword =
    async () => {

      if (
        !currentPassword ||
        !newPassword ||
        !confirmPassword
      ) {

        alert(
          "Please fill all password fields."
        );

        return;
      }


      if (newPassword.length < 6) {

        alert(
          "New password must be at least 6 characters."
        );

        return;
      }


      if (
        newPassword !==
        confirmPassword
      ) {

        alert(
          "New password and confirm password do not match."
        );

        return;
      }


      if (
        currentPassword ===
        newPassword
      ) {

        alert(
          "New password must be different from your current password."
        );

        return;
      }


      try {

        setChangingPassword(true);


        const token =
          localStorage.getItem(
            "token"
          );


        if (!token) {

          alert(
            "Your session has expired. Please login again."
          );

          navigate("/");

          return;
        }


        const response =
          await fetch(
            "http://localhost:5000/api/auth/password",
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                currentPassword,
                newPassword,
              }),
            }
          );


        const data =
          await response.json();


        if (!data.success) {

          alert(
            data.message ||
              "Failed to update password."
          );

          return;
        }


        alert(
          "Password updated successfully ✅"
        );


        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

      } catch (error) {

        console.error(
          "❌ Password Update Error:",
          error
        );


        alert(
          "Unable to connect to the server."
        );

      } finally {

        setChangingPassword(false);

      }

    };


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    const confirmed =
      window.confirm(
        "Are you sure you want to logout?"
      );


    if (!confirmed)
      return;


    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );


    navigate("/");

  };


  // =====================================================
  // BROWSER NOTIFICATIONS
  // =====================================================

  const handleBrowserNotification =
    async (checked) => {


      // ==========================================
      // DISABLE
      // ==========================================

      if (!checked) {

        setBrowserNotifications(
          false
        );


        localStorage.setItem(
          "browserNotifications",
          "false"
        );


        return;
      }


      // ==========================================
      // BROWSER SUPPORT CHECK
      // ==========================================

      if (
        !("Notification" in window)
      ) {

        alert(
          "This browser does not support notifications."
        );


        setBrowserNotifications(
          false
        );


        setNotificationPermission(
          "unsupported"
        );


        return;
      }


      // ==========================================
      // ALREADY GRANTED
      // ==========================================

      if (
        Notification.permission ===
        "granted"
      ) {

        setBrowserNotifications(
          true
        );


        setNotificationPermission(
          "granted"
        );


        localStorage.setItem(
          "browserNotifications",
          "true"
        );


        return;
      }


      // ==========================================
      // ALREADY BLOCKED
      // ==========================================

      if (
        Notification.permission ===
        "denied"
      ) {

        alert(
          "Browser notifications are blocked for VeriFrame. Please allow notifications for localhost:5173 in your browser site settings."
        );


        setBrowserNotifications(
          false
        );


        setNotificationPermission(
          "denied"
        );


        localStorage.setItem(
          "browserNotifications",
          "false"
        );


        return;
      }


      // ==========================================
      // REQUEST PERMISSION
      // ==========================================

      try {

        const permission =
          await Notification.requestPermission();


        setNotificationPermission(
          permission
        );


        if (
          permission !==
          "granted"
        ) {

          setBrowserNotifications(
            false
          );


          localStorage.setItem(
            "browserNotifications",
            "false"
          );


          alert(
            "Browser notification permission was not granted. Please select Allow in the browser permission popup."
          );


          return;
        }


        // ==========================================
        // SUCCESS
        // ==========================================

        setBrowserNotifications(
          true
        );


        localStorage.setItem(
          "browserNotifications",
          "true"
        );


        new Notification(
          "VeriFrame",
          {
            body:
              "Browser notifications are now enabled ✅",
          }
        );

      } catch (error) {

        console.error(
          "❌ Notification Permission Error:",
          error
        );


        setBrowserNotifications(
          false
        );


        localStorage.setItem(
          "browserNotifications",
          "false"
        );


        alert(
          "Unable to enable browser notifications."
        );

      }

    };


  // =====================================================
  // TEST BROWSER NOTIFICATION
  // =====================================================

  const handleTestNotification =
    async () => {


      // ==========================================
      // SUPPORT CHECK
      // ==========================================

      if (
        !("Notification" in window)
      ) {

        alert(
          "This browser does not support notifications."
        );

        return;
      }


      // ==========================================
      // DENIED
      // ==========================================

      if (
        Notification.permission ===
        "denied"
      ) {

        alert(
          "Notifications are blocked for localhost:5173. Please allow notifications in your browser site settings."
        );


        setBrowserNotifications(
          false
        );


        setNotificationPermission(
          "denied"
        );


        return;
      }


      // ==========================================
      // REQUEST IF NOT GRANTED
      // ==========================================

      if (
        Notification.permission !==
        "granted"
      ) {

        const permission =
          await Notification.requestPermission();


        setNotificationPermission(
          permission
        );


        if (
          permission !==
          "granted"
        ) {

          setBrowserNotifications(
            false
          );


          alert(
            "Please allow browser notifications first."
          );


          return;
        }

      }


      // ==========================================
      // ENABLE LOCAL STATE
      // ==========================================

      setBrowserNotifications(
        true
      );


      localStorage.setItem(
        "browserNotifications",
        "true"
      );


      // ==========================================
      // SEND TEST NOTIFICATION
      // ==========================================

      new Notification(
        "VeriFrame Test Notification",
        {
          body:
            "Notifications are working correctly ✅",
        }
      );

    };


  // =====================================================
  // RESET NOTIFICATIONS
  // =====================================================

  const handleResetNotifications =
    () => {

      const confirmed =
        window.confirm(
          "Reset all notification preferences to their default values?"
        );


      if (!confirmed)
        return;


      const browserAllowed =
        "Notification" in window &&
        Notification.permission ===
          "granted";


      const defaults = {

        emailAlerts: true,

        threatNotifications:
          true,

        weeklyReports:
          false,

        browserNotifications:
          browserAllowed,

      };


      setEmailAlerts(
        defaults.emailAlerts
      );


      setThreatNotifications(
        defaults.threatNotifications
      );


      setWeeklyReports(
        defaults.weeklyReports
      );


      setBrowserNotifications(
        defaults.browserNotifications
      );


      Object.entries(
        defaults
      ).forEach(
        ([key, value]) => {

          localStorage.setItem(
            key,
            String(value)
          );

        }
      );


      alert(
        "Notification preferences reset successfully ✅"
      );

    };


  // =====================================================
  // SAVE NOTIFICATIONS
  // =====================================================

  const handleSaveNotifications =
    () => {

      localStorage.setItem(
        "emailAlerts",
        String(emailAlerts)
      );


      localStorage.setItem(
        "threatNotifications",
        String(
          threatNotifications
        )
      );


      localStorage.setItem(
        "weeklyReports",
        String(weeklyReports)
      );


      const browserAllowed =
        "Notification" in window &&
        Notification.permission ===
          "granted";


      const browserEnabled =
        browserNotifications &&
        browserAllowed;


      localStorage.setItem(
        "browserNotifications",
        String(
          browserEnabled
        )
      );


      setBrowserNotifications(
        browserEnabled
      );


      alert(
        "Notification preferences saved successfully ✅"
      );

    };


  // =====================================================
  // SAVE APPEARANCE
  // =====================================================

  const handleSaveAppearance =
    () => {

      localStorage.setItem(
        "theme",
        theme
      );


      localStorage.setItem(
        "accentColor",
        accentColor
      );


      localStorage.setItem(
        "animations",
        String(animations)
      );


      localStorage.setItem(
        "compactMode",
        String(compactMode)
      );


      alert(
        "Appearance settings saved successfully ✅"
      );

    };


  // =====================================================
  // CLEAR CLIENT SESSION
  // =====================================================

  const clearClientSession = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

  };


  // =====================================================
  // EXPORT DATA
  // =====================================================

  const handleExportData =
    async () => {

      try {

        setProcessingAccount(
          true
        );


        const token =
          localStorage.getItem(
            "token"
          );


        const response =
          await fetch(
            "http://localhost:5000/api/auth/export",
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        const data =
          await response.json();


        if (!data.success) {

          alert(
            data.message ||
              "Failed to export data."
          );

          return;
        }


        const blob =
          new Blob(
            [
              JSON.stringify(
                data.data,
                null,
                2
              ),
            ],
            {
              type:
                "application/json",
            }
          );


        const url =
          window.URL.createObjectURL(
            blob
          );


        const link =
          document.createElement(
            "a"
          );


        link.href = url;


        link.download =
          "veriframe-account-data.json";


        document.body.appendChild(
          link
        );


        link.click();


        link.remove();


        window.URL.revokeObjectURL(
          url
        );


        alert(
          "Your data has been exported successfully ✅"
        );

      } catch (error) {

        console.error(
          "❌ Export Error:",
          error
        );


        alert(
          "Unable to export your data."
        );

      } finally {

        setProcessingAccount(
          false
        );

      }

    };


  // =====================================================
  // DEACTIVATE ACCOUNT
  // =====================================================

  const handleDeactivateAccount =
    async () => {

      const confirmed =
        window.confirm(
          "Are you sure you want to deactivate your account?"
        );


      if (!confirmed)
        return;


      try {

        setProcessingAccount(
          true
        );


        const token =
          localStorage.getItem(
            "token"
          );


        const response =
          await fetch(
            "http://localhost:5000/api/auth/deactivate",
            {
              method: "PUT",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        const data =
          await response.json();


        if (!data.success) {

          alert(
            data.message ||
              "Failed to deactivate account."
          );

          return;
        }


        alert(
          "Account deactivated successfully."
        );


        clearClientSession();


        navigate("/");

      } catch (error) {

        console.error(
          "❌ Deactivate Error:",
          error
        );


        alert(
          "Unable to deactivate account."
        );

      } finally {

        setProcessingAccount(
          false
        );

      }

    };


  // =====================================================
  // DELETE ACCOUNT
  // =====================================================

  const handleDeleteAccount =
    async () => {

      const firstConfirm =
        window.confirm(
          "WARNING: This will permanently delete your account. Continue?"
        );


      if (!firstConfirm)
        return;


      const typedConfirmation =
        window.prompt(
          'This action cannot be undone. Type "DELETE" to permanently delete your account.'
        );


      if (
        typedConfirmation !==
        "DELETE"
      ) {

        alert(
          "Account deletion cancelled."
        );

        return;
      }


      try {

        setProcessingAccount(
          true
        );


        const token =
          localStorage.getItem(
            "token"
          );


        const response =
          await fetch(
            "http://localhost:5000/api/auth/account",
            {
              method: "DELETE",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        const data =
          await response.json();


        if (!data.success) {

          alert(
            data.message ||
              "Failed to delete account."
          );

          return;
        }


        alert(
          "Your VeriFrame account has been permanently deleted."
        );


        clearClientSession();


        navigate("/");

      } catch (error) {

        console.error(
          "❌ Delete Account Error:",
          error
        );


        alert(
          "Unable to delete account."
        );

      } finally {

        setProcessingAccount(
          false
        );

      }

    };


  // =====================================================
  // PROFILE INITIALS
  // =====================================================

  const getInitials = () => {

    if (!user?.name) {
      return "U";
    }


    return user.name
      .split(" ")
      .map(
        (word) =>
          word.charAt(0)
      )
      .join("")
      .substring(0, 2)
      .toUpperCase();

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <DashboardLayout>

      <main className="flex-1 p-10">

        <h1 className="text-4xl font-bold text-white mb-8">
          Settings
        </h1>


        <div className="grid grid-cols-4 gap-8">


          {/* =====================================================
              MENU
          ===================================================== */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 h-fit">

            {[
              ["profile", "👤 Profile"],
              ["security", "🔐 Security"],
              [
                "notifications",
                "🔔 Notifications",
              ],
              ["ai", "🤖 AI Modules"],
              [
                "appearance",
                "🎨 Appearance",
              ],
              [
                "sessions",
                "📱 Active Sessions",
              ],
              [
                "danger",
                "⚠ Danger Zone",
              ],
            ].map(
              ([tab, label]) => (

                <button
                  key={tab}
                  onClick={() =>
                    setActiveTab(
                      tab
                    )
                  }
                  className={`w-full text-left px-4 py-3 rounded-xl mb-3 transition-all duration-300 ${
                    activeTab === tab
                      ? tab ===
                        "danger"
                        ? "bg-red-500 text-white"
                        : "bg-emerald-500 text-white"
                      : tab ===
                        "danger"
                      ? "hover:bg-red-500/20 text-red-400"
                      : "hover:bg-slate-800 text-gray-300"
                  }`}
                >
                  {label}
                </button>

              )
            )}

          </div>


          {/* =====================================================
              CONTENT
          ===================================================== */}

          <div className="col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-8">


            {/* =====================================================
                PROFILE
            ===================================================== */}

            {activeTab ===
              "profile" && (

              <>

                <h2 className="text-3xl font-bold text-white">
                  👤 Profile
                </h2>

                <p className="text-gray-400 mt-2 mb-8">
                  Manage your personal information.
                </p>


                <div className="flex items-center gap-6 mb-8">

                  <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">

                    <span className="text-3xl font-bold text-emerald-400">
                      {getInitials()}
                    </span>

                  </div>


                  <div>

                    <h3 className="text-white text-xl font-semibold">
                      Profile Photo
                    </h3>

                    <p className="text-gray-400 text-sm mt-2">
                      Profile photo upload can be added later.
                    </p>

                  </div>

                </div>


                <div className="grid grid-cols-2 gap-6">

                  <div>

                    <label className="block text-gray-400 mb-2">
                      Full Name
                    </label>


                    <input
                      value={name}
                      onChange={(e) =>
                        setName(
                          e.target.value
                        )
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500"
                    />

                  </div>


                  <div>

                    <label className="block text-gray-400 mb-2">
                      Email
                    </label>


                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(
                          e.target.value
                        )
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500"
                    />

                  </div>

                </div>


                <div className="mt-8 flex gap-4">

                  <button
                    onClick={
                      handleSaveProfile
                    }
                    disabled={
                      savingProfile
                    }
                    className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 px-5 py-3 rounded-lg text-white font-semibold"
                  >
                    {savingProfile
                      ? "Saving..."
                      : "Save Changes"}
                  </button>


                  <button
                    onClick={
                      handleLogout
                    }
                    className="border border-slate-700 hover:border-red-500 hover:text-red-400 px-5 py-3 rounded-lg text-gray-300"
                  >
                    Logout
                  </button>

                </div>

              </>

            )}


            {/* =====================================================
                SECURITY
            ===================================================== */}

            {activeTab ===
              "security" && (

              <>

                <h2 className="text-3xl font-bold text-white">
                  🔐 Security
                </h2>

                <p className="text-gray-400 mt-2 mb-8">
                  Change your password and secure your account.
                </p>


                <div className="space-y-6">

                  <input
                    type="password"
                    value={
                      currentPassword
                    }
                    onChange={(e) =>
                      setCurrentPassword(
                        e.target.value
                      )
                    }
                    placeholder="Current Password"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500"
                  />


                  <input
                    type="password"
                    value={
                      newPassword
                    }
                    onChange={(e) =>
                      setNewPassword(
                        e.target.value
                      )
                    }
                    placeholder="New Password"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500"
                  />


                  <input
                    type="password"
                    value={
                      confirmPassword
                    }
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    placeholder="Confirm Password"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500"
                  />


                  <div className="bg-slate-950 border border-slate-700 rounded-xl p-5">

                    <div className="flex justify-between">

                      <span className="text-white">
                        Password Strength
                      </span>


                      <span className="text-emerald-400">

                        {newPassword.length >=
                        8
                          ? "Strong"
                          : newPassword.length >=
                            6
                          ? "Medium"
                          : "Weak"}

                      </span>

                    </div>

                  </div>


                  <button
                    onClick={
                      handleChangePassword
                    }
                    disabled={
                      changingPassword
                    }
                    className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 px-6 py-3 rounded-xl text-white font-semibold"
                  >
                    {changingPassword
                      ? "Updating..."
                      : "🔒 Update Password"}
                  </button>

                </div>

              </>

            )}


            {/* =====================================================
                NOTIFICATIONS
            ===================================================== */}

            {activeTab ===
              "notifications" && (

              <>

                <h2 className="text-3xl font-bold text-white">
                  🔔 Notifications
                </h2>


                <p className="text-gray-400 mt-2 mb-8">
                  Control how VeriFrame notifies you.
                </p>


                <div className="space-y-5">


                  {[
                    [
                      "Email Alerts",
                      "Receive email updates about your image analyses.",
                      emailAlerts,
                      setEmailAlerts,
                    ],

                    [
                      "Threat Notifications",
                      "Receive alerts when high-risk deepfakes are detected.",
                      threatNotifications,
                      setThreatNotifications,
                    ],

                    [
                      "Weekly Reports",
                      "Receive a weekly analysis summary.",
                      weeklyReports,
                      setWeeklyReports,
                    ],
                  ].map(
                    ([
                      title,
                      description,
                      value,
                      setter,
                    ]) => (

                      <div
                        key={title}
                        className="flex justify-between items-center bg-slate-950 border border-slate-700 rounded-xl p-5"
                      >

                        <div>

                          <h3 className="text-white font-semibold">
                            {title}
                          </h3>


                          <p className="text-gray-400 text-sm mt-1">
                            {description}
                          </p>

                        </div>


                        <input
                          type="checkbox"
                          checked={
                            value
                          }
                          onChange={(e) =>
                            setter(
                              e.target.checked
                            )
                          }
                          className="w-5 h-5 accent-emerald-500"
                        />

                      </div>

                    )
                  )}


                  {/* =====================================================
                      BROWSER NOTIFICATIONS
                  ===================================================== */}

                  <div className="flex justify-between items-center bg-slate-950 border border-slate-700 rounded-xl p-5">

                    <div>

                      <h3 className="text-white font-semibold">
                        Browser Notifications
                      </h3>


                      <p className="text-gray-400 text-sm mt-1">
                        Receive notifications directly from your browser.
                      </p>


                      <p className="text-xs text-gray-500 mt-2">

                        Permission:{" "}

                        {notificationPermission ===
                        "unsupported"
                          ? "Not supported"
                          : notificationPermission}

                      </p>


                      {/* STATUS MESSAGE */}

                      {notificationPermission ===
                        "granted" && (

                        <p className="text-xs text-emerald-400 mt-1">
                          ✓ Browser permission granted
                        </p>

                      )}


                      {notificationPermission ===
                        "denied" && (

                        <p className="text-xs text-red-400 mt-1">
                          ✕ Notifications blocked. Allow them in browser site settings.
                        </p>

                      )}


                      {notificationPermission ===
                        "default" && (

                        <p className="text-xs text-yellow-400 mt-1">
                          ⚠ Permission not requested yet.
                        </p>

                      )}

                    </div>


                    <input
                      type="checkbox"
                      checked={
                        browserNotifications &&
                        notificationPermission ===
                          "granted"
                      }
                      onChange={(e) =>
                        handleBrowserNotification(
                          e.target.checked
                        )
                      }
                      disabled={
                        notificationPermission ===
                        "unsupported"
                      }
                      className="w-5 h-5 accent-emerald-500"
                    />

                  </div>


                  {/* =====================================================
                      BUTTONS
                  ===================================================== */}

                  <div className="flex flex-wrap gap-3 pt-2">

                    <button
                      onClick={
                        handleSaveNotifications
                      }
                      className="bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-xl text-white font-semibold transition"
                    >
                      Save Notification Preferences
                    </button>


                    <button
                      onClick={
                        handleTestNotification
                      }
                      className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-6 py-3 rounded-xl text-white font-semibold transition"
                    >
                      🔔 Test Notification
                    </button>


                    <button
                      onClick={
                        handleResetNotifications
                      }
                      className="border border-slate-700 hover:border-red-500 hover:text-red-400 px-6 py-3 rounded-xl text-gray-300 font-semibold transition"
                    >
                      Reset
                    </button>

                  </div>

                </div>

              </>

            )}


            {/* =====================================================
                AI MODULES
            ===================================================== */}

            {activeTab === "ai" && (

              <>

                <h2 className="text-3xl font-bold text-white">
                  🤖 AI Modules
                </h2>


                <p className="text-gray-400 mt-2 mb-8">
                  Current VeriFrame detection modules.
                </p>


                <div className="space-y-5">


                  {/* CNN */}

                  <div className="bg-slate-950 border border-emerald-500 rounded-xl p-5">

                    <div className="flex justify-between">

                      <div>

                        <h3 className="text-white font-semibold">
                          🧠 CNN Deepfake Detection
                        </h3>


                        <p className="text-gray-400 mt-2">
                          TensorFlow MobileNetV2 image detection.
                        </p>

                      </div>


                      <span className="h-fit bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full">
                        Active
                      </span>

                    </div>

                  </div>


                  {/* SEMANTIC */}

                  <div className="bg-slate-950 border border-emerald-500 rounded-xl p-5">

                    <div className="flex justify-between">

                      <div>

                        <h3 className="text-white font-semibold">
                          🔍 Semantic Similarity
                        </h3>


                        <p className="text-gray-400 mt-2">
                          AI-powered semantic image content analysis.
                        </p>

                      </div>


                      <span className="h-fit bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full">
                        Active
                      </span>

                    </div>

                  </div>


                  {/* BLOCKCHAIN */}

                  <div className="bg-slate-950 border border-emerald-500 rounded-xl p-5">

                    <div className="flex justify-between">

                      <div>

                        <h3 className="text-white font-semibold">
                          🔗 Blockchain Verification
                        </h3>


                        <p className="text-gray-400 mt-2">
                          Digital image authenticity and SHA-256 hash verification.
                        </p>

                      </div>


                      <span className="h-fit bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full">
                        Active
                      </span>

                    </div>

                  </div>


                  {/* OCR */}

                  <div className="flex justify-between bg-slate-950 border border-slate-700 rounded-xl p-5">

                    <div>

                      <h3 className="text-white font-semibold">
                        📄 OCR Forgery Detection
                      </h3>


                      <p className="text-gray-400 mt-2">
                        Edited text detection.
                      </p>

                    </div>


                    <span className="h-fit bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full">
                      Coming Soon
                    </span>

                  </div>


                  {/* VOICE */}

                  <div className="flex justify-between bg-slate-950 border border-slate-700 rounded-xl p-5">

                    <div>

                      <h3 className="text-white font-semibold">
                        🎤 Voice Deepfake Detection
                      </h3>


                      <p className="text-gray-400 mt-2">
                        AI-generated voice detection.
                      </p>

                    </div>


                    <span className="h-fit bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full">
                      Coming Soon
                    </span>

                  </div>


                </div>

              </>

            )}


            {/* =====================================================
                APPEARANCE
            ===================================================== */}

            {activeTab ===
              "appearance" && (

              <>

                <h2 className="text-3xl font-bold text-white">
                  🎨 Appearance
                </h2>


                <p className="text-gray-400 mt-2 mb-8">
                  Customize your VeriFrame experience.
                </p>


                <div className="space-y-6">


                  {/* THEME */}

                  <div className="flex justify-between items-center bg-slate-950 border border-slate-700 rounded-xl p-5">

                    <div>

                      <h3 className="text-white font-semibold">
                        🌙 Theme
                      </h3>


                      <p className="text-gray-400 text-sm mt-1">
                        Change the application theme.
                      </p>

                    </div>


                    <select
                      value={theme}
                      onChange={(e) =>
                        setTheme(
                          e.target.value
                        )
                      }
                      className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
                    >

                      <option value="dark">
                        Dark
                      </option>


                      <option value="light">
                        Light
                      </option>

                    </select>

                  </div>


                  {/* ACCENT */}

                  <div className="bg-slate-950 border border-slate-700 rounded-xl p-5">

                    <h3 className="text-white font-semibold">
                      🎯 Accent Color
                    </h3>


                    <p className="text-gray-400 text-sm mt-1 mb-5">
                      Choose the accent used by your interface.
                    </p>


                    <div className="flex gap-5">

                      {[
                        [
                          "emerald",
                          "bg-emerald-500",
                        ],

                        [
                          "cyan",
                          "bg-cyan-500",
                        ],

                        [
                          "purple",
                          "bg-purple-500",
                        ],

                        [
                          "blue",
                          "bg-blue-500",
                        ],
                      ].map(
                        ([
                          color,
                          bg,
                        ]) => (

                          <button
                            key={color}
                            onClick={() =>
                              setAccentColor(
                                color
                              )
                            }
                            className={`w-10 h-10 rounded-full ${bg} border-4 ${
                              accentColor ===
                              color
                                ? "border-white scale-125"
                                : "border-transparent"
                            } transition-all duration-300`}
                            title={color}
                          />

                        )
                      )}

                    </div>

                  </div>


                  {/* ANIMATIONS */}

                  <div className="flex justify-between items-center bg-slate-950 border border-slate-700 rounded-xl p-5">

                    <div>

                      <h3 className="text-white font-semibold">
                        ✨ Animations
                      </h3>


                      <p className="text-gray-400 text-sm mt-1">
                        Enable interface animations.
                      </p>

                    </div>


                    <input
                      type="checkbox"
                      checked={
                        animations
                      }
                      onChange={(e) =>
                        setAnimations(
                          e.target.checked
                        )
                      }
                      className="w-5 h-5 accent-emerald-500"
                    />

                  </div>


                  {/* COMPACT */}

                  <div className="flex justify-between items-center bg-slate-950 border border-slate-700 rounded-xl p-5">

                    <div>

                      <h3 className="text-white font-semibold">
                        📦 Compact Layout
                      </h3>


                      <p className="text-gray-400 text-sm mt-1">
                        Reduce spacing throughout the interface.
                      </p>

                    </div>


                    <input
                      type="checkbox"
                      checked={
                        compactMode
                      }
                      onChange={(e) =>
                        setCompactMode(
                          e.target.checked
                        )
                      }
                      className="w-5 h-5 accent-emerald-500"
                    />

                  </div>


                  <button
                    onClick={
                      handleSaveAppearance
                    }
                    className="bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-xl text-white font-semibold"
                  >
                    Save Appearance
                  </button>

                </div>

              </>

            )}


            {/* =====================================================
                SESSIONS
            ===================================================== */}

            {activeTab ===
              "sessions" && (

              <>

                <h2 className="text-3xl font-bold text-white">
                  📱 Active Sessions
                </h2>


                <p className="text-gray-400 mt-2 mb-8">
                  View and manage the device currently signed in to your VeriFrame account.
                </p>


                <div className="bg-slate-950 border border-emerald-500/70 rounded-2xl p-6">

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                    <div className="flex items-start gap-4">

                      <div className="w-14 h-14 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-2xl flex-shrink-0">
                        💻
                      </div>


                      <div>

                        <div className="flex flex-wrap items-center gap-3">

                          <h3 className="text-xl font-semibold text-white">
                            {sessionInfo.browser}
                          </h3>


                          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
                            ● Active now
                          </span>

                        </div>


                        <p className="text-gray-400 mt-2">
                          {sessionInfo.platform}
                        </p>


                        <p className="text-gray-500 text-sm mt-1 break-all">
                          {navigator.userAgent}
                        </p>

                      </div>

                    </div>


                    <button
                      onClick={
                        handleLogout
                      }
                      className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-xl text-white font-semibold transition"
                    >
                      🚪 Logout This Session
                    </button>

                  </div>


                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">

                      <p className="text-gray-500 text-sm">
                        Session Started
                      </p>


                      <p className="text-white font-medium mt-1">
                        {sessionInfo.sessionStarted}
                      </p>

                    </div>


                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">

                      <p className="text-gray-500 text-sm">
                        Language
                      </p>


                      <p className="text-white font-medium mt-1">
                        {sessionInfo.language}
                      </p>

                    </div>


                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">

                      <p className="text-gray-500 text-sm">
                        Authentication
                      </p>


                      <p className="text-emerald-400 font-medium mt-1">
                        JWT Protected
                      </p>

                    </div>

                  </div>

                </div>


                <div className="mt-6 bg-slate-950 border border-slate-700 rounded-2xl p-6">

                  <div className="flex items-start gap-4">

                    <div className="w-11 h-11 rounded-xl bg-cyan-500/15 flex items-center justify-center text-xl flex-shrink-0">
                      🔒
                    </div>


                    <div>

                      <h3 className="text-white font-semibold">
                        Session Security
                      </h3>


                      <p className="text-gray-400 mt-2 leading-relaxed">
                        Your current session is authenticated using the VeriFrame JWT authentication system.
                        Logging out removes the stored authentication token from this browser.
                      </p>

                    </div>

                  </div>

                </div>


                <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-5">

                  <p className="text-yellow-300 text-sm leading-relaxed">
                    ⚠️ Currently, VeriFrame manages the active session on this browser.
                    A full multi-device session manager would require storing individual
                    server-side sessions for each login.
                  </p>

                </div>

              </>

            )}


            {/* =====================================================
                DANGER ZONE
            ===================================================== */}

            {activeTab ===
              "danger" && (

              <>

                <h2 className="text-3xl font-bold text-red-400">
                  ⚠ Danger Zone
                </h2>


                <p className="text-gray-400 mt-2 mb-8">
                  These actions affect your VeriFrame account.
                </p>


                <div className="space-y-6">


                  {/* EXPORT */}

                  <div className="bg-slate-950 border border-cyan-500/50 rounded-xl p-6">

                    <h3 className="text-xl font-semibold text-white">
                      📥 Export My Data
                    </h3>


                    <p className="text-gray-400 mt-2">
                      Download your account information as a JSON file.
                    </p>


                    <button
                      onClick={
                        handleExportData
                      }
                      disabled={
                        processingAccount
                      }
                      className="mt-5 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 px-5 py-3 rounded-xl text-white font-semibold"
                    >
                      📥 Export Data
                    </button>

                  </div>


                  {/* DEACTIVATE */}

                  <div className="bg-yellow-950/20 border border-yellow-500 rounded-xl p-6">

                    <h3 className="text-xl font-semibold text-yellow-400">
                      🔒 Deactivate Account
                    </h3>


                    <p className="text-gray-400 mt-2">
                      Temporarily disable your VeriFrame account. Your account data is kept and can be reactivated from the login page.
                    </p>


                    <button
                      onClick={
                        handleDeactivateAccount
                      }
                      disabled={
                        processingAccount
                      }
                      className="mt-5 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 px-5 py-3 rounded-xl text-white font-semibold"
                    >
                      🔒 Deactivate Account
                    </button>

                  </div>


                  {/* DELETE */}

                  <div className="bg-red-950/30 border border-red-500 rounded-xl p-6">

                    <h3 className="text-xl font-semibold text-red-400">
                      🗑 Delete Account
                    </h3>


                    <p className="text-gray-400 mt-2">
                      Permanently delete your VeriFrame account. This cannot be undone.
                    </p>


                    <button
                      onClick={
                        handleDeleteAccount
                      }
                      disabled={
                        processingAccount
                      }
                      className="mt-5 bg-red-500 hover:bg-red-600 disabled:opacity-50 px-6 py-3 rounded-xl text-white font-semibold"
                    >
                      🗑 Permanently Delete Account
                    </button>

                  </div>


                  {/* ACTIVATION INFO */}

                  <div className="bg-emerald-950/20 border border-emerald-500/50 rounded-xl p-6">

                    <h3 className="text-xl font-semibold text-emerald-400">
                      🔓 Reactivate Account
                    </h3>


                    <p className="text-gray-400 mt-2">
                      If you deactivate your account, you can reactivate it later from the login page using your registered email and password.
                    </p>

                  </div>

                </div>

              </>

            )}

          </div>

        </div>

      </main>

    </DashboardLayout>

  );

}

export default Settings;