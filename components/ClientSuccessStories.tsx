
import React from 'react';
import { 
    CpuIcon, 
    MusicIcon, 
    ActivityIcon, 
    RocketIcon, 
    TruckIcon, 
    LightbulbIcon, 
    StarIcon 
} from './icons.tsx';

const ClientSuccessStories: React.FC = () => {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 font-geist overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl tracking-tight mb-4 font-playfair font-medium text-gray-100">
            Trusted by <span class="font-playfair font-medium text-blue-400">industry leaders</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto font-geist text-gray-400">
            See how companies are replacing manual spreadsheets with automated AI insights.
          </p>
        </div>

        <div className="masonry-grid animate-stagger">
          {/* Card 1 */}
          <div className="masonry-item">
            <div className="card-hover rounded-2xl border p-6 shadow-sm bg-[#0A0A0A] border-gray-800">
              <div className="flex items-center gap-4 mb-6">
                <img src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?fit=crop&w=80&q=80" alt="" className="w-12 h-12 rounded-full object-cover" />
                <div className="">
                  <p className="font-medium font-geist text-gray-100">Hiroki Tanaka</p>
                  <p className="text-sm text-gray-500 font-geist">Operations Lead · Nexus Robotics</p>
                </div>
                <div className="ml-auto">
                  <CpuIcon className="w-5 h-5 text-gray-600" />
                </div>
              </div>
              <p className="leading-relaxed text-gray-300 font-geist mb-4">
                "We went from spending 15 hours a week on manual Excel reports to zero. The AI just reads our raw production data and updates the KPIs instantly."
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-gray-900">
                <div className="flex items-center gap-1">
                  <StarIcon className="w-4 h-4 fill-current text-yellow-600" />
                  <span className="text-sm font-geist text-gray-400">4.9/5 Rating</span>
                </div>
                <span className="text-sm text-gray-500 font-geist">Tokyo, Japan</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="masonry-item">
            <div className="card-hover rounded-2xl border p-6 shadow-sm bg-[#0A0A0A] border-gray-800">
              <div className="flex items-center gap-4 mb-6">
                <img src="https://images.unsplash.com/photo-1552058544-f2b08422138a?fit=crop&w=80&q=80" alt="" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-medium font-geist text-gray-100">Serena Cardenas</p>
                  <p className="text-sm text-gray-500 font-geist">Data Analyst · TidalWave Music</p>
                </div>
                <div className="ml-auto">
                  <MusicIcon className="w-5 h-5 text-gray-600" />
                </div>
              </div>
              <p className="mb-6 leading-relaxed font-geist text-gray-300">
                "The AI agent didn't just visualize our sales data; it found correlations we missed. It's like having a data scientist on call 24/7 to explain the 'why' behind the numbers."
              </p>
              <div className="rounded-xl p-4 mb-6 border bg-gray-950 border-gray-900">
                <p className="text-sm font-medium mb-2 font-geist text-gray-100">Key Results:</p>
                <ul className="text-sm space-y-1 text-gray-400">
                  <li className="font-geist">• 90% faster reporting cycles</li>
                  <li className="font-geist">• Real-time anomaly detection</li>
                  <li className="font-geist">• Automated executive summaries</li>
                </ul>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-gray-900">
                <div className="flex items-center gap-1">
                  <StarIcon className="w-4 h-4 fill-current text-yellow-600" />
                  <span className="text-sm font-geist text-gray-400">5.0/5 Rating</span>
                </div>
                <span className="text-sm text-gray-500 font-geist">Los Angeles, CA</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="masonry-item">
            <div className="card-hover rounded-2xl border p-6 shadow-sm bg-[#0A0A0A] border-gray-800">
              <div className="flex items-center gap-4 mb-6">
                <img src="https://images.unsplash.com/photo-1550525811-e5869dd03032?fit=crop&w=80&q=80" alt="" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-medium font-geist text-gray-100">Armand Liu</p>
                  <p className="text-sm text-gray-500 font-geist">CFO · Aurora Health</p>
                </div>
                <div className="ml-auto">
                  <ActivityIcon className="w-5 h-5 text-gray-600" />
                </div>
              </div>
              <p className="mb-4 leading-relaxed font-geist text-gray-300">
                "I uploaded our messy financial sheets, and within minutes, I had a board-ready dashboard. No complex formulas, no DAX coding, just instant clarity."
              </p>
              <div className="flex gap-2 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border font-geist bg-green-900/30 text-green-200 border-green-800">Finance</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border font-geist bg-blue-900/30 text-blue-200 border-blue-800">Automated Reporting</span>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-gray-900">
                <div className="flex items-center gap-1">
                  <StarIcon className="w-4 h-4 fill-current text-yellow-600" />
                  <span className="text-sm font-geist text-gray-400">4.8/5 Rating</span>
                </div>
                <span className="text-sm text-gray-500 font-geist">Seattle, WA</span>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="masonry-item">
            <div className="card-hover rounded-2xl border p-6 shadow-sm bg-[#0A0A0A] border-gray-800">
              <div className="flex items-center gap-4 mb-6">
                <img src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?fit=crop&w=80&q=80" alt="" className="w-12 h-12 rounded-full object-cover" />
                <div className="">
                  <p className="font-medium font-geist text-gray-100">Nyah Obeng</p>
                  <p className="text-sm text-gray-500 font-geist">Marketing Dir. · HelioSpace</p>
                </div>
                <div className="ml-auto">
                  <RocketIcon className="w-5 h-5 text-gray-600" />
                </div>
              </div>
              <p className="mb-4 leading-relaxed font-geist text-gray-300">
                "Aggregating campaign data from 5 different sources used to be a nightmare. OneQlek's AI unified it into a single source of truth without us needing an IT team."
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-gray-900">
                <div className="flex items-center gap-1">
                  <StarIcon className="w-4 h-4 fill-current text-yellow-600" />
                  <span className="text-sm font-geist text-gray-400">4.9/5 Rating</span>
                </div>
                <span className="text-sm text-gray-500 font-geist">Houston, TX</span>
              </div>
            </div>
          </div>

          {/* Card 5 */}
          <div className="masonry-item">
            <div className="card-hover rounded-2xl border p-6 shadow-sm bg-[#0A0A0A] border-gray-800">
              <div className="flex items-center gap-4 mb-6">
                <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?fit=crop&w=80&q=80" alt="" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-medium font-geist text-gray-100">Mateo Fernandez</p>
                  <p className="text-sm text-gray-500 font-geist">Logistics Mgr · Sphere Logistics</p>
                </div>
                <div className="ml-auto">
                  <TruckIcon className="w-5 h-5 text-gray-600" />
                </div>
              </div>
              <div className="mb-4 pl-4 border-l-2 border-blue-800">
                <p className="leading-relaxed italic font-geist text-gray-300">
                  "The predictive forecasting model built by the AI was scarily accurate. It helped us optimize inventory levels weeks before the peak season started."
                </p>
              </div>
              <div className="rounded-xl p-4 mb-6 border bg-blue-950/30 border-blue-900">
                <p className="text-sm font-medium mb-2 font-geist text-blue-100">Impact Metrics:</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="font-geist text-gray-400">Forecast Accuracy</span>
                    <span className="font-medium font-geist text-green-400">+23%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-geist text-gray-400">Admin Hours Saved</span>
                    <span className="font-medium font-geist text-green-400">20hrs/week</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-geist text-gray-400">Inventory ROI</span>
                    <span className="font-medium font-geist text-green-400">+15%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-gray-900">
                <div className="flex items-center gap-1">
                  <StarIcon className="w-4 h-4 fill-current text-yellow-600" />
                  <span className="text-sm font-geist text-gray-400">5.0/5 Rating</span>
                </div>
                <span className="text-sm text-gray-500 font-geist">Miami, FL</span>
              </div>
            </div>
          </div>

          {/* Card 6 */}
          <div className="masonry-item">
            <div className="card-hover rounded-2xl border p-6 shadow-sm bg-[#0A0A0A] border-gray-800">
              <div className="flex items-center gap-4 mb-6">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=80&q=80" alt="" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-medium font-geist text-gray-100">Amira Kaplan</p>
                  <p className="text-sm text-gray-500 font-geist">CEO · Lumen Learning</p>
                </div>
                <div className="ml-auto">
                  <LightbulbIcon className="w-5 h-5 text-gray-600" />
                </div>
              </div>
              <p className="mb-4 leading-relaxed font-geist text-gray-300">
                "Finally, a dashboard that speaks the language of our C-suite. The automated narrative insights explain the 'why' behind the numbers, saving me hours of prep time for board meetings."
              </p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center rounded-xl p-4 border bg-gray-950 border-gray-900">
                  <div className="text-2xl font-playfair font-medium text-blue-400">100%</div>
                  <div className="text-xs text-gray-500 font-geist">Data Visibility</div>
                </div>
                <div className="text-center rounded-xl p-4 border bg-gray-950 border-gray-900">
                  <div className="text-2xl font-playfair font-medium text-green-400">-80%</div>
                  <div className="text-xs text-gray-500 font-geist">Manual Work</div>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-gray-900">
                <div className="flex items-center gap-1">
                  <StarIcon className="w-4 h-4 fill-current text-yellow-600" />
                  <span className="text-sm font-geist text-gray-400">4.7/5 Rating</span>
                </div>
                <span className="text-sm text-gray-500 font-geist">Boston, MA</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .masonry-grid {
          column-count: 1;
          column-gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .masonry-grid { column-count: 2; }
        }
        @media (min-width: 1024px) {
          .masonry-grid { column-count: 3; }
        }
        .masonry-item {
          break-inside: avoid;
          page-break-inside: avoid;
          margin-bottom: 1.5rem;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-stagger .masonry-item {
          opacity: 0;
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-stagger .masonry-item:nth-child(1) { animation-delay: 0.1s; }
        .animate-stagger .masonry-item:nth-child(2) { animation-delay: 0.2s; }
        .animate-stagger .masonry-item:nth-child(3) { animation-delay: 0.3s; }
        .animate-stagger .masonry-item:nth-child(4) { animation-delay: 0.4s; }
        .animate-stagger .masonry-item:nth-child(5) { animation-delay: 0.5s; }
        .animate-stagger .masonry-item:nth-child(6) { animation-delay: 0.6s; }
        .card-hover {
          transition: all 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
      `}</style>
    </section>
  );
};

export default ClientSuccessStories;
