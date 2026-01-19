import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Grow by Mediavine Script - Required for Mediavine Verification */}
        <script 
          data-grow-initializer=""
          dangerouslySetInnerHTML={{__html: `
            !(function(){
              window.growMe || (
                (window.growMe = function(e){ window.growMe._.push(e); }),
                (window.growMe._ = [])
              );
              var e = document.createElement("script");
              e.type = "text/javascript";
              e.src = "https://faves.grow.me/main.js";
              e.defer = true;
              e.setAttribute(
                "data-grow-faves-site-id",
                "U2l0ZTo5ZmZmYjE4Yi0wMmU2LTQ5YTYtYWRiYy05NGViMmU0OGU4NjY="
              );
              var t = document.getElementsByTagName("script")[0];
              t.parentNode.insertBefore(e, t);
            })();
          `}}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}