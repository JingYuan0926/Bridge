import Head from 'next/head';
import { useRouter } from 'next/router';  // Import useRouter from next/router
import FloatingLoginButton, { StartButton } from '../components/FloatingLoginButton';  // Import the FloatingLoginButton component

export default function LandingPage() {
  const router = useRouter();  // Initialize the router

  // Function to handle button click
  const handleStartClick = () => {
    router.push('/map');  // Navigate to the map page
  };

  return (
    <div className="container">
      <Head>
        <title>Landing Page</title>
        <meta name="description" content="Landing page for the LEarn game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="main">
        <div className="buttons">
          <FloatingLoginButton/>
        </div>
      </main>
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow: hidden;
        }
        .container {
          width: 100vw;
          height: 100vh;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          background-image: url('/brg.jpeg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
        .main {
          width: 100%;
          padding: 2rem 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .buttons {
          margin-bottom: 2rem;
        }
        .play-button {
          font-size: 2.3rem;
          padding: 2rem 5rem;
          background-color: #0000be;
          border: none;
          color: white;
          border-radius: 25px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          opacity: 0.9;
          transition: background-color 0.3s ease;
        }
        .button-text {
          font-weight: 700;
        }
        .play-button:hover {
          background-color: #0059c1;
        }
      `}</style>
    </div>
  );
}
