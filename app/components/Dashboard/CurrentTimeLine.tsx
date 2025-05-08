import { useEffect, useState } from "react";

interface CurrentTimeLineProps {
  day: string;
  cellHeight: number;
  startHour: string;
  totalHeight: number;
}

const CurrentTimeLine: React.FC<CurrentTimeLineProps> = ({
  day,
  cellHeight,
  startHour,
  totalHeight,
}) => {
  const [position, setPosition] = useState<number>(0);
  const [isToday, setIsToday] = useState(false);

  useEffect(() => {
    function updatePosition() {
      const now = new Date();
      const today = now.toISOString().split("T")[0];

      if (today === day) {
        setIsToday(true);

        // Convertir l'heure de début en minutes
        const [startH] = startHour.split(":").map(Number);
        const startMinutes = startH * 60;

        // Convertir l'heure actuelle en minutes
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentMinutes = currentHour * 60 + currentMinute;

        // Calculer la position
        const minutesSinceStart = currentMinutes - startMinutes;
        const pixelPosition = (minutesSinceStart / 30) * cellHeight;

        // Convertir en pourcentage
        const percentage = (pixelPosition / totalHeight) * 100;

        setPosition(Math.max(0, Math.min(100, percentage)));
      } else {
        setIsToday(false);
      }
    }

    updatePosition();
    const interval = setInterval(updatePosition, 60000);

    return () => clearInterval(interval);
  }, [day, cellHeight, startHour, totalHeight]);

  if (!isToday) return null;

  return (
    <div
      className="absolute left-0 right-0 z-20 pointer-events-none"
      style={{
        top: `${position}%`,
        transition: "top 0.5s ease",
        width: "100%", // Assure que la ligne prend toute la largeur
      }}
    >
      <div className="relative flex items-center w-full">
        <div className="absolute -left-[5px] w-2.5 h-2.5 rounded-full bg-red-500" />
        <div
          className="flex-1 h-[2px] bg-red-500 opacity-75"
          style={{ width: "calc(100% + 60px)" }} // Compense la largeur de la colonne des heures
        />
        <div className="absolute right-4 bg-red-500 text-white text-xs px-1 rounded">
          {new Date().toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};

export default CurrentTimeLine;
