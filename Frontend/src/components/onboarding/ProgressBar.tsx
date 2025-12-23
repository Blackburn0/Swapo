interface ProgressBarProps {
    total: number;
    current: number;
    onChange: (index: number) => void;
  }
  
  const ProgressBar = ({ total, current, onChange }: ProgressBarProps) => {
    return (
      <div className="flex justify-center space-x-2">
        {Array.from({ length: total }).map((_, index) => (
          <button
            key={index}
            onClick={() => onChange(index)}
            className={`w-8 h-1 rounded-full transition-all duration-300 ${
              index === current ? 'bg-[#FF4D4D]' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };
  
  export default ProgressBar;
  