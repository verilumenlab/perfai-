"use client";

import React, { useState } from "react";
import {
  X,
  Mail,
  Building,
  Phone,
  Globe,
  Briefcase,
  Calendar,
  Activity,
  Send,
  Loader2,
} from "lucide-react";

export interface LeadNoteItem {
  id: string;
  authorName: string;
  note: string;
  createdAt: string;
}

export interface LeadActivityItem {
  id: string;
  action: string;
  previousValue?: string | null;
  newValue?: string | null;
  note?: string | null;
  createdAt: string;
}

export interface FullLead {
  id: string;
  leadNumber: string;
  enquiryType: string;
  fullName: string;
  businessEmail: string;
  companyName: string;
  jobTitle: string;
  phoneNumber?: string | null;
  country: string;
  industry: string;
  facilityType?: string | null;
  areaOfInterest?: string | null;
  facilitySize?: string | null;
  partnershipType?: string | null;
  message: string;
  sourcePage: string;
  status: string;
  priority: string;
  createdAt: string;
  notes: LeadNoteItem[];
  activities: LeadActivityItem[];
}

interface LeadDetailModalProps {
  lead: FullLead | null;
  onClose: () => void;
  onLeadUpdated: (updatedLead: FullLead) => void;
}

const STATUS_OPTIONS = ["NEW", "CONTACTED", "QUALIFIED", "IN_PROGRESS", "CLOSED", "ARCHIVED"];
const PRIORITY_OPTIONS = ["LOW", "NORMAL", "HIGH", "URGENT"];

