import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SectionHeaderProps {
  title: string;
  seeAllPath?: string;
  onSeeAll?: () => void;
}

const SectionHeader = ({ title, seeAllPath, onSeeAll }: SectionHeaderProps) => {
  const navigate = useNavigate();

  const handleSeeAll = () => {
    if (onSeeAll) {
      onSeeAll();
    } else if (seeAllPath) {
      navigate(seeAllPath);
    }
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {title}
      </h2>
      {(seeAllPath || onSeeAll) && (
        <button
          onClick={handleSeeAll}
          className="text-sm text-primary font-bold flex items-center gap-1 active:scale-95 transition-transform"
        >
          See all <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SectionHeader;
