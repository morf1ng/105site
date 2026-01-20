'use client';
import { useEffect, useRef, useState } from 'react';

const codeLines = [
  'function solution() {',
  '  return [',
  '    "Веб-разработка",',
  '    "Мобильные приложения",',
  '    "UI-UX дизайн",',
  '    "Telegram-боты"',
  '  ].join("\\n");',
  '}',
  '',
  '// Всё для вас!',
  '// Код. Дизайн. Результат.',
];

const Typewriter = () => {
    const [mounted, setMounted] = useState(false);
    const [lineIndex, setLineIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [done, setDone] = useState(false);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (done) return;
        const timer = setTimeout(() => {
        const line = codeLines[lineIndex];
        if (charIndex < line.length) {
            setCharIndex(charIndex + 1);
        } else {
            // line finished
            if (lineIndex < codeLines.length - 1) {
            setLineIndex(lineIndex + 1);
            setCharIndex(0);
            } else {
            setDone(true);
            }
        }
        }, 50);
        return () => clearTimeout(timer);
    }, [lineIndex, charIndex, done]);

     const visible = mounted
        ? codeLines.slice(0, lineIndex + 1).map((line, i) =>
            i === lineIndex ? line.slice(0, charIndex) : line
        )
        : [];

    return (
        <div className="hero__right-code glass-border">
            <div className="hero__right-code-header">
                <div className="hero__right-code-dots">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                </div>
                index.js - Soft Studio
            </div>
            <div className="hero__right-code-body">
                <div className="typewriter-container">
                    {visible.map((text, i) => (
                        <div key={i} className="code-line">
                            {text}
                            {i===lineIndex && mounted && <span className="typewriter-cursor">|</span>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Typewriter