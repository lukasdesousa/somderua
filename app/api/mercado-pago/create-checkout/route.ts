// app/api/mercado-pago/create/route.ts
import { NextResponse } from 'next/server';
import { Preference } from 'mercadopago';
import mpClient from '@/lib/mercado-pago';
import { v4 as uuidv4 } from 'uuid';
import { SignJWT } from 'jose';
import { PrismaClient } from '@prisma/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const prisma = new PrismaClient();

if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
  throw new Error('Falta variável de ambiente MERCADO_PAGO_ACCESS_TOKEN');
}
if (!process.env.JWT_SECRET) {
  throw new Error('Falta variável de ambiente JWT_SECRET');
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req: Request) {
  const body = await req.json();
  const { userEmail, name } = body;

  const id = uuidv4();

  // Gera um JWT curto para proteger urls de retorno
  const extRef = uuidv4();
  const jwt = await new SignJWT({ ext: extRef })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('5m')
    .sign(secret);

  const origin = req.headers.get('origin') ?? ''; // pode querer fallback seguro
  if (!origin) {
    return NextResponse.json({ error: 'Origin não especificado' }, { status: 400 });
  }

  // URLs que o usuário verá
  const successUrl = `${origin}/download?reference=${id}`;
  const failureUrl = `${origin}/pagamento-recusado?status=failure&token=${jwt}&payment_id=${id}`;
  const pendingUrl = `${origin}/pagamento-pendente?status=pending&payment_id=${id}`;

  try {
    const preference = new Preference(mpClient);
    const pref = await preference.create({
      body: {
        external_reference: id,
        metadata: { id },

        // dados do pagador 
        ...(userEmail && {
          payer: {
            email: userEmail,
            name: name,
            surname: '',
          },
        }),

        items: [
          {
            id: String(id),
            description: "Pack com mais de 4500 músicas",
            title: "Pack Som de Rua",
            quantity: 1,
            unit_price: 5.00,
            currency_id: "BRL",
            category_id: "5805",
          },
        ],

        payment_methods: {
          excluded_payment_methods: [
            { id: "bolbradesco" },
            { id: "pec" },
          ],
          excluded_payment_types: [
            { id: "debit_card" },
            { id: "credit_card" },
          ],
          installments: 1,
        },

        auto_return: "approved",
        back_urls: {
          success: successUrl,
          failure: failureUrl,
          pending: pendingUrl,
        },
        notification_url: `${origin}/api/mercado-pago/webhook`

        // Você pode também definir validade da preferência, por exemplo:
        // expires: false,
        // expiration_date_from: "...",
        // expiration_date_to: "...",
      },
    });

    if (!pref || !pref.id) {
      throw new Error('Erro: preferência do Mercado Pago não retornou ID');
    }

    try {
      await prisma.user_payment.create({
        data: {
          id: id,
          user_name: name,
          email: userEmail,
          payment_method: "",      // vazio no início
          approved: false,         // ainda não aprovado
          mpPaymentId: pref.id,
          createdAt: new Date(),
        },
      });
    } catch (error) {
      console.log((error as Error).message)
    }

    const response = NextResponse.json({
      preferenceId: pref.id,
      initPoint: pref.init_point,
    });

    // Definir cookies de token (opcional)
    response.cookies.set('success_token', jwt, {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 10, // 10 minutos, por exemplo
    });
    response.cookies.set('pending_token', jwt, {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 10,
    });
    response.cookies.set('failure_token', jwt, {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 10,
    });

    return response;
  } catch (err) {
    console.error('Erro ao criar preferência Mercado Pago:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro interno' },
      { status: 500 }
    );
  }
}
