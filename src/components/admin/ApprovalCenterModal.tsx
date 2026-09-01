import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  X,
  FileCheck,
  Check,
  Users,
  UserPlus,
  Phone,
  Mail,
  Send,
  Trash2,
  MessageSquareShare,
  Crown
} from 'lucide-react';
import type { ApprovalItem, MemberProfile } from '../../services/dataService';
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
  // Main Section Tab: 'members' vs 'content'
  const [activeSection, setActiveSection] = useState<'members' | 'content'>('members');

  // Member Management State
  const [members, setMembers] = useState<MemberProfile[]>(() => DataService.getMembers());
  const [memberFilter, setMemberFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');

  // Content Approval State
  const [items, setItems] = useState<ApprovalItem[]>(() => DataService.getApprovalItems());
  const [contentFilter, setContentFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isAddingDraft, setIsAddingDraft] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftCategory, setDraftCategory] = useState<'sains' | 'kitab' | 'popculture' | 'draf_ai'>('sains');
  const [draftSummary, setDraftSummary] = useState('');

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const refreshAll = () => {
    setMembers(DataService.getMembers());
    setItems(DataService.getApprovalItems());
    onApprovalsChanged();
  };

  // --- MEMBER APPROVAL HANDLERS (STRICTLY ISOLATED PER-MEMBER) ---
  const handleUpdateMemberStatus = (memberId: string, memberName: string, newStatus: 'pending' | 'approved') => {
    const ok = DataService.updateMemberStatus(memberId, newStatus, activeAccount.name);
    if (ok) {
      refreshAll();
      setFeedbackMsg(
        newStatus === 'approved'
          ? `✅ Akun "${memberName}" berhasil disetujui oleh ${activeAccount.name}! (Hanya akun ini yang disetujui)`
          : `⚠️ Akses akun "${memberName}" ditangguhkan.`
      );
      setTimeout(() => setFeedbackMsg(null), 3500);
    }
  };

  const handleDeleteMember = (memberId: string, memberName: string) => {
    if (confirm(`Yakin ingin menghapus akun "${memberName}" dari daftar anggota?`)) {
      DataService.deleteMember(memberId);
      refreshAll();
      setFeedbackMsg(`Akun "${memberName}" berhasil dihapus.`);
      setTimeout(() => setFeedbackMsg(null), 3000);
    }
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    let formattedPhone = newMemberPhone ? newMemberPhone.replace(/[^0-9]/g, '') : '';
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '62' + formattedPhone.slice(1);
    }

    DataService.addMember({
      full_name: newMemberName.trim(),
      email: newMemberEmail.trim().toLowerCase() || undefined,
      phone_number: formattedPhone || undefined,
      role: 'member',
      status: 'approved', // Ditambahkan manual oleh admin otomatis approved
      approved_by: activeAccount.name,
      approved_at: new Date().toISOString(),
    });

    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberPhone('');
    setIsAddingMember(false);
    refreshAll();
    setFeedbackMsg('Anggota baru berhasil ditambahkan dan langsung aktif!');
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleSendWA = (member: MemberProfile) => {
    if (!member.phone_number) {
      alert('Anggota ini belum memasukkan nomor WhatsApp.');
      return;
    }
    const participantName = member.full_name || 'Sahabat NPT';
    const appUrl = window.location.origin;
    const message = `Halo Kak ${participantName}! 👋\n\nAkun Anda di Portal NPT Centre sudah aktif dan disetujui oleh Admin. Silakan buka tautan berikut untuk mengakses rekaman live, draf buku AI, dan 14 akar spiritual:\n👉 ${appUrl}\n\nSelamat berproses bersama NPT! 🔥`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${member.phone_number}?text=${encoded}`, '_blank');
  };

  const handleBroadcastWA = () => {
    const validMembers = members.filter((m) => m.phone_number);
    if (validMembers.length === 0) return alert('Belum ada kontak dengan nomor WA terdaftar!');
    const msg = `Halo Sahabat NPT! Update materi terbaru dan draf kajian sudah dapat diakses di portal NPT Centre: ${window.location.origin}`;
    navigator.clipboard.writeText(msg);
    alert(`Teks broadcast telah disalin ke clipboard untuk ${validMembers.length} nomor terdaftar!`);
  };

  // --- CONTENT APPROVAL HANDLERS (STRICTLY ISOLATED PER-ITEM) ---
  const handleApproveContent = (itemId: string, itemTitle: string) => {
    const ok = DataService.updateApprovalStatus(itemId, 'approved', activeAccount.name);
    if (ok) {
      refreshAll();
      setFeedbackMsg(`Materi "${itemTitle}" berhasil diapprove oleh ${activeAccount.name}! (Hanya item ini yang disetujui)`);
      setTimeout(() => setFeedbackMsg(null), 3500);
    }
  };

  const handleRejectContent = (itemId: string, itemTitle: string) => {
    const reason = prompt('Masukkan alasan penolakan / catatan revisi:') || 'Perlu perbaikan konten';
    const ok = DataService.updateApprovalStatus(itemId, 'rejected', activeAccount.name, reason);
    if (ok) {
      refreshAll();
      setFeedbackMsg(`Materi "${itemTitle}" telah ditolak/minta revisi.`);
      setTimeout(() => setFeedbackMsg(null), 3500);
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
    refreshAll();
    setFeedbackMsg('Draf materi baru berhasil diajukan ke ruang approval!');
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const pendingMembersCount = members.filter((m) => m.status === 'pending').length;
  const pendingContentCount = items.filter((i) => i.status === 'pending').length;

  const filteredMembers = members.filter((m) => {
    if (memberFilter === 'pending') return m.status === 'pending';
    if (memberFilter === 'approved') return m.status === 'approved';
    return true;
  });

  const filteredContent = items.filter((item) => {
    if (contentFilter === 'all') return true;
    return item.status === contentFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  Ruang Persetujuan & Kurasi NPT
                </h3>
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

        {/* Section Navigation Tabs (Member vs Konten) */}
        <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800 flex gap-2">
          <button
            onClick={() => setActiveSection('members')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSection === 'members'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Persetujuan Anggota / Member</span>
            {pendingMembersCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-white text-rose-600">
                {pendingMembersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSection('content')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSection === 'content'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Kurasi Materi & Draf AI</span>
            {pendingContentCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-white text-rose-600">
                {pendingContentCount}
              </span>
            )}
          </button>
        </div>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div className="mx-4 sm:mx-6 mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in slide-in-from-top-1">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* ================= TAB 1: PERSENGGUHAN ANGGOTA / MEMBER ================= */}
        {activeSection === 'members' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Filter Bar & Member Actions */}
            <div className="px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setMemberFilter('all')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg cursor-pointer ${
                    memberFilter === 'all' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Semua ({members.length})
                </button>
                <button
                  onClick={() => setMemberFilter('pending')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer ${
                    memberFilter === 'pending' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-500'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  <span>Pending ({pendingMembersCount})</span>
                </button>
                <button
                  onClick={() => setMemberFilter('approved')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer ${
                    memberFilter === 'approved' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Disetujui ({members.filter((m) => m.status === 'approved').length})</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleBroadcastWA}
                  title="Salin Teks Broadcast WA"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <MessageSquareShare className="w-3.5 h-3.5" />
                  <span>Broadcast WA</span>
                </button>
                <button
                  onClick={() => setIsAddingMember(!isAddingMember)}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{isAddingMember ? 'Tutup' : '+ Anggota Manual'}</span>
                </button>
              </div>
            </div>

            {/* Form Tambah Anggota Manual */}
            {isAddingMember && (
              <form onSubmit={handleAddMember} className="mx-4 sm:mx-6 my-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Tambah Anggota Baru (Langsung Disetujui)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Nama Lengkap *"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email (Opsional)"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  />
                  <input
                    type="text"
                    placeholder="No WA (08xx...)"
                    value={newMemberPhone}
                    onChange={(e) => setNewMemberPhone(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setIsAddingMember(false)} className="px-3 py-1.5 text-xs text-slate-500">
                    Batal
                  </button>
                  <button type="submit" className="px-4 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold">
                    Simpan & Aktifkan
                  </button>
                </div>
              </form>
            )}

            {/* List Anggota */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 scrollbar-thin">
              {filteredMembers.length === 0 ? (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <Users className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
                  <p className="text-xs">Tidak ada anggota pada kategori filter ini.</p>
                </div>
              ) : (
                filteredMembers.map((member) => {
                  const isApproved = member.status === 'approved';
                  return (
                    <div
                      key={member.id}
                      className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                            {member.full_name}
                          </span>
                          {member.role === 'super_admin' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1">
                              <Crown className="w-3 h-3" /> Super Admin
                            </span>
                          ) : isApproved ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Disetujui
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1 animate-pulse">
                              <Clock className="w-3 h-3" /> Menunggu Approval
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                          {member.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5" />
                              {member.email}
                            </span>
                          )}
                          {member.phone_number && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5" />
                              +{member.phone_number}
                            </span>
                          )}
                          <span className="text-[10px]">
                            Daftar: {new Date(member.created_at).toLocaleDateString('id-ID')}
                          </span>
                          {member.approved_by && (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                              Disetujui: {member.approved_by}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons (Strictly isolated by member.id) */}
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        {!isApproved ? (
                          <button
                            onClick={() => handleUpdateMemberStatus(member.id, member.full_name, 'approved')}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                            title="Setujui Akun Ini"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Setujui (Approve)</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateMemberStatus(member.id, member.full_name, 'pending')}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-xs font-medium cursor-pointer"
                            title="Tangguhkan Akses"
                          >
                            Tangguhkan
                          </button>
                        )}

                        {member.phone_number && (
                          <button
                            onClick={() => handleSendWA(member)}
                            className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 cursor-pointer"
                            title="Kirim Pesan WA Aktivasi"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteMember(member.id, member.full_name)}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 cursor-pointer"
                          title="Hapus Anggota"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: KURASI MATERI & DRAF AI ================= */}
        {activeSection === 'content' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Filter Bar & Action */}
            <div className="px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setContentFilter(st)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                      contentFilter === st
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
              <form onSubmit={handleAddTestDraft} className="mx-4 sm:mx-6 my-3 p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-3 animate-in fade-in">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
                  Formulir Pengajuan Materi Baru
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Judul temuan / riset / draf bab..."
                      value={draftTitle}
                      onChange={(e) => setDraftTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      required
                    />
                  </div>
                  <div>
                    <select
                      value={draftCategory}
                      onChange={(e: any) => setDraftCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
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
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  required
                />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setIsAddingDraft(false)} className="px-3 py-1.5 text-xs text-slate-500">
                    Batal
                  </button>
                  <button type="submit" className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold">
                    Kirim untuk Diapprove
                  </button>
                </div>
              </form>
            )}

            {/* List Materi */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 scrollbar-thin">
              {filteredContent.length === 0 ? (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <FileCheck className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
                  <p className="text-xs">Tidak ada item materi pada kategori ini.</p>
                </div>
              ) : (
                filteredContent.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/60 shadow-xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 uppercase">
                            {item.category}
                          </span>
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
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                          {item.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleApproveContent(item.id, item.title)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer"
                              title="Setujui Materi Ini"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleRejectContent(item.id, item.title)}
                              className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-500/20 cursor-pointer"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleApproveContent(item.id, item.title)}
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
                          Disetujui: <strong>{item.approvedBy}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Sistem terisolasi per-ID: Approval akun/materi dijamin tidak akan menular ke akun lain.
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
