import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../../component/Layout";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = () => {
        axios
            .get("https://newmmdata-backend.onrender.com/api/books")
            .then((response) => setBooks(response.data))
            .catch((error) => console.error("Error fetching data:", error));
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This will permanently delete the book.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Deleting...',
                    allowOutsideClick: false,
                    didOpen: () => Swal.showLoading(),
                });

                axios
                    .delete(`https://newmmdata-backend.onrender.com/api/books/${id}`)
                    .then(() => {
                        Swal.close(); // close loader

                        const timestamp = new Date().toLocaleString();
                        Swal.fire({
                            icon: 'success',
                            title: 'Book Deleted!',
                            text: `Deleted at ${timestamp}`,
                        });

                        fetchBooks();
                    })
                    .catch((error) => {
                        Swal.fire('Error', 'Delete failed!', 'error');
                        console.error("Delete failed:", error);
                    });
            }
        });
    };


    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setSelectedBook((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = () => {
        Swal.fire({
            title: 'Updating...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });

        axios
            .put(`https://newmmdata-backend.onrender.com/api/books/${selectedBook.id}`, selectedBook)
            .then(() => {
                Swal.close(); // close loader

                const timestamp = new Date().toLocaleString();
                Swal.fire({
                    icon: 'success',
                    title: 'Book Updated!',
                    text: `Updated at ${timestamp}`,
                });

                setShowEditModal(false);
                fetchBooks();
            })
            .catch((error) => {
                Swal.fire('Error', 'Update failed!', 'error');
                console.error("Update failed:", error);
            });
    };


    return (
        <Layout>
            <div className="min-h-screen bg-gray-100 py-10 px-4">
                <h1 className="text-3xl font-bold text-center mb-8">📚 Books Library</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow rounded-lg">
                        <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
                            <tr>
                                <th className="px-4 py-3 text-left">ID</th>
                                <th className="px-4 py-3 text-left">Cover</th>
                                <th className="px-4 py-3 text-left">Title</th>
                                <th className="px-4 py-3 text-left">ISBN</th>
                                <th className="px-4 py-3 text-left">Description</th>
                                <th className="px-4 py-3 text-left">Author</th>
                                <th className="px-4 py-3 text-left">Translator</th>
                                <th className="px-4 py-3 text-left">Language</th>
                                <th className="px-4 py-3 text-left">Book Date</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Category</th>
                                <th className="px-4 py-3 text-left">Created On</th>
                                <th className="px-4 py-3 text-left">Is Published</th>
                                <th className="px-4 py-3 text-left">Modified On</th>
                                <th className="px-4 py-3 text-left">PDF</th>
                                <th className="px-4 py-3 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book) => (
                                <tr key={book.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3">{book.id}</td>
                                    <td className="px-4 py-3">
                                        <img src={`https://newmmdata-backend.onrender.com/api/books/cover/${book.id}`} alt={book.title} className="w-16 h-auto object-cover" />
                                    </td>
                                    <td className="px-4 py-3">{book.title}</td>
                                    <td className="px-4 py-3">{book.isbn}</td>
                                    <td className="px-4 py-3">
                                        {book.description?.length > 100
                                            ? `${book.description.substring(0, 100)}...`
                                            : book.description || ""}
                                    </td>
                                    <td className="px-4 py-3">{book.author}</td>
                                    <td className="px-4 py-3">{book.translator}</td>
                                    <td className="px-4 py-3">{book.language}</td>
                                    <td className="px-4 py-3">{book.bookDate}</td>
                                    <td className="px-4 py-3">{book.status}</td>
                                    <td className="px-4 py-3">{book.category}</td>
                                    <td className="px-4 py-3">{new Date(book.createdOn).toLocaleString("en-GB")}</td>
                                    <td className="px-4 py-3">{book.isPublished ? "Yes" : "No"}</td>
                                    <td className="px-4 py-3">{new Date(book.modifiedOn).toLocaleString("en-GB")}</td>
                                    <td className="px-4 py-3">
                                        <a href={`https://newmmdata-backend.onrender.com/api/books/attachment/${book.id}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">Download PDF</a>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => navigate(`/viewbook/book/${book.id}`)}
                                                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => {
                                                    navigate(`/update-book/book/${book.id}`)
                                                }}
                                                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(book.id)}
                                                className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* View Modal */}
                {showViewModal && selectedBook && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                        <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl max-h-screen overflow-y-auto">
                            <h2 className="text-2xl font-bold mb-4 text-center">📖 Book Details</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div><strong>Title:</strong> {selectedBook.title}</div>
                                <div><strong>ISBN:</strong> {selectedBook.isbn}</div>
                                <div><strong>Author:</strong> {selectedBook.author}</div>
                                <div><strong>Translator:</strong> {selectedBook.translator}</div>
                                <div><strong>Language:</strong> {selectedBook.language}</div>
                                <div><strong>Book Date:</strong> {selectedBook.bookDate}</div>
                                <div><strong>Status:</strong> {selectedBook.status}</div>
                                <div><strong>Category:</strong> {selectedBook.category}</div>
                                <div><strong>Is Published:</strong> {selectedBook.isPublished ? "Yes" : "No"}</div>
                                <div><strong>Is Deleted:</strong> {selectedBook.isDeleted ? "Yes" : "No"}</div>
                                <div><strong>Created On:</strong> {new Date(selectedBook.createdOn).toLocaleString("en-GB")}</div>
                                <div><strong>Modified On:</strong> {new Date(selectedBook.modifiedOn).toLocaleString("en-GB")}</div>
                                <div className="sm:col-span-2">
                                    <strong>Description:</strong>
                                    <p className="mt-1 text-gray-700">{selectedBook.description}</p>
                                </div>
                                <div className="sm:col-span-2 text-center">
                                    <img
                                        src={`https://newmmdata-backend.onrender.com/api/books/cover/${selectedBook.id}`}
                                        alt={selectedBook.title}
                                        className="w-40 h-auto mx-auto mt-4 rounded border"
                                    />
                                </div>
                            </div>
                            <div className="text-center mt-6">
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}



                {/* Edit Modal */}
                {showEditModal && selectedBook && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg space-y-4">
                            <h2 className="text-2xl font-bold text-center mb-4">✏️ Edit Book</h2>

                            <div className="space-y-3">
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700">Title</span>
                                    <input
                                        name="title"
                                        value={selectedBook.title}
                                        onChange={handleEditChange}
                                        className="w-full border p-2 rounded mt-1"
                                        placeholder="Title"
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700">ISBN</span>
                                    <input
                                        name="isbn"
                                        value={selectedBook.isbn}
                                        onChange={handleEditChange}
                                        className="w-full border p-2 rounded mt-1"
                                        placeholder="ISBN"
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700">Description</span>
                                    <textarea
                                        name="description"
                                        value={selectedBook.description}
                                        onChange={handleEditChange}
                                        className="w-full border p-2 rounded mt-1"
                                        placeholder="Description"
                                        rows={3}
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700">Author</span>
                                    <input
                                        name="author"
                                        value={selectedBook.author}
                                        onChange={handleEditChange}
                                        className="w-full border p-2 rounded mt-1"
                                        placeholder="Author"
                                    />
                                </label>

                                {/* Add more fields with similar structure */}
                            </div>

                            <div className="flex justify-between mt-6">
                                <button
                                    onClick={handleUpdate}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default BookList;
