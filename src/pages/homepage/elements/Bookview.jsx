import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../../component/Layout";
import { ArrowLeft } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import Swal from "sweetalert2";

export default function BookView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const docRef = doc(db, "books", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setBook({
            id: docSnap.id,
            ...docSnap.data()
          });
        } else {
          Swal.fire('Error', 'No such book found!', 'error');
          navigate('/books');
        }
      } catch (error) {
        console.error("Error fetching book:", error);
        Swal.fire('Error', 'Failed to load book data', 'error');
        navigate('/books');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (!book) {
    return (
      <Layout>
        <div className="p-6 max-w-6xl mx-auto">
          <p className="text-center text-gray-500">Book not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Books
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Book Cover and Basic Info */}
          <div className="md:flex">
            <div className="md:w-1/3 p-6 flex justify-center">
              <img
                src={book.coverImage || "/placeholder-book.jpg"}
                alt={book.title}
                className="w-full max-w-xs h-auto object-cover rounded-lg shadow-md"
              />
            </div>
            
            <div className="md:w-2/3 p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>
              
              <div className="flex items-center mb-4">
                <span className="text-gray-600 mr-4">
                  <span className="font-semibold">Author:</span> {book.author || "Unknown"}
                </span>
                <span className="text-gray-600">
                  <span className="font-semibold">Published:</span> {book.publicationYear || "N/A"}
                </span>
              </div>
              
              <div className="mb-4">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                  {book.category || "Uncategorized"}
                </span>
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                  {book.language || "Language not specified"}
                </span>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {book.description || "No description available."}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="border-t border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Book Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Bibliographic Information</h3>
                <ul className="space-y-2">
                  <li className="flex">
                    <span className="text-gray-600 font-medium w-32">ISBN:</span>
                    <span>{book.isbn || "N/A"}</span>
                  </li>
                  <li className="flex">
                    <span className="text-gray-600 font-medium w-32">Publisher:</span>
                    <span>{book.publisher || "N/A"}</span>
                  </li>
                  <li className="flex">
                    <span className="text-gray-600 font-medium w-32">Pages:</span>
                    <span>{book.pageCount || "N/A"}</span>
                  </li>
                  <li className="flex">
                    <span className="text-gray-600 font-medium w-32">Format:</span>
                    <span>{book.format || "N/A"}</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Additional Information</h3>
                <ul className="space-y-2">
                  <li className="flex">
                    <span className="text-gray-600 font-medium w-32">Status:</span>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      book.status === 'Available' 
                        ? 'bg-green-100 text-green-800' 
                        : book.status === 'Checked Out' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {book.status || "Unknown"}
                    </span>
                  </li>
                  <li className="flex">
                    <span className="text-gray-600 font-medium w-32">Added On:</span>
                    <span>{new Date(book.createdAt?.toDate()).toLocaleDateString() || "N/A"}</span>
                  </li>
                  <li className="flex">
                    <span className="text-gray-600 font-medium w-32">Last Updated:</span>
                    <span>{new Date(book.updatedAt?.toDate()).toLocaleDateString() || "N/A"}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}