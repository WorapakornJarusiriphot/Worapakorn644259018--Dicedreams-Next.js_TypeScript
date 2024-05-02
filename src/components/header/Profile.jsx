import React, { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const Profile = ({ user }) => {
    const { logout } = useContext(AuthContext);
    console.log(user);
    const navigate = useNavigate();
    const handleOutOut = () => {
        logout()
            .then(() => {
                alert("Logged Out!");
                navigate("/");
            })
            .catch((error) => {
                console.log(error);
            });
    };
    return (
        <div>
            <div className="drawer drawer-end z-50">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    {/* Page content here */}
                    <label
                        htmlFor="my-drawer-4"
                        className="drawer-button btn btn-ghost btn-circle avatar"
                    >
                        <div className="w-10 rounded-full">
                            {user?.photoURL ? (
                                <div className="w-10 rounded-full">
                                    <img alt="User Photo Profile" src={user?.photoURL} />
                                </div>
                            ) : (
                                <img
                                    alt="User Photo Profile"
                                    src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                                />
                            )}
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default Profile;