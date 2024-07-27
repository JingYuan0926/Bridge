import React from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/quiz.module.css'; // Import the CSS module

const Quiz = () => {
  const router = useRouter();

  const handleChoiceClick = (choice) => {
    // Navigate to another page based on the choice
    router.push(`/complete`);
  };

  return (
    <div className={styles['quiz-container']}>
      <div className={styles['question-container']}>
        <p>Your question text goes here</p>
      </div>
      <div className={styles['characters-container']}>
        <img src="/gof.gif" alt="Character 1" className={styles.character} />
        <img src="/pirate.gif" alt="Character 2" className={styles.character} />
      </div>
      <div className={styles['choices-container']}>
        <button className={styles.choice} onClick={() => handleChoiceClick('Choice 1')}>Choice 1</button>
        <button className={styles.choice} onClick={() => handleChoiceClick('Choice 2')}>Choice 2</button>
        <button className={styles.choice} onClick={() => handleChoiceClick('Choice 3')}>Choice 3</button>
        <button className={styles.choice} onClick={() => handleChoiceClick('Choice 4')}>Choice 4</button>
      </div>
    </div>
  );
};

export default Quiz;
