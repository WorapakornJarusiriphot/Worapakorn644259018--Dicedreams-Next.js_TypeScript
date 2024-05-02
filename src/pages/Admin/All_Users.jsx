import React, { useEffect, useState } from 'react';
import axios from 'axios';

const All_Users = () => {
  const [users, setUsers] = useState([]);
  const [showVerified, setShowVerified] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/all-users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);


  const toggleVerifiedUsers = () => {
    setShowVerified(!showVerified);
  };

  return (
    <div className="overflow-x-auto p-5">
      <h2 className="text-2xl font-semibold mb-5">{showVerified ? "Admin" : "User"} Management</h2> {/* เปลี่ยนข้อความตามสถานะ */}
      <div className="form-control mb-5">
        <label className="label cursor-pointer">
          <span className="label-text">Show {showVerified ? "Not Verified" : "Verified"} Users</span>
          <input type="checkbox" checked={!showVerified} onChange={toggleVerifiedUsers} className="toggle toggle-primary" />
        </label>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input type="checkbox" className="checkbox" />
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Display Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email Verified
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Photo
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.filter(user => user.emailVerified === showVerified).map(user => (
            <tr key={user.uid}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <input type="checkbox" className="checkbox" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{user.displayName}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.emailVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user.emailVerified ? 'Verified' : 'Not Verified'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {user.photoURL && (
                  <img className="h-10 w-10 rounded-full" src={user.photoURL} alt="User" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default All_Users;