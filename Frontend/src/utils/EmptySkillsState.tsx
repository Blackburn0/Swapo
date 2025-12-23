import { Plus } from 'lucide-react';
import Button from '@/components/ui/Button';

interface Props {
  title: string;
  description: string;
  onAdd: () => void;
}

const EmptySkillsState = ({ title, description, onAdd }: Props) => {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-300 py-8 text-center dark:border-gray-600">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {title}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      <div className="w-full px-4">
        <Button
          onClick={onAdd}
          className="mt-2 flex items-center gap-2 bg-red-500 px-4 py-2 text-sm"
        >
          <Plus size={16} />
          Add skill
        </Button>
      </div>
    </div>
  );
};

export default EmptySkillsState;
