import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Users, Leaf } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

const WaveText = ({
  text,
  className = "",
  delayOffset = 0
}: {
  text: string;
  className?: string;
  delayOffset?: number;
}) => {
  return (
    <span className={`inline-flex ${className}`}>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          style={{ display: "inline-block" }}
          initial={{ y: 0 }}
          animate={{ y: [0, -15, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatDelay: 2,
            delay: delayOffset + (index * 0.05),
            ease: "easeInOut"
          }}
          className="cursor-default"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
};

const HeroSection = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 50,
        damping: 20
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/4 right-0 w-96 h-96 bg-accent/15 rounded-full blur-[100px]"
        animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-72 h-72 bg-primary/20 rounded-full blur-[100px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.8, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ y }}
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-8 hover:bg-primary/20 transition-colors cursor-default border border-primary/20 backdrop-blur-sm">
              <Leaf className="w-4 h-4 animate-pulse" />
              <span>Sustainable Waste Marketplace</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="font-display text-5xl md:text-7xl lg:text-8xl font-black text-foreground mb-6 leading-[1.1] tracking-tight"
            variants={itemVariants}
          >
            <div className="flex flex-wrap justify-center gap-x-4 md:gap-x-6">
              <WaveText text="Negotiate." delayOffset={0} className="hover:text-primary transition-colors" />
              <WaveText text="Connect." delayOffset={1.5} className="hover:text-primary transition-colors" />
            </div>
            <div className="mt-2">
              <WaveText
                text="Recycle."
                delayOffset={3}
                className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary bg-300% animate-gradient"
              />
            </div>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-lg md:text-2xl text-muted-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
            variants={itemVariants}
          >
            The first negotiation-based marketplace connecting waste generators,
            middlemen, and recyclers. Set your price. Make your offer. Close the deal.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20"
            variants={itemVariants}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="hero" size="xl" className="text-lg px-10 h-16 shadow-lg shadow-primary/25 rounded-full" asChild>
                <Link to="/signup">
                  Start Trading
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="xl" className="text-lg px-10 h-16 border-2 rounded-full backdrop-blur-sm bg-background/50" asChild>
                <Link to="/signup">
                  List Your Waste
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            {[
              { icon: TrendingUp, val: "12K+", label: "Successful Trades", color: "text-emerald-500" },
              { icon: Users, val: "5K+", label: "Active Users", color: "text-blue-500" },
              { icon: Leaf, val: "850T", label: "Waste Recycled", color: "text-green-600" }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
                className="bg-card/50 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-border/50"
              >
                <div className={`flex items-center justify-center gap-3 ${stat.color} mb-2`}>
                  <stat.icon className="w-6 h-6" />
                  <span className="font-display text-4xl font-bold tracking-tight">{stat.val}</span>
                </div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
