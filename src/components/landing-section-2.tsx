"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

const features = [
    {
        number: 1,
        title: "Monitor Deployments live",
        description:
            "Track your deployments with clarity, seeing updates take place as they happen.",
        icon: (
            <svg viewBox="0 0 120 120" className="w-full h-full">
                {/* 3D Cube with lines - Monitor icon */}
                <g fill="none" stroke="currentColor" strokeWidth="2">
                    {/* Outer hexagon */}
                    <path d="M60 15 L100 35 L100 85 L60 105 L20 85 L20 35 Z" />
                    {/* Inner shape */}
                    <path d="M60 35 L80 45 L80 75 L60 85 L40 75 L40 45 Z" />
                    {/* Vertical lines indicating data/monitoring */}
                    <line x1="50" y1="52" x2="50" y2="68" strokeWidth="3" />
                    <line x1="60" y1="48" x2="60" y2="72" strokeWidth="3" />
                    <line x1="70" y1="54" x2="70" y2="66" strokeWidth="3" />
                    {/* Top lines */}
                    <line x1="60" y1="15" x2="60" y2="35" />
                    <line x1="20" y1="35" x2="40" y2="45" />
                    <line x1="100" y1="35" x2="80" y2="45" />
                </g>
            </svg>
        ),
    },
    {
        number: 2,
        title: "Immediate Issue Detection",
        description:
            "Spot issues instantly and address them with precise metrics for optimized performance.",
        icon: (
            <svg viewBox="0 0 120 120" className="w-full h-full">
                {/* 3D Cube with magnifying glass - Detection icon */}
                <g fill="none" stroke="currentColor" strokeWidth="2">
                    {/* Outer diamond/rhombus */}
                    <path d="M60 20 L100 50 L60 80 L20 50 Z" />
                    <path d="M20 50 L20 90 L60 110 L60 80" />
                    <path d="M100 50 L100 90 L60 110" />
                    {/* Dashed lines for 3D effect */}
                    <path d="M60 20 L60 55" strokeDasharray="4 2" />
                    {/* Inner cube element */}
                    <rect x="45" y="45" width="30" height="25" rx="2" />
                    <path d="M50 55 L55 60 L70 50" strokeWidth="2.5" />
                </g>
            </svg>
        ),
    },
    {
        number: 3,
        title: "Revert to a Stable Version",
        description:
            "With just a few actions, revert to a previous version and restore system health swiftly.",
        icon: (
            <svg viewBox="0 0 120 120" className="w-full h-full">
                {/* 3D Layered cube - Version/Revert icon */}
                <g fill="none" stroke="currentColor" strokeWidth="2">
                    {/* Top layer */}
                    <path d="M60 25 L95 42 L60 59 L25 42 Z" />
                    {/* Middle layer */}
                    <path d="M25 55 L60 72 L95 55" />
                    <path d="M25 42 L25 55" />
                    <path d="M95 42 L95 55" />
                    {/* Bottom layer with stripes */}
                    <path d="M25 68 L60 85 L95 68" />
                    <path d="M25 55 L25 68" />
                    <path d="M95 55 L95 68" />
                    {/* Base */}
                    <path d="M25 68 L25 82 L60 99 L95 82 L95 68" />
                    <path d="M60 85 L60 99" />
                    {/* Horizontal stripes on base */}
                    <line x1="32" y1="75" x2="55" y2="88" />
                    <line x1="40" y1="72" x2="50" y2="78" />
                    <line x1="70" y1="78" x2="88" y2="72" />
                </g>
            </svg>
        ),
    },
];

export default function landingSection2() {
    return (
        <section className="w-full py-20 px-6 bg-background">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                        Launch with Assurance
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
                        Simplify your workflow with our tools that provide clear insights,
                        minimizing the complexity of managing intricate deployment data.
                    </p>
                </div>

                {/* Features Timeline */}
                <div className="relative max-w-2xl mx-auto">
                    {features.map((feature, index) => (
                        <div
                            key={feature.number}
                            className="relative flex items-start gap-4"
                        >
                            {/* Timeline */}
                            <div className="flex flex-col items-center shrink-0 h-full absolute top-0 left-0 bottom-0">
                                {/* Number circle */}
                                <div className="relative z-10 w-8 h-8 rounded-full border border-border bg-background flex items-center justify-center text-sm font-medium text-muted-foreground shrink-0">
                                    {feature.number}
                                </div>
                                {/* Vertical line with scroll effect */}
                                {index < features.length - 1 && (
                                    <div className="w-px flex-1 bg-border relative overflow-hidden h-full -mt-2">
                                        <ScrollProgressLine />
                                    </div>
                                )}
                            </div>

                            {/* Content Wrapper to creating spacing */}
                            <div className="flex-1 flex items-start gap-48 pb-12 pl-12">
                                {/* Text - Left aligned */}
                                <div className="w-64 shrink-0 pt-1">
                                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>

                                {/* Icon Card - Right aligned */}
                                <div
                                    className={cn(
                                        "w-48 h-36 md:w-56 md:h-40 rounded-lg border border-border",
                                        "bg-card flex items-center justify-center",
                                        "shadow-sm shrink-0"
                                    )}
                                >
                                    <div className="w-24 h-24 md:w-28 md:h-28 text-foreground">
                                        {feature.icon}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function ScrollProgressLine() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const gradientTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <div ref={ref} className="w-full h-full relative">
            <motion.div
                className="absolute inset-0 w-full bg-linear-to-b from-transparent via-primary to-transparent opacity-50"
                style={{
                    top: gradientTop,
                    height: "50%",
                    translateY: "-50%"
                }}
            />
        </div>
    );
}
