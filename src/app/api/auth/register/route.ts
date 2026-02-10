import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password)
      return NextResponse.json({ message: "Preencha todos os campos!" }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (user !== null)
      return NextResponse.json({ message: "Email já em uso!" }, { status: 400 });

    const crypted_pass = bcrypt.hashSync(password, 10);

    await prisma.user.create({
      data: {
        email,
        name,
        password: crypted_pass
      }
    });

    return NextResponse.json({ message: "Registrado com sucesso!" }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
