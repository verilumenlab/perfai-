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
      areaOfInterest: "Full Physical AI Suite",
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

      const payload = {
        ...data,
        enquiryType: "DEMO",
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
        className="p-6 sm:p-8 rounded-2xl bg-bg-surface border border-green-primary/30 text-white text-center"
        role="alert"
        aria-live="polite"
      >
        <div className="w-12 h-12 mx-auto rounded-full bg-green-primary/20 flex items-center justify-center text-mint-accent mb-4">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="font-heading font-bold text-xl text-white">
          Demonstration Request Registered
        </h3>
        <p className="mt-2 text-sm text-text-muted max-w-md mx-auto">
          Thank you for your interest in Senatria Physical AI. Our enterprise solutions team has received your enquiry.
        </p>
        <div className="mt-4 p-3 rounded-xl bg-bg-deep border border-border-dark inline-block font-mono text-xs text-mint-accent">
          Reference: <span className="font-bold text-white">{leadNumber}</span>
        </div>
        <p className="mt-3 text-xs text-text-muted">
          A confirmation summary has been dispatched. An enterprise specialist will reach out within one business day.
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-bg-deep border border-border-dark text-white hover:border-green-primary transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
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
      aria-label="Request a demonstration form"
    >
      {/* Hidden Honeypot */}
      <div className="absolute opacity-0 -z-50 pointer-events-none h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="hp_website_demo">Leave this field blank</label>
        <input
          id="hp_website_demo"
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
          <label htmlFor="fullName" className="block text-xs font-medium text-white/90 mb-1.5">
            Full Name <span className="text-mint-accent">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            className="w-full px-3.5 py-2.5 rounded-xl bg-bg-deep border border-border-dark text-white text-sm focus:outline-none focus:border-green-primary focus:ring-1 focus:ring-green-primary transition-colors"
            placeholder="Jane Doe"
            {...register("fullName")}
          />
          {errors.fullName && (
            <p id="fullName-error" className="mt-1 text-[11px] text-red-400">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="businessEmail" className="block text-xs font-medium text-white/90 mb-1.5">
            Business Email <span className="text-mint-accent">*</span>
          </label>
          <input
            id="businessEmail"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.businessEmail}
            aria-describedby={errors.businessEmail ? "businessEmail-error" : undefined}
            className="w-full px-3.5 py-2.5 rounded-xl bg-bg-deep border border-border-dark text-white text-sm focus:outline-none focus:border-green-primary focus:ring-1 focus:ring-green-primary transition-colors"
            placeholder="jane@company.com"
            {...register("businessEmail")}
          />
          {errors.businessEmail && (
            <p id="businessEmail-error" className="mt-1 text-[11px] text-red-400">
              {errors.businessEmail.message}
            </p>
          )}
        </div>
      </div>

      {/* Company and Job Title */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="companyName" className="block text-xs font-medium text-white/90 mb-1.5">
            Company / Organisation <span className="text-mint-accent">*</span>
          </label>
          <input
            id="companyName"
            type="text"
            autoComplete="organization"
            aria-invalid={!!errors.companyName}
            aria-describedby={errors.companyName ? "companyName-error" : undefined}
            className="w-full px-3.5 py-2.5 rounded-xl bg-bg-deep border border-border-dark text-white text-sm focus:outline-none focus:border-green-primary focus:ring-1 focus:ring-green-primary transition-colors"
            placeholder="Acme Real Estate Group"
            {...register("companyName")}
          />
          {errors.companyName && (
            <p id="companyName-error" className="mt-1 text-[11px] text-red-400">
              {errors.companyName.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="jobTitle" className="block text-xs font-medium text-white/90 mb-1.5">
            Job Title / Role <span className="text-mint-accent">*</span>
          </label>
          <input
            id="jobTitle"
            type="text"
            autoComplete="organization-title"
            aria-invalid={!!errors.jobTitle}
            aria-describedby={errors.jobTitle ? "jobTitle-error" : undefined}
            className="w-full px-3.5 py-2.5 rounded-xl bg-bg-deep border border-border-dark text-white text-sm focus:outline-none focus:border-green-primary focus:ring-1 focus:ring-green-primary transition-colors"
            placeholder="Head of Facilities / VP Operations"
            {...register("jobTitle")}
          />
          {errors.jobTitle && (
            <p id="jobTitle-error" className="mt-1 text-[11px] text-red-400">
              {errors.jobTitle.message}
            </p>
          )}
        </div>
      </div>

      {/* Country and Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="country" className="block text-xs font-medium text-white/90 mb-1.5">
            Country / Region <span className="text-mint-accent">*</span>
          </label>
          <input
            id="country"
            type="text"
            autoComplete="country-name"
            aria-invalid={!!errors.country}
            aria-describedby={errors.country ? "country-error" : undefined}
            className="w-full px-3.5 py-2.5 rounded-xl bg-bg-deep border border-border-dark text-white text-sm focus:outline-none focus:border-green-primary focus:ring-1 focus:ring-green-primary transition-colors"
            placeholder="India / United Kingdom / Singapore"
            {...register("country")}
          />
          {errors.country && (
            <p id="country-error" className="mt-1 text-[11px] text-red-400">
              {errors.country.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-xs font-medium text-white/90 mb-1.5">
            Phone Number <span className="text-text-muted text-[10px]">(optional)</span>
          </label>
          <input
            id="phoneNumber"
            type="tel"
            autoComplete="tel"
            aria-invalid={!!errors.phoneNumber}
            aria-describedby={errors.phoneNumber ? "phoneNumber-error" : undefined}
            className="w-full px-3.5 py-2.5 rounded-xl bg-bg-deep border border-border-dark text-white text-sm focus:outline-none focus:border-green-primary focus:ring-1 focus:ring-green-primary transition-colors"
            placeholder="+91 98765 43210"
            {...register("phoneNumber")}
          />
          {errors.phoneNumber && (
            <p id="phoneNumber-error" className="mt-1 text-[11px] text-red-400">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>
      </div>

      {/* Industry and Area of Interest */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="industry" className="block text-xs font-medium text-white/90 mb-1.5">
            Primary Industry <span className="text-mint-accent">*</span>
          </label>
          <select
            id="industry"
            aria-invalid={!!errors.industry}
            aria-describedby={errors.industry ? "industry-error" : undefined}
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
            <p id="industry-error" className="mt-1 text-[11px] text-red-400">
              {errors.industry.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="areaOfInterest" className="block text-xs font-medium text-white/90 mb-1.5">
            Area of Interest <span className="text-mint-accent">*</span>
          </label>
          <select
            id="areaOfInterest"
            aria-invalid={!!errors.areaOfInterest}
            aria-describedby={errors.areaOfInterest ? "areaOfInterest-error" : undefined}
            className="w-full px-3.5 py-2.5 rounded-xl bg-bg-deep border border-border-dark text-white text-sm focus:outline-none focus:border-green-primary focus:ring-1 focus:ring-green-primary transition-colors cursor-pointer"
            {...register("areaOfInterest")}
          >
            {AREA_OF_INTEREST_OPTIONS.map((area) => (
              <option key={area} value={area} className="bg-bg-deep text-white">
                {area}
              </option>
            ))}
          </select>
          {errors.areaOfInterest && (
            <p id="areaOfInterest-error" className="mt-1 text-[11px] text-red-400">
              {errors.areaOfInterest.message}
            </p>
          )}
        </div>
      </div>

      {/* Facility Type & Estimated Size */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="facilityType" className="block text-xs font-medium text-white/90 mb-1.5">
            Facility Type <span className="text-text-muted text-[10px]">(e.g. Grade-A Office, Hotel, Hyperscale DC)</span>
          </label>
          <input
            id="facilityType"
            type="text"
            className="w-full px-3.5 py-2.5 rounded-xl bg-bg-deep border border-border-dark text-white text-sm focus:outline-none focus:border-green-primary focus:ring-1 focus:ring-green-primary transition-colors"
            placeholder="Commercial High-Rise"
            {...register("facilityType")}
          />
        </div>

        <div>
          <label htmlFor="facilitySize" className="block text-xs font-medium text-white/90 mb-1.5">
            Estimated Facility Size <span className="text-text-muted text-[10px]">(e.g. 500,000 sq ft / 50 MW)</span>
          </label>
          <input
            id="facilitySize"
            type="text"
            className="w-full px-3.5 py-2.5 rounded-xl bg-bg-deep border border-border-dark text-white text-sm focus:outline-none focus:border-green-primary focus:ring-1 focus:ring-green-primary transition-colors"
            placeholder="350,000 sq ft"
            {...register("facilitySize")}
          />
        </div>
      </div>

      {/* Requirements / Message */}
      <div>
        <label htmlFor="message" className="block text-xs font-medium text-white/90 mb-1.5">
          Operational Requirements or Message <span className="text-mint-accent">*</span>
        </label>
        <textarea
          id="message"
          rows={3}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="w-full px-3.5 py-2.5 rounded-xl bg-bg-deep border border-border-dark text-white text-sm focus:outline-none focus:border-green-primary focus:ring-1 focus:ring-green-primary transition-colors resize-y"
          placeholder="Briefly describe your infrastructure challenges (e.g. chiller plant optimization, peak demand tariffs, BMS integration)."
          {...register("message")}
        />
        {errors.message && (
          <p id="message-error" className="mt-1 text-[11px] text-red-400">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Consent Checkbox */}
      <div className="pt-2">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            id="privacyConsent"
            aria-invalid={!!errors.privacyConsent}
            aria-describedby={errors.privacyConsent ? "privacyConsent-error" : undefined}
            className="mt-1 w-4 h-4 rounded border-border-dark text-green-primary focus:ring-green-primary bg-bg-deep accent-[#23A875]"
            {...register("privacyConsent")}
          />
          <span className="text-xs text-text-muted leading-relaxed">
            I consent to PerfAI processing my contact and facility details to coordinate this demonstration in accordance with the{" "}
            <Link href="/privacy" target="_blank" className="text-mint-accent underline hover:text-white">
              Privacy Policy
            </Link>.
          </span>
        </label>
        {errors.privacyConsent && (
          <p id="privacyConsent-error" className="mt-1 text-[11px] text-red-400">
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
              <span>Submitting Request...</span>
            </>
          ) : (
            <>
              <span>Submit Demonstration Request</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
