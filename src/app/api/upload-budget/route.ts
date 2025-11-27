import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name.replaceAll(' ', '_');

    // Define the path to save the file temporarily
    // In a real application, you might use a dedicated temp directory or cloud storage
    const uploadDir = path.join(process.cwd(), 'tmp');
    const filePath = path.join(uploadDir, filename);

    // Ensure the upload directory exists
    // await mkdir(uploadDir, { recursive: true }); // This would require 'fs/promises' mkdir

    await writeFile(filePath, buffer);

    // TODO: Implement Excel parsing and calculation logic here
    // For now, just return success
    console.log(`File saved to ${filePath}`);

    return NextResponse.json({ message: 'File uploaded successfully!', filePath }, { status: 200 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file.' }, { status: 500 });
  }
}
