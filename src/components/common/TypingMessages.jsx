import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

const messages = ["Crawling social media...", "Verifying metadata...", "Analyzing misinformation patterns...", "Fact-checking live streams...", "Updating national database..."];

const TypingMessages = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const handleTyping = () => {
      const fullText = messages[currentMessageIndex];
      
      if (!isDeleting) {
        // Typing
        setCurrentText(fullText.substring(0, currentText.length + 1));
        setTypingSpeed(100);

        if (currentText === fullText) {
          // Pause before deleting
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Deleting
        setCurrentText(fullText.substring(0, currentText.length - 1));
        setTypingSpeed(50);

        if (currentText === "") {
          setIsDeleting(false);
          setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentMessageIndex, typingSpeed]);

  return (
    <div className="absolute left-[48.5%] md:left-[47.5%] lg:left-[48.5%] -translate-x-1/2 bottom-[32%] z-30 w-[110px] sm:w-[130px] flex justify-start text-left">
      <p className="font-nokia font-bold text-[#2A3616] text-[10px] sm:text-[14px] leading-tight break-words min-h-[1.5em]">
        {currentText}
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          className="inline-block w-1.5 h-3 bg-[#2A3616] ml-1 align-middle"
        />
      </p>
    </div>
  );
};

export default TypingMessages;
