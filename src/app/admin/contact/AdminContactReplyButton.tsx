"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Reply, X, Send } from "lucide-react";

interface Props {
  messageId: string;
  senderName: string;
  senderEmail: string;
  originalMessage: string;
}

export default function AdminContactReplyButton({
  messageId, senderName, senderEmail, originalMessage,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!replyText.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/contact/${messageId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyText }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Gönderilemedi"); return; }
      setSent(true);
      router.refresh();
      setTimeout(() => { setOpen(false); setSent(false); setReplyText(""); }, 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
      >
        <Reply className="h-3 w-3" />
        Yanıtla
      </button>

      {/* Modal */}
      {open && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Yanıt Gönder</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    → <strong>{senderName}</strong> ({senderEmail})
                  </p>
                </div>
                <button onClick={() => setOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Original message */}
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-100">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Orijinal Mesaj</p>
                <p className="text-[12px] text-slate-600 whitespace-pre-wrap line-clamp-3">{originalMessage}</p>
              </div>

              {/* Reply textarea */}
              <div className="px-6 py-4">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                  Yanıtınız
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={5}
                  placeholder="Yanıtınızı buraya yazın..."
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 resize-none"
                  autoFocus
                />
                {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button onClick={() => setOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                  İptal
                </button>
                <button
                  onClick={handleSend}
                  disabled={loading || !replyText.trim() || sent}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                  {sent ? "Gönderildi ✓" : loading ? "Gönderiliyor…" : "Gönder"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
