import { useSearchParams } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Image as KImage, Text, Rect, Transformer, Label, Tag } from "react-konva";
import useImage from "use-image";
import Konva from "konva";
import {
  Upload,
  Trash2,
  Download,
  Type,
  Image as ImageIcon,
  Settings,
  Eye,
  Loader2,
  Menu,
  X,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Copy,
  Layers,
  Palette,
  Monitor
} from "lucide-react";

/* ===========================
   Helpers
   =========================== */
   const API = import.meta.env.VITE_API_URL;

const AVAILABLE_FONTS = [
  "Arial",
  "Inter",
  "Montserrat",
  "Poppins",
  "Roboto",
  "Georgia",
  "Times New Roman",
  "Courier New",
];

const rgbToCss = ({ r = 255, g = 255, b = 255 }) => `rgb(${r},${g},${b})`;
const rgbToHex = ({ r = 255, g = 255, b = 255 }) =>
  `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
const hexToRgb = (hex) => {
  if (!hex) return { r: 255, g: 255, b: 255 };
  const cleaned = hex.replace("#", "");
  if (cleaned.length === 3) {
    const r = parseInt(cleaned[0] + cleaned[0], 16);
    const g = parseInt(cleaned[1] + cleaned[1], 16);
    const b = parseInt(cleaned[2] + cleaned[2], 16);
    return { r, g, b };
  }
  const int = parseInt(cleaned, 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
};

/* ===========================
   Transformer wrapper
   =========================== */
const TransformerWrapper = ({ selectedShapeRef, trRef, isText }) => {
  useEffect(() => {
    if (trRef.current && selectedShapeRef.current) {
      trRef.current.nodes([selectedShapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [selectedShapeRef, trRef]);

  return (
    <Transformer
      ref={trRef}
      boundBoxFunc={(oldBox, newBox) => {
        if (newBox.width < 5 || newBox.height < 5) {
          return oldBox;
        }
        return newBox;
      }}
      enabledAnchors={
        isText
          ? ["top-left", "top-right", "bottom-left", "bottom-right", "middle-left", "middle-right"]
          : ["top-left", "top-right", "bottom-left", "bottom-right"]
      }
      anchorSize={10}
      anchorCornerRadius={5}
      borderStroke="#e5e7eb"
      anchorStroke="#e5e7eb"
      anchorFill="#000000"
    />
  );
};

/* ===========================
   RgbPicker component
   =========================== */
const RgbPicker = ({ rgb, onChange }) => {
  const hex = rgbToHex(rgb);
  return (
    <div className="space-y-3 p-3 bg-neutral-800 rounded-lg border border-neutral-700">
      <div className="flex items-center gap-3 mb-2">
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-neutral-600 shadow-sm">
          <input
            type="color"
            value={hex}
            onChange={(e) => onChange(hexToRgb(e.target.value))}
            className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer p-0 border-0"
          />
        </div>
        <div className="text-xs font-mono text-neutral-400 uppercase">{hex}</div>
      </div>

      {['r', 'g', 'b'].map((channel) => (
        <div key={channel} className="flex items-center gap-2">
          <span className="text-xs w-4 uppercase font-bold text-neutral-500">{channel}</span>
          <input
            type="range"
            min={0}
            max={255}
            value={rgb[channel]}
            onChange={(e) => onChange({ ...rgb, [channel]: parseInt(e.target.value, 10) })}
            className="flex-1 h-1 bg-neutral-600 rounded-lg appearance-none cursor-pointer "
            style={{ touchAction: "none" }}
          />
          <span className="text-xs w-6 text-right tabular-nums text-neutral-400">{rgb[channel]}</span>
        </div>
      ))}
    </div>
  );
};

/* ===========================
   Konva Elements
   =========================== */
const TextElement = ({ shapeProps, isSelected, onSelect, onChange, onDblClick, isEditing }) => {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  if (isEditing) return null;

  return (
    <>
      <Label
        ref={shapeRef}
        {...shapeProps}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDblClick={onDblClick}
        onDragEnd={(e) => onChange({ ...shapeProps, x: e.target.x(), y: e.target.y() })}
        onTransformEnd={() => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            rotation: Math.round(node.rotation()),
            fontSize: Math.max(5, Math.round(shapeProps.fontSize * scaleY)),
            width: Math.max(20, node.width() * scaleX),
          });
        }}
      >
        <Tag
          fill={shapeProps.textBg ? rgbToCss(shapeProps.textBgRgb) : undefined}
          opacity={shapeProps.textBg ? shapeProps.textBgOpacity : 0}
          cornerRadius={6}
          listening={false}
        />
        <Text
          text={shapeProps.text}
          fill={rgbToCss(shapeProps.fillRgb ?? { r: 255, g: 255, b: 255 })}
          fontSize={shapeProps.fontSize}
          fontFamily={shapeProps.fontFamily}
          fontStyle={shapeProps.fontStyle}
          align={shapeProps.align}
          width={shapeProps.width}
          padding={shapeProps.padding ?? 10}
          shadowColor={shapeProps.outline ? "#ffffff" : undefined}
          shadowBlur={shapeProps.shadowBlur ?? 0}
          shadowOpacity={shapeProps.outline ? shapeProps.shadowOpacity ?? 1 : 0}
        />
      </Label>
      {isSelected && <TransformerWrapper selectedShapeRef={shapeRef} trRef={trRef} isText={true} />}
    </>
  );
};

const ImageElement = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();
  const [img] = useImage(shapeProps.src, "anonymous");

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  if (!img) return null;

  return (
    <>
      <KImage
        image={img}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => onChange({ ...shapeProps, x: e.target.x(), y: e.target.y() })}
        onTransformEnd={() => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, Math.round(node.width() * scaleX)),
            height: Math.max(5, Math.round(node.height() * scaleY)),
            rotation: Math.round(node.rotation()),
          });
        }}
        shadowColor={shapeProps.outline ? "#ffffff" : undefined}
        shadowBlur={shapeProps.shadowBlur ?? 0}
        shadowOpacity={shapeProps.outline ? shapeProps.shadowOpacity ?? 1 : 0}
      />
      {isSelected && <TransformerWrapper selectedShapeRef={shapeRef} trRef={trRef} isText={false} />}
    </>
  );
};

/* ===========================
   Main Component
   =========================== */
export default function StickerEditorModern() {
  const [params] = useSearchParams();
  const incomingImage = params.get("template");

  const stageRef = useRef();
  const fileInputRef = useRef();
  const canvasContainerRef = useRef();

  // Background State
  const [bgType, setBgType] = useState("solid");
  const [bgRgb, setBgRgb] = useState({ r: 0, g: 0, b: 0 });
  const [bgImage, setBgImage] = useState(null);
  const [bgImg] = useImage(bgImage, "anonymous");

  // Data State
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const selectedElement = elements.find((e) => e.id === selectedId) || null;

  // UI State
  const [isUploading, setIsUploading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [canvasSize, setCanvasSize] = useState(800);
  
  // Drawer State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("properties"); // 'properties' | 'layers'

  // Responsive Canvas
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Calculate available space (approximate)
      const availableW = w < 768 ? w - 32 : w - 600; // on mobile subtract margin, on desktop subtract sidebars
      const availableH = h - 150;
      
      const size = Math.min(800, availableW, availableH);
      setCanvasSize(Math.max(300, size));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* ------------------------- Actions ------------------------- */
  const addText = () => {
    const id = `text-${Date.now()}`;
    const newText = {
      id,
      type: "text",
      text: "Double click to edit",
      x: canvasSize / 2 - 75,
      y: canvasSize / 2 - 20,
      fontSize: 36,
      fillRgb: { r: 255, g: 255, b: 255 },
      fontFamily: "Arial",
      align: "center",
      fontStyle: "normal",
      rotation: 0,
      opacity: 1,
      width: 300,
      padding: 10,
      textBg: false,
      textBgRgb: { r: 0, g: 0, b: 0 },
      textBgOpacity: 0.6,
      outline: false,
      shadowBlur: 0,
      shadowOpacity: 1,
    };
    setElements((s) => [...s, newText]);
    setSelectedId(id);
    setEditingId(null);
    // Auto open properties on mobile
    if (window.innerWidth < 768) {
      setActiveTab("properties");
      setDrawerOpen(true);
    }
  };

  const addImage = (src, w, h) => {
    const id = `image-${Date.now()}`;
    const newImg = {
      id,
      type: "image",
      src,
      x: canvasSize / 2 - (w/2),
      y: canvasSize / 2 - (h/2),
      width: w,
      height: h,
      rotation: 0,
      opacity: 1,
      outline: true,
      shadowBlur: 18,
      shadowOpacity: 1,
    };
    setElements((s) => [...s, newImg]);
    setSelectedId(id);
    setEditingId(null);
    if (window.innerWidth < 768) {
      setActiveTab("properties");
      setDrawerOpen(true);
    }
  };

  // Initialize Template
  useEffect(() => {
    if (!incomingImage) return;
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = incomingImage;
      img.onload = () => {
        const max = 400;
        const scale = Math.min(max / img.width, max / img.height, 1);
        addImage(incomingImage, Math.round(img.width * scale), Math.round(img.height * scale));
      };
      img.onerror = () => addImage(incomingImage, 300, 300);
    } catch (e) {
      console.error("incomingImage load failed", e);
    }
  }, [incomingImage]);

  const updateElement = (id, changes) => {
    setElements((s) => s.map((el) => (el.id === id ? { ...el, ...changes } : el)));
  };

  const deleteElement = (id) => {
    setElements((s) => s.filter((el) => el.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleFile = async (file) => {
    if (!file) return;
    setIsUploading(true);
    setLoadingMessage("Loading...");
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const max = 500;
          const scale = Math.min(max / img.width, max / img.height, 1);
          addImage(e.target.result, Math.round(img.width * scale), Math.round(img.height * scale));
          setIsUploading(false);
        };
        img.src = e.target.result;
      }
      reader.readAsDataURL(file);
    } catch (err) {
      alert("Upload failed");
      setIsUploading(false);
    }
  };

  const handleFileInput = (e) => handleFile(e.target.files[0]);
  const handleBgFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setBgImage(ev.target.result);
      setBgType("image");
    };
    reader.readAsDataURL(file);
  };

  const downloadCanvasPNG = (fileName = "sticker.png") => {
    const stage = stageRef.current;
    if (!stage) return;
    setSelectedId(null);
    setEditingId(null);
    setTimeout(() => {
      const uri = stage.toDataURL({ pixelRatio: 3, quality: 1, mimeType: "image/png" });
      const a = document.createElement("a");
      a.href = uri;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, 50);
  };

  const copyCanvasToClipboard = async () => {
    const stage = stageRef.current;
    if (!stage) return false;
    setSelectedId(null);
    setEditingId(null);
    setTimeout(async () => {
      const uri = stage.toDataURL({ pixelRatio: 3, quality: 1, mimeType: "image/png" });
      try {
        const res = await fetch(uri);
        const blob = await res.blob();
        if (navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
          alert("Image copied to clipboard!");
        } else {
          alert("Clipboard API not supported");
        }
      } catch (e) {
        console.error("copy failed", e);
      }
    }, 50);
  };

  /* ------------------------- Render Components ------------------------- */

  const renderInlineEditor = () => {
    if (!editingId) return null;
    const el = elements.find(e => e.id === editingId);
    if (!el) return null;

    const style = {
      position: 'absolute',
      top: `${el.y}px`,
      left: `${el.x}px`,
      width: `${el.width}px`,
      fontSize: `${el.fontSize}px`,
      fontFamily: el.fontFamily,
      color: rgbToCss(el.fillRgb),
      textAlign: el.align,
      background: 'transparent',
      border: 'none',
      outline: '1px dashed #e5e7eb',
      resize: 'none',
      overflow: 'hidden',
      padding: `${el.padding}px`,
      lineHeight: 1,
      transform: `rotate(${el.rotation}deg)`,
      transformOrigin: 'top left',
      zIndex: 100
    };

    return (
      <textarea
        value={el.text}
        onChange={(e) => updateElement(editingId, { text: e.target.value })}
        onBlur={() => setEditingId(null)}
        onKeyDown={(e) => e.stopPropagation()}
        autoFocus
        style={style}
        rows={Math.max(1, el.text.split('\n').length)}
      />
    );
  };

  // Property Panels
  const LayersPanel = () => (
    <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-800">
            <div className="flex items-center gap-2 font-semibold text-neutral-300">
                <Layers size={16} /> Layers
            </div>
            <div className="text-xs text-neutral-500">{elements.length} items</div>
        </div>
        <div className="flex-1 overflow-auto space-y-2 pr-1">
            {elements.length === 0 ? (
                <div className="text-center text-neutral-600 py-8 text-sm">Empty Canvas</div>
            ) : (
                [...elements].reverse().map((el) => (
                <div
                    key={el.id}
                    onClick={() => setSelectedId(el.id)}
                    className={`flex items-center justify-between gap-2 p-3 rounded-lg cursor-pointer border transition-all ${
                    selectedId === el.id 
                        ? "bg-neutral-800 border-white/20 shadow-sm" 
                        : "bg-neutral-900/50 border-transparent hover:bg-neutral-800"
                    }`}
                >
                    <div className="flex items-center gap-3 min-w-0">
                    {el.type === "text" ? <Type size={14} className="text-neutral-200" /> : <ImageIcon size={14} className="text-neutral-200" />}
                    <div className="text-sm truncate text-neutral-300">{el.type === "text" ? el.text : "Image Layer"}</div>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteElement(el.id);
                        }}
                        className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-700 rounded transition-colors"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
                ))
            )}
        </div>
    </div>
  );

  const PropertiesPanel = () => (
    <div className="h-full flex flex-col overflow-auto">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-800">
        <div className="flex items-center gap-2 font-semibold text-neutral-300">
          <Settings size={16} /> Properties
        </div>
        {selectedElement && (
            <button onClick={() => setSelectedId(null)} className="text-xs text-neutral-300 hover:text-neutral-200">
                Done
            </button>
        )}
      </div>

      {!selectedElement ? (
        <div className="flex flex-col items-center justify-center h-64 text-neutral-500 gap-3">
            <Monitor size={32} strokeWidth={1.5} />
            <span className="text-sm">Select an element to edit</span>
        </div>
      ) : (
        <div className="space-y-6 pb-20">
          {/* Text Specific Controls */}
          {selectedElement.type === "text" && (
            <>
               <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                        <label className="text-xs text-neutral-500 mb-1 block">Font Family</label>
                        <select
                        value={selectedElement.fontFamily}
                        onChange={(e) => updateElement(selectedElement.id, { fontFamily: e.target.value })}
                        className="w-full bg-neutral-800 border border-neutral-700 text-neutral-200 p-2 rounded text-sm focus:ring-2 focus:ring-neutral-200 outline-none"
                        >
                        {AVAILABLE_FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
                        </select>
                    </div>
                    
                    <div>
                         <label className="text-xs text-neutral-500 mb-1 block">Size</label>
                         <input
                            type="number"
                            value={selectedElement.fontSize}
                            onChange={(e) => updateElement(selectedElement.id, { fontSize: parseInt(e.target.value, 10) })}
                            className="w-full bg-neutral-800 border border-neutral-700 p-2 rounded text-sm text-white"
                         />
                    </div>

                    <div>
                        <label className="text-xs text-neutral-500 mb-1 block">Style</label>
                        <button
                        className={`w-full p-2 rounded text-sm border ${selectedElement.fontStyle === "bold" ? "bg-neutral-200 border-white text-neutral-900" : "bg-neutral-800 border-neutral-700 text-neutral-400"}`}
                        onClick={() => updateElement(selectedElement.id, { fontStyle: selectedElement.fontStyle === "bold" ? "normal" : "bold" })}
                        >
                        <Bold size={14} className="inline mr-1" /> Bold
                        </button>
                    </div>
               </div>

               <div>
                    <label className="text-xs text-neutral-500 mb-2 block">Alignment</label>
                    <div className="flex bg-neutral-800 rounded-lg p-1 border border-neutral-700">
                        {['left', 'center', 'right'].map((align) => (
                            <button
                                key={align}
                                onClick={() => updateElement(selectedElement.id, { align })}
                                className={`flex-1 py-2 rounded flex justify-center ${selectedElement.align === align ? "bg-neutral-700 text-neutral-100 shadow-sm" : "text-neutral-500 hover:text-neutral-300"}`}
                            >
                                {align === 'left' ? <AlignLeft size={16} /> : align === 'center' ? <AlignCenter size={16} /> : <AlignRight size={16} />}
                            </button>
                        ))}
                    </div>
               </div>

               <div>
                    <label className="text-xs text-neutral-500 mb-2 block">Color</label>
                    <RgbPicker
                        rgb={selectedElement.fillRgb ?? { r: 255, g: 255, b: 255 }}
                        onChange={(rgb) => updateElement(selectedElement.id, { fillRgb: rgb })}
                    />
               </div>

               <div className="space-y-3 pt-4 border-t border-neutral-800">
                    <div className="flex items-center justify-between">
                        <label className="text-sm text-neutral-300">Text Background</label>
                        <button
                            onClick={() => updateElement(selectedElement.id, { textBg: !selectedElement.textBg })}
                            className={`w-10 h-6 rounded-full relative transition-colors ${selectedElement.textBg ? "bg-neutral-200" : "bg-neutral-700"}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${selectedElement.textBg ? "left-5" : "left-1"}`} />
                        </button>
                    </div>
                    
                    {selectedElement.textBg && (
                        <div className="pl-2 border-l-2 border-white/20 space-y-3 mt-2">
                            <RgbPicker
                                rgb={selectedElement.textBgRgb ?? { r: 0, g: 0, b: 0 }}
                                onChange={(rgb) => updateElement(selectedElement.id, { textBgRgb: rgb })}
                            />
                            <div>
                                <div className="flex justify-between text-xs text-neutral-500 mb-1">
                                    <span>Opacity</span>
                                    <span>{Math.round((selectedElement.textBgOpacity ?? 0.6) * 100)}%</span>
                                </div>
                                <input
                                type="range" min={0} max={1} step={0.01}
                                value={selectedElement.textBgOpacity ?? 0.6}
                                onChange={(e) => updateElement(selectedElement.id, { textBgOpacity: parseFloat(e.target.value) })}
                                className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        </div>
                    )}
               </div>
            </>
          )}

          {/* Common Controls */}
          <div className="space-y-4 pt-4 border-t border-neutral-800">
             <div>
                <div className="flex justify-between text-xs text-neutral-500 mb-1">
                    <span>Element Opacity</span>
                    <span>{Math.round((selectedElement.opacity ?? 1) * 100)}%</span>
                </div>
                <input
                    type="range" min={0} max={1} step={0.01}
                    value={selectedElement.opacity ?? 1}
                    onChange={(e) => updateElement(selectedElement.id, { opacity: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                />
            </div>

             <div>
                <div className="flex justify-between text-xs text-neutral-500 mb-1">
                    <span>Rotation</span>
                    <span>{Math.round(selectedElement.rotation ?? 0)}°</span>
                </div>
                <input
                    type="range" min={0} max={360}
                    value={selectedElement.rotation ?? 0}
                    onChange={(e) => updateElement(selectedElement.id, { rotation: parseInt(e.target.value, 10) })}
                    className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                />
            </div>

            <div className="flex items-center justify-between">
                <label className="text-sm text-neutral-300">White Glow/Outline</label>
                <button
                    onClick={() => updateElement(selectedElement.id, { outline: !selectedElement.outline })}
                    className={`w-10 h-6 rounded-full relative transition-colors ${selectedElement.outline ? "bg-neutral-200" : "bg-neutral-700"}`}
                >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${selectedElement.outline ? "left-5" : "left-1"}`} />
                </button>
            </div>

            {selectedElement.outline && (
                 <div>
                    <label className="text-xs text-neutral-500 mb-1 block">Glow Strength</label>
                    <input
                        type="range" min={0} max={80}
                        value={selectedElement.shadowBlur ?? 18}
                        onChange={(e) => updateElement(selectedElement.id, { shadowBlur: parseInt(e.target.value, 10) })}
                        className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                    />
                 </div>
            )}
          </div>

          <button 
            className="w-full bg-neutral-900/20 text-red-400 border border-red-500/20 py-3 rounded-lg mt-6 hover:bg-neutral-800 flex items-center justify-center gap-2 transition-colors"
            onClick={() => deleteElement(selectedElement.id)}
          >
            <Trash2 size={16} /> Remove Element
          </button>
        </div>
      )}
    </div>
  );

  /* ------------------------- Main JSX ------------------------- */
  return (
    <div className="flex flex-col h-screen bg-black text-white overflow-hidden font-sans">
      
      {/* HEADER */}
      <header className="h-16 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between px-4 z-20 shrink-0">
        <div className="flex items-center gap-4">
            <div className="font-bold text-xl tracking-tight hidden md:block bg-linear-to-r from-neutral-100 to-neutral-300 bg-clip-text text-transparent">
                StickerStudio
            </div>
            <div className="h-6 w-px bg-neutral-700 hidden md:block"></div>
            
            <div className="flex items-center gap-2">
                <button onClick={addText} className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 p-2 md:px-3 md:py-2 rounded-lg flex items-center gap-2 text-sm transition-all border border-neutral-700">
                    <Type size={18} /> <span className="hidden md:inline">Add Text</span>
                </button>
                <label className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 p-2 md:px-3 md:py-2 rounded-lg flex items-center gap-2 text-sm cursor-pointer transition-all border border-neutral-700">
                    <ImageIcon size={18} />
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
                    <span className="hidden md:inline">Add Image</span>
                </label>
            </div>
        </div>

        <div className="flex items-center gap-3">
            {/* BG Controls - Compact */}
            <div className="hidden md:flex items-center gap-2 bg-neutral-800 p-1.5 rounded-lg border border-neutral-700">
                <div className="relative group">
                    <input 
                        type="color" 
                        value={rgbToHex(bgRgb)} 
                        onChange={(e) => { setBgType("solid"); setBgRgb(hexToRgb(e.target.value)); }}
                        className="w-6 h-6 rounded cursor-pointer border-none p-0 bg-transparent"
                    />
                </div>
                <label className="cursor-pointer hover:text-neutral-200 px-1">
                    <Upload size={16} />
                    <input type="file" accept="image/*" onChange={handleBgFile} className="hidden" />
                </label>
            </div>

            {/* Export Actions */}
            <button onClick={copyCanvasToClipboard} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors" title="Copy">
                <Copy size={20} />
            </button>
            <button onClick={() => downloadCanvasPNG()} className="bg-neutral-200 hover:bg-neutral-300 text-neutral-900 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg shadow-black/40 transition-all">
                <Download size={16} /> <span className="hidden md:inline">Export</span>
            </button>
            
            {/* Mobile Menu Toggle */}
            <button 
                className="md:hidden p-2 text-neutral-300 hover:bg-neutral-800 rounded-lg"
                onClick={() => setDrawerOpen(!drawerOpen)}
            >
                <Menu size={24} />
            </button>
        </div>
      </header>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* LEFT SIDEBAR (Desktop Only) */}
        <aside className="hidden md:block w-64 bg-neutral-900/50 border-r border-neutral-800 p-4 overflow-hidden">
            <LayersPanel />
        </aside>

        {/* CANVAS AREA */}
        <main className="flex-1 bg-neutral-950 relative overflow-auto flex items-center justify-center p-8 md:p-12" ref={canvasContainerRef}>
            
            {/* Canvas Wrapper with shadow */}
            <div 
                className="relative shadow-2xl shadow-black rounded overflow-hidden"
                style={{ width: canvasSize, height: canvasSize }}
            >
                 <Stage
                    width={canvasSize}
                    height={canvasSize}
                    ref={stageRef}
                    onMouseDown={(e) => {
                      const clickedOnEmpty = e.target === e.target.getStage() || e.target.attrs.name === "canvas-background" || e.target.attrs.name === "bg-image";
                      if (clickedOnEmpty) {
                        setSelectedId(null);
                        setEditingId(null);
                      }
                    }}
                    onTouchStart={(e) => {
                        const clickedOnEmpty = e.target === e.target.getStage() || e.target.attrs.name === "canvas-background" || e.target.attrs.name === "bg-image";
                        if (clickedOnEmpty) {
                          setSelectedId(null);
                          setEditingId(null);
                        }
                    }}
                  >
                    <Layer>
                      {bgType === "image" && bgImg ? (
                        <KImage image={bgImg} width={canvasSize} height={canvasSize} name="bg-image" listening={false} />
                      ) : (
                        <Rect width={canvasSize} height={canvasSize} fill={bgType === "transparent" ? "transparent" : rgbToCss(bgRgb)} name="canvas-background" listening={false} />
                      )}
                      {elements.map((el) =>
                        el.type === "text" ? (
                          <TextElement
                            key={el.id}
                            shapeProps={el}
                            isSelected={el.id === selectedId}
                            isEditing={el.id === editingId}
                            onSelect={() => { setSelectedId(el.id); setEditingId(null); }}
                            onDblClick={() => { setSelectedId(el.id); setEditingId(el.id); }}
                            onChange={(attrs) => updateElement(el.id, attrs)}
                          />
                        ) : (
                          <ImageElement
                            key={el.id}
                            shapeProps={el}
                            isSelected={el.id === selectedId}
                            onSelect={() => { setSelectedId(el.id); setEditingId(null); }}
                            onChange={(attrs) => updateElement(el.id, attrs)}
                          />
                        )
                      )}
                    </Layer>
                  </Stage>
                  {renderInlineEditor()}
            </div>

            {/* Floating status pill (Mobile) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-neutral-800/90 backdrop-blur text-neutral-400 text-xs px-4 py-2 rounded-full border border-neutral-700 pointer-events-none md:hidden whitespace-nowrap">
                {elements.length} layers • Tap to edit
            </div>
        </main>

        {/* RIGHT SIDEBAR (Desktop Only) */}
        <aside className="hidden md:block w-80 bg-neutral-900/50 border-l border-neutral-800 p-4 overflow-hidden">
            <PropertiesPanel />
        </aside>

        {/* MOBILE DRAWER OVERLAY */}
        {drawerOpen && (
             <div className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
        )}

        {/* MOBILE DRAWER PANEL */}
        <div className={`fixed top-0 right-0 bottom-0 w-80 bg-neutral-900 border-l border-neutral-800 z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col shadow-2xl ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}>
            <div className="h-14 border-b border-neutral-800 flex items-center justify-between px-4 bg-neutral-900 shrink-0">
                <span className="font-semibold text-neutral-200">Editor Tools</span>
                <button onClick={() => setDrawerOpen(false)} className="p-2 text-neutral-400 hover:text-white"><X size={20}/></button>
            </div>

            {/* Tabs */}
            <div className="flex p-2 gap-2 border-b border-neutral-800 bg-neutral-900/50">
                <button 
                    onClick={() => setActiveTab("properties")}
                    className={`flex-1 py-2 text-sm rounded-md flex items-center justify-center gap-2 transition-colors ${activeTab === "properties" ? "bg-neutral-200 text-neutral-900" : "text-neutral-400 hover:bg-neutral-800"}`}
                >
                   <Settings size={14} /> Properties
                </button>
                <button 
                    onClick={() => setActiveTab("layers")}
                    className={`flex-1 py-2 text-sm rounded-md flex items-center justify-center gap-2 transition-colors ${activeTab === "layers" ? "bg-neutral-200 text-neutral-900" : "text-neutral-400 hover:bg-neutral-800"}`}
                >
                   <Layers size={14} /> Layers
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {activeTab === "properties" ? <PropertiesPanel /> : <LayersPanel />}
            </div>

            {/* Mobile BG Picker in Drawer */}
            <div className="p-4 border-t border-neutral-800 bg-neutral-900">
                <label className="text-xs text-neutral-500 mb-2 block">Canvas Background</label>
                <div className="flex items-center gap-3">
                     <input 
                        type="color" 
                        value={rgbToHex(bgRgb)} 
                        onChange={(e) => { setBgType("solid"); setBgRgb(hexToRgb(e.target.value)); }}
                        className="w-10 h-10 rounded border border-neutral-700 p-0 bg-transparent"
                    />
                    <label className="flex-1 bg-neutral-800 border border-neutral-700 text-neutral-300 text-sm py-2 rounded flex items-center justify-center gap-2">
                        <Upload size={14} /> Image BG
                        <input type="file" accept="image/*" onChange={handleBgFile} className="hidden" />
                    </label>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
