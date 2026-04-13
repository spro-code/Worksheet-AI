import { Sparkles, PenLine, Upload, ArrowLeft, Zap, BookOpen, FileText, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWorksheetStore } from '../../store/worksheetStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cardGridVariants, cardItemVariants, itemVariants, listVariants } from '@/lib/motion';

export function CreateMethod() {
  const { setCurrentView } = useWorksheetStore();

  const methods = [
    {
      id: 'ai_generate' as const,
      icon: <Sparkles size={22} className="text-gray-900" />,
      label: 'AI Generated',
      badge: 'Fastest',
      badgeVariant: 'default' as const,
      description: 'Generate a complete worksheet in seconds using AI. Provide a topic, grade, or student data.',
      features: ['Generates questions instantly', 'AI image generation', 'Goal alignment', 'Multiple question types'],
      cta: 'Generate with AI',
      ctaVariant: 'gradient' as const,
      popular: true,
      iconBg: 'bg-gray-50',
    },
    {
      id: 'build_scratch' as const,
      icon: <PenLine size={22} className="text-blue-500" />,
      label: 'Build from Scratch',
      badge: 'Full Control',
      badgeVariant: 'info' as const,
      description: 'Start with a blank canvas. Add questions and formatting manually. AI assistant available.',
      features: ['9 question types', 'Section organisation', 'Answer keys', 'AI sidebar available'],
      cta: 'Start Building',
      ctaVariant: 'outline' as const,
      popular: false,
      iconBg: 'bg-blue-50',
    },
    {
      id: 'import_doc' as const,
      icon: <Upload size={22} className="text-emerald-500" />,
      label: 'Import Document',
      badge: 'Upload & Convert',
      badgeVariant: 'success' as const,
      description: 'Upload an existing worksheet (PDF, DOCX, image) and convert it to an editable format.',
      features: ['PDF, DOCX, TXT, Images', 'Auto question extraction', 'AI improvement', 'Editable output'],
      cta: 'Import Document',
      ctaVariant: 'outline' as const,
      popular: false,
      iconBg: 'bg-emerald-50',
    },
  ];

  return (
    <div className="h-full overflow-y-auto">
    <div className="max-w-4xl mx-auto px-6 py-10">
      <Button variant="ghost" size="sm" onClick={() => setCurrentView('library')} className="mb-7 -ml-1 text-gray-500">
        <ArrowLeft size={15} /> Back to Library
      </Button>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="default" className="gap-1.5"><Zap size={11} /> Create New Worksheet</Badge>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-1.5">How would you like to start?</h1>
        <p className="text-gray-500 text-sm max-w-lg">
          Choose your creation method. AI assistance is available regardless of how you start.
        </p>
      </div>

      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10" variants={cardGridVariants} initial="hidden" animate="show">
        {methods.map((method) => (
          <motion.div
            key={method.id}
            variants={cardItemVariants}
            whileHover={{ y: -4, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentView(method.id)}
          >
          <Card
            className={`relative cursor-pointer hover:shadow-md hover:shadow-gray-100 transition-all duration-200 border-gray-100 hover:border-gray-200 flex flex-col ${method.popular ? 'ring-2 ring-[#1A8917]/25 ring-offset-0 border-[#1A8917]/20' : ''}`}
          >
            {method.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="shadow-sm shadow-gray-200">⭐ Most Popular</Badge>
              </div>
            )}
            <CardContent className="p-5 flex flex-col gap-4 flex-1">
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-lg ${method.iconBg} flex items-center justify-center`}>
                  {method.icon}
                </div>
                <Badge variant={method.badgeVariant}>{method.badge}</Badge>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{method.label}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{method.description}</p>
              </div>

              <ul className="space-y-1.5 flex-1">
                {method.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-gray-500">
                    <Check size={12} className="text-[#1A8917] shrink-0" /> {f}
                  </li>
                ))}
              </ul>

              <Button
                variant={method.ctaVariant}
                className="w-full"
                onClick={(e) => { e.stopPropagation(); setCurrentView(method.id); }}
              >
                {method.cta}
              </Button>
            </CardContent>
          </Card>
          </motion.div>
        ))}
      </motion.div>

      <Separator className="mb-7 bg-gray-100" />

      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick start from your data</p>
        <motion.div className="flex flex-wrap gap-2" variants={listVariants} initial="hidden" animate="show">
          {[
            { icon: <BookOpen size={14} />, label: 'IEP Goals' },
            { icon: <FileText size={14} />, label: 'Session Notes' },
            { icon: <Sparkles size={14} />, label: 'Progress Data' },
            { icon: <Zap size={14} />, label: 'Goal Mastery' },
          ].map((item) => (
            <motion.div key={item.label} variants={itemVariants}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentView('ai_generate')}
              >
                {item.icon}
                {item.label}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
    </div>
  );
}
