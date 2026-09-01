import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  X,
  FileCheck,
  Check
} from 'lucide-react';
import type { ApprovalItem } from '../../services/dataService';
import { DataService } from '../../services/dataService';

interface ApprovalCenterModalProps {
  onClose: () => void;
  activeAccount: { id: string; name: string; role: 'Super Admin' | 'Reviewer VIP' | 'Anggota' };
  onApprovalsChanged: () => void;
}

export const ApprovalCenterModal: React.FC<ApprovalCenterModalProps> = ({
  onClose,
  activeAccount,
  onApprovalsChanged,
}) => {
  const [items, setItems] = useState<ApprovalItem[]>(() => DataService.getApprovalItems());
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Form for testing new draft item submission
  const [isAddingDraft, setIsAddingDraft] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftCategory, setDraftCategory] = useState<'sains' | 'kitab' | 'popculture' | 'draf_ai'>('sains');
  const [draftSummary, setDraftSummary] = useState('');

  const refreshItems = () => {
    setItems(DataService.getApprovalItems());
    onApprovalsChanged();
  };

  const handleApprove = (itemId: string, itemTitle: string) => {
    // Isolated update strictly targeting itemId
    const ok = DataService.updateApprovalStatus(itemId, 'approved', activeAccount.name);
    if (ok) {
      refreshItems();
      setActionSuccessMsg(`Item "${itemTitle}" berhasil diapprove oleh ${activeAccount.name}! (Hanya item ini yang disetujui)`);
      setTimeout(() => setActionSuccessMsg(null), 3500);
    }
  };

  const handleReject = (itemId: string, itemTitle: string) => {
    const reason = prompt('Masukkan alasan penolakan / catatan revisi:') || 'Perlu perbaikan konten';
    const ok = DataService.updateApprovalStatus(itemId, 'rejected', activeAccount.name, reason);
    if (ok) {
      refreshItems();
      setActionSuccessMsg(`Item "${itemTitle}" telah ditolak/minta revisi.`);
      setTimeout(() => setActionSuccessMsg(null), 3500);
    }
  };

  const handleAddTestDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftTitle.trim() || !draftSummary.trim()) return;

    DataService.addApprovalItem({
      category: draftCategory,
      title: draftTitle.trim(),
      summary: draftSummary.trim(),
      submittedBy: activeAccount.name,
    });

    setDraftTitle('');
    setDraftSummary('');
    setIsAddingDraft(false);
    refreshItems();
    setActionSuccessMsg('Draf materi baru berhasil diajukan ke ruang approval!');
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  const filteredItems = items.filter((item) => {
    if (filterStatus === 'all') return true;
    return item.status === filterStatus;
  });

  const pendingCount = items.filter((i) => i.status === 'pending').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  Ruang Approval & Kurasi Akun
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white">
                  {pendingCount} Pending
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Login sebagai: <strong className="text-slate-700 dark:text-slate-200">{activeAccount.name}</strong> ({activeAccount.role})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback alert */}
        {actionSuccessMsg && (
          <div className="mx-4 sm:mx-6 mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in slide-in-from-top-1">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* Filter Bar & Action */}
        <div className="px-4 sm:px-6 pt-4 pb-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                  filterStatus === st
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                }`}
              >
                {st === 'all' ? 'Semua' : st}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAddingDraft(!isAddingDraft)}
            className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAddingDraft ? 'Tutup Form' : 'Tambah Draf Uji'}</span>
          </button>
        </div>

        {/* New Draft Form */}
        {isAddingDraft && (
          <form onSubmit={handleAddTestDraft} className="mx-4 sm:mx-6 p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-3 mb-2 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
                Formulir Pengajuan Materi Baru
              </span>
              <span className="text-[10px] text-slate-400">Pengaju: {activeAccount.name}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Judul temuan / riset / draf bab..."
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              <div>
                <select
                  value={draftCategory}
                  onChange={(e: any) => setDraftCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="sains">Sains Epigenetika</option>
                  <option value="kitab">Kitab Kearifan</option>
                  <option value="popculture">Pop Culture</option>
                  <option value="draf_ai">Draf Buku AI</option>
                </select>
              </div>
            </div>

            <textarea
              rows={2}
              placeholder="Rangkuman atau isi temuan materi..."
              value={draftSummary}
              onChange={(e) => setDraftSummary(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              required
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingDraft(false)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Kirim untuk Diapprove
              </button>
            </div>
          </form>
        )}

        {/* List of Approval Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 scrollbar-thin">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <FileCheck className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
              <p className="text-xs">Tidak ada item approval dengan status ini.</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/60 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 uppercase">
                        {item.category}
                      </span>

                      {/* Status Badge */}
                      {item.status === 'pending' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Menunggu Approval
                        </span>
                      )}
                      {item.status === 'approved' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Disetujui
                        </span>
                      )}
                      {item.status === 'rejected' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Ditolak / Revisi
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {item.title}
                    </h4>
                  </div>

                  {/* Individual Action Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleApprove(item.id, item.title)}
                          title="Setujui Item Ini Saja"
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleReject(item.id, item.title)}
                          title="Tolak / Minta Revisi"
                          className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-500/20 cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleApprove(item.id, item.title)}
                        title="Perbarui Status Approval"
                        className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 underline cursor-pointer"
                      >
                        Ubah Status
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 font-light leading-relaxed">
                  {item.summary}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span>Diajukan oleh: <strong className="text-slate-600 dark:text-slate-300">{item.submittedBy}</strong></span>
                  {item.approvedBy && (
                    <span className="text-emerald-600 dark:text-emerald-400">
                      Disetujui oleh: <strong>{item.approvedBy}</strong>
                    </span>
                  )}
                  {item.rejectionReason && (
                    <span className="text-rose-500">
                      Catatan: {item.rejectionReason}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Sistem terisolasi per-ID: Approval tidak akan menular ke item lain.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-300 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
