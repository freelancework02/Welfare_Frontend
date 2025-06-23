import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import Swal from "sweetalert2";
import Layout from "../../../component/Layout";

export default function ViewLanguages() {
  const [languages, setLanguages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newLanguage, setNewLanguage] = useState("");

  const fetchLanguages = async () => {
    const querySnapshot = await getDocs(collection(db, "languages"));
    const langs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setLanguages(langs);
  };

  const deleteLanguage = async (id) => {
    try {
      await deleteDoc(doc(db, "languages", id));
      Swal.fire("Deleted!", "Language has been deleted.", "success");
      fetchLanguages();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const updateLanguage = async (id) => {
    try {
      await updateDoc(doc(db, "languages", id), {
        language: newLanguage,
      });
      setEditingId(null);
      setNewLanguage("");
      fetchLanguages();
      Swal.fire("Updated!", "Language updated successfully.", "success");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  return (
    <Layout>
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Languages List</h2>
      <ul className="space-y-4">
        {languages.map((lang) => (
          <li
            key={lang.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-2"
          >
            {editingId === lang.id ? (
              <>
                <input
                  type="text"
                  className="border px-2 py-1 rounded w-full sm:w-auto"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => updateLanguage(lang.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="text-lg">{lang.language}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(lang.id);
                      setNewLanguage(lang.language);
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteLanguage(lang.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
    </Layout>
  );
}
