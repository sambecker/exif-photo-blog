import Script from 'next/script';

const CookieBot = () => {
  return (
    <>
      <Script
        id='Cookiebot'
        strategy='lazyOnload'
        src="https://consent.cookiebot.com/uc.js"
        data-cbid="68e4778d-0ab1-4290-8eb2-cdf029f4ea2b"
        data-blockingmode="auto"
        type="text/javascript"
      />
    </>
  )
}


export default CookieBot;
