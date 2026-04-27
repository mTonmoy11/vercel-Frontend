import React, { useState } from "react";
import { API_ENDPOINTS } from "../../config/api";
import {
  FiUser,
  FiCalendar,
  FiCreditCard,
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiMapPin,
  FiBook,
  FiAward,
  FiBriefcase,
  FiFileText,
  FiUploadCloud,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiAlertCircle,
  FiChevronRight,
} from "react-icons/fi";
import { MdOutlineGavel, MdOutlineBalance } from "react-icons/md";

const PRACTICE_AREAS = [
  "Criminal Law",
  "Civil Law",
  "Family Law",
  "Human Right",
  "Anti-Corruption",
  "Corporate Law",
];

/* ─── tiny helpers ─── */
const SectionCard = ({ icon, title, accent, children }) => (
  <div
    className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden`}
  >
    <div
      className={`flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gradient-to-r ${accent}`}
    >
      <span className="text-white text-xl">{icon}</span>
      <h2 className="text-base font-bold text-white tracking-wide">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const Field = ({ label, required, hint, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-[#f6824d] ml-0.5">*</span>}
      {hint && (
        <span className="ml-1 text-xs font-normal text-gray-400">({hint})</span>
      )}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 focus:outline-none focus:border-[#f6824d] focus:ring-2 focus:ring-[#f6824d]/20 transition placeholder-gray-400";

const FileUploadBox = ({
  name,
  accept,
  required,
  label,
  fileObj,
  onChange,
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-[#f6824d] ml-0.5">*</span>}
    </label>
    <label
      className={`flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-xl border-2 border-dashed cursor-pointer transition
      ${fileObj ? "border-green-400 bg-green-50" : "border-gray-200 bg-gray-50 hover:border-[#f6824d] hover:bg-[#fff5f0]"}`}
    >
      {fileObj ? (
        <>
          <FiCheckCircle className="text-green-500 text-2xl" />
          <span className="text-xs text-green-700 font-medium text-center break-all">
            {fileObj.name}
          </span>
        </>
      ) : (
        <>
          <FiUploadCloud className="text-gray-400 text-2xl" />
          <span className="text-xs text-gray-500 text-center">
            Click to upload
            <br />
            <span className="text-gray-400">
              {accept
                .replace(/image\/\*/g, "Image")
                .replace(/\./g, "")
                .toUpperCase()}
            </span>
          </span>
        </>
      )}
      <input
        type="file"
        name={name}
        accept={accept}
        onChange={onChange}
        className="hidden"
        required={required}
      />
    </label>
  </div>
);

const getPwRules = (pw) => [
  { label: "At least 6 characters", ok: pw.length >= 6 },
  { label: "One lowercase letter (a–z)", ok: /[a-z]/.test(pw) },
  { label: "One uppercase letter (A–Z)", ok: /[A-Z]/.test(pw) },
  { label: "One special character (!@#…)", ok: /[^A-Za-z0-9]/.test(pw) },
];

const getPasswordStrength = (pw) => {
  if (!pw) return { score: 0, label: "", color: "" };
  const passed = getPwRules(pw).filter((r) => r.ok).length;
  if (passed <= 1) return { score: passed, label: "Weak", color: "bg-red-400" };
  if (passed <= 3)
    return { score: passed, label: "Medium", color: "bg-yellow-400" };
  return { score: passed, label: "Strong", color: "bg-green-500" };
};

/* ─── main component ─── */
const LawyerRegistrationPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dateOfBirth: "",
    nationalIdOrBarRegistrationNumber: "",
    barCouncilEnrollmentNumber: "",
    email: "",
    phone: "",
    whatsapp: "",
    officeAddress: "",
    city: "",
    district: "",
    highestQualification: "",
    universityName: "",
    yearsOfExperience: "",
    chamberOrLawFirmName: "",
    shortProfessionalBio: "",
    password: "",
    confirmPassword: "",
  });
  const [files, setFiles] = useState({
    profilePhoto: null,
    barCouncilCertificate: null,
    nationalIdFront: null,
    nationalIdBack: null,
    lawyerIdCard: null,
  });
  const [selectedPracticeAreas, setSelectedPracticeAreas] = useState([]);
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: f } = e.target;
    setFiles((p) => ({ ...p, [name]: f?.[0] || null }));
  };

  const toggleArea = (area) =>
    setSelectedPracticeAreas((p) =>
      p.includes(area) ? p.filter((a) => a !== area) : [...p, area],
    );

  const pwStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    if (!selectedPracticeAreas.length) {
      setSubmitError("Please select at least one practice area.");
      return;
    }
    const pwRules = getPwRules(formData.password);
    const failedRule = pwRules.find((r) => !r.ok);
    if (failedRule) {
      setSubmitError(`Password requirement not met: ${failedRule.label}`);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setSubmitError("Passwords do not match.");
      return;
    }
    if (
      !files.profilePhoto ||
      !files.barCouncilCertificate ||
      !files.nationalIdFront ||
      !files.nationalIdBack
    ) {
      setSubmitError(
        "Please upload all required documents (profile photo, bar council certificate, national ID front & back).",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (k !== "confirmPassword") payload.append(k, v);
      });
      payload.append("practiceAreas", JSON.stringify(selectedPracticeAreas));
      payload.append("profilePhoto", files.profilePhoto);
      payload.append("barCouncilCertificate", files.barCouncilCertificate);
      payload.append("nationalIdFront", files.nationalIdFront);
      payload.append("nationalIdBack", files.nationalIdBack);
      if (files.lawyerIdCard)
        payload.append("lawyerIdCard", files.lawyerIdCard);

      const res = await fetch(API_ENDPOINTS.LAWYER_REGISTER, {
        method: "POST",
        body: payload,
      });
      const result = await res.json();
      if (!res.ok || !result.success)
        throw new Error(result.message || "Failed to submit");

      setSubmitSuccess(true);
      setFormData({
        fullName: "",
        gender: "",
        dateOfBirth: "",
        nationalIdOrBarRegistrationNumber: "",
        barCouncilEnrollmentNumber: "",
        email: "",
        phone: "",
        whatsapp: "",
        officeAddress: "",
        city: "",
        district: "",
        highestQualification: "",
        universityName: "",
        yearsOfExperience: "",
        chamberOrLawFirmName: "",
        shortProfessionalBio: "",
        password: "",
        confirmPassword: "",
      });
      setFiles({
        profilePhoto: null,
        barCouncilCertificate: null,
        nationalIdFront: null,
        nationalIdBack: null,
        lawyerIdCard: null,
      });
      setSelectedPracticeAreas([]);
      event.target.reset();
    } catch (err) {
      setSubmitError(err.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── success screen ── */
  if (submitSuccess) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-[#fff5f0] to-gray-50 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-lg border border-gray-100 p-10 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="text-green-500 text-4xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Application Submitted!
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Your registration has been sent to the admin panel for review.
            You'll be notified once your account is approved.
          </p>
          <button
            onClick={() => setSubmitSuccess(false)}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#f6824d] to-[#e05a2a] text-white text-sm font-semibold hover:opacity-90 transition"
          >
            Submit Another Application
          </button>
        </div>
      </section>
    );
  }

  /* ── main form ── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff5f0] via-gray-50 to-white">
      {/* ── Hero banner ── */}
      <div className="bg-gradient-to-r from-[#f6824d] to-[#c54a1a] text-white">
        <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <MdOutlineBalance className="text-white text-4xl" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Lawyer Registration
            </h1>
            <p className="text-orange-100 text-sm mt-1 max-w-xl">
              Complete all five sections below to create your lawyer account.
              Your verification documents will be reviewed by the admin before
              your account is activated.
            </p>
          </div>
          <div className="ml-auto hidden md:flex flex-col items-end gap-1 text-xs text-orange-200 flex-shrink-0">
            {[
              "Basic Info",
              "Contact",
              "Professional",
              "Documents",
              "Security",
            ].map((s, i) => (
              <span key={i} className="flex items-center gap-1">
                <FiChevronRight className="text-[10px]" />
                {i + 1}. {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Form body ── */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Alerts */}
          {submitError && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <FiAlertCircle className="text-lg flex-shrink-0" />
              {submitError}
            </div>
          )}

          {/* ── 1. Basic Information ── */}
          <SectionCard
            icon={<FiUser />}
            title="1. Basic Information"
            accent="from-[#f6824d] to-[#e05a2a]"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Full Name" required>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Adv. Rahim Uddin"
                    className={`${inputCls} pl-9`}
                    required
                  />
                </div>
              </Field>

              <Field label="Profile Photo" required>
                <FileUploadBox
                  name="profilePhoto"
                  accept="image/*"
                  required
                  label=""
                  fileObj={files.profilePhoto}
                  onChange={handleFileChange}
                />
              </Field>

              <Field label="Gender" hint="optional">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={inputCls}
                >
                  <option value="">Select gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </Field>

              <Field label="Date of Birth" required>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className={`${inputCls} pl-9`}
                    required
                  />
                </div>
              </Field>

              <Field label="National ID / Bar Registration Number" required>
                <div className="relative">
                  <FiCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    name="nationalIdOrBarRegistrationNumber"
                    value={formData.nationalIdOrBarRegistrationNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. 1234567890"
                    className={`${inputCls} pl-9`}
                    required
                  />
                </div>
              </Field>

              <Field label="Bar Council Enrollment Number" required>
                <div className="relative">
                  <MdOutlineGavel className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    name="barCouncilEnrollmentNumber"
                    value={formData.barCouncilEnrollmentNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. BC-2020-01234"
                    className={`${inputCls} pl-9`}
                    required
                  />
                </div>
              </Field>
            </div>
          </SectionCard>

          {/* ── 2. Contact Information ── */}
          <SectionCard
            icon={<FiPhone />}
            title="2. Contact Information"
            accent="from-[#e05a2a] to-[#c54a1a]"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Email Address" required>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="lawyer@example.com"
                    className={`${inputCls} pl-9`}
                    required
                  />
                </div>
              </Field>

              <Field label="Phone Number" required>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+880 17XX XXXXXX"
                    className={`${inputCls} pl-9`}
                    required
                  />
                </div>
              </Field>

              <Field label="WhatsApp" hint="optional">
                <div className="relative">
                  <FiMessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    placeholder="+880 17XX XXXXXX"
                    className={`${inputCls} pl-9`}
                  />
                </div>
              </Field>

              <Field label="Office Address" required>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    name="officeAddress"
                    value={formData.officeAddress}
                    onChange={handleInputChange}
                    placeholder="House, Road, Area..."
                    className={`${inputCls} pl-9`}
                    required
                  />
                </div>
              </Field>

              <Field label="City" required>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Dhaka"
                    className={`${inputCls} pl-9`}
                    required
                  />
                </div>
              </Field>

              <Field label="District" required>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    placeholder="Dhaka"
                    className={`${inputCls} pl-9`}
                    required
                  />
                </div>
              </Field>
            </div>
          </SectionCard>

          {/* ── 3. Professional Information ── */}
          <SectionCard
            icon={<FiBriefcase />}
            title="3. Professional Information"
            accent="from-[#c54a1a] to-[#a33c14]"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field
                label="Highest Qualification"
                hint="LLB / LLM / PhD etc."
                required
              >
                <div className="relative">
                  <FiAward className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    name="highestQualification"
                    value={formData.highestQualification}
                    onChange={handleInputChange}
                    placeholder="LLM"
                    className={`${inputCls} pl-9`}
                    required
                  />
                </div>
              </Field>

              <Field label="University Name" required>
                <div className="relative">
                  <FiBook className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    name="universityName"
                    value={formData.universityName}
                    onChange={handleInputChange}
                    placeholder="University of Dhaka"
                    className={`${inputCls} pl-9`}
                    required
                  />
                </div>
              </Field>

              <Field label="Years of Experience" required>
                <div className="relative">
                  <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="5"
                    className={`${inputCls} pl-9`}
                    required
                  />
                </div>
              </Field>

              <Field label="Current Chamber / Law Firm Name" required>
                <div className="relative">
                  <FiFileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    name="chamberOrLawFirmName"
                    value={formData.chamberOrLawFirmName}
                    onChange={handleInputChange}
                    placeholder="Supreme Court Chamber"
                    className={`${inputCls} pl-9`}
                    required
                  />
                </div>
              </Field>

              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Practice Areas <span className="text-[#f6824d]">*</span>
                  <span className="ml-1 text-xs text-gray-400 font-normal">
                    (Select all that apply)
                  </span>
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {PRACTICE_AREAS.map((area) => {
                    const active = selectedPracticeAreas.includes(area);
                    return (
                      <button
                        key={area}
                        type="button"
                        onClick={() => toggleArea(area)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition
                          ${
                            active
                              ? "bg-[#f6824d] border-[#f6824d] text-white shadow-sm"
                              : "bg-gray-50 border-gray-200 text-gray-600 hover:border-[#f6824d] hover:text-[#f6824d]"
                          }`}
                      >
                        <span
                          className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition
                          ${active ? "bg-white border-white" : "border-gray-300"}`}
                        >
                          {active && (
                            <span className="w-2 h-2 rounded-sm bg-[#f6824d] block" />
                          )}
                        </span>
                        {area}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="md:col-span-2">
                <Field label="Short Professional Bio" required>
                  <textarea
                    name="shortProfessionalBio"
                    value={formData.shortProfessionalBio}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Briefly describe your background, expertise, and notable cases..."
                    className={inputCls}
                    required
                  />
                </Field>
              </div>
            </div>
          </SectionCard>

          {/* ── 4. Verification Documents ── */}
          <SectionCard
            icon={<FiUploadCloud />}
            title="4. Verification Documents"
            accent="from-[#a33c14] to-[#7c2d0e]"
          >
            <p className="text-sm text-gray-500 mb-5">
              All documents are reviewed only by admins and kept confidential.
              Accepted formats: <strong>PDF, JPG, PNG</strong>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FileUploadBox
                name="barCouncilCertificate"
                accept=".pdf,image/*"
                required
                label="Bar Council Certificate"
                fileObj={files.barCouncilCertificate}
                onChange={handleFileChange}
              />
              <FileUploadBox
                name="nationalIdFront"
                accept="image/*,.pdf"
                required
                label="National ID – Front"
                fileObj={files.nationalIdFront}
                onChange={handleFileChange}
              />
              <FileUploadBox
                name="nationalIdBack"
                accept="image/*,.pdf"
                required
                label="National ID – Back"
                fileObj={files.nationalIdBack}
                onChange={handleFileChange}
              />
              <FileUploadBox
                name="lawyerIdCard"
                accept="image/*,.pdf"
                label="Lawyer ID Card (optional)"
                fileObj={files.lawyerIdCard}
                onChange={handleFileChange}
              />
            </div>
          </SectionCard>

          {/* ── 5. Account Security ── */}
          <SectionCard
            icon={<FiLock />}
            title="5. Account Security"
            accent="from-gray-700 to-gray-800"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Field label="Password" required>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      type={showPw ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Min. 6 characters"
                      className={`${inputCls} pl-9 pr-10`}
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPw ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </Field>
                {formData.password && (
                  <div className="mt-3 space-y-1">
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300
                          ${i <= pwStrength.score ? pwStrength.color : "bg-gray-200"}`}
                        />
                      ))}
                    </div>
                    {getPwRules(formData.password).map((rule) => (
                      <p
                        key={rule.label}
                        className={`flex items-center gap-1.5 text-xs transition-colors
                        ${rule.ok ? "text-green-600" : "text-gray-400"}`}
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 text-[9px]
                          ${rule.ok ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"}`}
                        >
                          {rule.ok ? "✓" : ""}
                        </span>
                        {rule.label}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <Field label="Confirm Password" required>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type={showCpw ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Re-enter password"
                    className={`${inputCls} pl-9 pr-10`}
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCpw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCpw ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {formData.confirmPassword &&
                  formData.password !== formData.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">
                      Passwords do not match
                    </p>
                  )}
                {formData.confirmPassword &&
                  formData.password === formData.confirmPassword && (
                    <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                      <FiCheckCircle /> Passwords match
                    </p>
                  )}
              </Field>
            </div>
          </SectionCard>

          {/* ── Submit ── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-xs text-gray-400">
              By submitting, you agree that all provided information is accurate
              and authentic.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-10 py-3 rounded-xl bg-gradient-to-r from-[#f6824d] to-[#e05a2a]
                text-white font-bold text-sm shadow-md hover:shadow-lg hover:opacity-95 active:scale-[0.98] transition
                disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Registration <FiChevronRight className="text-base" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LawyerRegistrationPage;
