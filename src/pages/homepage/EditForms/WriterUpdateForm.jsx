import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileText } from "lucide-react";
import Layout from '../../../component/Layout';
import Swal from "sweetalert2";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const modules = {
    toolbar: [
        [{ 'font': [] }, { 'size': [] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image', 'video'],
        ['clean']
    ]
};

const formats = [
    'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'header', 'align',
    'blockquote', 'code-block',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
];

const WriterUpdateForm = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        writerName: "",
        designation: "",
        aboutWriter: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWriter = async () => {
            setIsLoading(true);
            try {
                const docRef = doc(db, "writers", id);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFormData({
                        writerName: data.writerName || "",
                        designation: data.designation || "",
                        aboutWriter: data.aboutWriter || ""
                    });
                } else {
                    Swal.fire('Error', 'No such writer found!', 'error');
                    navigate('/writers');
                }
            } catch (err) {
                console.error("Error fetching writer:", err);
                Swal.fire('Error', 'Failed to load writer data', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchWriter();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleDescriptionChange = (value) => {
        setFormData(prev => ({
            ...prev,
            aboutWriter: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.writerName.trim()) {
            Swal.fire('Error', 'Please enter the writer name', 'error');
            return;
        }

        Swal.fire({
            title: 'Updating writer...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const writerRef = doc(db, "writers", id);
            const updateData = {
                ...formData,
                updatedAt: new Date().toISOString()
            };

            await updateDoc(writerRef, updateData);

            Swal.fire({
                icon: 'success',
                title: 'Writer Updated Successfully!',
                text: `Updated at: ${new Date().toLocaleString()}`,
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                navigate('/writers');
            });

        } catch (error) {
            console.error("Error updating writer:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.message || "Something went wrong while updating the writer.",
            });
        }
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-blue-600 hover:underline"
            >
                ← Back
            </button>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight">Update Writer</h1>
                    <p className="text-gray-500">Edit the writer's information</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="bg-white shadow-md rounded-md overflow-hidden">
                        <div className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="writerName" className="block text-sm font-medium text-gray-700">
                                    Name <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    id="writerName"
                                    value={formData.writerName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="designation" className="block text-sm font-medium text-gray-700">
                                    Designation
                                </label>
                                <input
                                    id="designation"
                                    value={formData.designation}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="w-4 h-4" />
                                    <label className="text-sm font-medium">About Writer</label>
                                </div>
                                <ReactQuill
                                    theme="snow"
                                    value={formData.aboutWriter}
                                    onChange={handleDescriptionChange}
                                    modules={modules}
                                    formats={formats}
                                    className="bg-white border rounded-lg min-h-[136px]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            className="bg-[#5a6c17] hover:bg-[rgba(90,108,23,0.83)] text-white font-medium px-4 py-2 rounded-lg transition-all text-sm md:text-base flex items-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </>
                            ) : (
                                "Update Writer"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    )
}

export default WriterUpdateForm;