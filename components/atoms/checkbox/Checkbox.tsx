'use client';

import { CheckIcon } from '@public/icons';

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
        <CheckIcon className='text-white opacity-100'
          style={{ fontSize: '14px' }} />
      </div>
    </label>
  );
}
