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

const fieldClass =
  "w-full rounded-xl border border-line bg-bg-light px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/70 transition-colors focus:border-green-primary focus:outline-none focus:ring-1 focus:ring-green-primary";
const labelClass = "mb-1.5 block text-xs font-medium text-ink";
const errorClass = "mt-1 text-[11px] text-red-600";

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
      let utmSource: string | undefined;
      let utmMedium: string | undefined;
      let utmCampaign: string | undefined;
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        utmSource = params.get("utm_source") || undefined;
        utmMedium = params.get("utm_medium") || undefined;
        utmCampaign = params.get("utm_campaign") || undefined;
      }

      const payload = {
        ...data,
        enquiryType: "PARTNER",
        formLoadTime,
        sourcePage: typeof window !== "undefined" ? window.location.pathname : "/",
        utmSource,
        utmMedium,
        utmCampaign,
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
        className="rounded-2xl border border-green-primary/25 bg-bg-light p-6 text-center text-ink sm:p-8"
        role="alert"
        aria-live="polite"
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-primary/15 text-green-primary">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="font-heading text-xl font-bold text-ink">
          Partnership Enquiry Registered
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
          Thank you for reaching out to PerfAI. Our commercial partnerships team has received your details.
        </p>
        <div className="mt-4 inline-block rounded-xl border border-line bg-white p-3 font-mono text-xs text-forest">
          Reference: <span className="font-bold text-ink">{leadNumber}</span>
        </div>
        <p className="mt-3 text-xs text-ink-muted">
          A partnership coordinator will review your company profile and respond within two business days.
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-xs font-semibold text-ink transition-colors hover:border-green-primary"
          >
            <RotateCcw className="h-3.5 w-3.5" />
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
      {/* Anti-spam honeypot: invisible, inert (no focus, no assistive tech) and carries no readable text. */}
      <div
        className="pointer-events-none absolute -left-[9999px] top-0 -z-50 h-0 w-0 overflow-hidden opacity-0"
        aria-hidden="true"
        inert
      >
        <input
          id="hp_website_partner"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("hp_website")}
        />
      </div>

      {submitStatus === "error" && errorMessage && (
        <div
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700"
          role="alert"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="p_fullName" className={labelClass}>
            Full Name <span className="text-green-primary">*</span>
          </label>
          <input
            id="p_fullName"
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "p_fullName-error" : undefined}
            className={fieldClass}
            placeholder="Marcus Vance"
            {...register("fullName")}
          />
          {errors.fullName && (
            <p id="p_fullName-error" className={errorClass}>
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="p_businessEmail" className={labelClass}>
            Business Email <span className="text-green-primary">*</span>
          </label>
          <input
            id="p_businessEmail"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.businessEmail}
            aria-describedby={errors.businessEmail ? "p_businessEmail-error" : undefined}
            className={fieldClass}
            placeholder="m.vance@company.com"
            {...register("businessEmail")}
          />
          {errors.businessEmail && (
            <p id="p_businessEmail-error" className={errorClass}>
              {errors.businessEmail.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="p_companyName" className={labelClass}>
            Company / Organisation <span className="text-green-primary">*</span>
          </label>
          <input
            id="p_companyName"
            type="text"
            autoComplete="organization"
            aria-invalid={!!errors.companyName}
            aria-describedby={errors.companyName ? "p_companyName-error" : undefined}
            className={fieldClass}
            placeholder="Apex Infrastructure Partners"
            {...register("companyName")}
          />
          {errors.companyName && (
            <p id="p_companyName-error" className={errorClass}>
              {errors.companyName.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="p_jobTitle" className={labelClass}>
            Job Title / Role <span className="text-green-primary">*</span>
          </label>
          <input
            id="p_jobTitle"
            type="text"
            autoComplete="organization-title"
            aria-invalid={!!errors.jobTitle}
            aria-describedby={errors.jobTitle ? "p_jobTitle-error" : undefined}
            className={fieldClass}
            placeholder="Managing Director / Partnership Lead"
            {...register("jobTitle")}
          />
          {errors.jobTitle && (
            <p id="p_jobTitle-error" className={errorClass}>
              {errors.jobTitle.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="p_country" className={labelClass}>
            Country / Region <span className="text-green-primary">*</span>
          </label>
          <input
            id="p_country"
            type="text"
            autoComplete="country-name"
            aria-invalid={!!errors.country}
            aria-describedby={errors.country ? "p_country-error" : undefined}
            className={fieldClass}
            placeholder="India / United Arab Emirates / Germany"
            {...register("country")}
          />
          {errors.country && (
            <p id="p_country-error" className={errorClass}>
              {errors.country.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="p_phoneNumber" className={labelClass}>
            Phone Number <span className="text-[10px] text-ink-muted">(optional)</span>
          </label>
          <input
            id="p_phoneNumber"
            type="tel"
            autoComplete="tel"
            aria-invalid={!!errors.phoneNumber}
            aria-describedby={errors.phoneNumber ? "p_phoneNumber-error" : undefined}
            className={fieldClass}
            placeholder="+44 20 7946 0912"
            {...register("phoneNumber")}
          />
          {errors.phoneNumber && (
            <p id="p_phoneNumber-error" className={errorClass}>
              {errors.phoneNumber.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="p_industry" className={labelClass}>
            Primary Industry <span className="text-green-primary">*</span>
          </label>
          <select
            id="p_industry"
            aria-invalid={!!errors.industry}
            aria-describedby={errors.industry ? "p_industry-error" : undefined}
            className={`${fieldClass} cursor-pointer`}
            {...register("industry")}
          >
            {INDUSTRY_OPTIONS.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
          {errors.industry && (
            <p id="p_industry-error" className={errorClass}>
              {errors.industry.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="p_partnershipType" className={labelClass}>
            Partnership Profile <span className="text-green-primary">*</span>
          </label>
          <select
            id="p_partnershipType"
            aria-invalid={!!errors.partnershipType}
            aria-describedby={errors.partnershipType ? "p_partnershipType-error" : undefined}
            className={`${fieldClass} cursor-pointer`}
            {...register("partnershipType")}
          >
            {PARTNERSHIP_TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.partnershipType && (
            <p id="p_partnershipType-error" className={errorClass}>
              {errors.partnershipType.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="p_message" className={labelClass}>
          Partnership Overview or Collaboration Scope{" "}
          <span className="text-green-primary">*</span>
        </label>
        <textarea
          id="p_message"
          rows={3}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "p_message-error" : undefined}
          className={`${fieldClass} resize-y`}
          placeholder="Describe your organisation and proposed collaboration model (e.g. facility deployment, systems integration, distribution)."
          {...register("message")}
        />
        {errors.message && (
          <p id="p_message-error" className={errorClass}>
            {errors.message.message}
          </p>
        )}
      </div>

      <div className="pt-2">
        <label className="flex cursor-pointer select-none items-start gap-3">
          <input
            type="checkbox"
            id="p_privacyConsent"
            aria-invalid={!!errors.privacyConsent}
            aria-describedby={errors.privacyConsent ? "p_privacyConsent-error" : undefined}
            className="mt-1 h-4 w-4 rounded border-line bg-white accent-[#23A875] focus:ring-green-primary"
            {...register("privacyConsent")}
          />
          <span className="text-xs leading-relaxed text-ink-muted">
            I consent to PerfAI storing and processing my professional contact information in
            accordance with the{" "}
            <Link
              href="/privacy"
              target="_blank"
              className="text-forest underline hover:text-green-primary"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {errors.privacyConsent && (
          <p id="p_privacyConsent-error" className={errorClass}>
            {errors.privacyConsent.message}
          </p>
        )}
      </div>

      <div className="pt-3">
        <button
          type="submit"
          disabled={submitStatus === "submitting"}
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-green-primary px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-forest focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {submitStatus === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Submitting Enquiry...</span>
            </>
          ) : (
            <>
              <span>Submit Partnership Enquiry</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
