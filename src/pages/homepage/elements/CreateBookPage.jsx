import React, { useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import Swal from "sweetalert2";
import Layout from "../../../component/Layout";

export default function AddBook() {
  const [formData, setFormData] = useState({
    slug: "",
    aboutBook: "",
    writer: "",
    published: "",
    topic: "",
    thumbnail: "",
    tags: "",
    bookName: "",
    language: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.bookName || !formData.slug) {
      Swal.fire("Error", "Book name and slug are required", "error");
      return;
    }

    try {
      await addDoc(collection(db, "books"), {
        ...formData,
        createdOn: Timestamp.now(),
        modifiedOn: Timestamp.now(),
      });
      Swal.fire("Success", "Book added successfully", "success");
      setFormData({
        slug: "",
        aboutBook: "",
        writer: "",
        published: "",
        topic: "",
        thumbnail: "",
        tags: "",
        bookName: "",
        language: "",
      });
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <Layout>
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow mt-10">
      <h2 className="text-xl font-bold mb-4 text-center">Add New Book</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          "bookName",
          "slug",
          "writer",
          "language",
          "published",
          "topic",
          "tags",
          "thumbnail",
        ].map((field) => (
          <input
            key={field}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            placeholder={`Enter ${field}`}
            className="border px-4 py-2 rounded-md focus:outline-none focus:ring w-full"
          />
        ))}
        <textarea
          name="aboutBook"
          value={formData.aboutBook}
          onChange={handleChange}
          placeholder="About Book"
          className="col-span-1 md:col-span-2 border px-4 py-2 rounded-md h-24"
        />
        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Book
        </button>
      </form>
    </div>
    </Layout>
  );
}
