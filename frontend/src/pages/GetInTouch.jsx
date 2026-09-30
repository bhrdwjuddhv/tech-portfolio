import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { Link } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import { api } from "@/lib/api";
import { site, contactSubjects } from "@/data/site";
const ValidationSchema = Yup.object({
  name: Yup.string()
    .required("Required")
    .min(2, "Name must be at least 2 characters"),
  email: Yup.string()
    .required("Email required")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"),
  phone: Yup.string()
    .min(5, "Invalid phone number")
    .max(15, "Invalid phone number"),
  interested: Yup.string().required("Please select a subject"),
  message: Yup.string().required("Message is required").min(5, "Too short"),
});
const playPopSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // First oscillator: base sine sweep
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(280, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(840, ctx.currentTime + 0.08);

    gain1.gain.setValueAtTime(0, ctx.currentTime);
    gain1.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    // Second oscillator: triangle chime harmony
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(560, ctx.currentTime + 0.02);
    osc2.frequency.exponentialRampToValueAtTime(1120, ctx.currentTime + 0.1);

    gain2.gain.setValueAtTime(0, ctx.currentTime + 0.02);
    gain2.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.04);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc1.start();
    osc2.start(ctx.currentTime + 0.02);

    osc1.stop(ctx.currentTime + 0.13);
    osc2.stop(ctx.currentTime + 0.15);
  } catch (e) {
    console.warn("Audio Context playback failed:", e);
  }
};

