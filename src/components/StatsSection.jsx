import React, { useEffect, useState } from 'react';
import { stats } from '../mockData';

const StatsSection = () => {
  const [counter, setCounter] = useState(0);
  
  // Get the Projects stat from mockData
  const projectsStat = stats.find(stat => stat.label === "Happy Clients");

  useEffect(() => {
    if (!projectsStat) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;
    const increment = projectsStat.value / steps;
    
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= projectsStat.value) {
        current = projectsStat.value;
        clearInterval(timer);
      }
      setCounter(Math.floor(current));
    }, stepDuration);

    return () => clearInterval(timer);
  }, [projectsStat]);

  if (!projectsStat) return null;

  return (
    <section className="bg-zinc-900 py-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center">
          <div className="text-center max-w-2xl">
            <h3 className="text-white text-7xl md:text-8xl font-bold mb-4">
              {counter}+
            </h3>
            <p className="text-gray-400 text-lg md:text-xl tracking-widest uppercase">
              {projectsStat.label}
            </p>
            <p className="text-gray-500 text-sm mt-4 max-w-md mx-auto">
              Capturing moments and creating memories for clients worldwide
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;