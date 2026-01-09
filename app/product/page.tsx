'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = 'http://localhost:3000/products';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm('คุณต้องการลบสินค้านี้ใช่หรือไม่?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
        alert('ลบสินค้าสำเร็จ');
      } else {
        alert('ลบไม่สำเร็จ');
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาด');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📦 จัดการสินค้า
          </h1>
          <p className="text-gray-600">ระบบจัดการข้อมูลสินค้า</p>
        </div>

        {/* Add Button */}
        <div className="mb-6">
          <Link href="/product/create">
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-200 transform hover:scale-105">
              + เพิ่มสินค้าใหม่
            </button>
          </Link>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">ยังไม่มีสินค้าในระบบ</p>
            <Link href="/product/create">
              <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium">
                เพิ่มสินค้าแรก →
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-bold text-white group-hover:scale-105 transition-transform">
                      {p.name}
                    </h3>
                    <span className="bg-white/20 text-white text-xs px-2 py-1 rounded">
                      #{p.id}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Price */}
                  <div className="mb-4">
                    <p className="text-3xl font-bold text-indigo-600">
                      ฿{p.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {p.description || 'ไม่มีรายละเอียด'}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <Link 
                      href={`/product/${p.id}/detail`}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-3 rounded-lg transition text-center text-sm"
                    >
                      👁️ ดู
                    </Link>
                    <Link 
                      href={`/product/${p.id}`}
                      className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 px-3 rounded-lg transition text-center text-sm"
                    >
                      ✏️ แก้ไข
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-3 rounded-lg transition text-sm"
                    >
                      🗑️ ลบ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-600">
            รวมทั้งหมด: <span className="font-bold text-indigo-600">{products.length}</span> รายการ
          </p>
        </div>
      </div>
    </div>
  );
}