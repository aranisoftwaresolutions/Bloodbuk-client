import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchCategories } from '../../../redux/slices/categorySlices';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { FaCloudUploadAlt, FaTrash, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css';
import AdminSidebar from '../../../Components/Admin/AdminSidebar';
import { addProduct } from '../../../redux/slices/productSlices';


const NewProduct = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { categories } = useSelector(s => s.categories);
    const { loading, error } = useSelector(s => s.products);

    // Basic fields
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');

    // Color variants
    const [colorVariants, setColorVariants] = useState([]);

    useEffect(() => {
        dispatch(fetchCategories());
        setColorVariants([{
            colorName: '',
            stock: '',
            files: [],
            previews: [],
            colorImageFile: null,
            colorImagePreview: ''
        }]);
    }, [dispatch]);

    // Handlers
    const handleBasicSubmit = e => {
        e.preventDefault();
        if (!name || !price || !category || !subcategory || !description) {
            toast.error('Please fill all required fields.');
            return;
        }
        const fd = new FormData();
        fd.append('name', name);
        fd.append('price', price);
        fd.append('category', category);
        fd.append('subcategory', subcategory);
        fd.append('description', description);
        fd.append('numColorVariants', colorVariants.length);

        colorVariants.forEach((v, i) => {
            fd.append(`colorName${i}`, v.colorName || `Color ${i + 1}`);
            fd.append(`colorStock${i}`, v.stock || '');
            if (v.colorImageFile) fd.append(`colorImage${i}`, v.colorImageFile);

            // Push default image file first, then the rest (excluding default)
            if (v.files.length) {
                const orderedFiles = [
                    v.files[v.defaultImageIndex],
                    ...v.files.filter((f, idx) => idx !== v.defaultImageIndex)
                ];
                orderedFiles.forEach(file => fd.append(`colorImages${i}`, file));
            }
        });

        dispatch(addProduct(fd))
            .unwrap()
            .then(() => {
                toast.success('Product created!');
                setTimeout(() => navigate('/admin/products'), 1500);
            })
            .catch(err => toast.error(err.message || 'Failed to create.'));
    };

    const handleVariantChange = (idx, field, val) => {
        setColorVariants(vs =>
            vs.map((v, i) => i === idx ? { ...v, [field]: val } : v)
        );
    };
    const handleColorImage = (idx, e) => {
        const file = e.target.files[0];
        if (!file) return;
        const preview = URL.createObjectURL(file);
        handleVariantChange(idx, 'colorImageFile', file);
        handleVariantChange(idx, 'colorImagePreview', preview);
        e.target.value = null;
    };
    const removeColorImage = idx => {
        handleVariantChange(idx, 'colorImageFile', null);
        handleVariantChange(idx, 'colorImagePreview', '');
    };


    const handleFilesUpload = (idx, e) => {
        const files = Array.from(e.target.files);
        const previews = files.map(f => URL.createObjectURL(f));
        setColorVariants(vs =>
            vs.map((v, i) => i === idx
                ? { ...v, files, previews }
                : v
            )
        );
        e.target.value = null;
    };
    const removeFile = (vi, fi) => {
        setColorVariants(vs =>
            vs.map((v, i) => i === vi
                ? {
                    ...v,
                    previews: v.previews.filter((_, j) => j !== fi),
                    files: v.files.filter((_, j) => j !== fi)
                }
                : v
            )
        );
    };
    const addVariant = () =>
        setColorVariants(vs => [
            ...vs,
            { colorName: '', stock: '', files: [], previews: [], colorImageFile: null, colorImagePreview: '' }
        ]);
    const removeVariant = idx =>
        setColorVariants(vs => vs.filter((_, i) => i !== idx));

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <AdminSidebar />
            <main className="flex-1 p-6 lg:p-8 overflow-auto pl-[64px] lg:pl-[258px]">
                <ToastContainer />
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Product</h1>
                <form onSubmit={handleBasicSubmit} className="space-y-8 max-w-4xl mx-auto">
                    {/* Basic Info */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow p-6"
                    >
                        <div className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-t-2xl mb-6">
                            <h2 className="text-white text-xl font-semibold">Basic Information</h2>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="block mb-1 text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-gray-700">Price</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-gray-700">Category</label>
                                <select
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1 text-gray-700">Subcategory</label>
                                <select
                                    value={subcategory}
                                    onChange={e => setSubcategory(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
                                    required
                                >
                                    <option value="">Select Subcategory</option>
                                    {categories
                                        .find(c => c._id === category)
                                        ?.subcategories.map(sub => (
                                            <option key={sub._id} value={sub._id}>{sub.name}</option>
                                        ))}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block mb-1 text-gray-700">Description</label>
                                <ReactQuill
                                    theme="snow"
                                    value={description}
                                    onChange={setDescription}
                                    className="bg-white rounded-md"
                                />
                            </div>
                        </div>
                    </motion.section>

                    {/* Color Variants */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl shadow p-6"
                    >
                        <div className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-t-2xl mb-6">
                            <h2 className="text-white text-xl font-semibold">Color Variants</h2>
                        </div>
                        <div className="space-y-8">
                            {colorVariants.map((v, i) => (
                                <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-gray-800">Variant {i + 1}</h3>
                                        {colorVariants.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeVariant(i)}
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div>
                                            <label className="block mb-1 text-gray-700">Color Name</label>
                                            <input
                                                type="text"
                                                value={v.colorName}
                                                onChange={e => handleVariantChange(i, 'colorName', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-gray-700">Stock</label>
                                            <input
                                                type="number"
                                                value={v.stock}
                                                onChange={e => handleVariantChange(i, 'stock', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-400"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block mb-1 text-gray-700">Dedicated Image</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={e => handleColorImage(i, e)}
                                                className="text-sm"
                                            />
                                            {v.colorImagePreview && (
                                                <div className="mt-2 flex items-center space-x-2">
                                                    <img
                                                        src={v.colorImagePreview}
                                                        alt=""
                                                        className="w-24 h-24 rounded-md object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeColorImage(i)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-gray-700">Additional Images</label>
                                        <label className="flex items-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                                            <FaCloudUploadAlt className="text-gray-500" />
                                            <span className="text-gray-600">Upload Images</span>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={e => handleFilesUpload(i, e)}
                                                className="hidden"
                                            />
                                        </label>
                                        {v.previews.length > 0 && (
                                            <div className="mt-4 grid grid-cols-3 gap-4">
                                                {v.previews.map((src, fi) => (
                                                    <div key={fi} className="relative">
                                                        <img src={src} alt="" className="w-full h-24 object-cover rounded-md" />
                                                        <button type="button" onClick={() => removeFile(i, fi)} className="..."><FaTrash /></button>
                                                        <button type="button"
                                                            onClick={() => handleVariantChange(i, 'defaultImageIndex', fi)}
                                                            className={"absolute left-1 bottom-1 p-1 rounded-full " + (v.defaultImageIndex === fi ? 'bg-green-500 text-white' : 'bg-white text-gray-700')}>
                                                            ⭐
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addVariant}
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                            >
                                + Add Variant
                            </button>
                        </div>
                    </motion.section>

                    <div className="text-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-lg"
                        >
                            {loading ? 'Creating…' : 'Create Product'}
                        </button>
                        {error && <p className="mt-2 text-red-600">{error}</p>}
                    </div>
                </form>
            </main>
        </div>
    );
};

export default NewProduct;
