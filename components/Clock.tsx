import React, { useState, useEffect, useRef } from "react";
import { Clock as ClockIcon } from "lucide-react";

interface ClockProps {
  value: string;
  onChange: (value: string) => void;
}

const Clock = ({ value, onChange }: ClockProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [angle, setAngle] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Convert current time to angle
    const [hours] = value.split(':');
    const hourNum = parseInt(hours, 10);
    const hour12 = hourNum % 12 || 12;
    const newAngle = (hour12 * 30) - 90; // 360/12 = 30 degrees per hour, -90 to start at 12 o'clock
    setAngle(newAngle);
  }, [value]);

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsDragging(true);
    handleMouseMove(e);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging && e.type === 'mousemove') return;
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    let angle = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);
    angle = (angle + 360) % 360;
    
    // Snap to hours (every 30 degrees)
    const snappedAngle = Math.round(angle / 30) * 30;
    setAngle(snappedAngle);

    // Convert angle to hour (1-12)
    let hour = Math.round(((snappedAngle + 90 + 360) % 360) / 30) % 12;
    if (hour === 0) hour = 12;
    
    // Convert to 24-hour format and ensure it's between 8 AM and 5 PM
    let hour24 = hour;
    if (hour === 12) {
      hour24 = 12;
    } else if (hour >= 1 && hour <= 4) {
      hour24 = hour + 12; // PM hours
    } else {
      hour24 = hour; // AM hours
    }

    // Only update if the time is between 8 AM and 5 PM
    if (hour24 >= 8 && hour24 <= 17) {
      onChange(`${hour24.toString().padStart(2, '0')}:00`);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove as any);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove as any);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const formatDisplayTime = (time: string) => {
    const [hours] = time.split(':');
    const hour = parseInt(hours, 10);
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const ampm = hour < 12 ? 'AM' : 'PM';
    return `${displayHour}:00 ${ampm}`;
  };

  return (
    <div className="flex items-center space-x-2 bg-white p-4 rounded-lg shadow-md">
      <ClockIcon className="h-5 w-5 text-coffee-medium" />
      <div className="relative w-[120px] h-[120px]">
        <svg
          ref={svgRef}
          className="w-full h-full"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Clock face */}
          <circle
            cx="60"
            cy="60"
            r="58"
            fill="white"
            stroke="#8B5E3C"
            strokeWidth="2"
          />
          
          {/* Hour markers */}
          {Array.from({ length: 12 }).map((_, i) => {
            const markerAngle = i * 30 - 90;
            const x1 = 60 + Math.cos((markerAngle * Math.PI) / 180) * 50;
            const y1 = 60 + Math.sin((markerAngle * Math.PI) / 180) * 50;
            const x2 = 60 + Math.cos((markerAngle * Math.PI) / 180) * 58;
            const y2 = 60 + Math.sin((markerAngle * Math.PI) / 180) * 58;
            
            // Calculate the hour for this marker (1-12)
            const markerHour = ((i + 12) % 12) || 12; // Changed from (i + 9) to (i + 12) to align 12 correctly at top
            // Convert to 24-hour format
            let hour24 = markerHour;
            if (markerHour === 12) {
              hour24 = 12;
            } else if (markerHour >= 1 && markerHour <= 4) {
              hour24 = markerHour + 12;
            }
            
            // Determine if this hour should be highlighted (between 8 AM and 5 PM)
            const isActive = hour24 >= 8 && hour24 <= 17;
            
            return (
              <g key={i}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isActive ? "#8B5E3C" : "#CCCCCC"}
                  strokeWidth="2"
                  className="hover:cursor-pointer"
                />
                {isActive && (
                  <text
                    x={60 + Math.cos((markerAngle * Math.PI) / 180) * 40}
                    y={60 + Math.sin((markerAngle * Math.PI) / 180) * 40}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#8B5E3C"
                    fontSize="10"
                    className="hover:cursor-pointer"
                  >
                    {markerHour}
                  </text>
                )}
                
              </g>
            );
          })}

          {/* Hour hand */}
          <line
            x1="60"
            y1="60"
            x2={60 + Math.cos((angle * Math.PI) / 180) * 35}
            y2={60 + Math.sin((angle * Math.PI) / 180) * 35}
            stroke="#4A3428"
            strokeWidth="4"
            strokeLinecap="round"
            
          />

          {/* Center dot */}
          <circle cx="60" cy="60" r="3" fill="#4A3428" />
        </svg>
      </div>
      <span className="text-coffee-dark font-medium ml-2">
        {formatDisplayTime(value)}
      </span>
    </div>
  );
};

export default Clock;