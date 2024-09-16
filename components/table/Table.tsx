'use client'

import { useState, useRef, useEffect, useCallback } from "react";
import ColumnSeparator from "./ColumnSeparator";
import MenuIcon from "./MenuIcon";
import { LiaSortAlphaDownSolid } from "react-icons/lia";
import { CiFilter } from "react-icons/ci";
import { ConstructionOutlined } from "@mui/icons-material";
import Cell from "./Cell";

export default function Table({ name, data, attrs }: {
  name?: string,
  data: DataItem[],
  attrs: AttrProps[]
}) {
  // Load column order from localStorage or use default
  const [tableHeight, setTableHeight] = useState('auto');
  const [attrsByName, setAttrsByName] = useState(() => {
    // Turn into a dictionary
    const attrsByName: { [key: string]: AttrProps } = {}
    attrs.forEach((attr, index) => {
      attrsByName[attr.name] = attr
      attrsByName[attr.name].width = 150
      attrsByName[attr.name].order = index
    })
    return attrsByName;
  })

  const [menuOpen, setMenuOpen] = useState<number>(-1);
  const [focusedHeader, setFocusedHeader] = useState(-1);

  const resizingRef = useRef({ startX: 0, startWidth: 0, attrName: '' });

  const handleMouseDown = (e: React.MouseEvent, attrName: string) => {
    resizingRef.current.startX = e.clientX;
    resizingRef.current.startWidth = attrsByName[attrName].width || 150;
    resizingRef.current.attrName = attrName;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const { startX, startWidth, attrName } = resizingRef.current;
    if (attrName !== '') {
      const delta = e.clientX - startX;
      const newAttrsByName = attrsByName
      newAttrsByName[attrName].width = Math.max(50, startWidth + delta)
      setAttrsByName(newAttrsByName)
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    resizingRef.current.attrName = '';

    localStorage.setItem('attrsByName', JSON.stringify(attrsByName))
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, draggedName: string) => {
    e.dataTransfer.setData('text/plain', draggedName);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Allow drop
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetName: string) => {
    e.preventDefault();
    const draggedName = e.dataTransfer.getData('text/plain');
    if (draggedName !== targetName) {
      const newAttrsByName = attrsByName
      const lastOrder = newAttrsByName[draggedName].order
      newAttrsByName[draggedName].order = newAttrsByName[targetName].order
      newAttrsByName[targetName].order = lastOrder
      setAttrsByName(newAttrsByName)
      localStorage.setItem('attrsByName', JSON.stringify(newAttrsByName))
    }
  };

  useEffect(() => {
    const savedAttrsByName = localStorage.getItem('attrsByName');
    if (savedAttrsByName) {
      setAttrsByName(JSON.parse(savedAttrsByName))
    }
  }, []);

  const orderedAttrs = Object.keys(attrsByName)
    .map((attrName) => attrsByName[attrName])
    .sort((x, y) => x.order && y.order ? x.order - y.order : 0);


  return (
    <div className="table-container relative">
      <div className="table-header grid"
        style={{
          gridTemplateColumns: orderedAttrs
            .map((attr) => `${attr.width}px`)
            .join(' ')
        }}>
        {
          orderedAttrs.map((attr, index) =>
            <div
              key={index}
              className="table-header-cell flex justify-between items-center relative"
              style={{ width: `${attr.width}px` }}
              onMouseEnter={() => setFocusedHeader(index)}
              onMouseLeave={() => setFocusedHeader(-1)}
            >
              <div className=""
                draggable
                onDragStart={(e) => handleDragStart(e, attr.name)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, attr.name)}>
                {attr.name.charAt(0).toUpperCase() + attr.name.slice(1)}
              </div>

              <div className="icon-group flex items-center space-x-2 flex-nowrap">
                {focusedHeader === index && (
                  <>
                    <MenuIcon
                      onClick={() => setMenuOpen(index)}
                      onMouseLeave={() => setMenuOpen(-1)}
                    />
                    {menuOpen === index && (
                      <div className="absolute top-[10px] bg-white border shadow-md mt-2 z-10 w-[100px]"
                        onMouseEnter={() => setMenuOpen(index)}
                        onMouseLeave={() => setMenuOpen(-1)}
                      >
                        <div className="p-2 hover:bg-gray-200 w-full flex items-center justify-between">
                          Sort
                          <LiaSortAlphaDownSolid className="m-2" />
                        </div>
                        <div className="p-2 hover:bg-gray-200 w-full flex items-center justify-between">
                          Filter
                          <CiFilter className="m-2" />
                        </div>
                      </div>
                    )}
                  </>
                )}
                <ColumnSeparator
                  className="hover:cursor-col-resize"
                  onMouseDown={(e) => handleMouseDown(e, attr.name)}
                />
              </div>
            </div>
          )
        }
      </div>
      <div className="table-body">
        {data.map((item, rowIndex) =>
          <div key={rowIndex} className="table-item grid" style={{
            gridTemplateColumns: orderedAttrs
              .map((attr) => `${attr.width}px`)
              .join(' ')
          }}>
            {
              orderedAttrs.map((attr, cellIndex) =>
                <div key={cellIndex} className="cell-container" style={{ width: `${attr.width}px` }}>
                  <Cell itemId={item.id} attr={attr} content={item[attr.name]}></Cell>
                </div>
              )
            }
          </div>
        )}
      </div>
    </div>
  );
}
