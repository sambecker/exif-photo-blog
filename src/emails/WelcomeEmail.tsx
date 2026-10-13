/* eslint-disable max-len */
import {
  Html,
  Body,
  Head,
  Heading,
  Container,
  Preview,
  Section,
  Text,
  Img,
  Link,
  Hr,
  Tailwind,
} from '@react-email/components';
import * as React from 'react';

import { BASE_URL, EMAIL_HEADER_URL } from '@/app/config';

export default function WelcomeEmail() {
  return (
    <Html>
      <Head />
      <Preview>Bienvenido a la Galería Parker</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src={EMAIL_HEADER_URL}
                width="100%"
                height="auto"
                alt="Proyecto Polifonía Visual Header"
                className="rounded-t-lg mx-auto"
              />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Bienvenido a POLIFONÍA VISUAL
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hola,
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              ¡Gracias por unirte a POLIFONÍA VISUAL! Este proyecto está diseñado para ser una fuente de inspiración y un lienzo digital. Aquí podrás explorar fotografías y seleccionar aquellas que te provoquen a crear, ya sea escribiendo, dibujando o pintando digitalmente sobre ellas.
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Text className="text-black text-[16px] font-semibold">
                ¿Cómo funciona?
              </Text>
              <div className="text-left px-4">
                <Text className="text-black text-[14px] leading-[24px]">
                  <strong>1. Inspírate:</strong> Navega por nuestra colección de fotografías únicas.
                </Text>
                <Text className="text-black text-[14px] leading-[24px]">
                  <strong>2. Selecciona:</strong> Utiliza el botón &quot;Select&quot; en las imágenes que despierten tu creatividad y quieras &quot;intervenir&quot;.
                </Text>
                <Text className="text-black text-[14px] leading-[24px]">
                  <strong>3. Crea:</strong> Una vez confirmada tu selección, recibirás un correo con los enlaces para descargar las fotos en alta resolución, listas para tu intervención digital.
                </Text>
              </div>
            </Section>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Link
                href={`${BASE_URL}/`}
                className="bg-[#000000] text-white rounded px-5 py-3 text-[12px] font-semibold no-underline text-center"
              >
                Comienza a Intervenir
              </Link>
            </Section>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              Si no esperabas este correo, puedes ignorarlo.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