function getCsrfToken(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/perfai_csrf_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

export function LeadDetailModal({ lead, onClose, onLeadUpdated }: LeadDetailModalProps) {
  const [status, setStatus] = useState<string>(lead?.status || "NEW");
  const [priority, setPriority] = useState<string>(lead?.priority || "NORMAL");
  const [newNote, setNewNote] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"details" | "notes" | "activity">("details");

  if (!lead) return null;

  const handleUpdate = async (updatedFields: { status?: string; priority?: string; newNote?: string }) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": getCsrfToken(),
        },
        body: JSON.stringify(updatedFields),
      });

      const data = await res.json();
      if (res.ok && data.success && data.lead) {
        onLeadUpdated(data.lead);
        if (updatedFields.status) setStatus(updatedFields.status);
        if (updatedFields.priority) setPriority(updatedFields.priority);
        if (updatedFields.newNote) setNewNote("");
      }
    } catch (err) {
      console.error("Failed to update lead", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    handleUpdate({ status: newStatus });
  };

  const handlePriorityChange = (newPriority: string) => {
    setPriority(newPriority);
    handleUpdate({ priority: newPriority });
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    handleUpdate({ newNote: newNote.trim() });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-bg-surface border border-border-dark rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-border-dark flex items-center justify-between bg-bg-deep/50">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-mint-accent">
              {lead.leadNumber}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-green-primary/10 border border-green-primary/30 text-white font-medium">
              {lead.enquiryType}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-bg-deep transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status & Priority Controls Toolbar */}
        <div className="px-6 py-3.5 bg-bg-surface border-b border-border-dark flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted">Status:</span>
              <select
                id="status_select"
                value={status}
                disabled={isUpdating}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-bg-deep border border-border-dark text-white font-semibold focus:outline-none focus:border-green-primary cursor-pointer"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted">Priority:</span>
              <select
                id="priority_select"
                value={priority}
                disabled={isUpdating}
                onChange={(e) => handlePriorityChange(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-bg-deep border border-border-dark text-white font-semibold focus:outline-none focus:border-green-primary cursor-pointer"
              >
                {PRIORITY_OPTIONS.map((pr) => (
                  <option key={pr} value={pr}>
                    {pr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isUpdating && (
            <div className="flex items-center gap-2 text-xs text-mint-accent">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Updating...</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-border-dark flex gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("details")}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === "details"
                ? "border-green-primary text-mint-accent"
                : "border-transparent text-text-muted hover:text-white"
            }`}
          >
            Overview & Specifications
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "notes"
                ? "border-green-primary text-mint-accent"
                : "border-transparent text-text-muted hover:text-white"
            }`}
          >
            <span>Internal Notes</span>
            <span className="px-1.5 py-0.5 rounded-full bg-bg-deep text-[10px] text-text-muted">
              {lead.notes?.length || 0}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "activity"
                ? "border-green-primary text-mint-accent"
                : "border-transparent text-text-muted hover:text-white"
            }`}
          >
            <span>Audit Activity</span>
            <span className="px-1.5 py-0.5 rounded-full bg-bg-deep text-[10px] text-text-muted">
              {lead.activities?.length || 0}
            </span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === "details" && (
            <div className="space-y-6">
              {/* Primary Contact Info */}
              <div>
                <h4 className="text-xs font-mono uppercase text-mint-accent tracking-wider mb-3">
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-bg-deep p-4 rounded-2xl border border-border-dark">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-green-primary shrink-0" />
                    <div>
                      <span className="text-[11px] text-text-muted block">Full Name & Title</span>
                      <span className="text-sm font-semibold text-white">
                        {lead.fullName} — {lead.jobTitle}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Building className="w-4 h-4 text-green-primary shrink-0" />
                    <div>
                      <span className="text-[11px] text-text-muted block">Company</span>
                      <span className="text-sm font-semibold text-white">{lead.companyName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-green-primary shrink-0" />
                    <div>
                      <span className="text-[11px] text-text-muted block">Email</span>
                      <a
                        href={`mailto:${lead.businessEmail}`}
                        className="text-sm text-mint-accent underline hover:text-white"
                      >
                        {lead.businessEmail}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-green-primary shrink-0" />
                    <div>
                      <span className="text-[11px] text-text-muted block">Phone</span>
                      <span className="text-sm text-white">
                        {lead.phoneNumber || "Not provided"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-green-primary shrink-0" />
                    <div>
                      <span className="text-[11px] text-text-muted block">Country / Region</span>
                      <span className="text-sm text-white">{lead.country}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-green-primary shrink-0" />
                    <div>
                      <span className="text-[11px] text-text-muted block">Submission Date</span>
                      <span className="text-sm text-white">
                        {new Date(lead.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Facility / Infrastructure Scope */}
              <div>
                <h4 className="text-xs font-mono uppercase text-mint-accent tracking-wider mb-3">
                  Infrastructure & Scope
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-bg-deep p-4 rounded-2xl border border-border-dark">
                  <div>
                    <span className="text-[11px] text-text-muted block">Primary Industry</span>
                    <span className="text-sm font-medium text-white">{lead.industry}</span>
                  </div>

                  <div>
                    <span className="text-[11px] text-text-muted block">Area of Interest / Partnership</span>
                    <span className="text-sm font-medium text-white">
                      {lead.areaOfInterest || lead.partnershipType || "Standard Suite"}
                    </span>
                  </div>

                  {lead.facilityType && (
                    <div>
                      <span className="text-[11px] text-text-muted block">Facility Type</span>
                      <span className="text-sm text-white">{lead.facilityType}</span>
                    </div>
                  )}

                  {lead.facilitySize && (
                    <div>
                      <span className="text-[11px] text-text-muted block">Estimated Facility Size</span>
                      <span className="text-sm text-white">{lead.facilitySize}</span>
                    </div>
                  )}

                  <div>
                    <span className="text-[11px] text-text-muted block">Origin Page</span>
                    <span className="text-xs font-mono text-text-muted">{lead.sourcePage}</span>
                  </div>
                </div>
              </div>

              {/* Message Payload */}
              <div>
                <h4 className="text-xs font-mono uppercase text-mint-accent tracking-wider mb-3">
                  Requirement / Message
                </h4>
                <div className="p-4 rounded-2xl bg-bg-deep border border-border-dark text-sm text-white/90 leading-relaxed whitespace-pre-wrap">
                  {lead.message}
                </div>
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="space-y-6">
              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="space-y-3">
                <label htmlFor="new_note_input" className="block text-xs font-medium text-white">
                  Add Internal Note
                </label>
                <textarea
                  id="new_note_input"
                  rows={3}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Record call summary, qualification status, or action items..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-bg-deep border border-border-dark text-white text-xs focus:outline-none focus:border-green-primary resize-y"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isUpdating || !newNote.trim()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-primary text-bg-deep text-xs font-semibold hover:bg-mint-accent disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Save Note</span>
                  </button>
                </div>
              </form>

              {/* Notes List */}
              <div className="space-y-3">
                {lead.notes && lead.notes.length > 0 ? (
                  lead.notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 rounded-xl bg-bg-deep border border-border-dark text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-text-muted text-[11px]">
                        <span className="font-semibold text-white">{note.authorName}</span>
                        <span>{new Date(note.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-white/90 leading-relaxed whitespace-pre-wrap">
                        {note.note}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-text-muted py-4 text-center">
                    No internal notes yet recorded.
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-4">
              <h4 className="text-xs font-mono uppercase text-mint-accent tracking-wider">
                Audit Timeline
              </h4>
              <div className="space-y-3">
                {lead.activities && lead.activities.length > 0 ? (
                  lead.activities.map((act) => (
                    <div
                      key={act.id}
                      className="flex items-start gap-3 p-3 rounded-xl bg-bg-deep border border-border-dark text-xs"
                    >
                      <Activity className="w-4 h-4 text-green-primary shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-[11px] text-text-muted">
                          <span className="font-mono text-white">{act.action}</span>
                          <span>{new Date(act.createdAt).toLocaleString()}</span>
                        </div>
                        {act.note && <p className="mt-1 text-white/90">{act.note}</p>}
                        {act.previousValue && act.newValue && (
                          <p className="mt-1 text-[11px] text-mint-accent font-mono">
                            {act.previousValue} → {act.newValue}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-text-muted py-4 text-center">
                    No activity records found.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-bg-deep/50 border-t border-border-dark flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-bg-deep border border-border-dark text-white text-xs font-semibold hover:border-green-primary transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
