import { useState } from 'react';
import { motion } from 'framer-motion';
import { Box } from 'lucide-react';

export default function ThreeScene({ modelUrl }) {
  const [isLoading, setIsLoading] = useState(true);

  // Placeholder for Three.js integration
  // This would be replaced with actual @react-three/fiber implementation
  const ScenePlaceholder = () => (
    <div className="w-full h-full bg-gradient-to-br from-dark-800 to-dark-900 flex items-center justify-center">
      <div className="text-center text-white/60">
        <Box className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium">3D Scene Viewer</p>
        <p className="text-sm mt-2">Three.js / React Three Fiber integration</p>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full rounded-xl overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-dark-900">
          <div className="text-white text-sm">Loading 3D scene...</div>
        </div>
      )}
      <ScenePlaceholder />
    </div>
  );
}
