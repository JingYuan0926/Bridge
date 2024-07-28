import React from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/complete.module.css'; // Import the CSS module

const Quiz = () => {
  const router = useRouter();

  const handleChoiceClick = (choice) => {
    // Navigate to another page based on the choice
    router.push(`/complete`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>You Win!</h1>
      <img src="/csy1.png" alt="Quiz Image" className={styles.image} />
      <div className={styles.buttonContainer}>
        <button onClick={() => handleChoiceClick('choice1')} className={styles.button}>Easier pls</button>
        <button onClick={() => handleChoiceClick('choice2')} className={styles.button}>Maintain</button>
        <button onClick={() => handleChoiceClick('choice3')} className={styles.button}>Harder pls</button>
      </div>
    </div>
  );
};

export default Quiz;
