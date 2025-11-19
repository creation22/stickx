// StickerEditorModern.jsx
// Complete, ready-to-drop React component file.
// Features included:
// - Konva editor (text + images)
// - RGB color picker
// - Text align (left/center/right) + Bold toggle
// - Deselect when clicking/touching background
// - Mobile responsive drawer (elements/properties/background)
// - Export modal (styled to match dark theme) asking permission to submit to pending.json
// - If user agrees, sends POST to /api/stickers/pending with { imageUrl: uri }
// - Editor uploads (file -> /api/stickers/upload) remain unchanged (they return imageUrl only)
// - No MongoDB interaction from editor
//
// Notes:
// - Uses Tailwind classes for styling. Ensure Tailwind is configured in your project.
// - Assumes backend route POST /api/stickers/pending accepts { imageUrl } (base64 data URL or remote URL).
// - Keep Cloudinary/upload backend as previously arranged.
// - You can tweak endpoints/URLs to match production.
//
// Author: Generated for your project
import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Image as KImage, Text, Rect, Transformer } from "react-konva";
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
} from "lucide-react";

/* ===========================
   Constants & Helpers
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
const TransformerWrapper = ({ selectedShapeRef, trRef }) => {
  useEffect(() => {
    if (trRef.current && selectedShapeRef.current) {
      trRef.current.nodes([selectedShapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [selectedShapeRef, trRef]);
  return <Transformer ref={trRef} />;
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
          className="w-10 h-10 p-0 border-0 rounded"
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
   TextElement component
   =========================== */
const TextElement = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const height = shapeProps.height ?? Math.max(40, Math.round(shapeProps.fontSize * 1.4));

  return (
    <>
      {shapeProps.textBg && (
        <Rect
          x={shapeProps.x - (shapeProps.padding ?? 10)}
          y={shapeProps.y - (shapeProps.padding ?? 10)}
          width={(shapeProps.width ?? 200) + 2 * (shapeProps.padding ?? 10)}
          height={height + 2 * (shapeProps.padding ?? 10)}
          fill={rgbToCss(shapeProps.textBgRgb ?? { r: 0, g: 0, b: 0 })}
          opacity={shapeProps.textBgOpacity ?? 0.6}
          cornerRadius={6}
          listening={false}
          name="background-helper"
        />
      )}

      <Text
        ref={shapeRef}
        {...shapeProps}
        fill={rgbToCss(shapeProps.fillRgb ?? { r: 255, g: 255, b: 255 })}
        fontStyle={shapeProps.fontStyle ?? "normal"}
        align={shapeProps.align ?? "left"}
        draggable
        padding={shapeProps.padding ?? 10}
        height={height}
        onClick={onSelect}
        onTap={onSelect}
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
            width: Math.max(20, node.width() * scaleX),
            height: Math.max(20, node.height() * scaleY),
            fontSize: Math.max(5, Math.round(shapeProps.fontSize * scaleY)),
            rotation: Math.round(node.rotation()),
          });
        }}
        shadowColor={shapeProps.outline ? "#ffffff" : undefined}
        shadowBlur={shapeProps.shadowBlur ?? 0}
        shadowOpacity={shapeProps.outline ? shapeProps.shadowOpacity ?? 1 : 0}
      />

      {isSelected && <TransformerWrapper selectedShapeRef={shapeRef} trRef={trRef} />}
    </>
  );
};

/* ===========================
   ImageElement component
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

  const useRGBAFilter = !!shapeProps.tintRgb;
  const filters = useRGBAFilter ? [Konva.Filters.RGBA] : [];

  return (
    <>
      <KImage
        image={img}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        filters={filters}
        red={useRGBAFilter ? shapeProps.tintRgb.r : undefined}
        green={useRGBAFilter ? shapeProps.tintRgb.g : undefined}
        blue={useRGBAFilter ? shapeProps.tintRgb.b : undefined}
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
      {isSelected && <TransformerWrapper selectedShapeRef={shapeRef} trRef={trRef} />}
    </>
  );
};

/* ===========================
   Main Component
   =========================== */

