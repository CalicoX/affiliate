import { useEffect, useRef, useState } from "react";

const CATEGORIES = [
  "Agency / Consultant",
  "Creator / Influencer",
  "Media / Review site",
  "Community",
  "SaaS / Technology",
  "Logistics / Supply Chain",
  "Ecommerce Platform / Marketplace",
];

const ORGANIZATION_SIZES = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "501-1,000 employees",
  "1,001+ employees",
];

const PARTNERSHIP_TYPES = [
  { value: "affiliate", label: "Referral Partnership Program" },
  { value: "integration", label: "Tech Integration" },
  { value: "comarketing", label: "Co-marketing" },
  { value: "other", label: "Other Partnership Opportunities" },
];

const AUDIENCES = [
  "DTC Shopify brands",
  "DTC Non-Shopify brands",
  "Marketplace e-commerce",
  "Logistics & fulfillment businesses",
  "Other",
];

const REACH_OPTIONS = ["1-1,000", "1,001-10,000", "10,001-100,000", "100,001-500,000", "500,001+"];

const SHIPMENT_OPTIONS = [
  "< 1K shipments/month",
  "1-3K shipments/month",
  "3-5K shipments/month",
  "5-10K+ shipments/month",
  "Mixed / Not sure",
];

const PLATFORMS = ["Shopify", "BigCommerce", "WooCommerce", "Amazon", "Self-developed platform"];

const TECHNICAL_OPTIONS = ["Yes", "Not Currently"];

const ACTIVITY_OPTIONS = [
  "Webinar",
  "Industry report",
  "Case study",
  "Newsletter",
  "Social content",
  "Event",
  "Other",
];

const TIMELINE_OPTIONS = ["Within 1 month", "Within 1-3 months", "Within 3-6 months", "Exploring for now"];

const LIST_FIELDS = new Set(["affiliateAudience", "supportedPlatform", "comarketingAudience"]);

function freshValues() {
  return {
    firstName: "",
    lastName: "",
    workEmail: "",
    companyName: "",
    website: "",
    region: "",
    category: "",
    organizationSize: "",
    overview: "",
    partnershipInterest: "",
    affiliateMarkets: "",
    affiliateAudience: [],
    affiliateReach: "",
    affiliateShipmentVolume: "",
    integrationProduct: "",
    supportedPlatform: [],
    otherPlatform: "",
    integrationTechnical: "",
    comarketingType: "",
    comarketingTimeline: "",
    comarketingAudience: [],
    comarketingProposal: "",
    otherDetails: "",
    consent: false,
  };
}

function isBlank(value) {
  return !String(value ?? "").trim();
}

function validate(values) {
  const errors = {};
  const requireText = (key) => {
    if (isBlank(values[key])) errors[key] = true;
  };

  ["firstName", "lastName", "companyName", "website", "region", "category", "organizationSize"].forEach(
    requireText,
  );

  if (isBlank(values.workEmail) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.workEmail.trim())) {
    errors.workEmail = true;
  }

  if (!values.partnershipInterest) {
    errors.partnershipInterest = "Please select a partnership type.";
  }

  if (values.partnershipInterest === "affiliate") {
    requireText("affiliateMarkets");
    requireText("affiliateReach");
    requireText("affiliateShipmentVolume");
    if (!values.affiliateAudience.length) errors.affiliateAudience = "Select at least one audience.";
  }

  if (values.partnershipInterest === "integration") {
    requireText("integrationProduct");
    requireText("integrationTechnical");
    if (!values.supportedPlatform.length && isBlank(values.otherPlatform)) {
      errors.supportedPlatform = "Select a platform or enter another platform.";
    }
  }

  if (values.partnershipInterest === "comarketing") {
    requireText("comarketingType");
    requireText("comarketingTimeline");
    requireText("comarketingProposal");
    if (!values.comarketingAudience.length) errors.comarketingAudience = "Select at least one audience.";
  }

  if (values.partnershipInterest === "other") {
    requireText("otherDetails");
  }

  if (!values.consent) errors.consent = true;

  if (Object.keys(errors).length) {
    errors.form = "Please complete all required fields before submitting.";
  }

  return errors;
}

function RequiredMark() {
  return <span className="af-form-req"> *</span>;
}

