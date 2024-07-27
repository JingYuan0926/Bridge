import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/tutorial.module.css'; // Import the CSS module

const Story = () => {
    const router = useRouter();

    const handleNext = () => {
        router.push({
            pathname: '/quiz',
        });
    };

    return (
        <div className={styles['story-container']}>
            <div className={styles['story-content']}>
                <p>PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER</p>
                <button onClick={handleNext} className={styles['nav-button']}>Go to Quiz</button>
            </div>
        </div>
    );
};

export default Story;