const GetInTouch = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [shakingFields, setShakingFields] = useState({});

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      interested: "web",
      message: "",
    },
    validationSchema: ValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await api("/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        resetForm();
        setIsSubmitted(true);
        playPopSound();
        toast.success("Message sent successfully!");
      } catch (error) {
        toast.error(
          error.message || "Failed to send message. Please try again.",
        );
      } finally {
        setSubmitting(false);
      }
    },
  });
  const prevErrors = useRef(formik.errors);
  useEffect(() => {
    const newShaking = {};
    let shouldShake = false;
    Object.keys(formik.errors).forEach((key) => {
      const errorKey = key;
      // If it was not in error state before, but now has an error, trigger shake
      if (!prevErrors.current[errorKey] && formik.errors[errorKey]) {
        newShaking[key] = true;
        shouldShake = true;
      }
    });
    if (shouldShake) {
      setShakingFields((prev) => ({ ...prev, ...newShaking }));
      const timer = setTimeout(() => {
        setShakingFields((prev) => {
          const updated = { ...prev };
          Object.keys(newShaking).forEach((key) => {
            delete updated[key];
          });
          return updated;
        });
      }, 280);
      return () => clearTimeout(timer);
    }
    prevErrors.current = formik.errors;
  }, [formik.errors]);

  // Trigger shake for all currently invalid fields on submit attempt block
  useEffect(() => {
    if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
      const newShaking = {};
      Object.keys(formik.errors).forEach((key) => {
        newShaking[key] = true;
      });
      setShakingFields(newShaking);
      const timer = setTimeout(() => {
        setShakingFields({});
      }, 280);
      return () => clearTimeout(timer);
    }
  }, [formik.submitCount]);

  return (
    <>
      <div className="w-full overflow-hidden min-h-screen bg-white dark:bg-black transition-colors duration-300">
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <div className="flex items-center justify-center max-w-2xl mx-auto  -x  -zinc-200 dark: -zinc-800">
          <section className="h-full flex items-center justify-center mx-auto relative py-20">
            <p className="absolute font-extrabold text-7xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-200 dark:text-zinc-900">
              FAAHHHHHHH
            </p>
            <div className="dark:bg-neutral-400 rounded-full w-80 bg-yellow-200 left-1/2 -translate-x-1/2 h-4 absolute top-22" />
            <div
              className="mx-auto relative overflow-hidden py-8 lg:px-16 md:px-14 px-4 max-w-195
            bg-white/10 dark:bg-black/20
             -y  -zinc-200 dark: -zinc-800
            backdrop-blur-3xl"
            >
              {/* Corners */}
              <div className="w-2 h-2 bg-zinc-300 dark:bg-neutral-500    -zinc-400  -400 top-0 left-0 absolute" />
              <div className="w-2 h-2 bg-zinc-300 dark:bg-neutral-500    -zinc-400  -400 top-0 right-0 absolute" />
              <div className="w-2 h-2 bg-zinc-300 dark:bg-neutral-500    -zinc-400  -400 bottom-0 left-0 absolute" />
              <div className="w-2 h-2 bg-zinc-300 dark:bg-neutral-500    -zinc-400  -400 bottom-0 right-0 absolute" />
              {/* Glow */}
              <div className="w-30 h-30 bg-black/5 dark:bg-white/20 -left-10 -top-20 blur-3xl absolute" />
              <div className="w-30 h-30 bg-black/5 dark:bg-white/20 -right-10 -bottom-20 blur-3xl absolute" />

              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center t-success-pop">
                  <span
                    className="t-success-check mb-6"
                    data-state="in"
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      className="w-16 h-16 stroke-emerald-500 animate-in"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    >
                      <path d="M4 11l3.5 3.5L16 6" />
                    </svg>
                  </span>
                  <h2 className="mb-2 font-Neue text-3xl font-semibold text-black dark:text-white">
                    Message Sent!
                  </h2>
                  <p className="mb-8 text-sm font-sans text-zinc-600 dark:text-zinc-500 max-w-sm">
                    Thank you for reaching out. {site.name} has received your
                    message and will get back to you shortly.
                  </p>
                  <div className="flex gap-4">
                    <button
                      aria-label="send-again-message"
                      onClick={() => setIsSubmitted(false)}
                      className="px-5 py-2.5 rounded-xl    -zinc-300  -700 bg-white dark:bg-neutral-900 text-zinc-700 dark:text-neutral-300 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-neutral-800 transition duration-150 cursor-pointer"
                    >
                      Send Another
                    </button>
                    <Link to="/">
                      <button
                        aria-label="go-back-home"
                        className="px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-neutral-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-neutral-200 transition duration-150 cursor-pointer"
                      >
                        Go Back Home
                      </button>
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  {/* Heading */}
                  <div className="flex items-center justify-between">
                    <Link to={"/"}>
                      <div className="text-neutral-700 hover:dark:bg-neutral-900 hover: -800 rounded-md    -transparent hover:  hover:bg-neutral-50">
                        <HugeiconsIcon icon={ArrowLeft01Icon} />
                      </div>
                    </Link>
                    <h2 className="mb-1 font-Neue text-center text-4xl font-semibold leading-[0.92] text-black dark:text-white">
                      Get In Touch.
                    </h2>
                  </div>
                  <p className="mb-8 mt-4 text-base font-sans text-center text-zinc-600 dark:text-zinc-500">
                    Available for freelance projects, collaborations, and
                    full-time opportunities
                  </p>
                  <form
                    onSubmit={formik.handleSubmit}
                    className="flex flex-col"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans">
                      <InputField
                        label="Name"
                        placeholder="Your name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.name ? formik.errors.name : undefined
                        }
                        isShaking={shakingFields.name}
                        classNameLabel="after:content-['*']"
                      />

                      <InputField
                        label="Email"
                        placeholder="email@example.com"
                        name="email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.email ? formik.errors.email : undefined
                        }
                        isShaking={shakingFields.email}
                        classNameLabel="after:content-['*']"
                      />

                      <InputField
                        label="Phone"
                        placeholder="Phone No"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.phone ? formik.errors.phone : undefined
                        }
                        isShaking={shakingFields.phone}
                      />

                      {/* Select */}
                      <div
                        className={`t-input-wrap ${formik.touched.interested && formik.errors.interested ? "is-error" : ""}`}
                      >
                        <label className="text-[11px] after:content-['*'] font-bold uppercase tracking-[2px] text-zinc-500">
                          Interested In
                        </label>

                        <select
                          name="interested"
                          value={formik.values.interested}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`mt-2.5 mb-5 w-full rounded-xl   t-input px-4 py-3.5 text-[15px] text-black dark:text-neutral-300 outline-none focus: -neutral-400 ${
                            formik.touched.interested &&
                            formik.errors.interested
                              ? `is-error  -red-500 dark: -red-900 bg-red-50/10 dark:bg-red-950/10 ${shakingFields.interested ? "is-shaking" : ""}`
                              : " -zinc-300 dark: -zinc-800 bg-zinc-100 dark:bg-[#0f0f0f]"
                          }`}
                        >
                          <option value="">Select a subject</option>
                          {contactSubjects.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                        <div
                          className={`t-error-msg ${formik.touched.interested && formik.errors.interested ? "-mt-3 mb-4" : ""}`}
                        >
                          {formik.touched.interested &&
                            formik.errors.interested && (
                              <p className="text-red-500 font-sans text-xs">
                                {formik.errors.interested}
                              </p>
                            )}
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div
                      className={`t-input-wrap ${formik.touched.message && formik.errors.message ? "is-error" : ""}`}
                    >
                      <label className="text-[11px] after:content-['*'] font-sans font-bold uppercase tracking-[2px] text-zinc-500">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formik.values.message}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Type your message here."
                        rows={6}
                        className={`mt-2.5 w-full  rounded-xl   t-input px-4 py-3.5 text-[15px] text-black dark:text-white outline-none transition placeholder:text-zinc-500 dark:placeholder:text-zinc-600 focus: -neutral-400 resize-none font-mono ${
                          formik.touched.message && formik.errors.message
                            ? `is-error  -red-500 dark: -red-900 bg-red-50/10 dark:bg-red-950/10 ${shakingFields.message ? "is-shaking" : ""}`
                            : " -zinc-300 dark: -zinc-800 bg-zinc-100 dark:bg-[#0f0f0f]"
                        }`}
                      />
                      <div
                        className={`t-error-msg ${formik.touched.message && formik.errors.message ? "mt-1" : ""}`}
                      >
                        {formik.touched.message && formik.errors.message && (
                          <p className="text-red-500 font-sans text-xs">
                            {formik.errors.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Button */}
                    <button
                      aria-label="formik-btn"
                      type="submit"
                      disabled={
                        !formik.isValid || !formik.dirty || formik.isSubmitting
                      }
                      className={`group 
                          mt-5 px-6 relative rounded-xl py-2 overflow-hidden
                          transition duration-200
                          hover:bg-zinc-100 dark:hover:bg-zinc-900  
                    ${
                      !formik.isValid || !formik.dirty
                        ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 cursor-not-allowed"
                        : "text-neutral-800 dark:text-white    -zinc-300  -700 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    }`}
                    >
                      <div className="absolute w-10  h-30 -top-5 -translate-x-26 group-hover:translate-x-26 bg-white blur-xl -rotate-12 transition duration-500" />
                      {formik.isSubmitting ? "Sending..." : <>Send</>}
                    </button>
                  </form>
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
export default GetInTouch;

const InputField = ({
  label,
  placeholder,
  onChange,
  onBlur,
  value,
  name,
  type = "text",
  classNameLabel = "",
  error,
  isShaking,
}) => {
  return (
    <div className={`t-input-wrap ${error ? "is-error" : ""}`}>
      <label
        className={`text-[11px] after:text-sm font-bold uppercase tracking-[2px] text-zinc-500 ${classNameLabel}`}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`mt-2.5 mb-5 w-full rounded-xl   t-input
        px-4 py-3.5 text-[15px]
        text-black dark:text-white
        outline-none transition
        placeholder:text-zinc-500 dark:placeholder:text-zinc-600
        focus: -neutral-400 font-mono ${
          error
            ? `is-error  -red-500 dark: -red-900 bg-red-50/10 dark:bg-red-950/10 ${isShaking ? "is-shaking" : ""}`
            : " -zinc-300 dark: -zinc-800 bg-zinc-100 dark:bg-[#0f0f0f]"
        }`}
      />
      <div className={`t-error-msg ${error ? "-mt-3 mb-4" : ""}`}>
        {error && <p className="text-red-500 text-xs font-sans">{error}</p>}
      </div>
    </div>
  );
};
