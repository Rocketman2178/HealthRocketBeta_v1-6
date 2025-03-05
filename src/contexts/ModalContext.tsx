import React, { createContext, useContext, useState, useEffect } from 'react';
import { LeaderboardEntry } from '../types/community';
import { PlayerProfileModal } from '../components/dashboard/rank/PlayerProfileModal';
import { ModalPosition } from '../components/dashboard/rank/CommunityLeaderboard';

interface ModalContextType {
  showPlayerProfile: (player: LeaderboardEntry, position?: ModalPosition) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playerProfile, setPlayerProfile] = useState<LeaderboardEntry | null>(null);
  const [modalPosition, setModalPosition] = useState<ModalPosition | undefined>(undefined);

  const showPlayerProfile = (player: LeaderboardEntry, position?: ModalPosition) => {
    setPlayerProfile(player);
    setModalPosition(position);
  };

  const hideModal = () => {
    setPlayerProfile(null);
  };

  useEffect(() => {
    // Lock body scroll when modal is open
    if (playerProfile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [playerProfile]);

  return (
    <ModalContext.Provider value={{ showPlayerProfile, hideModal }}>
      {children}
      
      {/* Global Modal Container - Always present in DOM but only visible when needed */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: playerProfile ? 'auto' : 'none', zIndex: 9999 }}>
        {playerProfile && (
          <>
            {/* Full-screen backdrop with blur */}
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(4px)',
                zIndex: 1
              }}
              onClick={hideModal}
            />
            
            {/* Modal Content */}
            <div style={{ position: 'relative', zIndex: 2, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PlayerProfileModal 
                player={playerProfile} 
                onClose={hideModal} 
                position={modalPosition} 
                applyPosition={!!modalPosition}
              />
            </div>
          </>
        )}
      </div>
    </ModalContext.Provider>
  );
};