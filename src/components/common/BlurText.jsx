import React from 'react';
import { motion } from 'motion/react';

const BlurText = ({
  text,
  className = '',
  delay = 0,
}) => {
  const words = text.split(' ');

  return (
    <div className={`flex flex-wrap justify-center content-center row-gap-[0.1em] ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ filter: 'blur(10px)', opacity: 0, y: 50 }}
          whileInView={{
            filter: ['blur(10px)', 'blur(5px)', 'blur(0px)'],
            opacity: [0, 0.5, 1],
            y: [50, -5, 0],
          }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{
            duration: 0.7,
            times: [0, 0.5, 1],
            ease: 'easeOut',
            delay: delay / 1000 + (i * 100) / 1000,
          }}
          style={{ display: 'inline-block', marginRight: '0.28em' }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};

export default BlurText;
