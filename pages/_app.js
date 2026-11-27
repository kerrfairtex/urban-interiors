import { ChakraProvider } from '@chakra-ui/react'
import Layout from '../components/Layout'
import '@fontsource/plus-jakarta-sans/300.css'
import '@fontsource/plus-jakarta-sans/400.css'
import '@fontsource/plus-jakarta-sans/500.css'
import '@fontsource/plus-jakarta-sans/600.css'
import '@fontsource/plus-jakarta-sans/700.css'
import '@fontsource/plus-jakarta-sans/800.css'
import '@fontsource/great-vibes/latin-400'

import '../styles/globals.css'

import { theme } from '../styles/theme'
import { persistor, store } from '../store/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { Router } from 'next/router'
import Head from 'next/head'
import NProgress from 'nprogress'

function MyApp({ Component, pageProps }) {
  NProgress.configure({ showSpinner: true });

  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  });

  Router.events.on('routeChangeComplete', () => {
    NProgress.done();
  });

  return (
    <>
      <Head>
        <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css' integrity='sha512-42kB9yDlYiCEfx2xVwq0q7hT4uf26FUgSIZBK8uiaEnTdShXjwr8Ip1V4xGJMg3mHkUt9nNuTDxunHF0/EgxLQ==' crossOrigin='anonymous' referrerPolicy='no-referrer' />
        {pageProps.og && <>
          <meta property='og:type' content='product' />
          <meta property='og:site_name' content='Ka Elton Furniture' />
          <meta property='og:title' content={pageProps.og.title} />
          <meta property='og:description' content={pageProps.og.description} />
          <meta property='og:url' content={pageProps.og.url} />
          {pageProps.og.image && <meta property='og:image' content={pageProps.og.image} />}
          <meta name='twitter:card' content='summary_large_image' />
        </>}
      </Head>
      <Provider store={store}>
        <ChakraProvider theme={theme}>
          <PersistGate loading={null} persistor={persistor}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </PersistGate>
        </ChakraProvider>
      </Provider>
    </>
  )
}

export default MyApp