// src/components/products/SizeGuideModal.tsx
import React, { useState } from 'react';
import { X, Ruler, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SizeGuideModalProps {
  open: boolean;
  onClose: () => void;
  category: string;
  productName?: string;
  onSelectSize?: (size: string) => void;
  currentSelectedSize?: string | null;
}

type Unit = 'in' | 'cm';

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  open,
  onClose,
  category,
  productName = '',
  onSelectSize,
  currentSelectedSize,
}) => {
  const [unit, setUnit] = useState<Unit>('in');

  const isFootwear =
    productName.toLowerCase().includes('shoe') ||
    productName.toLowerCase().includes('sneaker') ||
    productName.toLowerCase().includes('air max') ||
    productName.toLowerCase().includes('running') ||
    category === 'shoes' ||
    category === 'footwear';

  const isBottoms = category === 'bottoms' && !isFootwear;

  // Sizing data
  const shoeSizes = [
    { uk: 'UK 7', us: 'US 8', eu: 'EU 41', cm: '26.0', in: '10.2' },
    { uk: 'UK 8', us: 'US 9', eu: 'EU 42.5', cm: '27.0', in: '10.6' },
    { uk: 'UK 9', us: 'US 10', eu: 'EU 44', cm: '28.0', in: '11.0' },
    { uk: 'UK 10', us: 'US 11', eu: 'EU 45', cm: '29.0', in: '11.4' },
    { uk: 'UK 11', us: 'US 12', eu: 'EU 46', cm: '30.0', in: '11.8' },
  ];

  const apparelSizes = [
    { size: 'XS', chestIn: '38"', chestCm: '96.5', lenIn: '27.5"', lenCm: '70.0', shoulderIn: '19.5"', shoulderCm: '49.5' },
    { size: 'S', chestIn: '40"', chestCm: '101.5', lenIn: '28.5"', lenCm: '72.5', shoulderIn: '20.5"', shoulderCm: '52.0' },
    { size: 'M', chestIn: '42"', chestCm: '106.5', lenIn: '29.5"', lenCm: '75.0', shoulderIn: '21.5"', shoulderCm: '54.5' },
    { size: 'L', chestIn: '44"', chestCm: '112.0', lenIn: '30.5"', lenCm: '77.5', shoulderIn: '22.5"', shoulderCm: '57.0' },
    { size: 'XL', chestIn: '46"', chestCm: '117.0', lenIn: '31.5"', lenCm: '80.0', shoulderIn: '23.5"', shoulderCm: '59.5' },
    { size: 'XXL', chestIn: '48"', chestCm: '122.0', lenIn: '32.5"', lenCm: '82.5', shoulderIn: '24.5"', shoulderCm: '62.0' },
  ];

  const bottomsSizes = [
    { size: 'S (30)', waistIn: '30"', waistCm: '76.2', lengthIn: '39"', lengthCm: '99.0', hipIn: '38"', hipCm: '96.5' },
    { size: 'M (32)', waistIn: '32"', waistCm: '81.3', lengthIn: '40"', lengthCm: '101.5', hipIn: '40"', hipCm: '101.5' },
    { size: 'L (34)', waistIn: '34"', waistCm: '86.4', lengthIn: '41"', lengthCm: '104.0', hipIn: '42"', hipCm: '106.5' },
    { size: 'XL (36)', waistIn: '36"', waistCm: '91.4', lengthIn: '42"', lengthCm: '106.5', hipIn: '44"', hipCm: '111.8' },
  ];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative bg-white rounded-3xl p-5 sm:p-7 max-w-lg w-full shadow-2xl border border-zinc-200 z-10 max-h-[90vh] overflow-y-auto flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center flex-shrink-0">
                  <Ruler size={18} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-zinc-900 leading-tight">
                    {isFootwear ? 'Footwear Size Chart' : 'Official Size Chart'}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    {isFootwear ? 'UK / India Standard Footwear' : `${category.toUpperCase()} Measurement Guide`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Unit Switcher */}
            <div className="flex items-center justify-between pt-3 pb-2">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Measurement Units
              </span>
              <div className="flex items-center p-0.5 rounded-lg bg-zinc-100 border border-zinc-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setUnit('in')}
                  className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                    unit === 'in' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  Inches (in)
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('cm')}
                  className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                    unit === 'cm' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  Centimeters (cm)
                </button>
              </div>
            </div>

            {/* Size Table */}
            <div className="mt-2 overflow-x-auto rounded-xl border border-zinc-200">
              {isFootwear ? (
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">UK / India</th>
                      <th className="py-2.5 px-3">US Size</th>
                      <th className="py-2.5 px-3">EU Size</th>
                      <th className="py-2.5 px-3">Foot Length ({unit})</th>
                      {onSelectSize && <th className="py-2.5 px-3 text-right">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-zinc-900 font-medium">
                    {shoeSizes.map((row) => {
                      const isSelected = currentSelectedSize === row.uk;
                      return (
                        <tr
                          key={row.uk}
                          className={`transition-colors ${isSelected ? 'bg-blue-50/70 font-bold' : 'hover:bg-zinc-50/60'}`}
                        >
                          <td className="py-2.5 px-3 font-bold text-zinc-900">{row.uk}</td>
                          <td className="py-2.5 px-3 text-zinc-600">{row.us}</td>
                          <td className="py-2.5 px-3 text-zinc-600">{row.eu}</td>
                          <td className="py-2.5 px-3 text-zinc-700 font-mono">
                            {unit === 'in' ? `${row.in}"` : `${row.cm} cm`}
                          </td>
                          {onSelectSize && (
                            <td className="py-2.5 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectSize(row.uk);
                                  onClose();
                                }}
                                className={`text-[11px] font-bold px-2 py-1 rounded-md transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
                                }`}
                              >
                                {isSelected ? 'Selected' : 'Select'}
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : isBottoms ? (
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Size</th>
                      <th className="py-2.5 px-3">Waist ({unit})</th>
                      <th className="py-2.5 px-3">Length ({unit})</th>
                      <th className="py-2.5 px-3">Hip ({unit})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-zinc-900 font-medium">
                    {bottomsSizes.map((row) => (
                      <tr key={row.size} className="hover:bg-zinc-50/60 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-zinc-900">{row.size}</td>
                        <td className="py-2.5 px-3 text-zinc-600 font-mono">
                          {unit === 'in' ? row.waistIn : `${row.waistCm} cm`}
                        </td>
                        <td className="py-2.5 px-3 text-zinc-600 font-mono">
                          {unit === 'in' ? row.lengthIn : `${row.lengthCm} cm`}
                        </td>
                        <td className="py-2.5 px-3 text-zinc-600 font-mono">
                          {unit === 'in' ? row.hipIn : `${row.hipCm} cm`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Size</th>
                      <th className="py-2.5 px-3">Chest ({unit})</th>
                      <th className="py-2.5 px-3">Length ({unit})</th>
                      <th className="py-2.5 px-3">Shoulder ({unit})</th>
                      {onSelectSize && <th className="py-2.5 px-3 text-right">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-zinc-900 font-medium">
                    {apparelSizes.map((row) => {
                      const isSelected = currentSelectedSize === row.size;
                      return (
                        <tr
                          key={row.size}
                          className={`transition-colors ${isSelected ? 'bg-blue-50/70 font-bold' : 'hover:bg-zinc-50/60'}`}
                        >
                          <td className="py-2.5 px-3 font-bold text-zinc-900">{row.size}</td>
                          <td className="py-2.5 px-3 text-zinc-600 font-mono">
                            {unit === 'in' ? row.chestIn : `${row.chestCm} cm`}
                          </td>
                          <td className="py-2.5 px-3 text-zinc-600 font-mono">
                            {unit === 'in' ? row.lenIn : `${row.lenCm} cm`}
                          </td>
                          <td className="py-2.5 px-3 text-zinc-600 font-mono">
                            {unit === 'in' ? row.shoulderIn : `${row.shoulderCm} cm`}
                          </td>
                          {onSelectSize && (
                            <td className="py-2.5 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectSize(row.size);
                                  onClose();
                                }}
                                className={`text-[11px] font-bold px-2 py-1 rounded-md transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
                                }`}
                              >
                                {isSelected ? 'Selected' : 'Select'}
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Measurement Tips */}
            <div className="mt-4 p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-[11.5px] text-zinc-600 space-y-1">
              <p className="font-bold text-zinc-900">
                {isFootwear ? 'How to measure your feet:' : 'How to measure:'}
              </p>
              {isFootwear ? (
                <>
                  <p>• Place your heel against a flat wall on a sheet of paper.</p>
                  <p>• Mark the longest point of your toe and measure the distance in cm.</p>
                </>
              ) : (
                <>
                  <p>• <strong>Chest:</strong> Measure across the fullest part under arms, keeping tape level.</p>
                  <p>• <strong>Length:</strong> Measure from highest shoulder point straight to bottom hem.</p>
                </>
              )}
            </div>

            {/* Close CTA */}
            <button
              type="button"
              onClick={onClose}
              className="w-full mt-4 h-11 rounded-full theme-flow-btn text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm"
            >
              Got it
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
