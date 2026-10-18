import React, { useRef } from 'react';
import { StampSettings, PaymentStatus } from '../types/receipt';
import { Sliders, RotateCw, Move, Upload, Eye, EyeOff, Palette, Image as ImageIcon } from 'lucide-react';

interface StampCustomizerProps {
  paidStampSettings: StampSettings;
  companyStampSettings: StampSettings;
  paymentStatus: PaymentStatus;
  onChangePaidStamp: (settings: StampSettings) => void;
  onChangeCompanyStamp: (settings: StampSettings) => void;
  isInteractiveStamps: boolean;
  onToggleInteractiveStamps: () => void;
}

export const StampCustomizer: React.FC<StampCustomizerProps> = ({
  paidStampSettings,
  companyStampSettings,
  paymentStatus,
  onChangePaidStamp,
  onChangeCompanyStamp,
  isInteractiveStamps,
  onToggleInteractiveStamps,
}) => {
  const companyFileRef = useRef<HTMLInputElement>(null);

  const handleCompanyImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onChangeCompanyStamp({
          ...companyStampSettings,
          uploadedImage: reader.result as string,
          enabled: true,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <h3 className="font-semibold text-sm tracking-wide">Stamp & Seal Controls</h3>
        </div>
        <button
          type="button"
          onClick={onToggleInteractiveStamps}
          className={`px-2.5 py-1 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
            isInteractiveStamps
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          title="Enable direct click & drag on receipt preview"
        >
          <Move className="w-3.5 h-3.5" />
          {isInteractiveStamps ? 'Drag on Preview Active' : 'Enable Drag on Preview'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Paid / Status Stamp Card */}
        <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor:
                    paymentStatus === 'Paid'
                      ? '#dc2626'
                      : paymentStatus === 'Pending'
                      ? '#ea580c'
                      : '#2563eb',
                }}
              />
              <span className="text-xs font-bold uppercase tracking-wider">
                {paymentStatus === 'Paid'
                  ? 'PAID Stamp (Red Ink)'
                  : paymentStatus === 'Pending'
                  ? 'PENDING Stamp (Orange Ink)'
                  : 'PARTIALLY PAID Stamp (Blue)'}
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                onChangePaidStamp({
                  ...paidStampSettings,
                  enabled: !paidStampSettings.enabled,
                })
              }
              className={`p-1.5 rounded transition ${
                paidStampSettings.enabled
                  ? 'text-emerald-400 hover:bg-slate-700'
                  : 'text-slate-500 hover:bg-slate-700'
              }`}
              title={paidStampSettings.enabled ? 'Hide Stamp' : 'Show Stamp'}
            >
              {paidStampSettings.enabled ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>

          {paidStampSettings.enabled && (
            <div className="space-y-2 text-xs text-slate-300 pt-1">
              {/* Position X Slider */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 w-16">Horiz. (X):</span>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={paidStampSettings.x}
                  onChange={(e) =>
                    onChangePaidStamp({
                      ...paidStampSettings,
                      x: Number(e.target.value),
                    })
                  }
                  className="w-full h-1.5 bg-slate-700 rounded-lg accent-emerald-500 cursor-pointer"
                />
                <span className="font-mono text-[10px] w-8 text-right">
                  {paidStampSettings.x}%
                </span>
              </div>

              {/* Position Y Slider */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 w-16">Vert. (Y):</span>
                <input
                  type="range"
                  min="10"
                  max="95"
                  value={paidStampSettings.y}
                  onChange={(e) =>
                    onChangePaidStamp({
                      ...paidStampSettings,
                      y: Number(e.target.value),
                    })
                  }
                  className="w-full h-1.5 bg-slate-700 rounded-lg accent-emerald-500 cursor-pointer"
                />
                <span className="font-mono text-[10px] w-8 text-right">
                  {paidStampSettings.y}%
                </span>
              </div>

              {/* Scale & Rotation */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Size:</span>
                    <span>{paidStampSettings.scale.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.6"
                    max="1.5"
                    step="0.05"
                    value={paidStampSettings.scale}
                    onChange={(e) =>
                      onChangePaidStamp({
                        ...paidStampSettings,
                        scale: Number(e.target.value),
                      })
                    }
                    className="w-full h-1.5 bg-slate-700 rounded-lg accent-emerald-500 cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Angle:</span>
                    <span>{paidStampSettings.rotation}°</span>
                  </div>
                  <input
                    type="range"
                    min="-45"
                    max="45"
                    value={paidStampSettings.rotation}
                    onChange={(e) =>
                      onChangePaidStamp({
                        ...paidStampSettings,
                        rotation: Number(e.target.value),
                      })
                    }
                    className="w-full h-1.5 bg-slate-700 rounded-lg accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Company Official Stamp Card */}
        <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Company Seal / Stamp
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                onChangeCompanyStamp({
                  ...companyStampSettings,
                  enabled: !companyStampSettings.enabled,
                })
              }
              className={`p-1.5 rounded transition ${
                companyStampSettings.enabled
                  ? 'text-emerald-400 hover:bg-slate-700'
                  : 'text-slate-500 hover:bg-slate-700'
              }`}
              title={companyStampSettings.enabled ? 'Hide Stamp' : 'Show Stamp'}
            >
              {companyStampSettings.enabled ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>

          {companyStampSettings.enabled && (
            <div className="space-y-2 text-xs text-slate-300 pt-1">
              {/* Position X Slider */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 w-16">Horiz. (X):</span>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={companyStampSettings.x}
                  onChange={(e) =>
                    onChangeCompanyStamp({
                      ...companyStampSettings,
                      x: Number(e.target.value),
                    })
                  }
                  className="w-full h-1.5 bg-slate-700 rounded-lg accent-blue-500 cursor-pointer"
                />
                <span className="font-mono text-[10px] w-8 text-right">
                  {companyStampSettings.x}%
                </span>
              </div>

              {/* Position Y Slider */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 w-16">Vert. (Y):</span>
                <input
                  type="range"
                  min="10"
                  max="95"
                  value={companyStampSettings.y}
                  onChange={(e) =>
                    onChangeCompanyStamp({
                      ...companyStampSettings,
                      y: Number(e.target.value),
                    })
                  }
                  className="w-full h-1.5 bg-slate-700 rounded-lg accent-blue-500 cursor-pointer"
                />
                <span className="font-mono text-[10px] w-8 text-right">
                  {companyStampSettings.y}%
                </span>
              </div>

              {/* Upload custom stamp image */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-700/60">
                <span className="text-[11px] text-slate-400">Custom Stamp Image:</span>
                <div className="flex items-center gap-1.5">
                  {companyStampSettings.uploadedImage ? (
                    <button
                      type="button"
                      onClick={() =>
                        onChangeCompanyStamp({
                          ...companyStampSettings,
                          uploadedImage: undefined,
                        })
                      }
                      className="text-[10px] text-red-400 hover:underline"
                    >
                      Remove
                    </button>
                  ) : null}
                  <input
                    ref={companyFileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCompanyImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => companyFileRef.current?.click()}
                    className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-[11px] flex items-center gap-1"
                  >
                    <Upload className="w-3 h-3" />
                    {companyStampSettings.uploadedImage ? 'Replace' : 'Upload PNG'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
