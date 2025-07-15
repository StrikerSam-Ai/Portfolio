import { useState, useCallback, useEffect, useRef } from 'react';

export const usePageTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentSection, setCurrentSection] = useState('hero');
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionsRef = useRef<{ id: string; element: HTMLElement | null }[]>([]);

  useEffect(() => {
    // Initialize sections once
    sectionsRef.current = [
      { id: 'hero', element: document.getElementById('hero') },
      { id: 'about', element: document.getElementById('about') },
      { id: 'portfolio', element: document.getElementById('portfolio') },
      { id: 'services', element: document.getElementById('services') },
      { id: 'contact', element: document.getElementById('contact') }
    ].filter(section => section.element !== null);
  }, []);

  useEffect(() => {
    const detectSection = () => {
      const scrollPos = window.scrollY + 80; // account for navbar height
      const sections = sectionsRef.current;
      if (!sections.length) return;
      // find last section whose top is above scrollPos
      let current = sections[0].id;
      for (const section of sections) {
        const el = section.element!;
        if (el.offsetTop <= scrollPos) {
          current = section.id;
        }
      }
      setCurrentSection(current);
    };

    window.addEventListener('scroll', detectSection, { passive: true });
    window.addEventListener('resize', detectSection);
    // initial check
    detectSection();

    return () => {
      window.removeEventListener('scroll', detectSection);
      window.removeEventListener('resize', detectSection);
    };
  }, []);

  const transitionToSection = useCallback((targetSection: string) => {
    if (isTransitioning) return;
    
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    
    setIsTransitioning(true);
    setCurrentSection(targetSection);
    
    const targetElement = document.getElementById(targetSection);
    if (targetElement) {
      const targetTop = targetElement.offsetTop;
      window.scrollTo({
        top: targetTop - 80, // Account for navbar height
        behavior: 'smooth' 
      });
      
      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 1000);
    } else {
      setIsTransitioning(false);
    }
  }, [isTransitioning]);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  return {
    isTransitioning,
    currentSection,
    transitionToSection
  };
};