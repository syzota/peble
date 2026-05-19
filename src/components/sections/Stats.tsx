import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, LineChart, Line, BarChart, Bar, Cell } from 'recharts';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const AnimatedCard = ({ className, ...props }: CardProps) => (
  <div
    role="region"
    aria-labelledby="card-title"
    aria-describedby="card-description"
    className={cn(
      "relative rounded-[2.5rem] w-full max-w-[356px] border overflow-hidden group/animated-card border-slate-200/50 bg-white/60 backdrop-blur-2xl shadow-2xl transition-all hover:shadow-sky-500/10 hover:border-sky-500/40",
      className,
    )}
    {...props}
  />
);

const CardBody = ({ className, ...props }: CardProps) => (
  <div
    role="group"
    className={cn(
      "flex flex-col space-y-2 p-8 border-t border-slate-200/50 relative z-10 bg-white/40",
      className,
    )}
    {...props}
  />
);

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
}

const CardTitle = ({ className, ...props }: CardTitleProps) => (
  <h3
    className={cn(
      "text-2xl text-slate-900 font-bold leading-none tracking-tight font-instrument",
      className,
    )}
    {...props}
  />
);

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

const CardDescription = ({ className, ...props }: CardDescriptionProps) => (
  <p
    className={cn(
      "text-sm text-slate-500 font-medium",
      className,
    )}
    {...props}
  />
);

const CardVisual = ({ className, ...props }: CardProps) => (
  <div
    className={cn("overflow-hidden w-full h-[220px] flex items-center justify-center bg-slate-50 relative", className)}
    {...props}
  />
);

// Mock data for charts
const hoaxData = [
  { year: '2020', count: 12000 },
  { year: '2021', count: 18000 },
  { year: '2022', count: 25000 },
  { year: '2023', count: 32000 },
  { year: '2024', count: 47000 },
];

const accuracyData = [
  { year: '2005', accuracy: 82 },
  { year: '2010', accuracy: 85 },
  { year: '2015', accuracy: 88 },
  { year: '2020', accuracy: 91 },
  { year: '2024', accuracy: 95 },
  { year: '2026', accuracy: 98 },
];

const synergyData = [
  { name: 'Media', value: 4500 },
  { name: 'NGO', value: 3200 },
  { name: 'Gov', value: 2800 },
  { name: 'Univ', value: 3979 },
];

const Stats = () => {
  return (
    <section className="relative w-full py-32 px-4 flex flex-col items-center overflow-hidden min-h-screen">
       {/* Background Video */}
       <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4"
      />
      
      {/* Overlay for contrast */}
      <div className="absolute inset-0 bg-white/40 z-10 backdrop-blur-sm pointer-events-none" />

      <div className="relative z-20 max-w-7xl w-full">
        <div className="flex flex-col items-center mb-24">
          <motion.span 
            initial={{ opacity: 0, tracking: '0.1em' }}
            whileInView={{ opacity: 1, tracking: '0.3em' }}
            viewport={{ once: true }}
            className="text-xs font-semibold text-sky-900/60 uppercase mb-4"
          >
            Digital Truth Monitoring
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-8xl font-bold tracking-tight text-slate-900 text-center font-instrument italic leading-none drop-shadow-sm"
          >
            Skala Dampak Nasional
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center">
          {/* Card 1: Hoax Records */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full"
          >
            <AnimatedCard className="mx-auto">
              <CardVisual className="bg-sky-50/50 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hoaxData}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="count" stroke="#0284c7" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="absolute top-4 left-4 font-mono text-[10px] text-sky-600/60 uppercase">Real-time Archive Growth</div>
              </CardVisual>
              <CardBody>
                <CardTitle className="text-sky-600">47,000+ Arsip</CardTitle>
                <CardDescription>Database hoaks nasional tervalidasi secara kumulatif.</CardDescription>
              </CardBody>
            </AnimatedCard>
          </motion.div>

          {/* Card 2: Accuracy Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="w-full"
          >
            <AnimatedCard className="mx-auto">
              <CardVisual className="bg-emerald-50/50 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={accuracyData}>
                    <Line type="stepAfter" dataKey="accuracy" stroke="#059669" strokeWidth={3} dot={{ fill: '#059669', r: 4 }} activeDot={{ r: 6 }} />
                    <XAxis dataKey="year" hide />
                    <YAxis hide domain={[80, 100]} />
                  </LineChart>
                </ResponsiveContainer>
                <div className="absolute top-4 left-4 font-mono text-[10px] text-emerald-600/60 uppercase">Precision Verification 2005-2026</div>
              </CardVisual>
              <CardBody>
                <CardTitle className="text-emerald-600">Akurasi 2005 - 2026</CardTitle>
                <CardDescription>Tingkat verifikasi fakta dengan presisi tinggi di atas 95%.</CardDescription>
              </CardBody>
            </AnimatedCard>
          </motion.div>

          {/* Card 3: Network Synergy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-full"
          >
            <AnimatedCard className="mx-auto">
              <CardVisual className="bg-amber-50/50 p-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={synergyData}>
                    <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                      {synergyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#d97706', '#f59e0b', '#fbbf24', '#fcd34d'][index]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="absolute top-4 left-4 font-mono text-[10px] text-amber-600/60 uppercase">Ecosystem Synergy Network</div>
              </CardVisual>
              <CardBody>
                <CardTitle className="text-amber-600">14,479+ Keywords</CardTitle>
                <CardDescription>Kolaborasi jaringan media, institusi, dan masyarakat sipil.</CardDescription>
              </CardBody>
            </AnimatedCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Stats;

