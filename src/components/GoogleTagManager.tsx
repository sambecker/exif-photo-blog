import Script from 'next/script';

const GoogleTagManager = ({ mode }: { mode: string }) => {
  if (mode === 'head') {
    return (
      <Script
        id="gtm-script"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-P4BXHRW4');`,
        }}
      />
    );
  } else if (mode === 'body') {
    return (
      <Script
        id="gtm-noscript"
        dangerouslySetInnerHTML={{
          __html: `
        <!-- Google Tag Manager (noscript) -->
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P4BXHRW4"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>
        </noscript>
        <!-- End Google Tag Manager (noscript) -->
      `,
        }}
      />
    );
  }
}; // Add a semicolon at the end

export default GoogleTagManager;

