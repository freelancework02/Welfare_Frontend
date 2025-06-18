import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Layout from '../../../component/Layout';
import Swal from 'sweetalert2';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
    toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        ['link', 'image'],
        ['clean']
    ]
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
];


const QuestionList = () => {
      const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [showViewPopup, setShowViewPopup] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        questionEnglish: '',
        answerEnglish: '',
        questionUrdu: '',
        answerUrdu: '',
        image: null
    });

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = () => {
        axios.get('https://newmmdata-backend.onrender.com/api/questions')
            .then(response => {
                setQuestions(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError('Error fetching data');
                setLoading(false);
            });
    };

    const handleEdit = (question) => {
        setFormData({
            id: question.id,
            slug: question.slug || '',
            questionEnglish: question.questionEnglish || '',
            answerEnglish: question.answerEnglish || '',
            questionUrdu: question.questionUrdu || '',
            answerUrdu: question.answerUrdu || '',
            writer: question.writer || '',
            date: question.date || '',
            tags: question.tags || '',
            language: question.language || '',
            topic: question.topic || '',
            translator: question.translator || '',
            isPublished: question.isPublished !== undefined ? question.isPublished : true,
            image: null
        });
        setShowPopup(true);
    };


    const handleView = (question) => {
        setSelectedQuestion(question);
        setShowViewPopup(true);
    };

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                setLoading(true);
                await axios.delete(`https://newmmdata-backend.onrender.com/api/questions/${id}`);
                await Swal.fire(
                    'Deleted!',
                    'Your question has been deleted.',
                    'success'
                );
                fetchQuestions();
            }
        } catch (error) {
            Swal.fire(
                'Error!',
                'Failed to delete question.',
                'error'
            );
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);
            const updatedFormData = new FormData();

            // Append all required fields
            updatedFormData.append('slug', formData.slug);
            updatedFormData.append('questionEnglish', formData.questionEnglish);
            updatedFormData.append('answerEnglish', formData.answerEnglish);
            updatedFormData.append('questionUrdu', formData.questionUrdu);
            updatedFormData.append('answerUrdu', formData.answerUrdu);
            updatedFormData.append('writer', formData.writer);
            updatedFormData.append('date', formData.date);
            updatedFormData.append('tags', formData.tags);
            updatedFormData.append('language', formData.language);
            updatedFormData.append('topic', formData.topic);
            updatedFormData.append('translator', formData.translator);
            updatedFormData.append('isPublished', formData.isPublished);

            if (formData.image) {
                updatedFormData.append('image', formData.image);
            }

            const response = await axios.put(
                `https://newmmdata-backend.onrender.com/api/questions/${formData.id}`,
                updatedFormData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setShowPopup(false);
            setSelectedQuestion(null);

            await Swal.fire(
                'Updated!',
                'Your question has been updated.',
                'success'
            );

            fetchQuestions();
        } catch (error) {
            console.error('Update error:', error.response?.data || error.message);
            Swal.fire(
                'Error!',
                error.response?.data?.message || 'Failed to update question.',
                'error'
            );
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };



    return (
        <Layout>
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">Question List</h1>


                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
                            <tr>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Slug</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Image</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">English Question</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Urdu Question</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Writer</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Date</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map((question) => (
                                <tr key={question.id} className="border-t border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-6 text-sm text-gray-700">{question.slug}</td>
                                    <td className="py-3 px-6 text-sm text-gray-700">
                                        <img src={`https://newmmdata-backend.onrender.com/api/questions/image/${question.id}`} alt={question.slug} className="w-16 h-16" />
                                    </td>
                                    <td className="py-3 px-6 text-sm text-gray-700">{question.questionEnglish}</td>
                                    <td className="py-3 px-6 text-sm text-gray-700" dir="rtl">{question.questionUrdu}</td>
                                    <td className="py-3 px-6 text-sm text-gray-700">{question.writer}</td>
                                    <td className="py-3 px-6 text-sm text-gray-700">
                                        {new Date(question.date).toLocaleDateString()}
                                    </td>
                                    <td className="py-3 px-6 flex justify-center gap-2">
                                        <button
                                            onClick={() => handleView(question)}
                                            className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                                        >
                                            View
                                        </button>
                            
                                        <button
                                            onClick={() => navigate(`/question-update/${question.id}`)}
                                            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(question.id)}
                                            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>

            {/* Edit Popup */}
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6">Edit Question Content</h2>

                        {/* English Question */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1 font-medium">English Question</label>
                            <input
                                type="text"
                                name="questionEnglish"
                                value={formData.questionEnglish}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* English Answer */}
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-1 font-medium">English Answer</label>
                            <ReactQuill
                                theme="snow"
                                value={formData.answerEnglish}
                                onChange={(value) => setFormData({ ...formData, answerEnglish: value })}
                                modules={modules}
                                formats={formats}
                                className="bg-white border rounded-lg min-h-[136px]"
                                style={{ direction: 'ltr', textAlign: 'left' }}
                            />
                        </div>

                        {/* Urdu Question */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1 font-medium">Urdu Question</label>
                            <input
                                type="text"
                                name="questionUrdu"
                                value={formData.questionUrdu}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                dir="rtl"
                            />
                        </div>

                        {/* Urdu Answer */}
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-1 font-medium">Urdu Answer</label>
                            <ReactQuill
                                theme="snow"
                                value={formData.answerUrdu}
                                onChange={(value) => setFormData({ ...formData, answerUrdu: value })}
                                modules={modules}
                                formats={formats}
                                className="bg-white border rounded-lg min-h-[136px]"
                                style={{ direction: 'rtl', textAlign: 'right' }}
                            />
                        </div>

                        {/* Image Input */}
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2 font-medium">Update Image (optional)</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                    className="w-full"
                                />
                                <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF up to 5MB</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                            <button
                                onClick={() => setShowPopup(false)}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Popup */}
            {showViewPopup && selectedQuestion && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6">Question Details</h2>

                        {/* Image */}
                        <div className="mb-6 flex justify-center">
                            <img
                                src={`https://newmmdata-backend.onrender.com/api/questions/image/${selectedQuestion.id}`}
                                alt={selectedQuestion.slug}
                                className="max-h-64 max-w-full rounded-lg"
                            />
                        </div>

                        {/* English Section */}
                        {/* English Section */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2 text-gray-800">English</h3>
                            <div className="bg-gray-50 p-4 rounded-lg prose max-w-none">
                                <p className="font-medium mb-1">Question:</p>
                                <div className="mb-3" dangerouslySetInnerHTML={{ __html: selectedQuestion.questionEnglish }} />
                                <p className="font-medium mb-1">Answer:</p>
                                <div dangerouslySetInnerHTML={{ __html: selectedQuestion.answerEnglish }} />
                            </div>
                        </div>

                        {/* Urdu Section */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2 text-gray-800">Urdu</h3>
                            <div className="bg-gray-50 p-4 rounded-lg prose max-w-none text-right" dir="rtl">
                                <p className="font-medium mb-1">سوال:</p>
                                <div className="mb-3" dangerouslySetInnerHTML={{ __html: selectedQuestion.questionUrdu }} />
                                <p className="font-medium mb-1">جواب:</p>
                                <div dangerouslySetInnerHTML={{ __html: selectedQuestion.answerUrdu }} />
                            </div>
                        </div>

                        {/* Meta Information */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <p className="text-sm text-gray-600">Slug:</p>
                                <p className="font-medium">{selectedQuestion.slug}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Writer:</p>
                                <p className="font-medium">{selectedQuestion.writer}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Date:</p>
                                <p className="font-medium">
                                    {new Date(selectedQuestion.date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* Close Button */}
                        <div className="flex justify-end pt-4 border-t border-gray-200">
                            <button
                                onClick={() => setShowViewPopup(false)}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default QuestionList;