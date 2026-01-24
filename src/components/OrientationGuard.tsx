import React from 'react';
import { BookOpen } from 'lucide-react';

export const OrientationGuard: React.FC = () => {
    return (
        <div className="rotate-device-screen">
            <div className="rotate-icon">
                <BookOpen size={64} />
            </div>
            <p>Please rotate your device to portrait mode</p>
            <style>{`
        .rotate-device-screen {
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: var(--bg-primary);
          color: var(--color-text);
          text-align: center;
          padding: 20px;
        }
        .rotate-icon {
          margin-bottom: 20px;
          color: var(--color-green);
          animation: rotate 2s infinite ease-in-out;
        }
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(-90deg); }
          75% { transform: rotate(-90deg); }
          100% { transform: rotate(0deg); }
        }
        p {
          font-size: 1.2rem;
          font-weight: 500;
        }
      `}</style>
        </div>
    );
};
