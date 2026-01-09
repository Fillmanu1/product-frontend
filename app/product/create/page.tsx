'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateProduct() {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price: Number(price), description }),
      });

      if (res.ok) {
        alert('เพิ่มสินค้าสำเร็จ');
        router.push('/product');
      } else {
        const errorData = await res.json();
        if (Array.isArray(errorData.message)) {
          setErrorMessage(errorData.message.join(', '));
        } else {
          setErrorMessage(errorData.message || 'เกิดข้อผิดพลาดในการบันทึก');
        }
      }
    } catch (error) {
      setErrorMessage('ไม่สามารถเชื่อมต่อกับ Server ได้');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/product" className="text-green-600 hover:text-green-800 font-medium">
            ← กลับไปรายการสินค้า
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              ➕ เพิ่มสินค้าใหม่
            </h1>
            <p className="text-green-100">กรอกข้อมูลสินค้าที่ต้องการเพิ่ม</p>
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

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
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
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none"
                  placeholder="กรอกรายละเอียดสินค้า (ถ้ามี)"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? '⏳ กำลังบันทึก...' : '💾 บันทึก'}
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
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">💡 คำแนะนำ</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• กรอกชื่อสินค้าและราคาให้ครบถ้วน</li>
            <li>• ระบุรายละเอียดเพื่อความชัดเจน</li>
            <li>• ตรวจสอบข้อมูลก่อนบันทึก</li>
          </ul>
        </div>
      </div>
    </div>
  );
}