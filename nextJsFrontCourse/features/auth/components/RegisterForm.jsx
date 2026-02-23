import Link from "next/link";

export function RegisterForm({ register, handleSubmit, errors, isSubmitting, onSubmit, showPassword, togglePassword }) {
  const inputClass = (name) =>
    `auth-page__input${errors[name] ? " auth-page__input--error" : ""}`;

  const selectClass = (name) =>
    `auth-page__select${errors[name] ? " auth-page__select--error" : ""}`;

  return (
    <form className="auth-page__form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Salutation */}
      <div className="auth-page__field">
        <label className="auth-page__label" htmlFor="salutation">
          Title
        </label>
        <div className="auth-page__select-wrapper">
          <select
            className={selectClass("salutation")}
            id="salutation"
            {...register("salutation")}
          >
            <option value="">Please select</option>
            <option value="mr">Mr.</option>
            <option value="ms">Ms.</option>
            <option value="dr">Dr.</option>
            <option value="prof">Prof.</option>
          </select>
        </div>
        {errors.salutation && (
          <span className="auth-page__error">{errors.salutation.message}</span>
        )}
      </div>

      {/* First Name */}
      <div className="auth-page__field">
        <label className="auth-page__label" htmlFor="firstName">
          First Name
        </label>
        <input
          className={inputClass("firstName")}
          type="text"
          id="firstName"
          {...register("firstName")}
        />
        {errors.firstName && (
          <span className="auth-page__error">{errors.firstName.message}</span>
        )}
      </div>

      {/* Last Name */}
      <div className="auth-page__field">
        <label className="auth-page__label" htmlFor="lastName">
          Last Name
        </label>
        <input
          className={inputClass("lastName")}
          type="text"
          id="lastName"
          {...register("lastName")}
        />
        {errors.lastName && (
          <span className="auth-page__error">{errors.lastName.message}</span>
        )}
      </div>

      {/* Organization */}
      <div className="auth-page__field">
        <label className="auth-page__label" htmlFor="organization">
          Organization
        </label>
        <input
          className={inputClass("organization")}
          type="text"
          id="organization"
          {...register("organization")}
        />
        {errors.organization && (
          <span className="auth-page__error">{errors.organization.message}</span>
        )}
      </div>

      {/* Email */}
      <div className="auth-page__field">
        <label className="auth-page__label" htmlFor="email">
          Email
        </label>
        <input
          className={inputClass("email")}
          type="email"
          id="email"
          {...register("email")}
        />
        {errors.email && (
          <span className="auth-page__error">{errors.email.message}</span>
        )}
      </div>

      {/* Password */}
      <div className="auth-page__field">
        <label className="auth-page__label" htmlFor="password">
          Password
        </label>
        <div className="auth-page__password-wrapper">
          <input
            className={inputClass("password")}
            type={showPassword ? "text" : "password"}
            id="password"
            {...register("password")}
          />
          <button
            type="button"
            className="auth-page__eye-btn"
            onClick={togglePassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        </div>
        {errors.password && (
          <span className="auth-page__error">{errors.password.message}</span>
        )}
      </div>

      {/* Position */}
      <div className="auth-page__field">
        <label className="auth-page__label" htmlFor="position">
          Position
        </label>
        <div className="auth-page__select-wrapper">
          <select
            className={selectClass("position")}
            id="position"
            {...register("position")}
          >
            <option value="">Please select</option>
            <option value="student">Student</option>
            <option value="employee">Employee</option>
            <option value="manager">Trainer</option>
            <option value="director">Director</option>
            <option value="other">Other</option>
          </select>
        </div>
        {errors.position && (
          <span className="auth-page__error">{errors.position.message}</span>
        )}
      </div>

      {/* Agreements */}
      <div className="auth-page__checkboxes">
        <div>
          <label className="auth-page__checkbox-label">
            <input type="checkbox" {...register("agreePrivacy")} />
            I agree to the{" "}
            <Link href="/privacy" className="auth-page__link">
              Privacy Policy
            </Link>
          </label>
          {errors.agreePrivacy && (
            <span className="auth-page__error">{errors.agreePrivacy.message}</span>
          )}
        </div>
        <div>
          <label className="auth-page__checkbox-label">
            <input type="checkbox" {...register("agreeTerms")} />
            I agree to the{" "}
            <Link href="/terms" className="auth-page__link">
              Terms &amp; Conditions
            </Link>
          </label>
          {errors.agreeTerms && (
            <span className="auth-page__error">{errors.agreeTerms.message}</span>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="auth-page__submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
