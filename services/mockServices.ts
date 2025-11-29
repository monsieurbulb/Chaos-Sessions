
import { User, LiveEvent, VideoSession, Provenance, Ticket, Asset } from '../types';
import { MOCK_EVENTS, MOCK_CONTACTS } from '../constants';

// Simulated Virto Connect Interaction
export const connectWallet = async (): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        address: '0x71C...9A23',
        alias: 'Seed',
        isAuthenticated: true,
        subscribedEvents: [],
        tickets: [],
        assets: [],
        balance: 1250.00,
        points: 850,
        addressBook: MOCK_CONTACTS,
      });
    }, 1500); // Simulate network delay
  });
};

// Simulated Feather Indexer Fetch
// In a real app, this would query a blockchain node or subgraph
export const fetchEvents = async (): Promise<LiveEvent[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_EVENTS);
    }, 800);
  });
};

// RSS Feed Simulation / Ticket Generation
export const subscribeToEvent = (user: User, eventId: string, ticketType?: Ticket['type']): User => {
  const alreadySubscribed = user.subscribedEvents.includes(eventId);
  
  let newSubs = user.subscribedEvents;
  let newTickets = user.tickets;
  let newAssets = user.assets;

  // Toggle subscription
  if (alreadySubscribed) {
    // Unsubscribe and remove ticket if exists
    newSubs = user.subscribedEvents.filter(id => id !== eventId);
    newTickets = user.tickets.filter(t => t.eventId !== eventId);
    // Note: We typically don't burn assets on unsubscribe in this mock, but let's leave it simple
  } else {
    // Subscribe
    newSubs = [...user.subscribedEvents, eventId];
    
    // Generate Ticket if type provided
    if (ticketType) {
      const newTicket: Ticket = {
        eventId,
        type: ticketType,
        accessCode: `${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        qrData: `virto://${eventId}/${user.address}/${Date.now()}`,
        timestamp: Date.now()
      };
      newTickets = [...user.tickets, newTicket];

      // Logic: If event is "Block Power Music" (e4), mint a Locked Asset
      if (eventId === 'e4') {
        const existingAsset = user.assets.find(a => a.eventId === eventId);
        if (!existingAsset) {
            const newAsset: Asset = {
                id: `asset-${Date.now()}`,
                title: 'Block Power Music 005',
                description: 'Limited Edition Digital Poster. Asset will unlock on confirmation of attendance.',
                imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600&auto=format&fit=crop', // Abstract digital art placeholder
                status: 'locked', // Default to locked until attendance confirmed
                eventId: eventId,
                tokenId: `#${Math.floor(Math.random() * 5000)}`
            };
            newAssets = [...user.assets, newAsset];
        }
      }
    }
  }
  
  return {
    ...user,
    subscribedEvents: newSubs,
    tickets: newTickets,
    assets: newAssets
  };
};

// --- CMS / Admin Services ---

export const adminLogin = async (password: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(password === 'chaos');
    }, 1000);
  });
};

export const pinToIpfs = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return a mock CID
      resolve(`Qm${Math.random().toString(36).substring(2, 15)}XyZ${Math.random().toString(36).substring(2, 6)}`);
    }, 2000); // Simulate upload latency
  });
};

export const mintFeather = async (
  metadata: Omit<VideoSession, 'id' | 'provenance' | 'date'>, 
  ipfsCid: string
): Promise<VideoSession> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const id = `v${Date.now()}`;
      const now = new Date();
      
      const newVideo: VideoSession = {
        id,
        ...metadata,
        date: now.toISOString().split('T')[0],
        provenance: {
          ipfsCid,
          transactionHash: `0x${Math.random().toString(16).substring(2, 40)}`,
          blockNumber: 18452000 + Math.floor(Math.random() * 100),
          timestamp: Date.now()
        }
      };
      
      resolve(newVideo);
    }, 2500); // Simulate block time
  });
};
