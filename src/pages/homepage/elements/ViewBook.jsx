import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import Swal from "sweetalert2";
import Layout from "../../../component/Layout";

export default function ViewBooks() {
  const [books, setBooks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchBooks = async () => {
    const snapshot = await getDocs(collection(db, "books"));
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setBooks(list);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleEditChange = (e) => {
    setEditData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async (id) => {
    try {
      await updateDoc(doc(db, "books", id), {
        ...editData,
        modifiedOn: new Date(),
      });
      setEditId(null);
      Swal.fire("Success", "Book updated!", "success");
      fetchBooks();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "books", id));
      Swal.fire("Deleted!", "Book removed", "success");
      fetchBooks();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <Layout>
    <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Books List</h2>
      {books.map((book) => (
        <div
          key={book.id}
          className="border-b py-4 mb-4 flex flex-col md:flex-row justify-between gap-4"
        >
          {editId === book.id ? (
            <div className="flex flex-col w-full gap-2">
              <input
                name="bookName"
                value={editData.bookName}
                onChange={handleEditChange}
                placeholder="Book Name"
                className="border px-2 py-1 rounded"
              />
              <textarea
                name="aboutBook"
                value={editData.aboutBook}
                onChange={handleEditChange}
                placeholder="About Book"
                className="border px-2 py-1 rounded"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleUpdate(book.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditId(null)}
                  className="bg-gray-500 text-white px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{book.bookName}</h3>
                <p className="text-sm text-gray-600">{book.aboutBook}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditId(book.id);
                    setEditData(book);
                  }}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(book.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
    </Layout>
  );
}
