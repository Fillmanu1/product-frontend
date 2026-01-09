export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl?: string; // URL รูปภาพสินค้า (ถ้ามี)
}