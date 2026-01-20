import React, { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      uName: "deepak01",
      fName: "Deepak",
      lName: "Sharma",
      email: "deepak@gmail.com",
      books: 3,
    },
    {
      id: 2,
      uName: "rahul99",
      fName: "Rahul",
      lName: "Verma",
      email: "rahul@gmail.com",
      books: 1,
    },
  ]);

  const deleteUser = (id) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <div className="p-6 bg-[#0e1a1c] min-h-screen mt-20 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#dbf8fa]">Users</h2>

        <Link
          to="/add-user"
          className="bg-amber-300 text-[#0e1a1c] px-4 py-2 rounded-lg font-semibold hover:bg-amber-400 transition"
        >
          + Add User
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[#1b2e31] border border-[#2c4449] rounded-xl p-5">
          <p className="text-gray-400 text-sm">Total Users</p>
          <h3 className="text-2xl font-bold text-[#dbf8fa]">{users.length}</h3>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1b2e31] border border-[#2c4449] rounded-xl p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 border-b border-[#2c4449]">
              <th className="py-2">Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Books</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="text-[#dbf8fa]">
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-[#2c4449] last:border-none"
              >
                <td className="py-3 font-medium">{user.uName}</td>
                <td className="text-gray-400">
                  {user.fName} {user.lName}
                </td>
                <td>{user.email}</td>
                <td>{user.books}</td>
                <td className="text-right flex justify-end gap-3 py-3">
                  <FiEdit className="text-blue-400 cursor-pointer" />
                  <FiTrash2
                    onClick={() => deleteUser(user.id)}
                    className="text-red-400 cursor-pointer"
                  />
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
