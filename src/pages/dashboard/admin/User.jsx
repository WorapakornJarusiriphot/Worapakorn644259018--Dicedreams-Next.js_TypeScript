import React from "react";
import useAxiosSecure from "../../../hook/useAxiosSecure";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import { FaTrashAlt } from "react-icons/fa";

const User = () => {
  const axiosSecure = useAxiosSecure();
  const { refetch, data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users`);
      return res.data;
    },
  });
  const handleMakeAdmin = (user) => {
    if (user.role === "admin") {
      axiosSecure
        .patch(`/users/user/${user._id}`)
        .then(() => {
          refetch();
          Swal.fire({
            title: `${user.name} is a user now!`,
            icon: "success",
            timer: 1500,
          });
        })
        .catch((error) => {
          const errorStatus = error?.response?.status;
          const errorMessage = error?.response?.data?.message;
          Swal.fire({
            icon: "error",
            title: `${errorStatus} - ${errorMessage}`,
            timer: 1500,
          });
        });
    } else {
      axiosSecure
        .patch(`/users/admin/${user._id}`)
        .then(() => {
          refetch();
          Swal.fire({
            title: `${user.name} is a admin now!`,
            icon: "success",
            timer: 1500,
          });
        })
        .catch((error) => {
          const errorStatus = error?.response?.status;
          const errorMessage = error?.response?.data?.message;
          Swal.fire({
            icon: "error",
            title: `${errorStatus} - ${errorMessage}`,
            timer: 1500,
          });
        });
    }
    refetch();
  };
  const handleDeleteUser = (user) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this !",
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/users/${user._id}`)
          .then((res) => {
            refetch();
            Swal.fire({
              title: "Deleted!",
              text: `${res.data.name} has been deleted!`,
              icon: "success",
            });
          })
          .catch((error) => {
            const errorStatus = error?.response?.status;
            const errorMessage = error?.response?.data?.message;
            Swal.fire({
              icon: "error",
              title: `${errorStatus} - ${errorMessage}`,
              timer: 1500,
            });
          });
      }
    });
    refetch();
  };
  return (
    <div>
      <div className="flex justify-between mx-4 my-4">
        <h1 className="font-bold text-4xl">
          Manage<span className="text-red"> All users</span>
        </h1>
        <h2 className="text-2xl">Total Users: {users.length} </h2>
      </div>
      <div>
        <div className="overflow-x-auto">
          <table className="table table-zebra mx-auto w-full">
            {/* head */}
            <thead className="bg-red text-white text-center">
              <tr>
                <th>
                  <label>#</label>
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="text-center">
                  <th>
                    <label>{index + 1}</label>
                  </th>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img
                            src={user.photoURL}
                            alt="Avatar Tailwind CSS Component"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td className="flex justify-items-center space-x-2 justify-center">
                    <p>User</p>
                    <input
                      type="checkbox"
                      className="toggle toggle-success"
                      onClick={() => handleMakeAdmin(user)}
                      checked={user.role === "admin"}
                    />
                    <p>Admin</p>
                  </td>
                  <th>
                    <button
                      className="btn btn-ghost btn-xs bg-orange-500"
                      onClick={() => handleDeleteUser(user)}
                    >
                      <FaTrashAlt />
                    </button>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default User;