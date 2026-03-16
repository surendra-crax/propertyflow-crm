"use client"

import { useState } from "react"
import { ArrowLeft, Printer, Calculator, FileText, Download } from "lucide-react"
import Link from "next/link"
import { use } from "react"

export default function CostSheetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  
  const [formData, setFormData] = useState({
    unitNo: "",
    clientName: "",
    areaSqft: 1200,
    basePricePerSqft: 5000,
    floorRiseCharges: 200,
    plcCharges: 150,
    carParking: 300000,
    clubhouseCharges: 150000,
    gstPercentage: 5,
    stampDutyPercentage: 6
  })

  // Calculations
  const baseCost = formData.areaSqft * formData.basePricePerSqft
  const floorRiseCost = formData.areaSqft * formData.floorRiseCharges
  const plcCost = formData.areaSqft * formData.plcCharges
  
  const agreementValue = baseCost + floorRiseCost + plcCost + formData.carParking + formData.clubhouseCharges
  
  const gstAmount = (agreementValue * formData.gstPercentage) / 100
  const stampDutyAmount = (agreementValue * formData.stampDutyPercentage) / 100
  
  const totalCost = agreementValue + gstAmount + stampDutyAmount

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      
      {/* Non-printable header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <Link href={`/projects/${id}/units`} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Calculator className="w-6 h-6 text-indigo-500" />
              Cost Sheet Generator
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Generate and print price quotation</p>
          </div>
        </div>
        
        <button 
          onClick={handlePrint}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Printer className="w-4 h-4" />
          Print / PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Editor Form - Hidden on Print */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm print:hidden sticky top-6">
          <h2 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <FileText className="w-4 h-4 text-slate-400" />
            Input Parameters
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">Unit No.</label>
                <input type="text" value={formData.unitNo} onChange={e => setFormData({...formData, unitNo: e.target.value})} className="w-full px-3 py-2 text-sm rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/50" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">Client Name</label>
                <input type="text" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} className="w-full px-3 py-2 text-sm rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/50" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">Saleable Area (Sq.Ft)</label>
              <input type="number" value={formData.areaSqft} onChange={e => setFormData({...formData, areaSqft: Number(e.target.value)})} className="w-full px-3 py-2 text-sm rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/50" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">Base Price (psf)</label>
                <input type="number" value={formData.basePricePerSqft} onChange={e => setFormData({...formData, basePricePerSqft: Number(e.target.value)})} className="w-full px-3 py-2 text-sm rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/50" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">Floor Rise (psf)</label>
                <input type="number" value={formData.floorRiseCharges} onChange={e => setFormData({...formData, floorRiseCharges: Number(e.target.value)})} className="w-full px-3 py-2 text-sm rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/50" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">PLC Charges (psf)</label>
              <input type="number" value={formData.plcCharges} onChange={e => setFormData({...formData, plcCharges: Number(e.target.value)})} className="w-full px-3 py-2 text-sm rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/50" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">Car Parking (Lump Sum)</label>
                <input type="number" value={formData.carParking} onChange={e => setFormData({...formData, carParking: Number(e.target.value)})} className="w-full px-3 py-2 text-sm rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/50" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">Clubhouse (Lump Sum)</label>
                <input type="number" value={formData.clubhouseCharges} onChange={e => setFormData({...formData, clubhouseCharges: Number(e.target.value)})} className="w-full px-3 py-2 text-sm rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/50" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">GST (%)</label>
                <input type="number" step="0.1" value={formData.gstPercentage} onChange={e => setFormData({...formData, gstPercentage: Number(e.target.value)})} className="w-full px-3 py-2 text-sm rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/50" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">Stamp Duty (%)</label>
                <input type="number" step="0.1" value={formData.stampDutyPercentage} onChange={e => setFormData({...formData, stampDutyPercentage: Number(e.target.value)})} className="w-full px-3 py-2 text-sm rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/50" />
              </div>
            </div>
          </div>
        </div>

        {/* Print Preview Sheet */}
        <div className="lg:col-span-8 bg-white text-slate-900 border border-slate-200 rounded-xl p-8 shadow-xl print:shadow-none print:border-none print:p-0">
          
          <div className="text-center mb-8 pb-6 border-b-2 border-slate-200">
            <h2 className="text-3xl font-black uppercase tracking-widest text-slate-800 mb-1">Cost Sheet Evaluation</h2>
            <p className="text-slate-500 font-medium tracking-wide">CONFIDENTIAL QUOTATION</p>
          </div>

          <div className="flex justify-between items-start mb-8">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-500 uppercase">Customer Name</p>
              <p className="font-bold text-lg">{formData.clientName || "______________"}</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-sm font-semibold text-slate-500 uppercase">Unit Details</p>
              <p className="font-bold text-lg">{formData.unitNo ? `Unit #${formData.unitNo}` : "______________"}</p>
              <p className="text-sm text-slate-600 font-medium">{formData.areaSqft} Sq.Ft. / Super Built-up</p>
            </div>
          </div>

          <div className="border border-slate-300 rounded-lg overflow-hidden">
            <div className="overflow-x-auto whitespace-nowrap">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 uppercase tracking-wide text-xs">
                  <tr>
                    <th className="py-3 px-4 text-left font-bold">Particulars</th>
                    <th className="py-3 px-4 text-right font-bold w-32">Rate (₹)</th>
                    <th className="py-3 px-4 text-right font-bold w-40">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {/* 1. Base Price */}
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4">Base Canvas Price</td>
                    <td className="py-3 px-4 text-right text-slate-600">{formatCurrency(formData.basePricePerSqft)} psf</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(baseCost)}</td>
                  </tr>
                  {/* 2. Floor Rise */}
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4">Floor Rise Premium (FRC)</td>
                    <td className="py-3 px-4 text-right text-slate-600">{formatCurrency(formData.floorRiseCharges)} psf</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(floorRiseCost)}</td>
                  </tr>
                  {/* 3. PLC */}
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4">Preferential Location (PLC)</td>
                    <td className="py-3 px-4 text-right text-slate-600">{formatCurrency(formData.plcCharges)} psf</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(plcCost)}</td>
                  </tr>
                  {/* 4. Car Parking */}
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4">Covered Car Parking</td>
                    <td className="py-3 px-4 text-right text-slate-600">Lump Sum</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(formData.carParking)}</td>
                  </tr>
                  {/* 5. Clubhouse */}
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4">Clubhouse Membership</td>
                    <td className="py-3 px-4 text-right text-slate-600">Lump Sum</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(formData.clubhouseCharges)}</td>
                  </tr>
                  
                  {/* Subtotal */}
                  <tr className="bg-slate-100 border-y-2 border-slate-300 font-bold text-base">
                    <td className="py-3 px-4 uppercase" colSpan={2}>Total Agreement Stage Value (A)</td>
                    <td className="py-3 px-4 text-right text-indigo-700">{formatCurrency(agreementValue)}</td>
                  </tr>
  
                  {/* Taxes Part */}
                  <tr className="hover:bg-slate-50 border-t-0">
                    <td className="py-3 px-4">Goods & Services Tax (GST)</td>
                    <td className="py-3 px-4 text-right text-slate-600">{formData.gstPercentage}%</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(gstAmount)}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4">Stamp Duty & Registration</td>
                    <td className="py-3 px-4 text-right text-slate-600">{formData.stampDutyPercentage}%</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(stampDutyAmount)}</td>
                  </tr>
  
                  {/* Statutory Total */}
                  <tr className="bg-slate-50 border-y border-slate-300 font-bold">
                    <td className="py-3 px-4 uppercase text-slate-600" colSpan={2}>Statutory Taxes (B)</td>
                    <td className="py-3 px-4 text-right text-slate-700">{formatCurrency(gstAmount + stampDutyAmount)}</td>
                  </tr>
  
                  {/* Grand Total */}
                  <tr className="bg-indigo-600 text-white font-black text-lg print:border-indigo-600">
                    <td className="py-4 px-4 uppercase tracking-wider" colSpan={2}>Grand Total Final Cost (A + B)</td>
                    <td className="py-4 px-4 text-right tracking-wider">{formatCurrency(totalCost)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 text-[11px] text-slate-500 space-y-2 leading-relaxed print:text-xs">
            <p><strong>Terms and Conditions:</strong></p>
            <p>1. This cost sheet is an estimate and valid for 7 days from the date of issuance.</p>
            <p>2. Maintenance charges (CAM, Corpus fund, Advance Maintenance) will be extra as per actuals at the time of possession.</p>
            <p>3. Any changes in statutory duties, Govt. taxes, and levies will be borne by the purchaser.</p>
            <p>4. Legal fees, society formation charges, and electricity/water meter deposits are excluded from this sheet.</p>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-200 flex justify-between items-end">
            <div className="text-center">
              <div className="w-48 border-b border-slate-400 mb-2 content-none h-8"></div>
              <p className="text-sm font-semibold text-slate-700 uppercase">Customer Signature</p>
            </div>
            <div className="text-center">
              <div className="w-48 border-b border-slate-400 mb-2 content-none h-8"></div>
              <p className="text-sm font-semibold text-slate-700 uppercase">Authorized Signatory</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
