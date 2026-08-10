import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { $n as CircleCheckBig, H as ShieldAlert, L as Sparkles, Un as Clock, et as RefreshCw, jr as Ban, n as Zap } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BFyKr2aS.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { t as superAdminApi } from "./superAdminApi-BvPFpOrt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AdminActionModals-BA3L7WW5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GrantAccessModal({ open, onOpenChange, org, onSuccess }) {
	const [plan, setPlan] = (0, import_react.useState)("Enterprise");
	const [accessType, setAccessType] = (0, import_react.useState)("Complimentary");
	const [duration, setDuration] = (0, import_react.useState)("30 days");
	const [customExpiryDate, setCustomExpiryDate] = (0, import_react.useState)("");
	const [reason, setReason] = (0, import_react.useState)("");
	const [internalNote, setInternalNote] = (0, import_react.useState)("");
	const [confirmed, setConfirmed] = (0, import_react.useState)(false);
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	if (!org) return null;
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!reason.trim()) {
			toast.error("Reason is required to grant access.");
			return;
		}
		if (!confirmed) {
			toast.error("Please check the confirmation checkbox.");
			return;
		}
		setIsSubmitting(true);
		try {
			await superAdminApi.grantAccess(org.id, {
				plan,
				access_type: accessType,
				duration,
				custom_expiry_date: customExpiryDate || void 0,
				reason,
				internal_note: internalNote || void 0,
				confirm: true
			});
			toast.success(`Successfully granted ${accessType} access to ${org.name}!`);
			onOpenChange(false);
			setReason("");
			setInternalNote("");
			setConfirmed(false);
			if (onSuccess) onSuccess();
		} catch (err) {
			toast.error(err.response?.data?.detail || err.message || "Failed to grant access");
		} finally {
			setIsSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-lg bg-background border-border shadow-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
				className: "font-display text-lg font-bold flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5 text-indigo-500" }), "Grant Organization Access"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
				className: "text-xs text-muted-foreground",
				children: [
					"Override payment requirements and grant complimentary or promotional access to ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-foreground",
						children: org.name
					}),
					"."
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-4 pt-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3 text-xs space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: org.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "border-indigo-500/30 text-indigo-400 text-[10px]",
								children: org.payment_status
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted-foreground text-[11px]",
							children: ["Owner: ", org.owner?.email || "—"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold text-muted-foreground",
								children: "Access Type"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: accessType,
								onValueChange: setAccessType,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-9 bg-background/50 border-border text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Complimentary",
										children: "Complimentary"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Free",
										children: "Free"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Trial",
										children: "Trial"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Promotional",
										children: "Promotional"
									})
								] })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold text-muted-foreground",
								children: "Subscription Plan"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: plan,
								onValueChange: setPlan,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-9 bg-background/50 border-border text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Basic",
										children: "Basic Plan"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Professional",
										children: "Professional Plan"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Enterprise",
										children: "Enterprise Plan"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Custom",
										children: "Custom Plan"
									})
								] })]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold text-muted-foreground",
								children: "Duration"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: duration,
								onValueChange: setDuration,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-9 bg-background/50 border-border text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "7 days",
										children: "7 Days"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "14 days",
										children: "14 Days"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "30 days",
										children: "30 Days"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "90 days",
										children: "90 Days"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "6 months",
										children: "6 Months"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "1 year",
										children: "1 Year"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Lifetime",
										children: "Lifetime (Never Expires)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Custom",
										children: "Custom Date"
									})
								] })]
							})]
						}), duration === "Custom" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold text-muted-foreground",
								children: "Custom Expiry Date"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: customExpiryDate,
								onChange: (e) => setCustomExpiryDate(e.target.value),
								className: "h-9 bg-background/50 border-border text-xs"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Reason for Granting Access *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: reason,
							onChange: (e) => setReason(e.target.value),
							placeholder: "e.g. Partner demo, VIP customer trial extension, Investor preview...",
							className: "h-9 bg-background/50 border-border text-xs",
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Internal Admin Note (Optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: internalNote,
							onChange: (e) => setInternalNote(e.target.value),
							placeholder: "Private notes visible only to Super Admin team",
							className: "min-h-[50px] bg-background/50 border-border text-xs"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-2.5 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							id: "grant-confirm",
							checked: confirmed,
							onChange: (e) => setConfirmed(e.target.checked),
							className: "mt-0.5 rounded border-border"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "grant-confirm",
							className: "text-muted-foreground leading-relaxed cursor-pointer select-none",
							children: "I understand this organization will receive access without a successful payment."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
						className: "pt-2 border-t border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => onOpenChange(false),
							className: "h-9 text-xs border-border bg-transparent",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							disabled: isSubmitting || !confirmed || !reason.trim(),
							className: "h-9 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-3.5 w-3.5" }), isSubmitting ? "Granting..." : "Confirm & Grant Access"]
						})]
					})
				]
			})]
		})
	});
}
function ExtendAccessModal({ open, onOpenChange, org, onSuccess }) {
	const [days, setDays] = (0, import_react.useState)(30);
	const [reason, setReason] = (0, import_react.useState)("");
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	if (!org) return null;
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!reason.trim()) {
			toast.error("Reason is required.");
			return;
		}
		setIsSubmitting(true);
		try {
			await superAdminApi.extendAccess(org.id, {
				days,
				reason
			});
			toast.success(`Extended access for ${org.name} by ${days} days!`);
			onOpenChange(false);
			setReason("");
			if (onSuccess) onSuccess();
		} catch (err) {
			toast.error(err.response?.data?.detail || err.message || "Failed to extend access");
		} finally {
			setIsSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-md bg-background border-border",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
				className: "font-display text-base font-bold flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-blue-500" }), "Extend Organization Access"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
				className: "text-xs text-muted-foreground",
				children: [
					"Extend access expiration date for ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-foreground",
						children: org.name
					}),
					"."
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-4 pt-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Extension Duration"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: days.toString(),
							onValueChange: (v) => setDays(parseInt(v)),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-9 text-xs bg-background/50 border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "7",
									children: "+ 7 Days"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "14",
									children: "+ 14 Days"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "30",
									children: "+ 30 Days (1 Month)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "90",
									children: "+ 90 Days (3 Months)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "180",
									children: "+ 180 Days (6 Months)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "365",
									children: "+ 365 Days (1 Year)"
								})
							] })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Extension Reason *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: reason,
							onChange: (e) => setReason(e.target.value),
							placeholder: "e.g. Requested additional testing period...",
							className: "h-9 text-xs bg-background/50 border-border",
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => onOpenChange(false),
						className: "h-9 text-xs",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: isSubmitting || !reason.trim(),
						className: "h-9 text-xs bg-blue-600 hover:bg-blue-700 text-white",
						children: isSubmitting ? "Extending..." : "Extend Access"
					})] })
				]
			})]
		})
	});
}
function SuspendAccessModal({ open, onOpenChange, org, onSuccess }) {
	const [reason, setReason] = (0, import_react.useState)("");
	const [internalNote, setInternalNote] = (0, import_react.useState)("");
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	if (!org) return null;
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!reason.trim()) {
			toast.error("Suspension reason is required.");
			return;
		}
		setIsSubmitting(true);
		try {
			await superAdminApi.suspendAccess(org.id, {
				reason,
				internal_note: internalNote
			});
			toast.warning(`Suspended access for ${org.name}`);
			onOpenChange(false);
			setReason("");
			if (onSuccess) onSuccess();
		} catch (err) {
			toast.error(err.response?.data?.detail || err.message || "Failed to suspend access");
		} finally {
			setIsSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-md bg-background border-border",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
				className: "font-display text-base font-bold text-rose-500 flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "h-5 w-5" }), "Suspend Organization Access"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
				className: "text-xs text-muted-foreground",
				children: [
					"Temporarily block all users of ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-foreground",
						children: org.name
					}),
					" from accessing protected application features. All organization data will be preserved intact."
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-4 pt-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Suspension Reason *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: reason,
							onChange: (e) => setReason(e.target.value),
							placeholder: "e.g. Non-payment, terms violation, security risk...",
							className: "h-9 text-xs bg-background/50 border-border",
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Internal Note (Optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: internalNote,
							onChange: (e) => setInternalNote(e.target.value),
							placeholder: "Internal tracking notes",
							className: "min-h-[50px] text-xs bg-background/50 border-border"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => onOpenChange(false),
						className: "h-9 text-xs",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: isSubmitting || !reason.trim(),
						className: "h-9 text-xs bg-rose-600 hover:bg-rose-700 text-white font-medium",
						children: isSubmitting ? "Suspending..." : "Suspend Organization"
					})] })
				]
			})]
		})
	});
}
function CancelAccessModal({ open, onOpenChange, org, onSuccess }) {
	const [cancelType, setCancelType] = (0, import_react.useState)("immediate");
	const [reason, setReason] = (0, import_react.useState)("");
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	if (!org) return null;
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!reason.trim()) {
			toast.error("Cancellation reason is required.");
			return;
		}
		setIsSubmitting(true);
		try {
			await superAdminApi.cancelAccess(org.id, {
				cancel_type: cancelType,
				reason
			});
			toast.error(`Cancelled subscription for ${org.name}`);
			onOpenChange(false);
			setReason("");
			if (onSuccess) onSuccess();
		} catch (err) {
			toast.error(err.response?.data?.detail || err.message || "Failed to cancel access");
		} finally {
			setIsSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-md bg-background border-border",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
				className: "font-display text-base font-bold text-rose-500 flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-5 w-5" }), "Cancel Subscription Access"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
				className: "text-xs text-muted-foreground",
				children: [
					"Cancel subscription for ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-foreground",
						children: org.name
					}),
					"."
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-4 pt-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Cancellation Type"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: cancelType,
							onValueChange: setCancelType,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-9 text-xs bg-background/50 border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "immediate",
								children: "Cancel Immediately"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "at_expiry",
								children: "Cancel at End of Billing Period"
							})] })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Cancellation Reason *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: reason,
							onChange: (e) => setReason(e.target.value),
							placeholder: "e.g. Customer churn request, non-renewal...",
							className: "h-9 text-xs bg-background/50 border-border",
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => onOpenChange(false),
						className: "h-9 text-xs",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: isSubmitting || !reason.trim(),
						className: "h-9 text-xs bg-rose-600 hover:bg-rose-700 text-white",
						children: isSubmitting ? "Cancelling..." : "Confirm Cancellation"
					})] })
				]
			})]
		})
	});
}
function ReactivateAccessModal({ open, onOpenChange, org, onSuccess }) {
	const [plan, setPlan] = (0, import_react.useState)("Professional");
	const [accessType, setAccessType] = (0, import_react.useState)("Complimentary");
	const [duration, setDuration] = (0, import_react.useState)("30 days");
	const [reason, setReason] = (0, import_react.useState)("");
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	if (!org) return null;
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!reason.trim()) {
			toast.error("Reactivation reason is required.");
			return;
		}
		setIsSubmitting(true);
		try {
			await superAdminApi.reactivateAccess(org.id, {
				plan,
				access_type: accessType,
				duration,
				reason
			});
			toast.success(`Reactivated access for ${org.name}!`);
			onOpenChange(false);
			setReason("");
			if (onSuccess) onSuccess();
		} catch (err) {
			toast.error(err.response?.data?.detail || err.message || "Failed to reactivate");
		} finally {
			setIsSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-md bg-background border-border",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
				className: "font-display text-base font-bold text-emerald-500 flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-5 w-5" }), "Reactivate Organization Access"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
				className: "text-xs text-muted-foreground",
				children: [
					"Restore application access for ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-foreground",
						children: org.name
					}),
					"."
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-4 pt-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold text-muted-foreground",
								children: "Access Type"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: accessType,
								onValueChange: setAccessType,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-9 text-xs bg-background/50 border-border",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Complimentary",
										children: "Complimentary"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Paid",
										children: "Paid Subscription"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Free",
										children: "Free"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Trial",
										children: "Trial"
									})
								] })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold text-muted-foreground",
								children: "Plan"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: plan,
								onValueChange: setPlan,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-9 text-xs bg-background/50 border-border",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Basic",
										children: "Basic Plan"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Professional",
										children: "Professional Plan"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Enterprise",
										children: "Enterprise Plan"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Custom",
										children: "Custom Plan"
									})
								] })]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Reactivation Reason *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: reason,
							onChange: (e) => setReason(e.target.value),
							placeholder: "e.g. Payment resolved, complimentary extension approved...",
							className: "h-9 text-xs bg-background/50 border-border",
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => onOpenChange(false),
						className: "h-9 text-xs",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: isSubmitting || !reason.trim(),
						className: "h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white",
						children: isSubmitting ? "Reactivating..." : "Reactivate Access"
					})] })
				]
			})]
		})
	});
}
function ChangePlanModal({ open, onOpenChange, org, onSuccess }) {
	const [newPlan, setNewPlan] = (0, import_react.useState)("Enterprise");
	const [reason, setReason] = (0, import_react.useState)("");
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	if (!org) return null;
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!reason.trim()) {
			toast.error("Reason for plan change is required.");
			return;
		}
		setIsSubmitting(true);
		try {
			await superAdminApi.changePlan(org.id, {
				new_plan: newPlan,
				reason
			});
			toast.success(`Updated ${org.name} plan to ${newPlan}`);
			onOpenChange(false);
			setReason("");
			if (onSuccess) onSuccess();
		} catch (err) {
			toast.error(err.response?.data?.detail || err.message || "Failed to change plan");
		} finally {
			setIsSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-md bg-background border-border",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
				className: "font-display text-base font-bold flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-5 w-5 text-indigo-500" }), "Change Subscription Plan"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
				className: "text-xs text-muted-foreground",
				children: [
					"Override plan entitlements for ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-foreground",
						children: org.name
					}),
					". Current: ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						children: org.plan
					})
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-4 pt-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Select New Plan"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: newPlan,
							onValueChange: setNewPlan,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-9 text-xs bg-background/50 border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "Basic",
									children: "Basic Plan"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "Professional",
									children: "Professional Plan"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "Enterprise",
									children: "Enterprise Plan"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "Custom",
									children: "Custom Enterprise Plan"
								})
							] })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Reason for Plan Change *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: reason,
							onChange: (e) => setReason(e.target.value),
							placeholder: "e.g. Upgrade request, custom SLA tier approved...",
							className: "h-9 text-xs bg-background/50 border-border",
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => onOpenChange(false),
						className: "h-9 text-xs",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: isSubmitting || !reason.trim(),
						className: "h-9 text-xs bg-indigo-600 hover:bg-indigo-700 text-white",
						children: isSubmitting ? "Updating..." : "Update Plan"
					})] })
				]
			})]
		})
	});
}
//#endregion
export { ReactivateAccessModal as a, GrantAccessModal as i, ChangePlanModal as n, SuspendAccessModal as o, ExtendAccessModal as r, CancelAccessModal as t };
