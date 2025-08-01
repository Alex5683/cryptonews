import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import Category from '@/models/Category';

export async function GET() {
  try {
    await connectMongoDB();
    const categories = await Category.find().sort({ createdAt: -1 });
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectMongoDB();
    const data = await request.json();
    const { name, slug } = data;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const newCategory = new Category({ name, slug });
    await newCategory.save();

    return NextResponse.json({ message: 'Category created successfully', category: newCategory }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectMongoDB();
    const data = await request.json();
    const { id, name, slug } = data;

    if (!id || !name || !slug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    category.name = name;
    category.slug = slug;
    await category.save();

    return NextResponse.json({ message: 'Category updated successfully', category });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing category id' }, { status: 400 });
    }

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    await category.deleteOne();

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
