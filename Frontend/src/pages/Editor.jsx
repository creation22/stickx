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
  Copy, // Added Copy icon
} from "lucide-react";

/* ===========================
   Helpers
   =========================== */
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
        // LIMIT: Don't let width/height drop below 5px
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
    />
  );
};

/* ===========================
   RgbPicker component
   =========================== */
const RgbPicker = ({ rgb, onChange }) => {
  const hex = rgbToHex(rgb);
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={hex}
          onChange={(e) => onChange(hexToRgb(e.target.value))}
          className="w-10 h-10 p-0 border-0 rounded cursor-pointer bg-transparent"
          aria-label="color"
        />
        <div className="text-sm">{rgbToCss(rgb)}</div>
      </div>

      <div>
        <label className="text-xs">R: {rgb.r}</label>
        <input
          type="range"
          min={0}
          max={255}
          value={rgb.r}
          onChange={(e) => onChange({ ...rgb, r: parseInt(e.target.value, 10) })}
          className="w-full accent-white"
        />
      </div>

      <div>
        <label className="text-xs">G: {rgb.g}</label>
        <input
          type="range"
          min={0}
          max={255}
          value={rgb.g}
          onChange={(e) => onChange({ ...rgb, g: parseInt(e.target.value, 10) })}
          className="w-full accent-white"
        />
      </div>

      <div>
        <label className="text-xs">B: {rgb.b}</label>
        <input
          type="range"
          min={0}
          max={255}
          value={rgb.b}
          onChange={(e) => onChange({ ...rgb, b: parseInt(e.target.value, 10) })}
          className="w-full accent-white"
        />
      </div>
    </div>
  );
};

/* ===========================
   TextElement (Refactored for Label/Tag)
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

  // If editing inline, hide the canvas text so we don't see double
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
          
          // Reset scale so stroke/shadows don't get distorted
          node.scaleX(1);
          node.scaleY(1);
          
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            rotation: Math.round(node.rotation()),
            // Update fontSize based on scale to actually "resize" text
            fontSize: Math.max(5, Math.round(shapeProps.fontSize * scaleY)),
            // Update width for wrapping
            width: Math.max(20, node.width() * scaleX),
          });
        }}
      >
        {/* The Tag is the background that auto-sizes */}
        <Tag
            fill={shapeProps.textBg ? rgbToCss(shapeProps.textBgRgb) : undefined}
            opacity={shapeProps.textBg ? shapeProps.textBgOpacity : 0}
            cornerRadius={6}
            // pointerEvents="none" 
            listening={false} // Important: let clicks pass to the text
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

