import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/tutorial.module.css'; // Import the CSS module
import FloatingLoginButton from '../components/FloatingLoginButton';

const Story = () => {
  const [scenes, setScenes] = useState([]); // State to hold the scenes
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const router = useRouter();

  // Function to navigate to the quiz page
  const handleNext = () => {
    router.push({
      pathname: '/room',
    });
  };

  // Fetch the learning content using OpenAI API
  useEffect(() => {
    const fetchLearningContent = async () => {
      try {
        const res = await fetch('/api/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'generateQuizContent' }),
        });

        const data = await res.json();

        if (res.ok) {
          // Parse the message data and set it to scenes
          const messageData = JSON.parse(data.message);
          setScenes([
            { title: messageData.Scene1 },
            { title: messageData.Scene2 },
            { title: messageData.Scene3 },
          ]);
        } else {
          alert('Failed to load learning content');
        }
      } catch (error) {
        console.error('Error fetching learning content:', error);
        alert('An error occurred while loading learning content.');
      } finally {
        setIsLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchLearningContent();
  }, []);

  // Render the story component
  return (
    <div className={styles['story-container']}>
                    <FloatingLoginButton />

      <div className={styles['story-background']}>
        
        {isLoading ? ( // Display loading indicator while data is being fetched
          <p className={styles['loading-text']}>Loading...</p>
        ) : (
            
          scenes.length > 0 && (
            <>
            
                <h1>How to Save Money</h1>
              <div className={styles['story-text-box']}>
                {scenes.map((scene, index) => (
                  <div key={index} className={styles['story-frame']}>
                    <h2 className={styles['font-joystix']}>{scene.title}</h2>
                  </div>
                ))}
              </div>
              <div className={styles['button-container']}>
                <button onClick={handleNext} className={styles['nav-button']}>
                  CONTINUE
                </button>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default Story;