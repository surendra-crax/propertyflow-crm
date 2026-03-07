"use client";

import { usePathname } from "next/navigation";
import { AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DemoBanner() {
    const pathname = usePathname();

    // Only show inside dashboard
    if (!pathname.startsWith("/(dashboard)") && !pathname.includes("dashboard") && pathname !== "/") {
        // We will mount this in dashboard layout, but just in case
    }

    return (
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white w-full py-2.5 px-4 relative z-50 shadow-sm flex items-center justify-center shrink-0">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-center">
                <div className="flex items-center gap-2 font-medium">
                    <AlertCircle className="w-4 h-4 fill-amber-700" />
                    This is a demonstration version of PropertyFlow CRM.
                </div>
                <div className="flex items-center gap-4">
                    <span className="hidden sm:inline opacity-80">To deploy this CRM for your company:</span>
                    <Link
                        href="/landing#contact-form"
                        className="bg-white text-amber-600 px-3 py-1 rounded-md font-bold text-xs uppercase tracking-wider hover:bg-amber-50 transition-colors shadow-sm flex items-center gap-1"
                    >
                        Book Consultation
                        <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