/* ===========================
   ImageElement
   =========================== */
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
        // Removed filters/tint props here as requested
        onDragEnd={(e) => onChange({ ...shapeProps, x: e.target.x(), y: e.target.y() })}
        onTransformEnd={() => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          
          // Reset scale to keep quality
          node.scaleX(1);
          node.scaleY(1);
          
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // Actually apply the new dimensions
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
  const incomingImage = params.get("img");

  const stageRef = useRef();
  const fileInputRef = useRef();
  const canvasContainerRef = useRef(); // To position the inline text editor

  // Background
  const [bgType, setBgType] = useState("solid"); // solid | transparent | image
  const [bgRgb, setBgRgb] = useState({ r: 0, g: 0, b: 0 });
  const [bgImage, setBgImage] = useState(null);
  const [bgImg] = useImage(bgImage, "anonymous");

  // Elements & selection
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null); // For inline text editing

  const selectedElement = elements.find((e) => e.id === selectedId) || null;

  // UI state
  const [isUploading, setIsUploading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState("elements");

  // Canvas size responsive
  const defaultCanvasSize = 800;
  const [canvasSize, setCanvasSize] = useState(defaultCanvasSize);

  // Responsive: adjust canvas on resize
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) {
        const margin = 32;
        const size = Math.max(280, Math.min(defaultCanvasSize, w - margin));
        setCanvasSize(size);
      } else if (w < 1024) {
        const size = Math.max(420, Math.min(defaultCanvasSize, Math.round(w * 0.6)));
        setCanvasSize(size);
      } else {
        setCanvasSize(defaultCanvasSize);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* -------------------------
     Element actions
     ------------------------- */
  const addText = () => {
    const id = `text-${Date.now()}`;
    const newText = {
      id,
      type: "text",
      text: "Double click to edit", // Changed default text
      x: 200,
      y: 200,
      fontSize: 36,
      fillRgb: { r: 255, g: 255, b: 255 },
      fontFamily: "Arial",
      align: "left",
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
    if (window.innerWidth < 640) {
      setDrawerOpen(true);
      setDrawerTab("properties");
    }
  };

  const addImage = (src, w, h) => {
    const id = `image-${Date.now()}`;
    const newImg = {
      id,
      type: "image",
      src,
      x: 150,
      y: 150,
      width: w,
      height: h,
      rotation: 0,
      opacity: 1,
      outline: true, // Default outline on
      shadowBlur: 18,
      shadowOpacity: 1,
      // tintRgb removed
    };
    setElements((s) => [...s, newImg]);
    setSelectedId(id);
    setEditingId(null);
    if (window.innerWidth < 640) {
      setDrawerOpen(true);
      setDrawerTab("properties");
    }
  };

  // ⭐ incomingImage effect
  useEffect(() => {
    if (!incomingImage) return;

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = incomingImage;

      img.onload = () => {
        const max = 600; 
        const scale = Math.min(max / img.width, max / img.height, 1);
        addImage(incomingImage, Math.round(img.width * scale), Math.round(img.height * scale));
      };

      img.onerror = () => {
        addImage(incomingImage, 300, 300);
      };
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

  /* -------------------------
     Upload handlers
     ------------------------- */
  const handleFile = async (file) => {
    if (!file) return;
    setIsUploading(true);
    setLoadingMessage("Uploading...");

    try {
      // Local File Reader fallback (faster than server)
      const reader = new FileReader();
      reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const scale = Math.min(600 / img.width, 600 / img.height, 1);
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

  /* -------------------------
     Export utilities (Download & Copy)
     ------------------------- */
  const downloadCanvasPNG = (fileName = "sticker.png") => {
    const stage = stageRef.current;
    if (!stage) return;
    
    // Deselect to hide transformer
    setSelectedId(null);
    setEditingId(null);

    // Small timeout to ensure React state updates before drawing
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

  // COPY FUNCTION RESTORED
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

  /* -------------------------
     Inline Editor Renderer
     ------------------------- */
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
        outline: '1px dashed white',
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
            onKeyDown={(e) => e.stopPropagation()} // Stop Konva shortcuts
            autoFocus
            style={style}
            rows={Math.max(1, el.text.split('\n').length)}
        />
    );
  };

  /* -------------------------
     Render
     ------------------------- */
  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      {/* TOP BAR */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <label className="inline-flex items-center gap-2 bg-neutral-800 px-3 py-2 rounded-lg cursor-pointer">
          <Upload size={16} />
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
          <span className="text-sm">Upload Image</span>
        </label>

        <button
          onClick={addText}
          className="bg-neutral-700 px-3 py-2 rounded-lg flex items-center gap-2 text-sm"
        >
          <Type size={16} /> Add Text
        </button>

        <label className="inline-flex items-center gap-2 bg-neutral-800 px-3 py-2 rounded-lg cursor-pointer">
          <ImageIcon size={16} />
          <input type="file" accept="image/*" onChange={handleBgFile} className="hidden" />
          <span className="text-sm">BG Image</span>
        </label>

        {/* NEW: Background Color Slider (Top Bar) */}
        <div className="flex items-center gap-2 bg-neutral-900 px-2 py-1 rounded border border-neutral-700">
             <span className="text-xs text-neutral-400">BG Color:</span>
             <input 
                type="color" 
                value={rgbToHex(bgRgb)} 
                onChange={(e) => {
                    setBgType("solid");
                    setBgRgb(hexToRgb(e.target.value));
                }}
                className="bg-transparent border-none w-6 h-6 cursor-pointer"
             />
        </div>

        {/* mobile drawer toggle */}
        <button
          className="ml-auto md:hidden bg-neutral-800 p-2 rounded"
          onClick={() => setDrawerOpen((s) => !s)}
          aria-label="open drawer"
        >
          {drawerOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* desktop right-side export controls */}
        <div className="ml-auto hidden md:flex items-center gap-3">
          <button
            onClick={() => downloadCanvasPNG()}
            className="bg-neutral-600 px-3 py-2 rounded-lg flex items-center gap-2"
            title="Download PNG"
          >
            <Download size={16} /> Download
          </button>

          {/* COPY BUTTON RESTORED */}
          <button
            onClick={copyCanvasToClipboard}
            className="bg-neutral-700 px-3 py-2 rounded-lg flex items-center gap-2"
            title="Copy image to clipboard"
          >
            <Copy size={16} /> Copy Image
          </button>
        </div>
      </div>

      
      <div className="md:grid md:grid-cols-[220px_1fr_320px] gap-4">
        
        
        <div className="hidden md:block bg-neutral-900 rounded-lg p-3 overflow-auto h-[76vh]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ImageIcon size={16} /> Elements
            </div>
            <div className="text-xs text-neutral-400">{elements.length}</div>
          </div>

          {elements.length === 0 ? (
            <div className="p-6 text-center text-neutral-500">No elements yet</div>
          ) : (
            <div className="space-y-2">
              {[...elements].map((el) => (
                <div
                  key={el.id}
                  onClick={() => setSelectedId(el.id)}
                  className={`flex items-center justify-between gap-2 p-2 rounded-lg cursor-pointer hover:bg-neutral-700 ${
                    selectedId === el.id ? "bg-neutral-600" : "bg-neutral-800"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {el.type === "text" ? <Type size={14} /> : <ImageIcon size={14} />}
                    <div className="text-sm truncate min-w-0">{el.type === "text" ? el.text : "Image"}</div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteElement(el.id);
                      }}
                      className="p-1 rounded hover:bg-neutral-600"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center bg-neutral-800/50 rounded-lg border border-neutral-700">
          <div 
            className="relative shadow-lg" 
            style={{ width: canvasSize + 40 }}
            ref={canvasContainerRef}
          >
            <div className="bg-white mx-auto rounded-md overflow-hidden touch-none relative" style={{ width: canvasSize, height: canvasSize }}>
              
              <Stage
                width={canvasSize}
                height={canvasSize}
                ref={stageRef}
                onMouseDown={(e) => {
                  const stage = e.target.getStage();
                  const targetName = e.target.getName ? e.target.getName() : "";
                  const className = e.target.getClassName ? e.target.getClassName() : "";
                  const clickedOnEmpty =
                    e.target === stage ||
                    targetName === "canvas-background" ||
                    targetName === "bg-image";
                  if (clickedOnEmpty) {
                    setSelectedId(null);
                    setEditingId(null);
                  }
                }}
              >
                <Layer>
                  {bgType === "image" && bgImg ? (
                    <KImage
                      image={bgImg}
                      x={0}
                      y={0}
                      width={canvasSize}
                      height={canvasSize}
                      name="bg-image"
                      listening={false}
                    />
                  ) : (
                    <Rect
                      x={0}
                      y={0}
                      width={canvasSize}
                      height={canvasSize}
                      fill={bgType === "transparent" ? "transparent" : rgbToCss(bgRgb)}
                      name="canvas-background"
                      listening={false}
                    />
                  )}

                  {elements.map((el) =>
                    el.type === "text" ? (
                      <TextElement
                        key={el.id}
                        shapeProps={{ ...el }}
                        isSelected={el.id === selectedId}
                        isEditing={el.id === editingId}
                        onSelect={() => {
                            setSelectedId(el.id);
                            setEditingId(null);
                        }}
                        onDblClick={() => {
                            setSelectedId(el.id);
                            setEditingId(el.id); // Trigger inline editor
                        }}
                        onChange={(newAttrs) => updateElement(el.id, newAttrs)}
                      />
                    ) : (
                      <ImageElement
                        key={el.id}
                        shapeProps={el}
                        isSelected={el.id === selectedId}
                        onSelect={() => {
                            setSelectedId(el.id);
                            setEditingId(null);
                        }}
                        onChange={(newAttrs) => updateElement(el.id, newAttrs)}
                      />
                    )
                  )}
                </Layer>
              </Stage>
              
              {/* INLINE EDITOR OVERLAY */}
              {renderInlineEditor()}

            </div>

            {/* FOOTER */}
            <div className="mt-3 flex items-center justify-between text-xs text-neutral-400 px-4">
              <div className="flex items-center gap-2">
                <Eye size={14} /> <span>{elements.length} elements</span>
              </div>
              <div className="text-right">
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" /> {loadingMessage}
                  </span>
                ) : (
                  <span>Double-click text to edit • Drag corners to resize</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — PROPERTIES (desktop) */}
        <div className="hidden md:block bg-neutral-900 rounded-lg p-4 h-[76vh] overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 font-semibold">
              <Settings size={16} /> Properties
            </div>
            <div className="text-xs text-neutral-400">{selectedElement ? selectedElement.id : "No selection"}</div>
          </div>

          {!selectedElement ? (
            <div className="text-neutral-500">Select an element to edit</div>
          ) : selectedElement.type === "text" ? (
            <div className="space-y-3">
              {/* NOTE: Textarea removed from here, use double click on canvas */}
              <div className="text-xs text-neutral-400 italic">Double-click text on canvas to type</div>

              <div>
                <label className="text-xs">Font Size: {selectedElement.fontSize}px</label>
                <input
                  type="range"
                  min={10}
                  max={200}
                  value={selectedElement.fontSize}
                  onChange={(e) => updateElement(selectedElement.id, { fontSize: parseInt(e.target.value, 10) })}
                  className="w-full accent-white"
                />
              </div>

              <div>
                <label className="text-xs">Font Color</label>
                <RgbPicker
                  rgb={selectedElement.fillRgb ?? { r: 255, g: 255, b: 255 }}
                  onChange={(rgb) => updateElement(selectedElement.id, { fillRgb: rgb })}
                />
              </div>

              <div>
                <label className="text-xs">Font Family</label>
                <select
                  value={selectedElement.fontFamily}
                  onChange={(e) => updateElement(selectedElement.id, { fontFamily: e.target.value })}
                  className="w-full bg-neutral-800 p-2 rounded text-sm"
                >
                  {AVAILABLE_FONTS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              {/* ALIGN + BOLD */}
              <div>
                <label className="text-xs">Alignment</label>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => updateElement(selectedElement.id, { align: "left" })}
                    className={`flex-1 py-2 rounded ${selectedElement.align === "left" ? "bg-neutral-500" : "bg-neutral-700"}`}
                  >
                    <AlignLeft size={14} className="mx-auto" />
                  </button>

                  <button
                    onClick={() => updateElement(selectedElement.id, { align: "center" })}
                    className={`flex-1 py-2 rounded ${selectedElement.align === "center" ? "bg-neutral-500" : "bg-neutral-700"}`}
                  >
                    <AlignCenter size={14} className="mx-auto" />
                  </button>

                  <button
                    onClick={() => updateElement(selectedElement.id, { align: "right" })}
                    className={`flex-1 py-2 rounded ${selectedElement.align === "right" ? "bg-neutral-500" : "bg-neutral-700"}`}
                  >
                    <AlignRight size={14} className="mx-auto" />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs">Bold</label>
                <button
                  className={`w-full py-2 mt-1 rounded ${selectedElement.fontStyle === "bold" ? "bg-neutral-500" : "bg-neutral-700"}`}
                  onClick={() =>
                    updateElement(selectedElement.id, {
                      fontStyle: selectedElement.fontStyle === "bold" ? "normal" : "bold",
                    })
                  }
                >
                  <div className="flex items-center justify-center gap-2">
                    <Bold size={14} /> {selectedElement.fontStyle === "bold" ? "Bold: ON" : "Bold: OFF"}
                  </div>
                </button>
              </div>

              <div>
                <label className="text-xs">Opacity</label>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={selectedElement.opacity ?? 1}
                  onChange={(e) => updateElement(selectedElement.id, { opacity: parseFloat(e.target.value) })}
                  className="w-full accent-white"
                />
              </div>

              <div className="flex gap-2">
                <button
                  className="flex-1 bg-neutral-700 py-2 rounded"
                  onClick={() => updateElement(selectedElement.id, { textBg: !selectedElement.textBg })}
                >
                  {selectedElement.textBg ? "Text BG: ON" : "Text BG: OFF"}
                </button>
                <button className="flex-1 bg-neutral-700 py-2 rounded" onClick={() => deleteElement(selectedElement.id)}>
                  <Trash2 size={14} className="mx-auto" />
                </button>
              </div>

              {/* Text BG options */}
              {selectedElement.textBg && (
                <>
                  <div>
                    <label className="text-xs">Text BG Opacity</label>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={selectedElement.textBgOpacity ?? 0.6}
                      onChange={(e) => updateElement(selectedElement.id, { textBgOpacity: parseFloat(e.target.value) })}
                      className="w-full accent-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs">Text BG Color</label>
                    <RgbPicker
                      rgb={selectedElement.textBgRgb ?? { r: 0, g: 0, b: 0 }}
                      onChange={(rgb) => updateElement(selectedElement.id, { textBgRgb: rgb })}
                    />
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-xs">Opacity: {Math.round((selectedElement.opacity ?? 1) * 100)}%</label>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={selectedElement.opacity ?? 1}
                  onChange={(e) => updateElement(selectedElement.id, { opacity: parseFloat(e.target.value) })}
                  className="w-full accent-white"
                />
              </div>

              <div>
                <label className="text-xs">Rotation: {Math.round(selectedElement.rotation ?? 0)}°</label>
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={selectedElement.rotation ?? 0}
                  onChange={(e) => updateElement(selectedElement.id, { rotation: parseInt(e.target.value, 10) })}
                  className="w-full accent-white"
                />
              </div>

              {/* TINT SLIDER REMOVED AS REQUESTED */}

              <div>
                <label className="text-xs">White Outline</label>
                <button
                  className={`px-3 py-2 rounded w-full ${selectedElement.outline ? "bg-neutral-500" : "bg-neutral-700"}`}
                  onClick={() => updateElement(selectedElement.id, { outline: !selectedElement.outline })}
                >
                  {selectedElement.outline ? "ON" : "OFF"}
                </button>
              </div>

              <div>
                <label className="text-xs">Outline Strength</label>
                <input
                  type="range"
                  min={0}
                  max={80}
                  value={selectedElement.shadowBlur ?? 18}
                  onChange={(e) => updateElement(selectedElement.id, { shadowBlur: parseInt(e.target.value, 10) })}
                  className="w-full accent-white"
                />
              </div>

              <button className="w-full bg-neutral-700 py-2 rounded mt-2" onClick={() => deleteElement(selectedElement.id)}>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}