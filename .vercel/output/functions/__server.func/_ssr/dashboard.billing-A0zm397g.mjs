import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { cn as useofc360, j as apiInstance } from "./ofc360-store-Dm5opMS0.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { B as ShieldCheck, Fn as CreditCard, I as Sparkles, Qn as CircleCheck, V as ShieldAlert, or as Check } from "../_libs/lucide-react.mjs";
import { r as PageHeader } from "./DashboardShell-BxC1t09N.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.billing-A0zm397g.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function loadRazorpayScript() {
	return new Promise((resolve) => {
		if (typeof window === "undefined") {
			resolve(false);
			return;
		}
		if (window.Razorpay) {
			resolve(true);
			return;
		}
		const script = document.createElement("script");
		script.src = "https://checkout.razorpay.com/v1/checkout.js";
		script.async = true;
		script.onload = () => resolve(true);
		script.onerror = () => resolve(false);
		document.body.appendChild(script);
	});
}
async function processRazorpayCheckout(options) {
	const { amountInRupees, description, planName, prefill, onSuccess, onError, onDismiss } = options;
	if (!await loadRazorpayScript()) {
		toast.error("Failed to load Razorpay SDK. Please check your internet connection.");
		onError?.(/* @__PURE__ */ new Error("Razorpay SDK load failure"));
		return;
	}
	const amountInPaise = Math.max(100, Math.round(amountInRupees * 100));
	try {
		toast.loading("Creating order...", { id: "razorpay-init" });
		const createRes = await apiInstance.post("/payments/create-order", {
			amount: amountInPaise,
			currency: "INR",
			receipt: `rcpt_${Date.now()}`
		});
		toast.dismiss("razorpay-init");
		if (!createRes.data || !createRes.data.order_id) throw new Error("Order creation failed on backend");
		const { order_id, amount, currency, key_id } = createRes.data;
		const rzpOptions = {
			key: key_id || "rzp_test_TNY7mS8PhHloDn",
			amount,
			currency,
			name: "OFC360 HRMS",
			description: description || `Payment for ${planName || "Subscription Plan"}`,
			image: "https://dummyimage.com/128x128/0f172a/ffffff&text=OFC360",
			order_id,
			prefill: {
				name: prefill?.name || "",
				email: prefill?.email || "",
				contact: prefill?.contact || ""
			},
			theme: { color: "#6366f1" },
			handler: async function(response) {
				try {
					toast.loading("Verifying payment...", { id: "razorpay-verify" });
					const verifyRes = await apiInstance.post("/payments/verify-payment", {
						razorpay_order_id: response.razorpay_order_id,
						razorpay_payment_id: response.razorpay_payment_id,
						razorpay_signature: response.razorpay_signature
					});
					toast.dismiss("razorpay-verify");
					if (verifyRes.data && verifyRes.data.verified) {
						toast.success("Payment successful! Signature verified.", {
							description: `Payment ID: ${response.razorpay_payment_id}`,
							duration: 6e3
						});
						onSuccess?.({
							orderId: response.razorpay_order_id,
							paymentId: response.razorpay_payment_id,
							signature: response.razorpay_signature
						});
					} else {
						toast.error("Payment verification failed!", { description: "Signature mismatch detected. Payment was not completed." });
						onError?.(/* @__PURE__ */ new Error("Signature verification failed"));
					}
				} catch (verifyError) {
					toast.dismiss("razorpay-verify");
					const msg = verifyError?.response?.data?.detail || verifyError?.message || "Verification failed";
					toast.error("Payment verification error", { description: msg });
					onError?.(verifyError);
				}
			},
			modal: { ondismiss: function() {
				toast.info("Payment cancelled by user.");
				onDismiss?.();
			} }
		};
		const rzp = new window.Razorpay(rzpOptions);
		rzp.on("payment.failed", function(response) {
			toast.error("Payment failed", { description: response.error?.description || "Payment process failed" });
			onError?.(response.error);
		});
		rzp.open();
	} catch (err) {
		toast.dismiss("razorpay-init");
		const errMsg = err?.response?.data?.detail || err?.message || "Unable to start checkout";
		toast.error("Checkout Initialization Error", { description: errMsg });
		onError?.(err);
	}
}
var plans = [
	{
		id: "starter",
		name: "Starter Plan",
		tagline: "Ideal for small teams & growing startups.",
		monthlyPrice: 499,
		yearlyPrice: 399,
		features: [
			"Core HR & Employee Database",
			"Up to 25 Active Employees",
			"Attendance & Leave Management",
			"Basic Payroll Processing",
			"Employee Self-Service Portal",
			"Email Support"
		]
	},
	{
		id: "growth",
		name: "Growth Plan",
		tagline: "Full HR automation & AI recruitment tools.",
		monthlyPrice: 1499,
		yearlyPrice: 1199,
		popular: true,
		features: [
			"Everything in Starter",
			"Up to 100 Active Employees",
			"AI Candidate Screening & ATS",
			"Advanced Attendance & Rosters",
			"Performance Coaching & Reviews",
			"Priority 24/7 Support"
		]
	},
	{
		id: "enterprise",
		name: "Enterprise Plan",
		tagline: "Unlimited AI Agents, custom SLAs & dedicated manager.",
		monthlyPrice: 4999,
		yearlyPrice: 3999,
		features: [
			"Everything in Growth",
			"Unlimited Active Employees",
			"Full ofc360 AI Suite (70+ Agents)",
			"Custom Workflows & Integrations",
			"Dedicated Account Manager",
			"99.9% Uptime SLA"
		]
	}
];
function BillingPage() {
	const ws = useofc360();
	if ((ws.user?.role)?.toLowerCase() === "employee") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-8 max-w-lg mx-auto text-center space-y-4 my-12 bg-card/60 border border-border/60 rounded-2xl backdrop-blur-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-6 w-6" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-bold text-foreground",
				children: "Access Restricted"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "You do not have permission to view workspace billing or subscription settings. Please contact your organization administrator."
			})
		]
	});
	const user = ws.user;
	const company = ws.company;
	const [billingCycle, setBillingCycle] = (0, import_react.useState)("monthly");
	const [loadingPlan, setLoadingPlan] = (0, import_react.useState)(null);
	const [paymentSuccessData, setPaymentSuccessData] = (0, import_react.useState)(null);
	const handleSubscribe = async (plan) => {
		const price = billingCycle === "yearly" ? plan.yearlyPrice * 12 : plan.monthlyPrice;
		setLoadingPlan(plan.id);
		try {
			await processRazorpayCheckout({
				amountInRupees: price,
				description: `${plan.name} (${billingCycle.toUpperCase()}) - OFC360 HRMS`,
				planName: plan.name,
				prefill: {
					name: user?.fullName || company?.name || "",
					email: user?.email || "",
					contact: user?.phone || ""
				},
				onSuccess: (result) => {
					setLoadingPlan(null);
					setPaymentSuccessData({
						orderId: result.orderId,
						paymentId: result.paymentId,
						planName: plan.name,
						amountPaid: price,
						date: (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
							day: "numeric",
							month: "short",
							year: "numeric"
						})
					});
				},
				onError: (err) => {
					setLoadingPlan(null);
				},
				onDismiss: () => {
					setLoadingPlan(null);
				}
			});
		} catch (e) {
			setLoadingPlan(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8 max-w-7xl mx-auto pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Billing & Subscription",
				description: "Manage your subscription plan, payment methods, and invoice receipts."
			}),
			paymentSuccessData && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-foreground space-y-3 animate-in fade-in duration-300",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-semibold text-lg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-6 w-6" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subscription Payment Verified & Active!" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [
							"Thank you! Your payment for ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: paymentSuccessData.planName }),
							" was processed and verified successfully via Razorpay."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-xs pt-2 font-mono bg-background/50 p-3 rounded-xl border border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground block",
								children: "Order ID:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: paymentSuccessData.orderId
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground block",
								children: "Payment ID:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: paymentSuccessData.paymentId
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground block",
								children: "Amount Paid:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-semibold text-foreground",
								children: ["₹", paymentSuccessData.amountPaid.toLocaleString("en-IN")]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground block",
								children: "Date:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: paymentSuccessData.date
							})] })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-6 rounded-2xl border border-border bg-card shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded-full bg-primary/10",
								children: "Active Subscription"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground",
								children: ["Company ID: ", company?.id ? String(company.id).substring(0, 8) : "demo-corp"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-2xl font-bold text-foreground",
							children: paymentSuccessData ? paymentSuccessData.planName : "Starter Plan (Free Trial)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: paymentSuccessData ? "Your paid subscription is verified and active." : "You are currently on a 14-day free trial. Upgrade to unlock full features & AI modules."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right hidden sm:block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "Razorpay Integration"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), " Standard Checkout Ready"]
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col items-center justify-center space-y-3 pt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "inline-flex items-center p-1.5 rounded-full bg-muted border border-border text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setBillingCycle("monthly"),
						className: `px-5 py-2 rounded-full font-medium transition-all ${billingCycle === "monthly" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
						children: "Monthly Billing"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setBillingCycle("yearly"),
						className: `px-5 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${billingCycle === "yearly" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Annual Billing" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white",
							children: "Save 20%"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 md:grid-cols-3 gap-8 pt-2",
				children: plans.map((plan) => {
					const displayPrice = billingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
					const totalPrice = billingCycle === "yearly" ? plan.yearlyPrice * 12 : plan.monthlyPrice;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `relative rounded-3xl p-8 border flex flex-col justify-between transition-all duration-200 ${plan.popular ? "bg-card border-primary ring-2 ring-primary/20 shadow-xl scale-[1.02]" : "bg-card/60 border-border hover:border-border/80 shadow-sm"}`,
						children: [
							plan.popular && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-md flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " Most Popular"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-xl font-bold text-foreground",
										children: plan.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-1 min-h-[32px]",
										children: plan.tagline
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "py-2 border-y border-border/60",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-baseline gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-4xl font-extrabold text-foreground",
												children: ["₹", displayPrice]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-muted-foreground",
												children: "/ month"
											})]
										}), billingCycle === "yearly" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5",
											children: [
												"Billed annually (₹",
												totalPrice.toLocaleString("en-IN"),
												"/yr)"
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "space-y-2.5 text-xs text-muted-foreground pt-2",
										children: plan.features.map((feat, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-start gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-emerald-500 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: feat })]
										}, idx))
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pt-8",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									disabled: loadingPlan === plan.id,
									onClick: () => handleSubscribe(plan),
									className: `w-full py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${plan.popular ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"} disabled:opacity-50 disabled:cursor-not-allowed`,
									children: loadingPlan === plan.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Opening Razorpay..." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Pay ₹",
										totalPrice.toLocaleString("en-IN"),
										" via Razorpay"
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-4 w-4" })] })
								})
							})
						]
					}, plan.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-6 rounded-2xl bg-muted/40 border border-border text-center space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-emerald-500" }), "Secured by Razorpay Standard Checkout"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground max-w-2xl mx-auto",
					children: "All major Credit & Debit cards, UPI (GPay, PhonePe, Paytm), Net Banking, and Wallets supported. Transactions are 256-bit SSL encrypted."
				})]
			})
		]
	});
}
//#endregion
export { BillingPage as component };