export default function StickerEditorModern() {
  const stageRef = useRef();
  const fileInputRef = useRef();

  // Background
  const [bgType, setBgType] = useState("solid"); // solid | transparent | image
  const [bgRgb, setBgRgb] = useState({ r: 0, g: 0, b: 0 });
  const [bgImage, setBgImage] = useState(null);
  const [bgImg] = useImage(bgImage, "anonymous");

  // Elements & selection
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
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

  // Export modal state
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportingUri, setExportingUri] = useState(null);
  const [submittingPending, setSubmittingPending] = useState(false);

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
      text: "New text",
      x: 200,
      y: 200,
      fontSize: 36,
      fill: "rgb(255,255,255)",
      fillRgb: { r: 255, g: 255, b: 255 },
      fontFamily: "Arial",
      align: "left",
      fontStyle: "normal",
      rotation: 0,
      opacity: 1,
      width: 300,
      height: 60,
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
      outline: true,
      shadowBlur: 18,
      shadowOpacity: 1,
      tintRgb: { r: 255, g: 255, b: 255 },
    };
    setElements((s) => [...s, newImg]);
    setSelectedId(id);
    if (window.innerWidth < 640) {
      setDrawerOpen(true);
      setDrawerTab("properties");
    }
  };

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
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("http://localhost:5000/api/stickers/upload", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (!data.imageUrl) throw new Error("Invalid server response");

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const scale = Math.min(600 / img.width, 600 / img.height, 1);
        addImage(data.imageUrl, Math.round(img.width * scale), Math.round(img.height * scale));
        setIsUploading(false);
        setLoadingMessage("");
      };
      img.src = data.imageUrl;
    } catch (err) {
      alert(err.message || "Upload failed");
      setIsUploading(false);
      setLoadingMessage("");
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
     Export logic (modal based)
     ------------------------- */

  const prepareExport = () => {
    const stage = stageRef.current;
    if (!stage) return;

    // Hide transformers
    const transformers = stage.find("Transformer");
    transformers.forEach((tr) => tr.visible(false));
    stage.draw();

    // Export PNG data URL
    const uri = stage.toDataURL({
      pixelRatio: 3,
      quality: 1,
      mimeType: "image/png",
    });

    // Re-show transformers
    transformers.forEach((tr) => tr.visible(true));
    stage.draw();

    // Trigger download immediately
    const a = document.createElement("a");
    a.href = uri;
    a.download = "sticker.png";
    a.click();

    // Open modal to ask user
    setExportingUri(uri);
    setExportModalOpen(true);
  };

  const submitPending = async () => {
    if (!exportingUri) return;
    setSubmittingPending(true);
    try {
      const res = await fetch("http://localhost:5000/api/stickers/pending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: exportingUri }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      // success
      setExportModalOpen(false);
      setExportingUri(null);
      alert("Thanks — your sticker was submitted for review!");
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please try again later.");
    } finally {
      setSubmittingPending(false);
    }
  };

  const cancelPending = () => {
    setExportModalOpen(false);
    setExportingUri(null);
  };

  /* -------------------------
     Render
     ------------------------- */

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      {/* TOP BAR */}
      <div className="flex items-center gap-3 mb-4">
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
          <span className="text-sm">Background Image</span>
        </label>

        {/* mobile drawer toggle */}
        <button
          className="ml-auto md:hidden bg-neutral-800 p-2 rounded"
          onClick={() => setDrawerOpen((s) => !s)}
          aria-label="open drawer"
        >
          {drawerOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* desktop right-side controls */}
        <div className="ml-auto hidden md:flex items-center gap-3">
          <button
            onClick={prepareExport}
            className="bg-neutral-600 px-3 py-2 rounded-lg flex items-center gap-2"
          >
            <Download size={16} /> Export PNG
          </button>
        </div>
      </div>

      {/* LAYOUT GRID */}
      <div className="md:grid md:grid-cols-[220px_1fr_320px] gap-4">
        {/* LEFT PANEL (desktop) */}
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

        {/* CENTER — CANVAS */}
        <div className="flex items-center justify-center">
          <div className="bg-neutral-800 p-4 rounded-lg shadow-lg" style={{ width: canvasSize + 40 }}>
            <div className="bg-white rounded-md overflow-hidden touch-none" style={{ width: canvasSize, height: canvasSize }}>
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
                    targetName === "bg-image" ||
                    className === "Rect" ||
                    className === "Image";
                  if (clickedOnEmpty) {
                    setSelectedId(null);
                  }
                }}
                onTouchStart={(e) => {
                  const stage = e.target.getStage();
                  const targetName = e.target.getName ? e.target.getName() : "";
                  const className = e.target.getClassName ? e.target.getClassName() : "";
                  const clickedOnEmpty =
                    e.target === stage ||
                    targetName === "canvas-background" ||
                    targetName === "bg-image" ||
                    className === "Rect" ||
                    className === "Image";
                  if (clickedOnEmpty) {
                    setSelectedId(null);
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
                        onSelect={() => setSelectedId(el.id)}
                        onChange={(newAttrs) => updateElement(el.id, newAttrs)}
                      />
                    ) : (
                      <ImageElement
                        key={el.id}
                        shapeProps={el}
                        isSelected={el.id === selectedId}
                        onSelect={() => setSelectedId(el.id)}
                        onChange={(newAttrs) => updateElement(el.id, newAttrs)}
                      />
                    )
                  )}
                </Layer>
              </Stage>
            </div>

            {/* FOOTER */}
            <div className="mt-3 flex items-center justify-between text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <Eye size={14} /> <span>{elements.length} elements</span>
              </div>
              <div className="text-right">
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" /> {loadingMessage}
                  </span>
                ) : (
                  <span>Ready</span>
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
              <label className="text-xs">Content</label>
              <textarea
                value={selectedElement.text}
                onChange={(e) => updateElement(selectedElement.id, { text: e.target.value })}
                className="w-full bg-neutral-800 p-2 rounded text-sm"
                rows={3}
              />

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
                    title="Align left"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <AlignLeft size={14} /> Left
                    </div>
                  </button>

                  <button
                    onClick={() => updateElement(selectedElement.id, { align: "center" })}
                    className={`flex-1 py-2 rounded ${selectedElement.align === "center" ? "bg-neutral-500" : "bg-neutral-700"}`}
                    title="Align center"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <AlignCenter size={14} /> Center
                    </div>
                  </button>

                  <button
                    onClick={() => updateElement(selectedElement.id, { align: "right" })}
                    className={`flex-1 py-2 rounded ${selectedElement.align === "right" ? "bg-neutral-500" : "bg-neutral-700"}`}
                    title="Align right"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <AlignRight size={14} /> Right
                    </div>
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

              <div className="flex gap-2">
                <button
                  className="flex-1 bg-neutral-700 py-2 rounded"
                  onClick={() => updateElement(selectedElement.id, { textBg: !selectedElement.textBg })}
                >
                  {selectedElement.textBg ? "Text BG: ON" : "Text BG: OFF"}
                </button>
                <button className="flex-1 bg-neutral-700 py-2 rounded" onClick={() => deleteElement(selectedElement.id)}>
                  <Trash2 size={14} />
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

              <div>
                <label className="text-xs">Image Tint (color picker + RGB sliders)</label>
                <RgbPicker
                  rgb={selectedElement.tintRgb ?? { r: 255, g: 255, b: 255 }}
                  onChange={(rgb) => updateElement(selectedElement.id, { tintRgb: rgb })}
                />
                <div className="text-xs text-neutral-400 mt-1">255,255,255 = original; lower values tint toward black.</div>
              </div>

              <div>
                <label className="text-xs">White Outline</label>
                <button
                  className={`px-3 py-2 rounded ${selectedElement.outline ? "bg-neutral-500" : "bg-neutral-700"}`}
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

              <div>
                <label className="text-xs">Outline Opacity</label>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={selectedElement.shadowOpacity ?? 1}
                  onChange={(e) => updateElement(selectedElement.id, { shadowOpacity: parseFloat(e.target.value) })}
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

      {/* MOBILE DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-[92%] max-w-[420px] bg-neutral-900 shadow-xl transform transition-transform duration-300 z-50 md:hidden
          ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Settings size={16} /> <div className="font-semibold">Editor</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDrawerTab("elements")}
              className={`px-2 py-1 rounded text-sm ${drawerTab === "elements" ? "bg-neutral-700" : ""}`}
            >
              Elements
            </button>
            <button
              onClick={() => setDrawerTab("properties")}
              className={`px-2 py-1 rounded text-sm ${drawerTab === "properties" ? "bg-neutral-700" : ""}`}
            >
              Properties
            </button>
            <button
              onClick={() => setDrawerTab("background")}
              className={`px-2 py-1 rounded text-sm ${drawerTab === "background" ? "bg-neutral-700" : ""}`}
            >
              Background
            </button>
            <button className="ml-2 p-2" onClick={() => setDrawerOpen(false)}>
              <X />
            </button>
          </div>
        </div>

        <div className="p-3 overflow-auto h-full">
          {drawerTab === "elements" && (
            <>
              <div className="mb-3 text-xs text-neutral-400">Elements ({elements.length})</div>
              {elements.length === 0 ? (
                <div className="p-6 text-center text-neutral-500">No elements yet</div>
              ) : (
                <div className="space-y-2">
                  {[...elements].map((el) => (
                    <div
                      key={el.id}
                      onClick={() => {
                        setSelectedId(el.id);
                        setDrawerTab("properties");
                      }}
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
            </>
          )}

          {drawerTab === "properties" && (
            <>
              <div className="mb-2 text-xs text-neutral-400">Properties</div>
              {!selectedElement ? (
                <div className="text-neutral-500">Select an element to edit</div>
              ) : selectedElement.type === "text" ? (
                <div className="space-y-3">
                  <label className="text-xs">Content</label>
                  <textarea
                    value={selectedElement.text}
                    onChange={(e) => updateElement(selectedElement.id, { text: e.target.value })}
                    className="w-full bg-neutral-800 p-2 rounded text-sm"
                    rows={3}
                  />

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

                  <div>
                    <label className="text-xs">Alignment</label>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => updateElement(selectedElement.id, { align: "left" })}
                        className={`flex-1 py-2 rounded ${selectedElement.align === "left" ? "bg-neutral-500" : "bg-neutral-700"}`}
                        title="Align left"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <AlignLeft size={14} /> Left
                        </div>
                      </button>

                      <button
                        onClick={() => updateElement(selectedElement.id, { align: "center" })}
                        className={`flex-1 py-2 rounded ${selectedElement.align === "center" ? "bg-neutral-500" : "bg-neutral-700"}`}
                        title="Align center"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <AlignCenter size={14} /> Center
                        </div>
                      </button>

                      <button
                        onClick={() => updateElement(selectedElement.id, { align: "right" })}
                        className={`flex-1 py-2 rounded ${selectedElement.align === "right" ? "bg-neutral-500" : "bg-neutral-700"}`}
                        title="Align right"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <AlignRight size={14} /> Right
                        </div>
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

                  <div className="flex gap-2">
                    <button
                      className="flex-1 bg-neutral-700 py-2 rounded"
                      onClick={() => updateElement(selectedElement.id, { textBg: !selectedElement.textBg })}
                    >
                      {selectedElement.textBg ? "Text BG: ON" : "Text BG: OFF"}
                    </button>
                    <button
                      className="flex-1 bg-neutral-700 py-2 rounded"
                      onClick={() => deleteElement(selectedElement.id)}
                    >
                      <Trash2 size={14} />
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

                  <div>
                    <label className="text-xs">Image Tint (color picker + RGB sliders)</label>
                    <RgbPicker
                      rgb={selectedElement.tintRgb ?? { r: 255, g: 255, b: 255 }}
                      onChange={(rgb) => updateElement(selectedElement.id, { tintRgb: rgb })}
                    />
                    <div className="text-xs text-neutral-400 mt-1">255,255,255 = original; lower values tint toward black.</div>
                  </div>

                  <div>
                    <label className="text-xs">White Outline</label>
                    <button
                      className={`px-3 py-2 rounded ${selectedElement.outline ? "bg-neutral-500" : "bg-neutral-700"}`}
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

                  <div>
                    <label className="text-xs">Outline Opacity</label>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={selectedElement.shadowOpacity ?? 1}
                      onChange={(e) => updateElement(selectedElement.id, { shadowOpacity: parseFloat(e.target.value) })}
                      className="w-full accent-white"
                    />
                  </div>

                  <button className="w-full bg-neutral-700 py-2 rounded mt-2" onClick={() => deleteElement(selectedElement.id)}>
                    Delete
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Export Modal (styled, theme-aware) */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg bg-neutral-900 rounded-lg shadow-xl border border-neutral-800">
            <div className="flex items-center justify-between p-4 border-b border-neutral-800">
              <div className="text-lg font-semibold">Share your sticker?</div>
              <button onClick={cancelPending} className="p-2 rounded hover:bg-neutral-800">
                <X />
              </button>
            </div>
            <div className="p-4">
              <p className="text-sm text-neutral-300">
                Would you like to submit your exported sticker to our pending list for possible inclusion in the feed?
              </p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => submitPending()}
                  disabled={submittingPending}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-black py-2 rounded font-semibold"
                >
                  {submittingPending ? "Submitting..." : "Yes — submit"}
                </button>

                <button
                  onClick={cancelPending}
                  className="flex-1 bg-neutral-700 hover:bg-neutral-600 py-2 rounded"
                >
                  No, thanks
                </button>
              </div>

              <div className="mt-4 text-xs text-neutral-400">
                We will only save the exported image URL to a local pending list (pending.json). Your image will not be added to the feed unless approved.
              </div>

              {/* preview */}
              {exportingUri && (
                <div className="mt-4 bg-neutral-800 rounded p-2">
                  <div className="text-xs text-neutral-400 mb-2">Preview (exported image)</div>
                  <img src={exportingUri} alt="export preview" className="w-full rounded" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
