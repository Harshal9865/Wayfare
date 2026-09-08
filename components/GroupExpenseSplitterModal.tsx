"use client";

import React, { useState } from "react";
import { formatINR } from "@/lib/utils";
import { useCurrency } from "@/lib/currency";

interface GroupExpenseSplitterModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripTitle: string;
}

interface ExpenseEntry {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
}

export default function GroupExpenseSplitterModal({
  isOpen,
  onClose,
  tripTitle,
}: GroupExpenseSplitterModalProps) {
  const { formatPrice } = useCurrency();
  const [copiedUpi, setCopiedUpi] = useState<string | null>(null);
  const [members, setMembers] = useState<string[]>(["Harshal", "Priya", "Arjun"]);
  const [newMemberName, setNewMemberName] = useState("");
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([
    { id: "e1", description: "BrijRama Bajra Boat Charter", amount: 3500, paidBy: "Harshal" },
    { id: "e2", description: "Assi Ghat Evening Sweets & Lassi", amount: 1200, paidBy: "Priya" },
    { id: "e3", description: "Corridor E-Rickshaw & Autos", amount: 800, paidBy: "Arjun" },
  ]);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [paidBy, setPaidBy] = useState("Harshal");

  if (!isOpen) return null;

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemberName.trim() && !members.includes(newMemberName.trim())) {
      setMembers([...members, newMemberName.trim()]);
      setNewMemberName("");
    }
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim() || !amount || Number(amount) <= 0) return;

    setExpenses([
      ...expenses,
      {
        id: `exp-${Date.now()}`,
        description: desc.trim(),
        amount: Number(amount),
        paidBy,
      },
    ]);
    setDesc("");
    setAmount("");
  };

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const fairSharePerPerson = members.length > 0 ? Math.round(totalExpense / members.length) : 0;

  // Calculate balance per member
  const paidAmounts: Record<string, number> = {};
  members.forEach((m) => (paidAmounts[m] = 0));
  expenses.forEach((e) => {
    paidAmounts[e.paidBy] = (paidAmounts[e.paidBy] || 0) + e.amount;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-surface dark:bg-[#1A1A1A] border-2 border-on-surface dark:border-[rgba(250,247,242,0.35)] rounded-[36px] p-6 md:p-8 scrollbar-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-surface-container dark:border-[#2A2A2A]">
          <div>
            <span className="font-sans text-[10px] uppercase tracking-widest text-secondary dark:text-[#1E8C80] font-semibold block mb-1">
              Group Travel Ledger • Fair-Share Protocol
            </span>
            <h3 className="font-serif text-2xl md:text-3xl text-on-surface dark:text-[#FAF7F2] font-normal">
              Expense Splitter
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-surface-container-lowest dark:bg-[#201F1F] flex items-center justify-center text-on-surface dark:text-[#FAF7F2] hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Group Members Pill Bar */}
        <div className="mb-6">
          <label className="font-sans text-xs uppercase tracking-widest text-outline dark:text-[rgba(250,247,242,0.5)] font-semibold block mb-2">
            Voyagers in Group ({members.length})
          </label>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {members.map((m) => (
              <span
                key={m}
                className="px-3 py-1 rounded-full border-2 border-on-surface/30 dark:border-[rgba(250,247,242,0.3)] bg-surface-container-low dark:bg-[#201F1F] text-xs font-sans text-on-surface dark:text-[#FAF7F2] flex items-center gap-1.5"
              >
                <span>👤 {m}</span>
                {members.length > 1 && (
                  <button
                    onClick={() => setMembers(members.filter((x) => x !== m))}
                    className="text-outline hover:text-rose-500 ml-1 text-xs"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>

          <form onSubmit={handleAddMember} className="flex gap-2">
            <input
              type="text"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="Add companion name..."
              className="flex-1 bg-surface-container-lowest dark:bg-[#201F1F] border-2 border-on-surface/20 rounded-full px-4 py-1.5 text-xs text-on-surface dark:text-[#FAF7F2] focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-1.5 rounded-full border-2 border-on-surface dark:border-[#1E8C80] bg-primary-container text-white dark:bg-[#1E8C80] dark:text-[#131313] font-sans text-xs uppercase tracking-wider font-semibold cursor-pointer"
            >
              + Add
            </button>
          </form>
        </div>

        {/* Summary Card */}
        <div className="p-4 rounded-[20px] bg-surface-container-low dark:bg-[#201F1F] border-2 border-on-surface/30 dark:border-[rgba(250,247,242,0.25)] grid grid-cols-2 gap-4 text-center mb-6">
          <div>
            <span className="font-sans text-[10px] uppercase tracking-wider text-outline dark:text-[rgba(250,247,242,0.5)] block">
              Total Outlay
            </span>
            <span className="font-serif text-2xl text-primary dark:text-[#1E8C80] font-normal">
              {formatPrice(totalExpense)}
            </span>
          </div>
          <div className="border-l-2 border-surface-container dark:border-[#2A2A2A]">
            <span className="font-sans text-[10px] uppercase tracking-wider text-outline dark:text-[rgba(250,247,242,0.5)] block">
              Fair Share / Person
            </span>
            <span className="font-serif text-2xl text-on-surface dark:text-[#FAF7F2] font-normal">
              {formatPrice(fairSharePerPerson)}
            </span>
          </div>
        </div>

        {/* Who Owes Whom Matrix */}
        <div className="space-y-2 mb-6 font-sans text-xs">
          <span className="text-[10px] uppercase tracking-widest text-outline dark:text-[rgba(250,247,242,0.5)] font-semibold block mb-1">
            Settlement Breakdown &amp; Instant UPI Payout
          </span>
          {members.map((m) => {
            const paid = paidAmounts[m] || 0;
            const net = paid - fairSharePerPerson;
            const upiLink = `upi://pay?pa=voyager@okaxis&pn=${encodeURIComponent(m)}&am=${Math.abs(net)}&cu=INR`;

            return (
              <div
                key={m}
                className="p-3 rounded-[16px] bg-surface-container-lowest dark:bg-[#201F1F] border-2 border-on-surface/20 flex flex-wrap items-center justify-between gap-2"
              >
                <div>
                  <span className="font-semibold text-on-surface dark:text-[#FAF7F2] block">{m}</span>
                  <span className="text-[11px] text-on-surface-variant dark:text-[rgba(250,247,242,0.6)]">
                    Paid: {formatPrice(paid)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {net > 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      Gets back {formatPrice(net)}
                    </span>
                  ) : net < 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">
                        Owes {formatPrice(Math.abs(net))}
                      </span>
                      <a
                        href={upiLink}
                        onClick={() => {
                          navigator.clipboard?.writeText(`upi://pay?pa=voyager@okaxis&pn=${encodeURIComponent(m)}&am=${Math.abs(net)}&cu=INR`);
                          setCopiedUpi(m);
                          setTimeout(() => setCopiedUpi(null), 2500);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-container dark:bg-[#1E8C80] text-white dark:text-[#131313] text-[10px] font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                        title="Instant UPI Payment (GPay, PhonePe, Paytm)"
                      >
                        <span className="material-symbols-outlined text-[12px]">payments</span>
                        <span>{copiedUpi === m ? "UPI Copied!" : "Settle UPI"}</span>
                      </a>
                    </div>
                  ) : (
                    <span className="text-outline">Settled evenly</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add New Expense Form */}
        <form onSubmit={handleAddExpense} className="space-y-3 font-sans text-xs pt-4 border-t-2 border-surface-container dark:border-[#2A2A2A]">
          <span className="font-semibold text-on-surface dark:text-[#FAF7F2] block uppercase tracking-wider">
            Record New Group Expense
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="e.g. Soba Tasting Dinner"
              required
              className="sm:col-span-2 bg-surface-container-lowest dark:bg-[#201F1F] border-2 border-on-surface/20 rounded-full px-4 py-2 text-xs text-on-surface dark:text-[#FAF7F2] focus:outline-none"
            />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Amount (₹)"
              required
              className="bg-surface-container-lowest dark:bg-[#201F1F] border-2 border-on-surface/20 rounded-full px-4 py-2 text-xs text-on-surface dark:text-[#FAF7F2] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-outline">Paid by:</span>
              <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="bg-surface-container-lowest dark:bg-[#201F1F] border-2 border-on-surface/20 rounded-full px-3 py-1.5 text-xs text-on-surface dark:text-[#FAF7F2] focus:outline-none cursor-pointer"
              >
                {members.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-primary-container dark:bg-[#1E8C80] text-white dark:text-[#131313] border-2 border-on-surface dark:border-[#1E8C80] font-sans text-xs uppercase tracking-wider font-semibold hover:bg-primary transition-colors cursor-pointer"
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
