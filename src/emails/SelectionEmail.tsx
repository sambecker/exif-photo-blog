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
  Hr,
  Tailwind,
  Row,
  Column,
  Img,
  Button,
} from '@react-email/components';
import * as React from 'react';

interface SelectionEmailProps {
  photos: {
    id: string;
    title: string;
    urlHighRes?: string;
    url?: string;
  }[];
}

export default function SelectionEmail({ photos = [] }: SelectionEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Tus fotos seleccionadas están listas</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Tus Fotos Seleccionadas
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Aquí tienes los enlaces para descargar las versiones en alta resolución de las fotos que seleccionaste.
            </Text>

            <Section className="mt-4">
              {photos.map((photo) => (
                <div key={photo.id} className="mb-6 p-4 border rounded-lg border-gray-200">
                  <Row>
                    <Column className="w-[80px]">
                      {/* Renders the stored CDN url; any rows reverted to r2.dev will display from r2.dev until the owner repairs the data. */}
                      <Img
                        src={photo.url}
                        width="80"
                        height="80"
                        className="rounded object-cover"
                        alt={photo.title}
                      />
                    </Column>
                    <Column className="pl-4">
                      <Text className="text-[14px] font-medium m-0 mb-2">
                        {photo.title || 'Untitled'}
                      </Text>
                      {photo.urlHighRes ? (
                        <Button
                          href={photo.urlHighRes}
                          className="bg-black text-white text-[12px] px-3 py-2 rounded no-underline"
                        >
                          Descargar Alta Res
                        </Button>
                      ) : (
                        <Text className="text-gray-500 text-[12px]">
                          Alta resolución no disponible
                        </Text>
                      )}
                    </Column>
                  </Row>
                </div>
              ))}
            </Section>

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              Gracias por participar en Polifonía Visual.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
