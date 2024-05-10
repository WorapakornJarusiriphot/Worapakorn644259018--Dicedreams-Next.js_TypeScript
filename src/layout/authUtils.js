// สร้างและ export ฟังก์ชัน handleLogout
export const handleLogout = (setUserLoggedIn, setUser, router) => {
    localStorage.removeItem("access_token");
    setUserLoggedIn(false);
    setUser({ firstName: "", lastName: "", profilePictureUrl: "" });
    router.push("/sign-in");
};
