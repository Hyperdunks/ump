"use client";

import { motion } from "motion/react";
import { Globe, Mail, Webhook } from "lucide-react";

export default function landingSection3() {
    return (
        <section className="py-24 px-4 overflow-hidden relative bg-background text-foreground">
            <div className="container mx-auto max-w-5xl">
                {/* Header Content */}
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                        Seamless Global Connectivity
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Connect your data sources, applications, and workflows effortlessly.
                        Experience real-time synchronization across your entire ecosystem.
                    </p>
                </div>

                {/* Tree Layout Diagram */}
                <div className="flex flex-col items-center">

                    {/* Level 1: Central Hub (Globe) */}
                    <div className="relative z-10 w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 backdrop-blur-sm shadow-lg shadow-primary/5 mb-8">
                        <Globe className="w-10 h-10 text-primary" />
                        <motion.div
                            className="absolute inset-0 rounded-full bg-primary/20"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>

                    {/* SVG Tree Connectors */}
                    <div className="relative w-full max-w-3xl h-16">
                        <svg
                            className="absolute inset-0 w-full h-full overflow-visible"
                            viewBox="0 0 800 64"
                            preserveAspectRatio="none"
                        >
                            {/* Base Track (Always Visible) */}
                            <g className="text-border opacity-30">
                                {/* Down from Globe */}
                                <path d="M 400 0 L 400 32" stroke="currentColor" strokeWidth="1" fill="none" />
                                {/* Horizontal */}
                                <path d="M 100 32 L 700 32" stroke="currentColor" strokeWidth="1" fill="none" />
                                {/* Down to nodes */}
                                <path d="M 100 32 L 100 64" stroke="currentColor" strokeWidth="1" fill="none" />
                                <path d="M 300 32 L 300 64" stroke="currentColor" strokeWidth="1" fill="none" />
                                <path d="M 500 32 L 500 64" stroke="currentColor" strokeWidth="1" fill="none" />
                                <path d="M 700 32 L 700 64" stroke="currentColor" strokeWidth="1" fill="none" />
                            </g>

                            {/* Active Flow Animation - Delay-based Sequence */}
                            <g className="text-primary">
                                {/* 1. Down from Globe */}
                                <motion.path
                                    d="M 400 0 L 400 32"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                    strokeDasharray="20 52"
                                    animate={{ strokeDashoffset: [20, -52] }}
                                    transition={{
                                        duration: 0.9,
                                        repeat: Infinity,
                                        repeatDelay: 1.8,
                                        ease: "linear",
                                    }}
                                />

                                {/* 2. Horizontal Spread */}
                                {/* Left Side */}
                                <motion.path
                                    d="M 400 32 L 100 32"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                    strokeDasharray="30 320"
                                    animate={{ strokeDashoffset: [30, -320] }}
                                    transition={{
                                        duration: 0.9,
                                        delay: 0.9,
                                        repeat: Infinity,
                                        repeatDelay: 1.8,
                                        ease: "linear",
                                    }}
                                />
                                {/* Right Side */}
                                <motion.path
                                    d="M 400 32 L 700 32"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                    strokeDasharray="30 320"
                                    animate={{ strokeDashoffset: [30, -320] }}
                                    transition={{
                                        duration: 0.9,
                                        delay: 0.9,
                                        repeat: Infinity,
                                        repeatDelay: 1.8,
                                        ease: "linear",
                                    }}
                                />

                                {/* 3. Down to All Nodes (same timing) */}
                                {[100, 300, 500, 700].map((x, i) => (
                                    <motion.path
                                        key={`node-${i}`}
                                        d={`M ${x} 32 L ${x} 64`}
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        fill="none"
                                        strokeDasharray="20 52"
                                        animate={{ strokeDashoffset: [20, -52] }}
                                        transition={{
                                            duration: 1,
                                            delay: 2, // After horizontal spread finishes
                                            repeat: Infinity,
                                            repeatDelay: 1.8, // 0.8 + 0.3 + 0.4 = 1.5s total cycle
                                            ease: "linear",
                                        }}
                                    />
                                ))}
                            </g>
                        </svg>
                    </div>

                    {/* Level 2: Integrations Row */}
                    <div className="grid grid-cols-4 gap-4 w-full max-w-3xl">
                        <IntegrationNode Icon={Mail} delay={0.3} label="Mail" />
                        <IntegrationNode Icon={SlackIcon} delay={0.6} label="Slack" />
                        <IntegrationNode Icon={DiscordIcon} delay={0.9} label="Discord" />
                        <IntegrationNode Icon={Webhook} delay={1.2} label="Webhook" />
                    </div>

                </div>
            </div>
        </section>
    );
}

function IntegrationNode({ Icon, delay }: { Icon: React.ElementType; delay: number; label: string }) {
    return (
        <div className="flex flex-col items-center">
            <motion.div
                className="w-16 h-16 bg-card rounded-2xl border flex items-center justify-center shadow-sm relative z-10 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay, type: "spring" }}
            >
                <Icon className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                <div className="absolute inset-0 bg-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
        </div>
    );
}

// Custom Icons
const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
    </svg>
);

const SlackIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
    </svg>
);
