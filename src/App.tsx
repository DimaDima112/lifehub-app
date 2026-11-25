import { HashRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './modules/dashboard';
import Topics from './modules/topics';
import TopicDetail from './modules/topicDetail';
import Planner from './modules/planner';
import Ideas from './modules/ideas';
import YearPlan from './modules/yearplan';
import Finance from './modules/finance';
import Dates from './modules/dates';
import Health from './modules/health';
import Templates from './modules/templates';
import Settings from './modules/settings';
import More from './modules/more';
import BottomNav from './components/BottomNav';
import ReminderBanner from './components/ReminderBanner';
import Toast from './components/Toast';
import ScrollToTop from './components/ScrollToTop';
import Fab from './components/Fab';
import GlobalSearch from './components/GlobalSearch';
import Hotkeys from './components/Hotkeys';

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-100 dark:bg-black flex justify-center">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 min-h-screen relative shadow-xl overflow-x-hidden">
          <ScrollToTop />
          <Toast />
          <ReminderBanner />
          <div className="pb-24">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/topics" element={<Topics />} />
              <Route path="/topic/:id" element={<TopicDetail />} />
              <Route path="/planner" element={<Planner />} />
              <Route path="/planner/:date" element={<Planner />} />
              <Route path="/ideas" element={<Ideas />} />
              <Route path="/year" element={<YearPlan />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/dates" element={<Dates />} />
              <Route path="/health" element={<Health />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/more" element={<More />} />
            </Routes>
          </div>
          <BottomNav />
          <Fab />
          <GlobalSearch />
          <Hotkeys />
        </div>
      </div>
    </HashRouter>
  );
}
