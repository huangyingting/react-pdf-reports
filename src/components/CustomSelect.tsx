import React, { useState, useRef, useEffect, useCallback } from 'react';
import './CustomSelect.css';

interface Option {
  value: string | number;
  label: string;
}

interface CustomSelectProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: Option[];
  className?: string;
  placeholder?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  className = '',
  placeholder = 'Select an option'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropdownDirection, setDropdownDirection] = useState<'down' | 'up'>('down');
  const selectRef = useRef<HTMLDivElement>(null);

  // Get the label for the selected value
  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = useCallback((optionValue: string | number) => {
    onChange(optionValue);
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, [onChange]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setHighlightedIndex(prev => 
            prev < options.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
          break;
        case 'Enter':
          event.preventDefault();
          if (highlightedIndex >= 0) {
            handleSelect(options[highlightedIndex].value);
          }
          break;
        case 'Escape':
          event.preventDefault();
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
    return undefined;
  }, [isOpen, highlightedIndex, options, handleSelect]);

  const calculateDropdownDirection = () => {
    if (!selectRef.current) return 'down';

    const rect = selectRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownMaxHeight = 300; // matches CSS max-height
    
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    
    // If there's not enough space below but there's more space above, show upward
    if (spaceBelow < dropdownMaxHeight && spaceAbove > spaceBelow) {
      return 'up';
    }
    
    return 'down';
  };

  const toggleDropdown = () => {
    if (!isOpen) {
      // Calculate direction before opening
      const direction = calculateDropdownDirection();
      setDropdownDirection(direction);
      // Set highlighted index to current selection when opening
      const currentIndex = options.findIndex(opt => opt.value === value);
      setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div 
      className={`custom-select ${className} ${isOpen ? 'is-open' : ''} ${dropdownDirection === 'up' ? 'dropdown-up' : ''}`} 
      ref={selectRef}
    >
      <div 
        className="custom-select-trigger" 
        onClick={toggleDropdown}
        role="button"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="custom-select-value">{displayText}</span>
        <svg 
          className="custom-select-arrow" 
          width="12" 
          height="8" 
          viewBox="0 0 12 8" 
          fill="none"
        >
          <path 
            d="M1 1.5L6 6.5L11 1.5" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
      
      {isOpen && (
        <div className="custom-select-dropdown" role="listbox">
          {options.map((option, index) => (
            <div
              key={option.value}
              className={`custom-select-option ${
                option.value === value ? 'is-selected' : ''
              } ${index === highlightedIndex ? 'is-highlighted' : ''}`}
              onClick={() => handleSelect(option.value)}
              onMouseEnter={() => setHighlightedIndex(index)}
              role="option"
              aria-selected={option.value === value}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
