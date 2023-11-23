import * as React from "react";
import { ChakraProvider, CSSReset, Box, Container } from '@chakra-ui/react';
import { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <CSSReset />
      <Container maxW="container.xl" centerContent>
        <Box maxW="container.md" mx="auto">
          <Component {...pageProps} />
        </Box>
      </Container>
    </ChakraProvider>
  );
}


export default MyApp;
