import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { User, Mail, Phone, Loader, X, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import { backendurl } from "../App";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendurl}/api/forms/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.data.success) {
        setContacts(response.data.forms);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Error fetching contact list");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.post(
        `${backendurl}/api/forms/delete-contact`,
        { id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.data.success) {
        toast.success("Contact deleted");
        fetchContacts();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Failed to delete contact");
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter((contact) => {
    const term = searchTerm.toLowerCase();
    return (
      contact?.name?.toLowerCase().includes(term) ||
      contact?.email?.toLowerCase().includes(term) ||
      contact?.phone?.toLowerCase().includes(term) ||
      contact?.message?.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <Loader className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Contacts</h1>
            <p className="text-gray-600">
              View and manage contact form submissions
            </p>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 w-1/6 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 w-1/4 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 w-1/6 text-left text-xs font-medium text-gray-500 uppercase">
                    Phone
                  </th>
                  <th className="px-6 py-3 w-[300px] text-left text-xs font-medium text-gray-500 uppercase">
                    Message
                  </th>
                  <th className="px-6 py-3 w-1/12 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredContacts.map((contact) => (
                  <motion.tr
                    key={contact._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2 truncate max-w-xs">
                      <User className="w-5 h-5 text-gray-400" />
                      {contact.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">
                      <div className="flex items-center gap-1">
                        <Mail className="w-5 h-5 text-gray-400" />
                        {contact.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">
                      <div className="flex items-center gap-1">
                        <Phone className="w-5 h-5 text-gray-400" />
                        {contact.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-pre-wrap break-words max-h-32 overflow-y-auto">
                      {contact.message}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(contact._id)}
                        className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                        aria-label="Delete contact"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredContacts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No contacts found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contacts;
