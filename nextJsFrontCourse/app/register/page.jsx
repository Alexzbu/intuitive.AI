"use client";

import { useState } from "react";
import Link from "next/link";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(formData) {
   const errors = {};

   if (!formData.salutation) errors.salutation = "Please select a title.";
   if (!formData.firstName.trim()) errors.firstName = "First name is required.";
   else if (formData.firstName.trim().length < 2) errors.firstName = "At least 2 characters.";
   if (!formData.lastName.trim()) errors.lastName = "Last name is required.";
   else if (formData.lastName.trim().length < 2) errors.lastName = "At least 2 characters.";
   if (!formData.organization.trim()) errors.organization = "Organization is required.";
   if (!formData.email.trim()) errors.email = "Email is required.";
   else if (!EMAIL_RE.test(formData.email)) errors.email = "Enter a valid email address.";
   if (!formData.position) errors.position = "Please select a position.";
   if (!formData.agreePrivacy) errors.agreePrivacy = "You must agree to the Privacy Policy.";
   if (!formData.agreeTerms) errors.agreeTerms = "You must agree to the Terms & Conditions.";

   return errors;
}

export default function RegisterPage() {
   const [formData, setFormData] = useState({
      salutation: "",
      firstName: "",
      lastName: "",
      organization: "",
      email: "",
      position: "",
      agreePrivacy: false,
      agreeTerms: false,
   });
   const [errors, setErrors] = useState({});
   const [touched, setTouched] = useState({});
   const [loading, setLoading] = useState(false);

   const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      const newData = {
         ...formData,
         [name]: type === "checkbox" ? checked : value,
      };
      setFormData(newData);
      // re-validate only the changed field if it was already touched
      if (touched[name]) {
         const fieldErrors = validate(newData);
         setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
      }
   };

   const handleBlur = (e) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      const fieldErrors = validate(formData);
      setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      // Mark all fields as touched and run full validation
      const allTouched = Object.keys(formData).reduce((acc, k) => ({ ...acc, [k]: true }), {});
      setTouched(allTouched);
      const allErrors = validate(formData);
      setErrors(allErrors);
      if (Object.keys(allErrors).length > 0) return;

      setLoading(true);
      // TODO: connect to registration API
      setLoading(false);
   };

   const fieldClass = (base, name) =>
      `${base}${errors[name] && touched[name] ? ` ${base}--error` : ""}`;

   return (
      <div className="auth-page">
         <div className="auth-page__card">
            <h1 className="auth-page__title">Get Started</h1>

            <form className="auth-page__form" onSubmit={handleSubmit} noValidate>
               {/* Salutation */}
               <div className="auth-page__field">
                  <label className="auth-page__label" htmlFor="salutation">
                     Title
                  </label>
                  <div className="auth-page__select-wrapper">
                     <select
                        className={fieldClass("auth-page__select", "salutation")}
                        id="salutation"
                        name="salutation"
                        value={formData.salutation}
                        onChange={handleChange}
                        onBlur={handleBlur}
                     >
                        <option value="" disabled>
                           Please select
                        </option>
                        <option value="mr">Mr.</option>
                        <option value="ms">Ms.</option>
                        <option value="dr">Dr.</option>
                        <option value="prof">Prof.</option>
                     </select>
                  </div>
                  {touched.salutation && errors.salutation && (
                     <span className="auth-page__error">{errors.salutation}</span>
                  )}
               </div>

               {/* First Name */}
               <div className="auth-page__field">
                  <label className="auth-page__label" htmlFor="firstName">
                     First Name
                  </label>
                  <input
                     className={fieldClass("auth-page__input", "firstName")}
                     type="text"
                     id="firstName"
                     name="firstName"
                     value={formData.firstName}
                     onChange={handleChange}
                     onBlur={handleBlur}
                  />
                  {touched.firstName && errors.firstName && (
                     <span className="auth-page__error">{errors.firstName}</span>
                  )}
               </div>

               {/* Last Name */}
               <div className="auth-page__field">
                  <label className="auth-page__label" htmlFor="lastName">
                     Last Name
                  </label>
                  <input
                     className={fieldClass("auth-page__input", "lastName")}
                     type="text"
                     id="lastName"
                     name="lastName"
                     value={formData.lastName}
                     onChange={handleChange}
                     onBlur={handleBlur}
                  />
                  {touched.lastName && errors.lastName && (
                     <span className="auth-page__error">{errors.lastName}</span>
                  )}
               </div>

               {/* Organization */}
               <div className="auth-page__field">
                  <label className="auth-page__label" htmlFor="organization">
                     Organization
                  </label>
                  <input
                     className={fieldClass("auth-page__input", "organization")}
                     type="text"
                     id="organization"
                     name="organization"
                     value={formData.organization}
                     onChange={handleChange}
                     onBlur={handleBlur}
                  />
                  {touched.organization && errors.organization && (
                     <span className="auth-page__error">{errors.organization}</span>
                  )}
               </div>

               {/* Email */}
               <div className="auth-page__field">
                  <label className="auth-page__label" htmlFor="email">
                     Email
                  </label>
                  <input
                     className={fieldClass("auth-page__input", "email")}
                     type="email"
                     id="email"
                     name="email"
                     value={formData.email}
                     onChange={handleChange}
                     onBlur={handleBlur}
                  />
                  {touched.email && errors.email && (
                     <span className="auth-page__error">{errors.email}</span>
                  )}
               </div>

               {/* Position */}
               <div className="auth-page__field">
                  <label className="auth-page__label" htmlFor="position">
                     Position
                  </label>
                  <div className="auth-page__select-wrapper">
                     <select
                        className={fieldClass("auth-page__select", "position")}
                        id="position"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        onBlur={handleBlur}
                     >
                        <option value="" disabled>
                           Please select
                        </option>
                        <option value="student">Student</option>
                        <option value="employee">Employee</option>
                        <option value="manager">Trainer</option>
                        <option value="director">Director</option>
                        <option value="other">Other</option>
                     </select>
                  </div>
                  {touched.position && errors.position && (
                     <span className="auth-page__error">{errors.position}</span>
                  )}
               </div>

               {/* Agreements */}
               <div className="auth-page__checkboxes">
                  <div>
                     <label className="auth-page__checkbox-label">
                        <input
                           type="checkbox"
                           name="agreePrivacy"
                           checked={formData.agreePrivacy}
                           onChange={handleChange}
                           onBlur={handleBlur}
                        />
                        I agree to the{" "}
                        <Link href="/privacy" className="auth-page__link">
                           Privacy Policy
                        </Link>
                     </label>
                     {touched.agreePrivacy && errors.agreePrivacy && (
                        <span className="auth-page__error">{errors.agreePrivacy}</span>
                     )}
                  </div>
                  <div>
                     <label className="auth-page__checkbox-label">
                        <input
                           type="checkbox"
                           name="agreeTerms"
                           checked={formData.agreeTerms}
                           onChange={handleChange}
                           onBlur={handleBlur}
                        />
                        I agree to the{" "}
                        <Link href="/terms" className="auth-page__link">
                           Terms &amp; Conditions
                        </Link>
                     </label>
                     {touched.agreeTerms && errors.agreeTerms && (
                        <span className="auth-page__error">{errors.agreeTerms}</span>
                     )}
                  </div>
               </div>

               <button
                  type="submit"
                  className="auth-page__submit"
                  disabled={loading}
               >
                  {loading ? "Registering..." : "Register"}
               </button>
            </form>
         </div>
      </div>
   );
}
