"use client";

import React, { useState } from "react";
import {
  Search,
  Download,
  RefreshCw,
  Inbox,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { LeadDetailModal, FullLead } from "./LeadDetailModal";

export interface LeadListItem {
  id: string;
  leadNumber: string;
  enquiryType: string;
  fullName: string;
  businessEmail: string;
  companyName: string;
  jobTitle: string;
  country: string;
  industry: string;
  areaOfInterest?: string | null;
  partnershipType?: string | null;
  status: string;
  priority: string;
  createdAt: string;
  _count: {
    notes: number;
    activities: number;
  };
}

export interface StatsData {
  total: number;
  new: number;
  demo: number;
  partner: number;
  urgent: number;
}

interface AdminDashboardProps {
  initialLeads: LeadListItem[];
  initialStats: StatsData;
  initialTotal: number;
  initialTotalPages: number;
}

export function AdminDashboard({
  initialLeads,
  initialStats,
  initialTotal,
  initialTotalPages,
}: AdminDashboardProps) {
  const [leads, setLeads] = useState<LeadListItem[]>(initialLeads);
  const [stats, setStats] = useState<StatsData>(initialStats);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(initialTotalPages);
  const [totalLeads, setTotalLeads] = useState<number>(initialTotal);

  // Filters
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");

  // Selected Lead for Modal
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [selectedLeadFull, setSelectedLeadFull] = useState<FullLead | null>(null);

  const queryLeads = async (
    newSearch = search,
    newStatus = statusFilter,
    newType = typeFilter,
    newPriority = priorityFilter,
    newPage = page
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (newSearch) params.set("search", newSearch);
      if (newStatus !== "ALL") params.set("status", newStatus);
      if (newType !== "ALL") params.set("type", newType);
      if (newPriority !== "ALL") params.set("priority", newPriority);
      params.set("page", newPage.toString());
      params.set("limit", "15");

      const res = await fetch(`/api/admin/leads?${params.toString()}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setLeads(data.leads);
        setStats(data.stats);
        setTotalPages(data.pagination.totalPages || 1);
        setTotalLeads(data.pagination.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch leads", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
    queryLeads(value, statusFilter, typeFilter, priorityFilter, 1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
    queryLeads(search, value, typeFilter, priorityFilter, 1);
  };

  const handleTypeChange = (value: string) => {
    setTypeFilter(value);
    setPage(1);
    queryLeads(search, statusFilter, value, priorityFilter, 1);
  };

  const handlePriorityChange = (value: string) => {
    setPriorityFilter(value);
    setPage(1);
    queryLeads(search, statusFilter, typeFilter, value, 1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    queryLeads(search, statusFilter, typeFilter, priorityFilter, newPage);
  };

  const openLeadDetail = async (id: string) => {
    setSelectedLeadId(id);
    try {
      const res = await fetch(`/api/admin/leads/${id}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setSelectedLeadFull(data.lead);
      }
    } catch (err) {
      console.error("Error loading lead detail", err);
    }
  };

  const handleLeadUpdated = (updatedLead: FullLead) => {
    setSelectedLeadFull(updatedLead);
    setLeads((prev) =>
      prev.map((l) =>
        l.id === updatedLead.id
          ? {
              ...l,
              status: updatedLead.status,
              priority: updatedLead.priority,
            }
          : l
      )
    );
    queryLeads();
  };

  const getCsvExportUrl = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter !== "ALL") params.set("status", statusFilter);
    if (typeFilter !== "ALL") params.set("type", typeFilter);
    if (priorityFilter !== "ALL") params.set("priority", priorityFilter);
    return `/api/admin/leads/export?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Overview & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight">
            Enterprise Inbound Pipeline
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Real-time lead capture, technical qualification, and commercial engagement logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => queryLeads()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-bg-surface border border-border-dark text-xs text-text-muted hover:text-white transition-colors cursor-pointer"
            title="Refresh lead data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <a
            href={getCsvExportUrl()}
            download
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-primary text-bg-deep text-xs font-semibold hover:bg-mint-accent transition-colors shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-bg-surface border border-border-dark flex flex-col justify-between">
          <span className="text-[11px] font-mono text-text-muted uppercase">Total Enquiries</span>
          <div className="mt-2 text-2xl font-bold font-mono text-white">{stats.total}</div>
        </div>

        <div className="p-4 rounded-2xl bg-bg-surface border border-border-dark flex flex-col justify-between">
          <span className="text-[11px] font-mono text-mint-accent uppercase">New Unread</span>
          <div className="mt-2 text-2xl font-bold font-mono text-mint-accent">{stats.new}</div>
        </div>

        <div className="p-4 rounded-2xl bg-bg-surface border border-border-dark flex flex-col justify-between">
          <span className="text-[11px] font-mono text-text-muted uppercase">Demo Requests</span>
          <div className="mt-2 text-2xl font-bold font-mono text-white">{stats.demo}</div>
        </div>

        <div className="p-4 rounded-2xl bg-bg-surface border border-border-dark flex flex-col justify-between">
          <span className="text-[11px] font-mono text-text-muted uppercase">Partner Enquiries</span>
          <div className="mt-2 text-2xl font-bold font-mono text-white">{stats.partner}</div>
        </div>

        <div className="p-4 rounded-2xl bg-bg-surface border border-border-dark flex flex-col justify-between">
          <span className="text-[11px] font-mono text-red-400 uppercase">High / Urgent</span>
          <div className="mt-2 text-2xl font-bold font-mono text-red-400">{stats.urgent}</div>
        </div>
      </div>

      {/* 2. Filters & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-bg-surface border border-border-dark flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by company, name, email or PF ref..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-bg-deep border border-border-dark text-xs text-white placeholder-text-muted focus:outline-none focus:border-green-primary"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-3 py-2 rounded-xl bg-bg-deep border border-border-dark text-xs text-white focus:outline-none focus:border-green-primary cursor-pointer"
          >
            <option value="ALL">Status: All</option>
            <option value="NEW">NEW</option>
            <option value="CONTACTED">CONTACTED</option>
            <option value="QUALIFIED">QUALIFIED</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="CLOSED">CLOSED</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>

          {/* Type */}
          <select
            value={typeFilter}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="px-3 py-2 rounded-xl bg-bg-deep border border-border-dark text-xs text-white focus:outline-none focus:border-green-primary cursor-pointer"
          >
            <option value="ALL">Type: All</option>
            <option value="DEMO">Demo Requests</option>
            <option value="PARTNER">Partner Enquiries</option>
          </select>

          {/* Priority */}
          <select
            value={priorityFilter}
            onChange={(e) => handlePriorityChange(e.target.value)}
            className="px-3 py-2 rounded-xl bg-bg-deep border border-border-dark text-xs text-white focus:outline-none focus:border-green-primary cursor-pointer"
          >
            <option value="ALL">Priority: All</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="NORMAL">Normal</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* 3. Leads Table */}
      <div className="rounded-2xl bg-bg-surface border border-border-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-bg-deep/60 border-b border-border-dark text-[11px] font-mono text-text-muted uppercase">
                <th className="py-3 px-4">Ref #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Contact & Company</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Area / Scope</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark/50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-text-muted">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-green-primary" />
                    <span>Loading pipeline records...</span>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-text-muted">
                    <Inbox className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <span>No lead submissions match your current filters.</span>
                  </td>
                </tr>
              ) : (
                leads.map((l) => (
                  <tr
                    key={l.id}
                    className="hover:bg-bg-deep/30 transition-colors group cursor-pointer"
                    onClick={() => openLeadDetail(l.id)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-mint-accent">
                      {l.leadNumber}
                    </td>
                    <td className="py-3.5 px-4 text-text-muted whitespace-nowrap">
                      {new Date(l.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white group-hover:text-mint-accent transition-colors">
                        {l.fullName}
                      </div>
                      <div className="text-[11px] text-text-muted">
                        {l.companyName} · {l.country}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-bg-deep border border-border-dark text-white">
                        {l.enquiryType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-[180px] truncate text-text-muted">
                      {l.areaOfInterest || l.partnershipType || l.industry}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          l.status === "NEW"
                            ? "bg-green-primary/10 border-green-primary/40 text-mint-accent"
                            : l.status === "CONTACTED"
                            ? "bg-blue-500/10 border-blue-500/40 text-blue-300"
                            : l.status === "QUALIFIED"
                            ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                            : l.status === "CLOSED"
                            ? "bg-gray-500/10 border-gray-500/40 text-gray-400"
                            : "bg-bg-deep border-border-dark text-text-muted"
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          l.priority === "URGENT"
                            ? "text-red-400 bg-red-950/40 border border-red-500/40"
                            : l.priority === "HIGH"
                            ? "text-orange-400 bg-orange-950/40 border border-orange-500/40"
                            : "text-text-muted"
                        }`}
                      >
                        {l.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openLeadDetail(l.id);
                        }}
                        className="p-1.5 rounded-lg bg-bg-deep border border-border-dark text-text-muted hover:text-white hover:border-green-primary transition-colors cursor-pointer"
                        title="Review complete details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="px-4 py-3 bg-bg-deep/40 border-t border-border-dark flex items-center justify-between text-xs text-text-muted">
            <span>
              Showing {leads.length} of {totalLeads} records (Page {page} of {totalPages})
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                className="p-1.5 rounded-lg bg-bg-deep border border-border-dark disabled:opacity-40 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                className="p-1.5 rounded-lg bg-bg-deep border border-border-dark disabled:opacity-40 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      {selectedLeadId && (
        <LeadDetailModal
          lead={selectedLeadFull}
          onClose={() => {
            setSelectedLeadId(null);
            setSelectedLeadFull(null);
          }}
          onLeadUpdated={handleLeadUpdated}
        />
      )}
    </div>
  );
}
