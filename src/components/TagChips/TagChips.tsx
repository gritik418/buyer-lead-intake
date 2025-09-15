import { KeyboardEvent, useState } from "react";

interface Props {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}

const buyerTags = [
  "Budget Ready",
  "Exploring",
  "Interested",
  "Looking Now",
  "Exploring Options",
  "New Lead",
  "Repeat Buyer",
  "Referred",
  "High Priority",
];

const TagChipsInput = ({ tags, onChange, placeholder }: Props) => {
  const [input, setInput] = useState<string>("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      if (activeIndex >= 0) {
        addTag(filteredSuggestions[activeIndex]);
      } else {
        addTag(input);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        Math.min(prev + 1, filteredSuggestions.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      onChange(tags.slice(0, tags.length - 1));
    }
  };

  const addTag = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput("");
    setFilteredSuggestions([]);
    setActiveIndex(-1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    if (val) {
      setFilteredSuggestions(
        buyerTags.filter(
          (s) =>
            s.toLowerCase().includes(val.toLowerCase()) && !tags.includes(s)
        )
      );
      setActiveIndex(0);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center border p-2 rounded gap-1 bg-gray-900">
        {tags.map((tag, idx) => (
          <div
            key={idx}
            className="flex items-center bg-indigo-500 text-white text-xs px-2 py-0.5 rounded"
          >
            {tag}
            <button
              type="button"
              className="ml-1 text-white font-bold"
              onClick={() => removeTag(idx)}
            >
              ×
            </button>
          </div>
        ))}
        <input
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Add tags..."}
          className="flex-1 bg-transparent focus:outline-none text-white px-1 py-0.5"
        />
      </div>
      {filteredSuggestions.length > 0 && (
        <ul className="absolute z-10 bg-gray-700 border border-gray-600 mt-1 rounded w-full max-h-40 overflow-y-auto text-white text-sm">
          {filteredSuggestions.map((s, idx) => (
            <li
              key={s}
              className={`px-2 py-1 cursor-pointer ${
                idx === activeIndex ? "bg-indigo-500" : ""
              }`}
              onMouseDown={() => addTag(s)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagChipsInput;
