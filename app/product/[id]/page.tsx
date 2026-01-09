'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://product-backend-pi.vercel.app/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setName(data.name);
          setPrice(data.price);
          setDescription(data.description);
          setCharCount(data.description.length);
        } else {
          alert('ไม่พบสินค้านี้');
          router.push('/product');
        }
      } catch (error) {
        alert('เกิดข้อผิดพลาด');
        router.push('/product');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (description.length > 100) {
      setErrorMessage('รายละเอียดต้องไม่เกิน 100 ตัวอักษร');
      return;
    }

    try {
      const res = await fetch(`https://product-backend-pi.vercel.app/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price: Number(price), description }),
      });

      if (res.ok) {
        alert('อัปเดตสินค้าสำเร็จ');
        router.push('/product');
      } else {
        const errorData = await res.json();
        if (Array.isArray(errorData.message)) {
          setErrorMessage(errorData.message.join(', '));
        } else {
          setErrorMessage(errorData.message || 'แก้ไขไม่สำเร็จ');
        }
      }
    } catch (error) {
      setErrorMessage('ไม่สามารถเชื่อมต่อกับ Server ได้');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/product" className="text-blue-600 hover:text-blue-800 font-medium">
            ← กลับไปรายการสินค้า
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              ✏️ แก้ไขสินค้า
            </h1>
            <p className="text-blue-100">รหัสสินค้า: #{id}</p>
          </div>

          {/* Form Section */}
          <div className="px-8 py-8">
            {/* Error Message */}
            {errorMessage && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex items-start">
                  <span className="text-red-500 text-xl mr-3">⚠️</span>
                  <div>
                    <h3 className="text-red-800 font-semibold mb-1">เกิดข้อผิดพลาด</h3>
                    <p className="text-red-700 text-sm">{errorMessage}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  ชื่อสินค้า <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="กรอกชื่อสินค้า"
                />
              </div>

              {/* Price Field */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  ราคา (บาท) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  รายละเอียด
                </label>
                <textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setCharCount(e.target.value.length);
                  }}
                  rows={4}
                  maxLength={100}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                  placeholder="กรอกรายละเอียดสินค้า (ถ้ามี)"
                />
                <p className="text-sm text-gray-500 mt-1">{charCount}/100 ตัวอักษร</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-200 transform hover:scale-105"
                >
                  💾 บันทึกการแก้ไข
                </button>
                <Link
                  href="/product"
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition text-center"
                >
                  ยกเลิก
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>💡 กรอกข้อมูลให้ครบถ้วนเพื่อแก้ไขสินค้า</p>
        </div>
      </div>
    </div>
  );
}