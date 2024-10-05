'use client';

import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

export default function Checkbox({ checked, onChange }: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className={`w-[16px] h-[16px] bg-gray-200 flex items-center justify-center
        peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300
        rounded-sm relative dark:border-gray-600 peer-checked:bg-[#1b4683]
        transition-all duration-300 ease-in-out`}>
        <CheckRoundedIcon className='size-[14px] text-white opacity-100' />
      </div>
    </label>
  );
}
