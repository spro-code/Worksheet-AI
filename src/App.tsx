import './App.css';
import { AnimatePresence, motion } from 'framer-motion';
import { useWorksheetStore } from './store/worksheetStore';
import { Library } from './components/Library/Library';
import { CreateMethod } from './components/Creation/CreateMethod';
import { AIGenerate } from './components/Creation/AIGenerate';
import { BuildFromScratch } from './components/Creation/BuildFromScratch';
import { ImportDocument } from './components/Creation/ImportDocument';
import { WorksheetEditor } from './components/Editor/WorksheetEditor';
import { Marketplace } from './components/Marketplace/Marketplace';
import { Caseload } from './components/Caseload/Caseload';
import { LeftNav } from './components/Layout/LeftNav';
import { pageVariants } from './lib/motion';

function App() {
  const { currentView } = useWorksheetStore();

  const renderView = () => {
    switch (currentView) {
      case 'library':       return <Library />;
      case 'marketplace':   return <Marketplace />;
      case 'caseload':      return <Caseload />;
      case 'create_method': return <CreateMethod />;
      case 'ai_generate':   return <AIGenerate />;
      case 'build_scratch': return <BuildFromScratch />;
      case 'import_doc':    return <ImportDocument />;
      case 'editor':        return <WorksheetEditor />;
      default:              return <Library />;
    }
  };

  if (currentView === 'editor') {
    return (
      <div className="h-screen flex flex-col overflow-hidden">
        {renderView()}
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <LeftNav />
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            className="absolute inset-0 flex flex-col"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
