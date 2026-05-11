import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, X, ArrowRight } from "lucide-react";
import { upload as uploadApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Constructor() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (selectedFiles) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setUploading(true);
    const newFiles = [];
    for (const file of selectedFiles) {
      try {
        const result = await uploadApi.file(file);
        if (result.error) {
          newFiles.push({ name: file.name, error: result.error });
        } else {
          newFiles.push({
            name: result.original_name,
            url: result.url,
            size: result.size,
          });
        }
      } catch {
        newFiles.push({ name: file.name, error: "Помилка завантаження" });
      }
    }
    setFiles([...files, ...newFiles]);
    setUploading(false);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="constructor-page">
      <h1
        style={{
          fontSize: "1.8rem",
          marginBottom: 8,
          color: "var(--slate-900)",
        }}
      >
        Онлайн-конструктор
      </h1>
      <p style={{ color: "var(--slate-500)", marginBottom: 32 }}>
        Завантажте креслення вашого майбутнього виробу та створіть тендер
      </p>

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16 }}>Завантаження креслень</h3>

        <div
          className="upload-zone"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="icon">
            <Upload size={40} />
          </div>
          <p>
            <strong>Натисніть</strong> або перетягніть файли сюди
          </p>
          <p className="formats">
            Підтримувані формати: DWG, DXF, STEP, STP, IGES, STL, OBJ, PDF,
            PNG, JPG
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          style={{ display: "none" }}
          accept=".pdf,.dwg,.dxf,.step,.stp,.iges,.stl,.obj,.png,.jpg,.jpeg"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {uploading && (
          <p style={{ marginTop: 12, color: "var(--blue-600)" }}>
            Завантаження...
          </p>
        )}

        {files.length > 0 && (
          <div className="file-list">
            {files.map((f, i) => (
              <div
                key={i}
                className="file-item"
                style={f.error ? { borderColor: "var(--danger)" } : {}}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <FileText size={18} color="var(--blue-500)" />
                  <span>{f.name}</span>
                  {f.size && (
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--slate-400)",
                      }}
                    >
                      {formatSize(f.size)}
                    </span>
                  )}
                  {f.error && (
                    <span
                      style={{ fontSize: "0.8rem", color: "var(--danger)" }}
                    >
                      {f.error}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => removeFile(i)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--slate-400)",
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16 }}>Підтримувані CAD-програми</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
          }}
        >
          {[
            {
              name: "AutoCAD",
              formats: "DWG, DXF",
              desc: "Найпопулярніший CAD для 2D-креслень",
            },
            {
              name: "SolidWorks",
              formats: "STEP, STL",
              desc: "Професійне 3D-моделювання",
            },
            {
              name: "Компас-3D",
              formats: "STEP, IGES",
              desc: "Популярний в СНД CAD-пакет",
            },
            {
              name: "Інші CAD",
              formats: "STEP, IGES, OBJ",
              desc: "Будь-яка CAD-система з експортом",
            },
          ].map((cad) => (
            <div
              key={cad.name}
              style={{
                padding: 16,
                background: "var(--blue-50)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <h4 style={{ marginBottom: 4 }}>{cad.name}</h4>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "var(--blue-600)",
                  marginBottom: 4,
                }}
              >
                {cad.formats}
              </p>
              <p style={{ fontSize: "0.8rem", color: "var(--slate-500)" }}>
                {cad.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {files.filter((f) => !f.error).length > 0 && (
        <div style={{ textAlign: "center" }}>
          <button
            className="btn btn-primary btn-large"
            onClick={() => navigate("/tenders/create")}
          >
            Створити тендер з цими кресленнями
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
