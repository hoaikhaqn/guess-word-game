import MainMenu from "@/components/templates/MainMenu"
import MessegerFB from "@/lib/messenger"
import Script from "next/script"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center container items-center gap-10">
      <div className="mb-10 text-center">
        <h1 className="text-5xl mb-5 font-bold text-foreground uppercase">Guess word</h1>
        <span className="text-4xl px-3 py-1 font-bold text-white uppercase bg-foreground rounded-xl">The game</span>
      </div>
      <MainMenu />
      {/* <MessegerFB /> */}
      <div id="fb-customer-chat" className="fb-customerchat"></div>
      <Script strategy="lazyOnload" id="facebook-chat">
        {`
        var chatbox = document.getElementById('fb-customer-chat');
        chatbox.setAttribute("page_id", "102712775611937");
        chatbox.setAttribute("attribution", "biz_inbox");
  
        window.fbAsyncInit = function() {
          FB.init({
            xfbml            : true,
            version          : 'v12.0'
          });
        };
  
        (function(d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          js = d.createElement(s); js.id = id;
          js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
        `}
      </Script>
    </main>
  )
}
