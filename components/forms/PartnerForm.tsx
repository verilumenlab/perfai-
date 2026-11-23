"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  partnerFormSchema,
  PartnerFormData,
  INDUSTRY_OPTIONS,
  PARTNERSHIP_TYPE_OPTIONS,
} from "@/lib/validation";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, RotateCcw } from "lucide-react";

export function PartnerForm() {
  const [formLoadTime, setFormLoadTime] = useState<number>(() => Date.now());
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [leadNumber, setLeadNumber] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PartnerFormData>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      fullName: "",
      businessEmail: "",
      companyName: "",
      jobTitle: "",
      phoneNumber: "",
      country: "",
      industry: "Commercial Buildings",
      partnershipType: "Facility Owner / Enterprise Operator",
      message: "",
      privacyConsent: false as unknown as true,
      hp_website: "",
    },
  });

  const onSubmit = async (data: PartnerFormData) => {
    setSubmitStatus("submitting");
    setErrorMessage(null);

    try {
      const payload = {
        ...data,
        enquiryType: "PARTNER",
        formLoadTime,
        sourcePage: typeof window !== "undefined" ? window.location.pathname : "/partner",
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to submit partnership enquiry.");
      }

      setLeadNumber(result.leadNumber || "PF-2026-CONFIRMED");
      setSubmitStatus("success");
    } catch (err: unknown) {
      setSubmitStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred. Please try again."
      );
    }
  };

  const handleReset = () => {
    reset();
    setSubmitStatus("idle");
    setErrorMessage(null);
    setLeadNumber(null);
    setFormLoadTime(Date.now());
  };

  if (submitStatus === "success") {
    return (
      <div
        className="p-6 sm:p-8 rounded-2xl bg-bg-surface border border-green-primary/30 text-white text-center"
        role="alert"
        aria-live="polite"
      >
        <div className="w-12 h-12 mx-auto rounded-full bg-green-primary/20 flex items-center justify-center text-mint-accent mb-4">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="font-heading font-bold text-xl text-white">
          Partnership Enquiry Registered
        </h3>
        <p className="mt-2 text-sm text-text-muted max-w-md mx-auto">
          Thank you for reaching out to PerfAI. Our commercial partnerships team has received your details.
        </p>
        <div className="mt-4 p-3 rounded-xl bg-bg-deep border border-border-dark inline-block font-mono text-xs text-mint-accent">
          Reference: <span className="font-bold text-white">{leadNumber}</span>
        </div>
        <p className="mt-3 text-xs text-text-muted">
          A partnership coordinator will review your company profile and respond within two business days.
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-bg-deep border border-border-dark text-white hover:border-green-primary transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Submit another enquiry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 text-left"
      noValidate
      aria-label="Partnership enquiry form"
    >
      {/* Hidden Honeypot */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="hp_website_partner">Leave this field blank</label>
        <input
          id="hp_website_partner"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("hp_website")}
        />
      </div>

      {/* Global Error Banner */}
      {submitStatus === "error" && errorMessage && (
        <div
          className="p-4 rounded-xl bg-red-950/40 border border-red-500/50 flex items-start gap-3 text-red-200 text-xs"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Name and Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="p_fullName" className="block text-xs font-medium text-white/90 mb-1.5">
            Full Name <span className="text-mint-accent">*</span>
          </label>
          <input
            id="p_fullName"
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "p_fullName-error" : undefined}
            className="w-full px-3.5 py-2.5 rounded-xl bg-bg-deep border border-border-dark text-white text-sm focus:outline-none focus:border-green-primary focus:ring-1 focus:ring-green-primary transition-colors"
            placeholder="Marcus Vance"
            {...register("fullName")}
          />
          {errors.fullName && (
            <p id="p_fullName-error" className="mt-1 text-[11px] text-red-400">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="p_businessEmail" className="block text-xs font-medium text-white/90 mb-1.5">
            Business Email <span className="text-mint-accent">*</span>
          </label>
          <input
            id="p_businessEmail"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.businessEmail}
            aria-describedby={errors.businessEmail ? "p_businessEmail-error" : undefined}
            className="w-full px-3.5 py-2.5 rounded-xl bg-bg-deep border border-border-dark text-white text-sm focus:outline-none focus:border-green-primary focus:ring-1 focus:ring-green-primary transition-colors"
            placeholder="m.vance@company.com"
            {...register("businessEmail")}
          />
          {errors.businessEmail && (
            <p id="p_businessEmail-error" className="mt-1 text-[11px] text-red-400">
              {errors.businessEmail.message}
            </p>
          )}
        </div>
      </div>

      {/* Company and Job Title */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="p_companyName" className="block text-xs font-medium text-white/90 mb-1.5">
            Company / Organisation <span className="text-mint-accent">*</span>
          </label>
          <input
            id="p_companyName"
            type="text"
            autoComplete="organization"
            aria-invalid={!!errors.companyName}
            aria-describedby={errors.companyName ? "p_companyName-error" : undefined}
            className="w-full px-3.5 py-2.5 rounded-xl bg-bg-deep border border-border-dark text-white text-sm focus:outline-none focus:border-green-primary focus:ring-1 focus:ring-green-primary transition-colors"
            placeholder="Apex Infrastructure Partners"
            {...register("companyName")}
          />
          {errors.companyName && (
            <p id="p_companyName-error" className="mt-1 text-[11px] text-red-400">
              {errors.companyName.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="p_jobTitle" className="block text-xs font-medium text-white/90 mb-1.5">
            Job Title / Role <span className="text-mint-accent">*</span>
          </label>
          <input
            id="p_jobTitle"
            type="text"
            autoComplete="organization-title"
            aria-invalid={!!errors.jobTitle}
            aria-describedby={errors.jobTitle ? "p_jobTitle-error" : undefined}
            className="w-full px-3.5 py-2.5 rounded-xl bg-bg-deep border border-border-dark text-white text-sm focus:outline-none focus:border-green-primary focus:ring-1 focus:ring-green-primary transition-colors"
            placeholder="Managing Director / Partnership Lead"
            {...register("jobTitle")}
          />
          {errors.jobTitle && (
            <p id="p_jobTitle-error" className="mt-1 text-[11px] text-red-400">
              {errors.jobTitle.message}
            </p>
          )}
        </div>
      </div>

      {/* Country and Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="p_country" className="block text-xs font-medium text-white/90 mb-1.5">
            Country / Region <span className="text-mint-accent">*</span>
          </label>
          <input
            id="p_country"
            type="text"
            autoComplete="country-name"
            aria-invalid={!!errors.country}
            aria-describedby={errors.country ? "p_country-error" : undefined}
            className="w-full px-3.5 py-2.5 rounded-xl bg-bg-deep border border-border-dark text-white text-sm focus:outline-none focus:border-green-primary focus:ring-1 focus:ring-green-primary transition-colors"
            placeholder="India / United Arab Emirates / Germany"
            {...register("country")}
          />
          {errors.country && (
            <p id="p_country-error" className="mt-1 text-[11px] text-red-400">
              {errors.country.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="p_phoneNumber" className="block text-xs font-medium text-white/90 mb-1.5">
            Phone Number <span className="text-text-muted text-[10px]">(optional)</span>
          </label>
          <input
            id="p_phoneNumber"
            type="tel"
            autoComplete="tel"
            aria-invalid={!!errors.phoneNumber}
            aria-describedby={errors.phoneNumber ? "p_phoneNumber-error" : undefined}
            className="w-full px-3.5 py-2.5 rounded-xl bg-bg-deep border border-border-dark text-white text-sm focus:outline-none focus:border-green-primary focus:ring-1 focus:ring-green-primary transition-colors"
            placeholder="+44 20 7946 0912"
            {...register("phoneNumber")}
          />
          {errors.phoneNumber && (
            <p id="p_phoneNumber-error" className="mt-1 text-[11px] text-red-400">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>
      </div>

      {/* Industry and Partnership Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="p_industry" className="block text-xs font-medium text-white/90 mb-1.5">
            Primary Industry <span className="text-mint-accent">*</span>
          </label>
          <select
            id="p_industry"
            aria-invalid={!!errors.industry}
            aria-describedby={errors.industry ? "p_industry-error" : undefined}
            className="w-full px-3.5 py-2.5 rounded-xl bg-bg-deep border border-border-dark text-white text-sm focus:outline-none focus:border-green-primary focus:ring-1 focus:ring-green-primary transition-colors cursor-pointer"
            {...register("industry")}
          >
            {INDUSTRY_OPTIONS.map((ind) => (
              <option key={ind} value={ind} className="bg-bg-deep text-white">
                {ind}
              </option>
            ))}
          </select>
          {errors.industry && (
            <p id="p_industry-error" className="mt-1 text-[11px] text-red-400">
              {errors.industry.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="p_partnershipType" className="block text-xs font-medium text-white/90 mb-1.5">
            Partnership Profile <span className="text-mint-accent">*</span>
          </label>
          <select
            id="p_partnershipType"
            aria-invalid={!!errors.partnershipType}
            aria-describedby={errors.partnershipType ? "p_partnershipType-error" : undefined}
            className="w-full px-3.5 py-2.5 rounded-xl bg-bg-deep border border-border-dark text-white text-sm focus:outline-none focus:border-green-primary focus:ring-1 focus:ring-green-primary transition-colors cursor-pointer"
            {...register("partnershipType")}
          >
            {PARTNERSHIP_TYPE_OPTIONS.map((type) => (
              <option key={type} value={type} className="bg-bg-deep text-white">
                {type}
              </option>
            ))}
          </select>
          {errors.partnershipType && (
            <p id="p_partnershipType-error" className="mt-1 text-[11px] text-red-400">
              {errors.partnershipType.message}
            </p>
          )}
        </div>
      </div>

      {/* Collaboration Message */}
      <div>
        <label htmlFor="p_message" className="block text-xs font-medium text-white/90 mb-1.5">
          Partnership Overview or Collaboration Scope <span className="text-mint-accent">*</span>
        </label>
        <textarea
          id="p_message"
          rows={3}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "p_message-error" : undefined}
          className="w-full px-3.5 py-2.5 rounded-xl bg-bg-deep border border-border-dark text-white text-sm focus:outline-none focus:border-green-primary focus:ring-1 focus:ring-green-primary transition-colors resize-y"
          placeholder="Describe your organization and proposed collaboration model (e.g. facility deployment, systems integration, distribution)."
          {...register("message")}
        />
        {errors.message && (
          <p id="p_message-error" className="mt-1 text-[11px] text-red-400">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Consent Checkbox */}
      <div className="pt-2">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            id="p_privacyConsent"
            aria-invalid={!!errors.privacyConsent}
            aria-describedby={errors.privacyConsent ? "p_privacyConsent-error" : undefined}
            className="mt-1 w-4 h-4 rounded border-border-dark text-green-primary focus:ring-green-primary bg-bg-deep accent-[#23A875]"
            {...register("privacyConsent")}
          />
          <span className="text-xs text-text-muted leading-relaxed">
            I consent to PerfAI storing and processing my professional contact information in accordance with the{" "}
            <Link href="/privacy" target="_blank" className="text-mint-accent underline hover:text-white">
              Privacy Policy
            </Link>.
          </span>
        </label>
        {errors.privacyConsent && (
          <p id="p_privacyConsent-error" className="mt-1 text-[11px] text-red-400">
            {errors.privacyConsent.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-3">
        <button
          type="submit"
          disabled={submitStatus === "submitting"}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-green-primary text-bg-deep text-sm font-semibold hover:bg-mint-accent focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2 focus:ring-offset-bg-deep transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-green-primary/10 cursor-pointer"
        >
          {submitStatus === "submitting" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting Enquiry...</span>
            </>
          ) : (
            <>
              <span>Submit Partnership Enquiry</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
