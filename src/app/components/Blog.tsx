'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';

interface Blog {
  id: string;
  Title: string;
  Content_Preview: string;
  image?: string;
  timestamp?: Date;
  Author_Name: string;
}

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBlog, setNewBlog] = useState({ Title: '', Content_Preview: '', Author_Name: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    console.log('Fetching blogs...');
    const q = query(collection(db, 'blogs'));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const blogList: Blog[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            Title: data.Title,
            Content_Preview: data.Content_Preview,
            timestamp: data.timestamp?.toDate(),
            Author_Name: data.Author_Name,
            image: data.image || '/default-image.png' // Provide a default image
          };
        });
        setBlogs(blogList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewBlog({ ...newBlog, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newBlog.Title && newBlog.Content_Preview && newBlog.Author_Name) {
      try {
        await addDoc(collection(db, 'blogs'), {
          ...newBlog,
          timestamp: serverTimestamp(),
          image: '/default-image.png', // Optional: you can allow users to upload an image
        });
        setNewBlog({ Title: '', Content_Preview: '', Author_Name: '' });
        setIsModalOpen(false); // Close the modal after submission
      } catch (error) {
        console.error("Error adding blog:", error);
      }
    }
  };

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-bold mb-4 text-black text-center"
     >BlogNest</h2>

      {/* Button to Open Modal */}
      <button
  onClick={() => setIsModalOpen(true)}
  className="px-4 py-2 text-white rounded hover:opacity-90 mb-4"
  style={{
    background: 'linear-gradient(90deg, #cce2b3, #b3d9f5, #d9b3f5)',
  }}
>
  Add New Blog
</button>


      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">New Blog</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="Title"
                  value={newBlog.Title}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 text-black rounded"
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Content Preview</label>
                <textarea
                  name="Content_Preview"
                  value={newBlog.Content_Preview}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 text-black rounded"
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Author Name</label>
                <input
                  type="text"
                  name="Author_Name"
                  value={newBlog.Author_Name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 text-black rounded"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white rounded hover:bg-blue-700"
                  style={{
                    background: 'linear-gradient(90deg, #cce2b3, #b3d9f5, #d9b3f5)',
                  }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Blog List */}
      {loading ? (
        <p className="text-gray-600">Loading blogs...</p>
      ) : blogs.length > 0 ? (
        <ul className="space-y-4">
          {blogs.map((blog, index) => {
            const shades = [
              'bg-[#f5c6cb]', // Pastel Pink
              'bg-[#f6e2b3]', // Pastel Yellow
              'bg-[#cce2b3]', // Pastel Green
              'bg-[#b3d9f5]', // Pastel Blue
              'bg-[#d9b3f5]'  // Pastel Purple
            ];
            const backgroundColor = shades[index % shades.length];

            return (
              <li
                key={blog.id}
                className={`p-4 rounded shadow-lg ${backgroundColor} text-black flex items-center`}
              >
                <div className="ml-4">
                  <h4 className="text-xl font-semibold mb-2">{blog.Title}</h4>
                  <p className="mb-2">{blog.Content_Preview}</p>
                  <p className="text-sm text-gray-600">by {blog.Author_Name}</p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-600">No blogs found.</p>
      )}
    </div>
  );
}
