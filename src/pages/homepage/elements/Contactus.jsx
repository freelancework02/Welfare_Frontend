import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Layout from "../../../component/Layout";

export default function ContactUsList() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    axios.get("https://welfare-a0jo.onrender.com/api/contact") // ✅ Corrected URL
      .then((res) => {
        // ✅ Ensure data is an array before setting
        if (Array.isArray(res.data)) {
          setContacts(res.data);
        } else {
          console.error("Expected array but got:", res.data);
          setContacts([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch contacts:", err);
        setContacts([]);
      });
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(contacts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "ContactUsData.xlsx");
  };

  return (
    <Layout>

    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">📬 Contact Us Submissions</h1>
        <button
          onClick={exportToExcel}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-md transition duration-200"
          >
          Export to Excel
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 uppercase text-xs text-gray-600">
            <tr>
              <th className="px-6 py-4">#</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Message</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center px-6 py-8 text-gray-500">
                  No submissions yet.
                </td>
              </tr>
            ) : (
              contacts.map((contact, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{contact.name}</td>
                  <td className="px-6 py-4">{contact.email}</td>
                  <td className="px-6 py-4">{contact.description}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
                </Layout>
  );
}
