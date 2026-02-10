import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (user === null) 
    return NextResponse.json({ message: "Email ou senha inválido!" }, { status: 404})

  if (!bcrypt.compareSync(password, user.password)) 
    return NextResponse.json({ message: "Email ou senha inválido!" }, { status: 404})

  const payload = {
    id: user.id,
    role: user.role
  }

  if (!process.env.JWT_SECRET) throw new Error("Missing JWT Secret on .env");
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
  
  const cookieStore = await cookies();
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: (60 * 60 * 24) * 5, // 1 day * 5 
    path: '/',
  });
    
  return NextResponse.json({ message: "Logado com sucesso" });
}
