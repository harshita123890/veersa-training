import { useEffect, useRef } from "react";

type SearchDropdownProps<T> = {
  value: string;
  placeholder?: string;
  options: T[];
  getOptionLabel: (option: T) => string;
  onChange: (val: string) => void;
  onSelect: (option: T) => void;
  showDropdown: boolean;
  setShowDropdown: (show: boolean) => void;
  onFocus?: () => void;
    disabled?: boolean;
};

function SearchDropdown<T extends { id: number }>({
  value,
  placeholder,
  options,
  getOptionLabel,
  onChange,
  onSelect,
  showDropdown,
  setShowDropdown,
  onFocus,
    disabled = false,
}: SearchDropdownProps<T>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <input
        type="text"
        className="w-full p-2 border rounded"
        placeholder={placeholder}
        value={value}
        onChange={e => {
          onChange(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={onFocus}
        disabled={disabled}
      />
      {showDropdown && options.length > 0 && (
        <ul className="absolute w-full mt-1 border rounded bg-white shadow z-10 max-h-40 overflow-y-auto">
          {options.map(opt => (
            <li
              key={opt.id}
              onClick={() => {
                onSelect(opt);
                setShowDropdown(false);
              }}
              className="p-2 hover:bg-blue-100 cursor-pointer text-sm"
            >
              {getOptionLabel(opt)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchDropdown;
