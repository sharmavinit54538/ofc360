import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { cn as useofc360 } from "./ofc360-store-Dm5opMS0.mjs";
import { t as api } from "./client-DZR8fCuj.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Cn as FileCheck, Nt as LoaderCircle, Qn as CircleCheck, Rn as Coins, Sr as Building2, _r as CalendarDays, gn as FileText, jn as Download, nt as Printer, ut as Percent } from "../_libs/lucide-react.mjs";
import { r as PageHeader } from "./DashboardShell-BxC1t09N.mjs";
import { t as Button } from "./button-BKVZsq8w.mjs";
import { t as Badge } from "./badge-CIlo-S9O.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/EmployeePayslips-CnJz1dnC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function numberToIndianWords(amount) {
	if (isNaN(amount) || amount <= 0) return "Rupees Zero Only";
	const num = Math.floor(amount);
	if (num === 0) return "Rupees Zero Only";
	const ones = [
		"",
		"One",
		"Two",
		"Three",
		"Four",
		"Five",
		"Six",
		"Seven",
		"Eight",
		"Nine",
		"Ten",
		"Eleven",
		"Twelve",
		"Thirteen",
		"Fourteen",
		"Fifteen",
		"Sixteen",
		"Seventeen",
		"Eighteen",
		"Nineteen"
	];
	const tens = [
		"",
		"",
		"Twenty",
		"Thirty",
		"Forty",
		"Fifty",
		"Sixty",
		"Seventy",
		"Eighty",
		"Ninety"
	];
	function convertGroup(n) {
		let str = "";
		if (n >= 100) {
			str += ones[Math.floor(n / 100)] + " Hundred ";
			n %= 100;
		}
		if (n >= 20) str += tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
		else if (n > 0) str += ones[n];
		return str.trim();
	}
	let crore = Math.floor(num / 1e7);
	let rem = num % 1e7;
	let lakh = Math.floor(rem / 1e5);
	rem %= 1e5;
	let thousand = Math.floor(rem / 1e3);
	rem %= 1e3;
	let result = "";
	if (crore > 0) result += convertGroup(crore) + " Crore ";
	if (lakh > 0) result += convertGroup(lakh) + " Lakh ";
	if (thousand > 0) result += convertGroup(thousand) + " Thousand ";
	if (rem > 0) result += convertGroup(rem);
	const trimmed = result.trim();
	return trimmed ? `Rupees ${trimmed} Only` : "Rupees Zero Only";
}
function fmtINR(amount) {
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: 0
	}).format(amount);
}
function parseMonthResponse(data) {
	const rawList = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : Array.isArray(data?.months) ? data.months : [];
	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	];
	return rawList.map((item) => {
		if (typeof item === "string") {
			const parts = item.trim().split(/\s+/);
			if (parts.length >= 2) return {
				month: parts[0],
				year: parts[1]
			};
			return null;
		}
		if (item && typeof item === "object") {
			let m = item.month ?? item.monthName ?? item.name;
			let y = item.year;
			if (typeof m === "number" && m >= 1 && m <= 12) m = monthNames[m - 1];
			if (m && y) return {
				month: String(m),
				year: String(y)
			};
		}
		return null;
	}).filter((item) => item !== null);
}
function EmployeePayslipsPage() {
	const ws = useofc360();
	const [months, setMonths] = (0, import_react.useState)([]);
	const [selectedMonth, setSelectedMonth] = (0, import_react.useState)(null);
	const [activeSlip, setActiveSlip] = (0, import_react.useState)(null);
	const [isLoadingMonths, setIsLoadingMonths] = (0, import_react.useState)(true);
	const [isLoadingSlip, setIsLoadingSlip] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let isMounted = true;
		async function fetchMonths() {
			setIsLoadingMonths(true);
			try {
				const formattedMonths = parseMonthResponse(await api.get("payroll/payslips/me/months"));
				if (isMounted) {
					setMonths(formattedMonths);
					if (formattedMonths.length > 0) setSelectedMonth(formattedMonths[0]);
					else {
						setSelectedMonth(null);
						setActiveSlip(null);
					}
				}
			} catch (err) {
				if (isMounted) {
					setMonths([]);
					setSelectedMonth(null);
					setActiveSlip(null);
					toast.error(err?.message || "Failed to load payslip data.");
				}
			} finally {
				if (isMounted) setIsLoadingMonths(false);
			}
		}
		fetchMonths();
		return () => {
			isMounted = false;
		};
	}, [ws.user?.id]);
	(0, import_react.useEffect)(() => {
		if (!selectedMonth) {
			setActiveSlip(null);
			return;
		}
		const currentMonth = selectedMonth;
		let isMounted = true;
		async function fetchPayslip() {
			setIsLoadingSlip(true);
			try {
				const res = await api.get(`payroll/payslips/me?month=${encodeURIComponent(currentMonth.month)}&year=${encodeURIComponent(currentMonth.year)}`);
				const rawData = res?.data ?? res;
				if (isMounted) if (rawData && typeof rawData === "object" && Object.keys(rawData).length > 0) setActiveSlip({
					month: String(rawData.month || currentMonth.month),
					year: String(rawData.year || currentMonth.year),
					payDate: rawData.payDate || rawData.pay_date || rawData.paidAt || rawData.paid_on || "",
					basic: Number(rawData.basic ?? rawData.basicSalary ?? rawData.basic_salary ?? 0),
					hra: Number(rawData.hra ?? rawData.houseRentAllowance ?? rawData.house_rent_allowance ?? 0),
					specialAllowance: Number(rawData.specialAllowance ?? rawData.special_allowance ?? 0),
					conveyance: Number(rawData.conveyance ?? rawData.conveyanceAllowance ?? rawData.conveyance_allowance ?? 0),
					pfDeduction: Number(rawData.pfDeduction ?? rawData.pf_deduction ?? rawData.pf ?? 0),
					ptDeduction: Number(rawData.ptDeduction ?? rawData.pt_deduction ?? rawData.pt ?? 0),
					tdsDeduction: Number(rawData.tdsDeduction ?? rawData.tds_deduction ?? rawData.tds ?? rawData.taxDeduction ?? 0),
					netPay: Number(rawData.netPay ?? rawData.net_pay ?? rawData.netSalary ?? rawData.net_salary ?? 0),
					bankAccountMasked: rawData.bankAccountMasked || rawData.bank_account_masked || rawData.bankAccount || rawData.bank_account || "",
					taxRegime: rawData.taxRegime || rawData.tax_regime || ""
				});
				else setActiveSlip(null);
			} catch (err) {
				if (isMounted) {
					setActiveSlip(null);
					toast.error(err?.message || "Failed to load payslip data.");
				}
			} finally {
				if (isMounted) setIsLoadingSlip(false);
			}
		}
		fetchPayslip();
		return () => {
			isMounted = false;
		};
	}, [selectedMonth, ws.user?.id]);
	const grossEarnings = activeSlip ? activeSlip.basic + activeSlip.hra + activeSlip.specialAllowance + activeSlip.conveyance : 0;
	const totalDeductions = activeSlip ? activeSlip.pfDeduction + activeSlip.ptDeduction + activeSlip.tdsDeduction : 0;
	const employeeName = ws.user?.fullName || "Employee";
	const companyName = ws.company?.name || "ofc360 Technologies Pvt Ltd";
	const userRole = ws.user?.role || "—";
	const bankAccount = activeSlip?.bankAccountMasked || "—";
	const taxRegime = activeSlip?.taxRegime || "—";
	const handleDownloadPDF = () => {
		if (!activeSlip) return;
		toast.success(`Downloading Payslip for ${activeSlip.month} ${activeSlip.year}...`);
		window.print();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "My Salary & Payslips",
				description: "View monthly salary statements, statutory breakdowns, tax declarations, and Form 16."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card/60 p-3 backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2 overflow-x-auto",
					children: isLoadingMonths ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-xs text-muted-foreground px-2 py-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }), " Loading periods..."]
					}) : months.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground px-2 py-1",
						children: "No periods available"
					}) : months.map((m) => {
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSelectedMonth(m),
							className: `flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${selectedMonth?.month === m.month && selectedMonth?.year === m.year ? "bg-indigo-600 text-white shadow-md" : "border border-border bg-background/50 text-muted-foreground hover:text-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								m.month,
								" ",
								m.year
							] })]
						}, `${m.month}-${m.year}`);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: handleDownloadPDF,
						variant: "outline",
						size: "sm",
						disabled: !activeSlip,
						className: "h-9 gap-1.5 text-xs font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "h-3.5 w-3.5" }), " Print / Save PDF"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: handleDownloadPDF,
						size: "sm",
						disabled: !activeSlip,
						className: "h-9 gap-1.5 bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), " Download Payslip"]
					})]
				})]
			}),
			isLoadingSlip || isLoadingMonths ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-border bg-card/80 p-6 shadow-xl backdrop-blur-2xl animate-pulse space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between items-start border-b border-border/80 pb-6 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-48 bg-muted rounded-md" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-32 bg-muted rounded-md" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-28 bg-muted rounded-md" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-background/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 bg-muted rounded-md" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 bg-muted rounded-md" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 bg-muted rounded-md" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 bg-muted rounded-md" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-44 bg-muted/40 rounded-2xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-44 bg-muted/40 rounded-2xl" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-20 bg-muted/40 rounded-2xl" })
				]
			}) : !activeSlip ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-border bg-card/80 p-12 shadow-xl backdrop-blur-2xl text-center space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-10 w-10 text-muted-foreground/40 mx-auto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-muted-foreground",
					children: "No payslip available for this period yet"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-border bg-card/80 p-6 shadow-xl backdrop-blur-2xl space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-start justify-between border-b border-border/80 pb-6 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-6 w-6 text-indigo-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-xl font-extrabold tracking-tight text-foreground",
									children: companyName
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									"Salary Slip for the month of",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-bold text-foreground",
										children: [
											activeSlip.month,
											" ",
											activeSlip.year
										]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 font-bold px-3 py-1 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-1 h-3.5 w-3.5 text-emerald-500" }),
									" ",
									activeSlip.payDate ? `PAID ON ${activeSlip.payDate}` : "PAID"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1.5 text-xs text-muted-foreground",
								children: [
									"Payment Method:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-medium text-foreground",
										children: "Direct Bank Transfer"
									})
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-2xl border border-border/60 bg-background/40 p-4 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-muted-foreground uppercase font-semibold block",
								children: "Employee Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-foreground",
								children: employeeName
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-muted-foreground uppercase font-semibold block",
								children: "Designation"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground capitalize",
								children: userRole
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-muted-foreground uppercase font-semibold block",
								children: "Bank Account"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono font-semibold text-foreground",
								children: bankAccount
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-muted-foreground uppercase font-semibold block",
								children: "Tax Regime"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-indigo-400",
								children: taxRegime
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-bold text-emerald-500 text-sm flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Earnings" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Amount" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 text-xs divide-y divide-border/40",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-2 flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Basic Salary"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-semibold text-foreground",
											children: fmtINR(activeSlip.basic)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-2 flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "House Rent Allowance (HRA)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-semibold text-foreground",
											children: fmtINR(activeSlip.hra)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-2 flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Special Allowance"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-semibold text-foreground",
											children: fmtINR(activeSlip.specialAllowance)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-2 flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Conveyance Allowance"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-semibold text-foreground",
											children: fmtINR(activeSlip.conveyance)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-3 flex justify-between font-bold text-sm text-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Gross Earnings" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-emerald-500",
											children: fmtINR(grossEarnings)
										})]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-bold text-rose-500 text-sm flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Statutory Deductions" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Amount" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 text-xs divide-y divide-border/40",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-2 flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Provident Fund (Employee PF)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-semibold text-foreground",
											children: fmtINR(activeSlip.pfDeduction)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-2 flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Professional Tax (PT)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-semibold text-foreground",
											children: fmtINR(activeSlip.ptDeduction)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-2 flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Income Tax (TDS)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-semibold text-foreground",
											children: fmtINR(activeSlip.tdsDeduction)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-3 flex justify-between font-bold text-sm text-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Deductions" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-rose-500",
											children: fmtINR(totalDeductions)
										})]
									})
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-emerald-900/40 border border-indigo-500/30 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs uppercase font-bold text-indigo-300 tracking-wider block",
								children: "Net Take-Home Salary"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-2xl font-black text-foreground font-mono",
								children: fmtINR(activeSlip.netPay)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground mt-0.5",
								children: numberToIndianWords(activeSlip.netPay)
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: handleDownloadPDF,
							className: "bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 h-10 gap-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), " Download PDF Slip"]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 space-y-2 backdrop-blur-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-indigo-400 font-bold text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Percent, { className: "h-4 w-4" }), " Tax Regime & Exemptions"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: ["Active Regime: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: taxRegime
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								className: "w-full text-xs h-8 mt-2",
								children: "View Tax Computation"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 space-y-2 backdrop-blur-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-emerald-400 font-bold text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck, { className: "h-4 w-4" }), " Form 16 Tax Certificate"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Available for FY 2025-26 & FY 2024-25"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								className: "w-full text-xs h-8 mt-2",
								onClick: () => toast.info("Form 16 PDF requested"),
								children: "Download Form 16"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 space-y-2 backdrop-blur-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-amber-400 font-bold text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "h-4 w-4" }), " Provident Fund (PF) & UAN"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: ["UAN Status: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-emerald-500",
									children: "Verified & Active"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								className: "w-full text-xs h-8 mt-2",
								onClick: () => toast.info("Redirecting to EPFO portal"),
								children: "EPFO Passbook Portal"
							})
						]
					})
				]
			})
		]
	});
}
//#endregion
export { EmployeePayslipsPage as t };
