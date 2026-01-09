'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/types/product';

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://product-backend-pi.vercel.app/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        } else {
          alert('ไม่พบสินค้านี้');
          router.push('/product');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาด');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, router]);

  const handleDelete = async () => {
    if (!confirm('คุณต้องการลบสินค้านี้ใช่หรือไม่?')) return;

    try {
      const res = await fetch(`https://product-backend-pi.vercel.app/products/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert('ลบสินค้าสำเร็จ');
        router.push('/product');
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
        <div className="text-xl">กำลังโหลด...</div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/product" className="text-blue-600 hover:text-blue-800 font-medium">
            ← กลับไปรายการสินค้า
          </Link>
        </div>

        {/* Product Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
            <p className="text-blue-100">รหัสสินค้า: #{product.id}</p>
          </div>

          {/* Content Section */}
          <div className="px-8 py-8">
            {/* Price */}
            <div className="mb-8">
              <p className="text-gray-600 text-sm mb-2">ราคา</p>
              <p className="text-4xl font-bold text-indigo-600">
                ฿{product.price.toLocaleString()}
              </p>
            </div>

            {/* Description */}
            <div className="mb-8">
              <p className="text-gray-600 text-sm mb-2">รายละเอียด</p>
              <p className="text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-lg">
                {product.description || 'ไม่มีรายละเอียด'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <Link 
                href={`/product/${product.id}`}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 text-center"
              >
                ✏️ แก้ไขสินค้า
              </Link>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                🗑️ ลบสินค้า
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
          <h3 className="font-semibold text-gray-700 mb-3">ข้อมูลเพิ่มเติม</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">สถานะ</p>
              <p className="text-green-600 font-semibold">✓ พร้อมขาย</p>
            </div>
            <div>
              <p className="text-gray-500">หมวดหมู่</p>
              <p className="text-gray-700 font-semibold">สินค้าทั่วไป</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}