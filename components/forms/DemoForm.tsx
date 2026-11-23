"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  demoFormSchema,
  DemoFormData,
  INDUSTRY_OPTIONS,
  AREA_OF_INTEREST_OPTIONS,
} from "@/lib/validation";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, RotateCcw } from "lucide-react";

const fieldClass =
  "w-full rounded-lg border border-line/90 bg-bg-light/80 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/65 transition-colors focus:border-green-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-green-primary/40";
const labelClass = "mb-1.5 block text-xs font-medium text-ink/85";
const errorClass = "mt-1 text-[11px] text-red-600";

export function DemoForm() {
  const [formLoadTime, setFormLoadTime] = useState<number>(() => Date.now());
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [leadNumber, setLeadNumber] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DemoFormData>({
    resolver: zodResolver(demoFormSchema),
    defaultValues: {
      fullName: "",
      businessEmail: "",
      companyName: "",
      jobTitle: "",
      phoneNumber: "",
      country: "",
      industry: "Commercial Buildings",
      facilityType: "",
      areaOfInterest: "Full Building Management Suite",
      facilitySize: "",
      message: "",
      privacyConsent: false as unknown as true,
      hp_website: "",
    },
  });

  const onSubmit = async (data: DemoFormData) => {
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

      const isPartner = data.areaOfInterest === "Partnership / Channel Enquiry";
      const payload = {
        ...data,
        enquiryType: isPartner ? "PARTNER" : "DEMO",
        // Partner API schema expects partnershipType; map from area of interest when needed
        ...(isPartner
          ? { partnershipType: "Other Business Enquiry" as const }
          : {}),
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
        throw new Error(result.error || "Failed to submit demo request.");
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
          Enquiry Received
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
          Thank you for contacting PerfAI. Our team has received your enquiry and will follow up shortly.
        </p>
        <div className="mt-4 inline-block rounded-xl border border-line bg-white p-3 font-mono text-xs text-forest">
          Reference: <span className="font-bold text-ink">{leadNumber}</span>
        </div>
        <p className="mt-3 text-xs text-ink-muted">
          A confirmation summary has been dispatched. An enterprise specialist will reach out within one business day.
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-xs font-semibold text-ink transition-colors hover:border-green-primary"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Submit another request</span>
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
      aria-label="Contact PerfAI enquiry form"
    >
      <div className="pointer-events-none absolute -z-50 h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
        <label htmlFor="hp_website_demo">Leave this field blank</label>
        <input
          id="hp_website_demo"
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
          <label htmlFor="fullName" className={labelClass}>
            Full Name <span className="text-green-primary">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            className={fieldClass}
            placeholder="Jane Doe"
            {...register("fullName")}
          />
          {errors.fullName && (
            <p id="fullName-error" className={errorClass}>
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="businessEmail" className={labelClass}>
            Business Email <span className="text-green-primary">*</span>
          </label>
          <input
            id="businessEmail"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.businessEmail}
            aria-describedby={errors.businessEmail ? "businessEmail-error" : undefined}
            className={fieldClass}
            placeholder="jane@company.com"
            {...register("businessEmail")}
          />
          {errors.businessEmail && (
            <p id="businessEmail-error" className={errorClass}>
              {errors.businessEmail.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="companyName" className={labelClass}>
            Company / Organisation <span className="text-green-primary">*</span>
          </label>
          <input
            id="companyName"
            type="text"
            autoComplete="organization"
            aria-invalid={!!errors.companyName}
            aria-describedby={errors.companyName ? "companyName-error" : undefined}
            className={fieldClass}
            placeholder="Acme Real Estate Group"
            {...register("companyName")}
          />
          {errors.companyName && (
            <p id="companyName-error" className={errorClass}>
              {errors.companyName.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="jobTitle" className={labelClass}>
            Job Title / Role <span className="text-green-primary">*</span>
          </label>
          <input
            id="jobTitle"
            type="text"
            autoComplete="organization-title"
            aria-invalid={!!errors.jobTitle}
            aria-describedby={errors.jobTitle ? "jobTitle-error" : undefined}
            className={fieldClass}
            placeholder="Head of Facilities / VP Operations"
            {...register("jobTitle")}
          />
          {errors.jobTitle && (
            <p id="jobTitle-error" className={errorClass}>
              {errors.jobTitle.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="country" className={labelClass}>
            Country / Region <span className="text-green-primary">*</span>
          </label>
          <input
            id="country"
            type="text"
            autoComplete="country-name"
            aria-invalid={!!errors.country}
            aria-describedby={errors.country ? "country-error" : undefined}
            className={fieldClass}
            placeholder="India / United Kingdom / Singapore"
            {...register("country")}
          />
          {errors.country && (
            <p id="country-error" className={errorClass}>
              {errors.country.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phoneNumber" className={labelClass}>
            Phone Number <span className="text-[10px] text-ink-muted">(optional)</span>
          </label>
          <input
            id="phoneNumber"
            type="tel"
            autoComplete="tel"
            aria-invalid={!!errors.phoneNumber}
            aria-describedby={errors.phoneNumber ? "phoneNumber-error" : undefined}
            className={fieldClass}
            placeholder="+91 98765 43210"
            {...register("phoneNumber")}
          />
          {errors.phoneNumber && (
            <p id="phoneNumber-error" className={errorClass}>
              {errors.phoneNumber.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="industry" className={labelClass}>
            Primary Industry <span className="text-green-primary">*</span>
          </label>
          <select
            id="industry"
            aria-invalid={!!errors.industry}
            aria-describedby={errors.industry ? "industry-error" : undefined}
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
            <p id="industry-error" className={errorClass}>
              {errors.industry.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="areaOfInterest" className={labelClass}>
            Area of Interest <span className="text-green-primary">*</span>
          </label>
          <select
            id="areaOfInterest"
            aria-invalid={!!errors.areaOfInterest}
            aria-describedby={errors.areaOfInterest ? "areaOfInterest-error" : undefined}
            className={`${fieldClass} cursor-pointer`}
            {...register("areaOfInterest")}
          >
            {AREA_OF_INTEREST_OPTIONS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
          {errors.areaOfInterest && (
            <p id="areaOfInterest-error" className={errorClass}>
              {errors.areaOfInterest.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="facilityType" className={labelClass}>
            Facility Type{" "}
            <span className="text-[10px] text-ink-muted">
              (e.g. Grade-A Office, Hotel, Hyperscale DC)
            </span>
          </label>
          <input
            id="facilityType"
            type="text"
            className={fieldClass}
            placeholder="Commercial High-Rise"
            {...register("facilityType")}
          />
        </div>

        <div>
          <label htmlFor="facilitySize" className={labelClass}>
            Estimated Facility Size{" "}
            <span className="text-[10px] text-ink-muted">(e.g. 500,000 sq ft / 50 MW)</span>
          </label>
          <input
            id="facilitySize"
            type="text"
            className={fieldClass}
            placeholder="350,000 sq ft"
            {...register("facilitySize")}
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Operational Requirements or Message <span className="text-green-primary">*</span>
        </label>
        <textarea
          id="message"
          rows={3}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`${fieldClass} resize-y`}
          placeholder="Briefly describe your infrastructure challenges (e.g. chiller plant optimization, peak demand tariffs, BMS integration)."
          {...register("message")}
        />
        {errors.message && (
          <p id="message-error" className={errorClass}>
            {errors.message.message}
          </p>
        )}
      </div>

      <div className="pt-2">
        <label className="flex cursor-pointer select-none items-start gap-3">
          <input
            type="checkbox"
            id="privacyConsent"
            aria-invalid={!!errors.privacyConsent}
            aria-describedby={errors.privacyConsent ? "privacyConsent-error" : undefined}
            className="mt-1 h-4 w-4 rounded border-line bg-white accent-[#23A875] focus:ring-green-primary"
            {...register("privacyConsent")}
          />
          <span className="text-xs leading-relaxed text-ink-muted">
            I consent to PerfAI processing my contact and facility details to coordinate this
            demonstration in accordance with the{" "}
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
          <p id="privacyConsent-error" className={errorClass}>
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
              <span>Submitting Request...</span>
            </>
          ) : (
            <>
              <span>Submit Enquiry</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
