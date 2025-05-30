import { Send, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState, FormEvent } from "react";
import Spinner from "./spinner"; 

const primaryColorTextClass = "text-[#143c80]";
const primaryColorBorderClass = "border-[#143c80]";
const primaryColorBgClass = "bg-[#143c80]";
const accentColorTextClass = "text-[#0d2d62]";
const accentColorBgClass = "bg-[#0d2d62]";
const secondaryTextColorClass = "text-[#143c80]/80";
const lightBorderColorClass = "border-[#143c80]/20";


export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setStatusMessage("");
    console.log("Form data:", { name, email, subject, message });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus("idle");
    alert("Отправка формы в разработке. Пожалуйста, используйте email, указанный на странице контактов.");
  };

  const inputBaseClasses = `w-full p-3 bg-white ${primaryColorTextClass} rounded-lg border ${lightBorderColorClass} focus:ring-2 focus:ring-[#0d2d62] focus:border-[#0d2d62] outline-none placeholder:text-[#143c80]/50 transition-colors`;
  const labelBaseClasses = `block text-sm font-medium ${primaryColorTextClass} mb-1.5`;
  const buttonClasses = `inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg shadow-md ${primaryColorBgClass} text-white hover:${accentColorBgClass} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-[#0d2d62] transition-all duration-300 group hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed`;

  return (
    <div className={`bg-white p-6 sm:p-8 rounded-xl shadow-2xl border ${lightBorderColorClass}`}>
      <div className="flex items-center mb-6">
        <Send size={32} className={`mr-3 ${accentColorTextClass}`} />
        <h2 className={`text-2xl sm:text-3xl font-bold ${accentColorTextClass}`}>
          Написать Нам
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className={labelBaseClasses}>Ваше имя</label>
          <input
            type="text" name="name" id="name" required value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputBaseClasses}
            placeholder="Иван Иванов"
            disabled={status === "submitting"}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelBaseClasses}>Ваш Email</label>
          <input
            type="email" name="email" id="email" required value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputBaseClasses}
            placeholder="you@example.com"
            disabled={status === "submitting"}
          />
        </div>
        <div>
          <label htmlFor="subject" className={labelBaseClasses}>Тема сообщения</label>
          <input
            type="text" name="subject" id="subject" required value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={inputBaseClasses}
            placeholder="Предложение о сотрудничестве"
            disabled={status === "submitting"}
          />
        </div>
        <div>
          <label htmlFor="message" className={labelBaseClasses}>Сообщение</label>
          <textarea
            name="message" id="message" rows={5} required value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={inputBaseClasses}
            placeholder="Ваше сообщение..."
            disabled={status === "submitting"}
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            className={`${buttonClasses} w-full sm:w-auto min-h-[50px]`}
            disabled={status === "submitting"}
          >
            {status === "submitting" ? (
              <Spinner text="Отправка..." size="small" />
            ) : (
              <>
                Отправить сообщение
                <Send size={18} className="ml-2.5 group-hover:translate-x-1 transition-transform"/>
              </>
            )}
          </button>
        </div>
        {statusMessage && (
          <div
            className={`flex items-start text-sm mt-4 p-3 rounded-md border ${
              status === "success"
                ? "bg-green-50 border-green-300 text-green-700"
                : "bg-red-50 border-red-300 text-red-700"
            }`}
          >
            {status === "success" ? (
                <CheckCircle2 size={20} className="mr-2 flex-shrink-0 text-green-500" />
            ) : (
                <AlertCircle size={20} className="mr-2 flex-shrink-0 text-red-500" />
            )}
            {statusMessage}
          </div>
        )}
      </form>
    </div>
  );
}
