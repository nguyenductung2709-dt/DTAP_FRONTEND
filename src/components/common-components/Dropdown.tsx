import React, { FC, useEffect, useRef, useState } from "react";
import arrowDown from "../../assets/ArrowSquareDown.png"
import arrowDownDark from "../../assets/ArrowSquareDown_darkTheme.png"

type Option = {
  name: string;
  isCategory?: boolean;
  category?: string;
}; 

//properties of the component
type DropdownProps = {
  title: string;
  optionList: Option[];
  darkTheme: boolean;
  onSelect?: (selected:string) => void;
  selectedValue?: string | null;
};

const Dropdown: FC<DropdownProps> = ({ title, optionList, darkTheme, onSelect, selectedValue }) => {
  const [selectedTitle, setSelectedTitle] = useState<string>(title);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const selectRef = useRef<HTMLDivElement | null>(null);

  
  useEffect(() => {
    if (selectedValue === null || selectedValue === undefined) {
      setSelectedTitle(title);
    } else {
      setSelectedTitle(selectedValue);
    }
  }, [selectedValue, title]);

  useEffect(() => {
    
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={selectRef} className="inline-block min-w-20 md:min-w-50 text-left relative">
      <div
        className={`selected-text flex items-center justify-between w-full bg-transparent  border-2 border-solid border-black-100 cursor-pointer relative rounded-lg ${darkTheme ? "text-white":"text-black"} font-mono selected-text ${showOptions ? "active" : ""} py-2 px-2 md:px-3  gap-x-2 text-sm md:text-base`}
        onClick={() => setShowOptions(!showOptions)} 
      > {/*every time it's clicked the options are either shown or not anymore*/}
        {selectedTitle}
        <img
            src={darkTheme? arrowDownDark:arrowDown}
            alt="Toggle dropdown"
            className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 ease ${showOptions ? "rotate-0" : "rotate-180"} object-contain`}/>
      </div> {/*if showOptions is true -> show the whole list */}
      {showOptions && (
        <ul className={`absolute mt-2 w-full border-2 border-solid border-black-100 rounded-[10px] z-50 max-h-[300px] opacity-100 overflow-auto transition-all duration-300 ease-in-out ${darkTheme ? "text-white bg-black":"text-black bg-white"} font-mono font-medium`}>
          {optionList.map((option) => (
            <li
              
              className={`list-none py-2 px-2 md:px-3 bg-transparent text-left  text-sm md:text-base ${option.isCategory ? "font-bold cursor-default" : "hover:bg-gray-200 cursor-pointer"}`}
              onClick={() => { 
                if (!option.isCategory) { 
                //setSelectedTitle(option.name);
                setShowOptions(false);
                if (onSelect) onSelect(option.name);
              }
              }}
            >
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
