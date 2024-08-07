import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';

export const POST = async (request: NextRequest, response: NextResponse) => {
  const formData = await request.formData();

  const file = formData.get('file') as File;
  const date = formData.get('date') as string;

  if (!file) {
    return NextResponse.json(
      { success: false, error: 'No files received.' },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = file.name.replaceAll(' ', '_');

  try {
    await mkdir(`${process.cwd()}/public/puzzles/${date}/`, {
      recursive: true,
    });

    await writeFile(
      path.join(process.cwd(), `/public/puzzles/${date}/` + filename),
      buffer,
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.log('Error occurred ', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
};
