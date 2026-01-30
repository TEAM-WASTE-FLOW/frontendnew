import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Users, ArrowRight, Activity, Recycle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import KineticText from "@/components/ui/kinetic-text";

const About = () => {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900 relative overflow-hidden font-sans selection:bg-emerald-500/20">
            {/* Animated Mesh Gradient Background (Light Mode: Emerald, Sage, Blue) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* World Map Overlay */}
                <div className="absolute inset-0 bg-[url('/images/world-map-dots.png')] bg-contain bg-center bg-no-repeat opacity-20 mix-blend-multiply" />

                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 45, 0],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                    className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-emerald-100/50 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        x: [0, 50, 0],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: 2
                    }}
                    className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-blue-100/50 rounded-full blur-[100px]"
                />
            </div>

            <Header />

            <main className="pt-32 pb-24 relative z-10" ref={targetRef}>
                <div className="container mx-auto px-4">

                    {/* Hero Section */}
                    <div className="max-w-5xl mx-auto text-center mb-24">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <Badge className="mb-8 bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200 transition-all font-medium px-4 py-1.5 text-sm backdrop-blur-md shadow-sm">
                                SERIES A • GLOBAL TRADE
                            </Badge>

                            {/* Kinetic Hero Text */}
                            <KineticText
                                text="Driving Sustainability Through Transparency"
                                className="font-display text-5xl md:text-7xl font-bold mb-8 tracking-tight text-zinc-900 leading-tight"
                            />

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.6 }}
                                className="text-xl md:text-2xl text-zinc-600 leading-relaxed max-w-3xl mx-auto font-light"
                            >
                                WasteFlow is the digital infrastructure for the global circular economy. We are bridging the gap between waste generators and recyclers worldwide with the first negotiation-based marketplace.
                            </motion.p>
                        </motion.div>
                    </div>

                    {/* Bento Grid Layout (Asymmetrical) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-24 max-w-7xl mx-auto">

                        {/* 1. Our Mission (Tall Vertical on Left) */}
                        <motion.div
                            className="lg:col-span-4"
                            initial={{ opacity: 0, y: 80 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ type: "spring", stiffness: 60, damping: 15, delay: 0.1 }}
                        >
                            <Card className="h-full bg-white/40 backdrop-blur-[20px] border-white/60 shadow-xl hover:scale-[1.02] hover:shadow-2xl hover:border-white/80 transition-all duration-500 group">
                                <CardContent className="p-8 flex flex-col h-full">
                                    <div className="mb-auto">
                                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-6 border border-emerald-200 group-hover:scale-110 transition-transform duration-500">
                                            <Recycle className="w-6 h-6 text-emerald-600" />
                                        </div>
                                        <h3 className="text-3xl font-bold mb-4 font-display text-zinc-900 tracking-tight">Our Mission</h3>
                                        <p className="text-zinc-600 leading-relaxed text-lg">
                                            To democratize the global waste trade. We connect generators, middlemen, and recyclers across borders in a transparent ecosystem.
                                        </p>
                                    </div>
                                    <div className="mt-8 relative h-64 w-full rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                                        <img
                                            src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2670&auto=format&fit=crop"
                                            alt="Mission"
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Right Column Stack (Horizontal Blocks) */}
                        <div className="lg:col-span-8 flex flex-col gap-6">

                            {/* 2. Scalable Impact Engine */}
                            <motion.div
                                className="flex-1"
                                initial={{ opacity: 0, y: 80 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ type: "spring", stiffness: 60, damping: 15, delay: 0.2 }}
                            >
                                <Card className="h-full bg-white/40 backdrop-blur-[20px] border-white/60 shadow-xl hover:scale-[1.02] hover:shadow-2xl hover:border-white/80 transition-all duration-500 group">
                                    <CardContent className="p-10 flex flex-col md:flex-row items-center gap-8 h-full">
                                        <div className="flex-1">
                                            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-6 border border-orange-200 group-hover:rotate-12 transition-transform duration-500">
                                                <TrendingUp className="w-6 h-6 text-orange-600" />
                                            </div>
                                            <h3 className="text-3xl font-bold mb-4 font-display text-zinc-900 tracking-tight">Scalable Impact Engine</h3>
                                            <p className="text-zinc-600 text-lg">
                                                Scalable Impact Engine. We leverage real-time data and AI-driven logistics to turn environmental challenges into economic opportunities. This is not just a concept—it is a scalable revolution.
                                            </p>
                                        </div>
                                        <div className="w-full md:w-1/3 h-40 rounded-2xl bg-gradient-to-br from-orange-100 to-transparent border border-white/40 relative overflow-hidden group-hover:border-orange-200 transition-colors duration-500">
                                            {/* Abstract Visualization */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Activity className="w-16 h-16 text-orange-400/40 group-hover:text-orange-500/60 transition-colors duration-500" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* 3. Engineered for Global Impact */}
                            <motion.div
                                className="flex-1"
                                initial={{ opacity: 0, y: 80 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ type: "spring", stiffness: 60, damping: 15, delay: 0.3 }}
                            >
                                <Card className="h-full bg-white/40 backdrop-blur-[20px] border-white/60 shadow-xl hover:scale-[1.02] hover:shadow-2xl hover:border-white/80 transition-all duration-500 group">
                                    <CardContent className="p-10">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 group-hover:animate-pulse">
                                                <Globe className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">SDGs 11, 12, 13</Badge>
                                        </div>

                                        <h3 className="text-3xl font-bold mb-4 font-display text-zinc-900 tracking-tight">Engineered for Global Impact</h3>
                                        <p className="text-zinc-600 text-lg mb-8">
                                            Engineered for Global Impact. We are decongesting cities (SDG 11), closing the circular loop (SDG 12), and reducing carbon footprints through optimized logistics (SDG 13).
                                        </p>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {['Sustainable Cities', 'Responsible Consumption', 'Climate Action'].map((tag, i) => (
                                                <div key={i} className="px-4 py-3 rounded-xl bg-white/60 border border-white/40 text-sm text-zinc-600 flex items-center justify-center text-center hover:bg-white/80 transition-colors font-medium">
                                                    {tag}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </div>

                    {/* Join the Movement - Call to Action */}
                    <motion.div
                        className="max-w-5xl mx-auto text-center"
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", duration: 0.8 }}
                    >
                        <div className="group relative overflow-hidden rounded-[40px] p-[1px] bg-gradient-to-b from-emerald-500/30 to-blue-500/30 backdrop-blur-md shadow-2xl">
                            <div className="relative bg-white/80 backdrop-blur-2xl rounded-[39px] p-16 md:p-24 overflow-hidden">
                                {/* Glow Effect */}
                                <div className="absolute top-[-50%] left-[-20%] w-[50%] h-[50%] bg-emerald-200/50 blur-[100px] pointer-events-none" />
                                <div className="absolute bottom-[-50%] right-[-20%] w-[50%] h-[50%] bg-blue-200/50 blur-[100px] pointer-events-none" />

                                <Users className="w-20 h-20 text-emerald-600 mx-auto mb-8 relative z-10" />
                                <h2 className="text-5xl md:text-6xl font-bold mb-6 font-display tracking-tight text-zinc-900 relative z-10">
                                    Ready to Monetize Your Waste?
                                </h2>
                                <p className="text-2xl text-zinc-600 mb-12 max-w-2xl mx-auto font-light relative z-10">
                                    Join the ecosystem where waste meets value.
                                </p>
                                <Button size="xl" className="h-16 px-12 text-xl rounded-full shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all hover:scale-105 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold relative z-10" asChild>
                                    <Link to="/create-listing">
                                        Start Trading Now
                                        <ArrowRight className="ml-2 w-6 h-6" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </main>
            <Footer />
        </div>
    );
};

export default About;
