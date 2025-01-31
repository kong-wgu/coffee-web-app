import React from "react";
import { Slider } from "../components/ui/slider";

interface CoffeeSliderProps {
  label: string;
  value: number;
  showSlider : boolean;
  onChange: (value: number[]) => void;
  showGreen : boolean
}

const CoffeeSlider = ({ label, value, showGreen, showSlider, onChange }: CoffeeSliderProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-coffee-dark">{label}</label>
        <span className="text-sm text-coffee-medium">{value} sales</span>
      </div>
      { showSlider ? (
        <Slider
          defaultValue={[value]}
          max={100}
          step={1}
          onValueChange={onChange}
          
          
          color={showGreen ? "green" : ""}
          className={showGreen ? "py-4 green-500" : "py-4"}
        />

      ) : (
        <></>
      )}
    </div>
  );
};

export default CoffeeSlider;