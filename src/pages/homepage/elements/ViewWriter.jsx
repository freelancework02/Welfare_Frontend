import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../../component/Layout";
import { ArrowLeft } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import Swal from "sweetalert2";
import ReactQuill from 'react-quill';

export default function ViewWriter() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [writer, setWriter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWriter = async () => {
      try {
        const docRef = doc(db, "writers", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setWriter({
            id: docSnap.id,
            ...docSnap.data()
          });
        } else {
          Swal.fire('Error', 'No such writer found!', 'error');
          navigate('/writers');
        }
      } catch (error) {
        console.error("Error fetching writer:", error);
        Swal.fire('Error', 'Failed to load writer data', 'error');
        navigate('/writers');
      } finally {
        setLoading(false);
      }
    };

    fetchWriter();
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

  if (!writer) {
    return (
      <Layout>
        <div className="p-6 max-w-6xl mx-auto">
          <p className="text-center text-gray-500">Writer not found</p>
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
          Back to Writers
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Writer Profile Header */}
          <div className="md:flex border-b border-gray-200">
            <div className="md:w-1/3 p-6 flex flex-col items-center">
              <img
                src={writer.imageURL || "/placeholder-writer.jpg"}
                alt={writer.writerName}
                className="w-48 h-48 object-cover rounded-full shadow-md mb-4"
              />
              <h1 className="text-2xl font-bold text-center">{writer.writerName}</h1>
              {writer.designation && (
                <p className="text-gray-600 text-center">{writer.designation}</p>
              )}
            </div>
            
            <div className="md:w-2/3 p-6">
              <div className="flex flex-wrap gap-4 mb-6">
                {writer.isTeamMember && (
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Team Member
                  </span>
                )}
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Joined: {new Date(writer.createdAt?.toDate()).toLocaleDateString() || "N/A"}
                </span>
                <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  Last Updated: {new Date(writer.updatedAt?.toDate()).toLocaleDateString() || "N/A"}
                </span>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">About the Writer</h3>
                <div className="prose max-w-none">
                  {writer.aboutWriter ? (
                    <div dangerouslySetInnerHTML={{ __html: writer.aboutWriter }} />
                  ) : (
                    <p className="text-gray-500 italic">No description available</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Detailed Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Biographical Details</h3>
                <ul className="space-y-3">
                  <li className="flex">
                    <span className="text-gray-600 font-medium w-40">Full Name:</span>
                    <span>{writer.writerName || "N/A"}</span>
                  </li>
                  <li className="flex">
                    <span className="text-gray-600 font-medium w-40">Designation:</span>
                    <span>{writer.designation || "N/A"}</span>
                  </li>
                  <li className="flex">
                    <span className="text-gray-600 font-medium w-40">Contact Email:</span>
                    <span>{writer.email || "N/A"}</span>
                  </li>
                  <li className="flex">
                    <span className="text-gray-600 font-medium w-40">Website:</span>
                    <span>
                      {writer.website ? (
                        <a href={writer.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {writer.website}
                        </a>
                      ) : "N/A"}
                    </span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Professional Information</h3>
                <ul className="space-y-3">
                  <li className="flex">
                    <span className="text-gray-600 font-medium w-40">Specialization:</span>
                    <span>{writer.specialization || "N/A"}</span>
                  </li>
                  <li className="flex">
                    <span className="text-gray-600 font-medium w-40">Published Works:</span>
                    <span>{writer.publishedWorks || "N/A"}</span>
                  </li>
                  <li className="flex">
                    <span className="text-gray-600 font-medium w-40">Awards:</span>
                    <span>{writer.awards || "N/A"}</span>
                  </li>
                  <li className="flex">
                    <span className="text-gray-600 font-medium w-40">Social Media:</span>
                    <div className="flex gap-2">
                      {writer.socialMedia?.twitter && (
                        <a href={writer.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                          </svg>
                        </a>
                      )}
                      {writer.socialMedia?.facebook && (
                        <a href={writer.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                          </svg>
                        </a>
                      )}
                      {writer.socialMedia?.instagram && (
                        <a href={writer.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748 1.15.344.353.882.3 1.857.344 1.023.047 1.351.058 3.807.058h.468c2.456 0 2.784-.011 3.807-.058.975-.045 1.504-.207 1.857-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.047-1.023.058-1.351.058-3.807v-.468c0-2.456-.011-2.784-.058-3.807-.045-.975-.207-1.504-.344-1.857a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                          </svg>
                        </a>
                      )}
                    </div>
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