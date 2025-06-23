import React, { useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import Swal from "sweetalert2";
import Layout from "../../../component/Layout";

export default function AddLanguage() {
  const [language, setLanguage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!language.trim()) {
      Swal.fire("Error", "Please enter a language", "error");
      return;
    }

    try {
      await addDoc(collection(db, "languages"), {
        language,
        createdOn: Timestamp.now(),
      });
      Swal.fire("Success", "Language added successfully", "success");
      setLanguage("");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <Layout>
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md mt-10">
      <h2 className="text-xl font-bold mb-4 text-center">Add Language</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter language"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add Language
        </button>
      </form>
    </div>
    </Layout>
  );
}