function TextField({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  invalid = false,
  span = false,
  type = "text",
  ...rest
}) {
  return (
    <div className={span ? "af-form-field af-form-span" : "af-form-field"}>
      <label className="af-form-label" htmlFor={id}>
        {label}
        {required ? <RequiredMark /> : null}
      </label>
      {type === "textarea" ? (
        <textarea
          className={invalid ? "af-form-control is-invalid" : "af-form-control"}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          aria-invalid={invalid || undefined}
        />
      ) : (
        <input
          className={invalid ? "af-form-control is-invalid" : "af-form-control"}
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          aria-invalid={invalid || undefined}
          {...rest}
        />
      )}
    </div>
  );
}

function SelectField({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  options,
  required = false,
  invalid = false,
  error,
  span = false,
}) {
  return (
    <div className={span ? "af-form-field af-form-span" : "af-form-field"}>
      <label className="af-form-label" htmlFor={id}>
        {label}
        {required ? <RequiredMark /> : null}
      </label>
      <select
        className={`af-form-control${value ? "" : " is-placeholder"}${invalid ? " is-invalid" : ""}`}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        aria-invalid={invalid || undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        <option value="">{placeholder}</option>
        {options.map((option) =>
          typeof option === "string" ? (
            <option key={option} value={option}>
              {option}
            </option>
          ) : (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ),
        )}
      </select>
      {error ? (
        <p className="af-form-error" id={`${id}-error`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ChoiceGroup({ id, label, name, options, selected, onToggle, error }) {
  return (
    <div
      className="af-form-field af-form-span"
      role="group"
      aria-labelledby={id}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${id}-error` : undefined}
    >
      <p className="af-form-label" id={id}>
        {label}
        <RequiredMark />
      </p>
      <div className="af-form-choices">
        {options.map((option) => {
          const checked = selected.includes(option);
          return (
            <label key={option} className={checked ? "af-form-choice is-checked" : "af-form-choice"}>
              <input
                type="checkbox"
                name={name}
                value={option}
                checked={checked}
                onChange={() => onToggle(name, option)}
              />
              <span>{option}</span>
            </label>
          );
        })}
      </div>
      {error ? (
        <p className="af-form-error" id={`${id}-error`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SectionIntro({ title, help }) {
  return (
    <div className="af-form-section-copy af-form-span">
      <p className="af-form-label">{title}</p>
      <p className="af-form-help">{help}</p>
    </div>
  );
}

export default function PartnerApplicationForm() {
  const [values, setValues] = useState(freshValues);
  const [attempted, setAttempted] = useState(false);
  const [done, setDone] = useState(false);
  const successRef = useRef(null);
  const errors = attempted ? validate(values) : {};

  useEffect(() => {
    if (done) successRef.current?.focus();
  }, [done]);

  function onChange(event) {
    const { name, type, value, checked } = event.target;
    if (type === "checkbox" && LIST_FIELDS.has(name)) return;
    setValues((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function onToggle(name, option) {
    setValues((current) => {
      const list = current[name];
      const next = list.includes(option) ? list.filter((item) => item !== option) : [...list, option];
      return { ...current, [name]: next };
    });
  }

  function onSubmit(event) {
    event.preventDefault();
    const next = validate(values);
    setAttempted(true);
    if (!next.form) setDone(true);
  }

  function startOver() {
    setValues(freshValues());
    setAttempted(false);
    setDone(false);
  }

  if (done) {
    return (
      <div className="af-form-success">
        <h2 ref={successRef} tabIndex={-1}>
          Application submitted
        </h2>
        <p>
          Thanks for your interest in partnering with 17TRACK. Our team will review your information and contact you
          with next steps.
        </p>
        <button type="button" className="af-form-submit" onClick={startOver}>
          Submit another application
        </button>
      </div>
    );
  }

  const type = values.partnershipInterest;

  return (
    <form className="af-form" id="partner-application-form" noValidate onSubmit={onSubmit}>
      <div className="af-form-grid">
        <TextField
          id="partner-first-name"
          name="firstName"
          label="First name"
          placeholder="Enter your first name"
          value={values.firstName}
          onChange={onChange}
          required
          invalid={Boolean(errors.firstName)}
          autoComplete="given-name"
        />
        <TextField
          id="partner-last-name"
          name="lastName"
          label="Last name"
          placeholder="Enter your last name"
          value={values.lastName}
          onChange={onChange}
          required
          invalid={Boolean(errors.lastName)}
          autoComplete="family-name"
        />
        <TextField
          id="partner-work-email"
          name="workEmail"
          label="Work email"
          type="email"
          placeholder="you@company.com"
          value={values.workEmail}
          onChange={onChange}
          required
          invalid={Boolean(errors.workEmail)}
          autoComplete="email"
        />
        <TextField
          id="partner-company-name"
          name="companyName"
          label="Company name"
          placeholder="Enter your company name"
          value={values.companyName}
          onChange={onChange}
          required
          invalid={Boolean(errors.companyName)}
          autoComplete="organization"
        />
        <TextField
          id="partner-website"
          name="website"
          label="Website link"
          placeholder="https://www.example.com"
          value={values.website}
          onChange={onChange}
          required
          invalid={Boolean(errors.website)}
          inputMode="url"
          autoComplete="url"
        />
        <TextField
          id="partner-region"
          name="region"
          label="Country / region"
          placeholder="e.g. United States"
          value={values.region}
          onChange={onChange}
          required
          invalid={Boolean(errors.region)}
          autoComplete="country-name"
        />
        <SelectField
          id="partner-category"
          name="category"
          label="Category"
          placeholder="Select a category"
          options={CATEGORIES}
          value={values.category}
          onChange={onChange}
          required
          invalid={Boolean(errors.category)}
        />
        <SelectField
          id="partner-organization-size"
          name="organizationSize"
          label="Organization size"
          placeholder="Select organization size"
          options={ORGANIZATION_SIZES}
          value={values.organizationSize}
          onChange={onChange}
          required
          invalid={Boolean(errors.organizationSize)}
        />
        <TextField
          id="partner-overview"
          name="overview"
          label="Company overview"
          type="textarea"
          placeholder="Briefly describe your company, products, services, and the customers you serve"
          value={values.overview}
          onChange={onChange}
          span
        />
        <SelectField
          id="partner-partnership-interest"
          name="partnershipInterest"
          label="How would you like to work with 17TRACK?"
          placeholder="Select a partnership type"
          options={PARTNERSHIP_TYPES}
          value={values.partnershipInterest}
          onChange={onChange}
          required
          invalid={Boolean(errors.partnershipInterest)}
          error={typeof errors.partnershipInterest === "string" ? errors.partnershipInterest : ""}
          span
        />

        {type === "affiliate" ? (
          <div className="af-form-section">
            <SectionIntro
              title="Referral Partnership Program"
              help="Help us understand your audience, reach, and customer profile."
            />
            <p className="af-form-note af-form-span">
              <strong>Eligibility:</strong> Affiliate partnerships and commission payouts are currently available to
              eligible partners outside China.
            </p>
            <TextField
              id="partner-affiliate-markets"
              name="affiliateMarkets"
              label="Which markets do you primarily reach?"
              placeholder="e.g. North America, Europe, Southeast Asia"
              value={values.affiliateMarkets}
              onChange={onChange}
              required
              invalid={Boolean(errors.affiliateMarkets)}
            />
            <ChoiceGroup
              id="partner-affiliate-audience"
              label="Who is your primary audience?"
              name="affiliateAudience"
              options={AUDIENCES}
              selected={values.affiliateAudience}
              onToggle={onToggle}
              error={errors.affiliateAudience}
            />
            <SelectField
              id="partner-affiliate-reach"
              name="affiliateReach"
              label="How many core users do you serve?"
              placeholder="Select your reach"
              options={REACH_OPTIONS}
              value={values.affiliateReach}
              onChange={onChange}
              required
              invalid={Boolean(errors.affiliateReach)}
            />
            <SelectField
              id="partner-affiliate-shipment"
              name="affiliateShipmentVolume"
              label="What is the monthly shipment volume range for your core users?"
              placeholder="Select shipment volume"
              options={SHIPMENT_OPTIONS}
              value={values.affiliateShipmentVolume}
              onChange={onChange}
              required
              invalid={Boolean(errors.affiliateShipmentVolume)}
            />
          </div>
        ) : null}

        {type === "integration" ? (
          <div className="af-form-section">
            <SectionIntro
              title="Tech Integration"
              help="Tell us what you would like to connect and how the integration could support shared customers."
            />
            <TextField
              id="partner-integration-product"
              name="integrationProduct"
              label="What product or platform would you like to integrate with 17TRACK?"
              placeholder="Enter your product or platform"
              value={values.integrationProduct}
              onChange={onChange}
              required
              invalid={Boolean(errors.integrationProduct)}
              span
            />
            <div
              className="af-form-field af-form-span"
              role="group"
              aria-labelledby="partner-platforms-label"
              aria-invalid={errors.supportedPlatform ? true : undefined}
              aria-describedby={errors.supportedPlatform ? "partner-platforms-error" : undefined}
            >
              <p className="af-form-label" id="partner-platforms-label">
                What platforms do you support?
                <RequiredMark />
              </p>
              <div className="af-form-choices">
                {PLATFORMS.map((platform) => {
                  const checked = values.supportedPlatform.includes(platform);
                  return (
                    <label key={platform} className={checked ? "af-form-choice is-checked" : "af-form-choice"}>
                      <input
                        type="checkbox"
                        name="supportedPlatform"
                        value={platform}
                        checked={checked}
                        onChange={() => onToggle("supportedPlatform", platform)}
                      />
                      <span>{platform}</span>
                    </label>
                  );
                })}
                <div className="af-form-choice af-form-choice-other">
                  <label htmlFor="partner-integration-other-platform">Other</label>
                  <input
                    className="af-form-inline"
                    id="partner-integration-other-platform"
                    name="otherPlatform"
                    type="text"
                    placeholder="Enter platform name, e.g. Wix or Magento"
                    value={values.otherPlatform}
                    onChange={onChange}
                  />
                </div>
              </div>
              {errors.supportedPlatform ? (
                <p className="af-form-error" id="partner-platforms-error" role="alert">
                  {errors.supportedPlatform}
                </p>
              ) : null}
            </div>
            <SelectField
              id="partner-integration-technical"
              name="integrationTechnical"
              label="Do you have a technical team?"
              placeholder="Select an option"
              options={TECHNICAL_OPTIONS}
              value={values.integrationTechnical}
              onChange={onChange}
              required
              invalid={Boolean(errors.integrationTechnical)}
            />
          </div>
        ) : null}

        {type === "comarketing" ? (
          <div className="af-form-section">
            <SectionIntro
              title="Co-marketing"
              help="Share the audience, format, and campaign idea you would like to explore together."
            />
            <SelectField
              id="partner-comarketing-type"
              name="comarketingType"
              label="Co-marketing activity"
              placeholder="Select an activity"
              options={ACTIVITY_OPTIONS}
              value={values.comarketingType}
              onChange={onChange}
              required
              invalid={Boolean(errors.comarketingType)}
            />
            <SelectField
              id="partner-comarketing-timeline"
              name="comarketingTimeline"
              label="Preferred timeline"
              placeholder="Select a timeline"
              options={TIMELINE_OPTIONS}
              value={values.comarketingTimeline}
              onChange={onChange}
              required
              invalid={Boolean(errors.comarketingTimeline)}
            />
            <ChoiceGroup
              id="partner-comarketing-audience"
              label="Who is your primary audience?"
              name="comarketingAudience"
              options={AUDIENCES}
              selected={values.comarketingAudience}
              onToggle={onToggle}
              error={errors.comarketingAudience}
            />
            <TextField
              id="partner-comarketing-proposal"
              name="comarketingProposal"
              label="Campaign idea"
              type="textarea"
              placeholder="Briefly describe your campaign idea"
              value={values.comarketingProposal}
              onChange={onChange}
              required
              invalid={Boolean(errors.comarketingProposal)}
              span
            />
          </div>
        ) : null}

        {type === "other" ? (
          <div className="af-form-section">
            <SectionIntro
              title="Other partnership opportunity"
              help="Share what you would like to explore with 17TRACK, and we will route your request to the right team."
            />
            <TextField
              id="partner-other-details"
              name="otherDetails"
              label="Tell us about your partnership idea"
              type="textarea"
              placeholder="Briefly describe your proposal"
              value={values.otherDetails}
              onChange={onChange}
              required
              invalid={Boolean(errors.otherDetails)}
              span
            />
          </div>
        ) : null}
      </div>

      <label className={errors.consent ? "af-form-consent is-invalid" : "af-form-consent"}>
        <input
          id="partner-consent"
          name="consent"
          type="checkbox"
          checked={values.consent}
          onChange={onChange}
          required
          aria-invalid={errors.consent ? true : undefined}
        />
        <span>
          By submitting this form, you agree to 17TRACK&apos;s{" "}
          <a href="#privacy" onClick={(event) => event.preventDefault()}>
            Privacy Policy
          </a>{" "}
          and applicable{" "}
          <a href="#terms" onClick={(event) => event.preventDefault()}>
            Partnership Terms
          </a>
          {", and consent to receive personalized marketing communications. You can unsubscribe at any time."}
        </span>
      </label>

      <div className="af-form-footer">
        <button className="af-form-submit" type="submit">
          Submit application
        </button>
        {errors.form ? (
          <p className="af-form-error" role="alert">
            {errors.form}
          </p>
        ) : null}
      </div>
    </form>
  );
}
