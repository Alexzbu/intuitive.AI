import Link from "next/link";

export function LoginForm({
  register,
  handleSubmit,
  errors,
  isSubmitting,
  onSubmit,
  showPassword,
  togglePassword,
}) {
  return (
    <form className="auth-page__form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Username */}
      <div className="auth-page__field">
        <label className="auth-page__label" htmlFor="username">
          Username
        </label>
        <input
          className={`auth-page__input${errors.username ? " auth-page__input--error" : ""}`}
          type="text"
          id="username"
          {...register("username")}
        />
        {errors.username && (
          <span className="auth-page__error">{errors.username.message}</span>
        )}
      </div>

      {/* Password */}
      <div className="auth-page__field">
        <label className="auth-page__label" htmlFor="password">
          Password
        </label>
        <div className="auth-page__password-wrapper">
          <input
            className={`auth-page__input${errors.password ? " auth-page__input--error" : ""}`}
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

      <Link href="/forgot-password" className="auth-page__forgot-link">
        Forgot password?
      </Link>

      <button
        type="submit"
        className="auth-page__submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>

      <div className="auth-page__form-footer">
        <span>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="auth-page__link">
            Sign Up
          </Link>
        </span>
      </div>
    </form>
  );
}
