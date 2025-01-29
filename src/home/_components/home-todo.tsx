import React, { useState, useEffect, useRef } from 'react';

type DataItem = {
  id: number;
  Title: string;
  date_added: string;
  date_completed: string;
};

const AddAndDisplayData: React.FC = () => {
  const [formData, setFormData] = useState<DataItem>({
    Title: '',
    date_added: '',
    date_completed: '',
    id: 0,
  });

  const [dataList, setDataList] = useState<DataItem[]>([]);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const modalRef = useRef<HTMLDivElement | null>(null); // Reference for the modal content

  // fetchData function
  const fetchData = async () => {
    try {
      const response = await fetch('https://faux-api.com/api/v1/todo_17484665438427394');
      const { result: fetchedData, status } = await response.json();

      if (status === "success") {
        setDataList(fetchedData);
      }
    } catch (error) {
    }
  };

  // handlePost function
  const handlePost = async () => {
    try {
      const response = await fetch('https://faux-api.com/api/v1/todo_17484665438427394', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([formData]),
      });

      await response.json(); // Remove unused variable

      setFormData({ Title: '', date_added: '', date_completed: '', id: 0 });
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
    }
  };

  // handlePut function
  const handlePut = async () => {
    try {
      const response = await fetch(`https://faux-api.com/api/v1/todo_17484665438427394/${editingItemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([formData]),
      });

      await response.json(); // Remove unused variable

      setFormData({ Title: '', date_added: '', date_completed: '', id: 0 });
      setEditingItemId(null);
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
    }
  };

  // deleteData function
  const deleteData = async (id: number) => {
    try {
      await fetch(`https://faux-api.com/api/v1/todo_17484665438427394/${id}`, {
        method: 'DELETE',
      });

      fetchData();
    } catch (error) {
    }
  };


  // Handle form changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Start editing an existing item
  const handleEdit = (item: DataItem) => {
    setFormData({ ...item });
    setEditingItemId(item.id);
    setIsModalOpen(true); // Open the modal for editing
  };

  // Submit form: Post or Put depending on editingItemId
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingItemId) {
      handlePut(); // Update existing data
    } else {
      handlePost(); // Add new data
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Reset form and modal when adding new data
  const handleAddNewItem = () => {
    setFormData({ Title: '', date_added: '', date_completed: '', id: 0 });
    setEditingItemId(null); // Ensure it's in "Add New" mode
    setIsModalOpen(true); // Open the modal
  };

  // Close modal when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsModalOpen(false); // Close the modal if click is outside
        setEditingItemId(null); // Reset editing mode
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside); // Listen for clicks outside the modal
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Clean up event listener
    };
  }, [isModalOpen]);

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-lg font-bold mb-4">Add, Edit, and Display Data</h1>

      <button
        onClick={handleAddNewItem}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      >
        Add New Item
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div
            ref={modalRef}
            className="bg-white p-6 rounded shadow-lg w-96"
          >
            <h2 className="text-lg font-bold mb-4">{editingItemId ? 'Edit' : 'Add'} Item</h2>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div>
                <label htmlFor="Title" className="block font-medium">
                  Title
                </label>
                <input
                  type="text"
                  id="Title"
                  name="Title"
                  value={formData.Title}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label htmlFor="date_added" className="block font-medium">
                  Date Added
                </label>
                <input
                  type="date"
                  id="date_added"
                  name="date_added"
                  value={formData.date_added}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label htmlFor="date_completed" className="block font-medium">
                  Date Completed
                </label>
                <input
                  type="date"
                  id="date_completed"
                  name="date_completed"
                  value={formData.date_completed}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              {/* Conditionally render submit or update button */}
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                {editingItemId ? 'Update' : 'Submit'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingItemId(null); // Reset editing mode when closing the modal
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Data List Section (Display fetched data immediately on first render) */}
      <h2 className="text-lg font-bold mb-2">Current Data</h2>
      {dataList.length > 0 ? (
        <ul className="space-y-2">
          {dataList.map((item) => (
            <li key={item.id} className="p-4 border rounded">
              <p><strong>Title:</strong> {item.Title}</p>
              <p><strong>Date Added:</strong> {item.date_added}</p>
              <p><strong>Date Completed:</strong> {item.date_completed}</p>
              <div className="flex justify-between">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded mt-2 hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteData(item.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded mt-2 hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default AddAndDisplayData;
