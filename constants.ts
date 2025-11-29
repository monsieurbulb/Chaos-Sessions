
import { VideoSession, LiveEvent, Contact } from './types';

export const MOCK_VIDEOS: VideoSession[] = [
  {
    id: 'v1',
    title: 'Relativistic Economics',
    guest: 'Dr. A. Vance',
    description: 'Dispatches from the frontiers of collective intelligence',
    thumbnailUrl: 'https://picsum.photos/800/450?grayscale&blur=2',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    date: '2023-10-24',
  },
  {
    id: 'v2',
    title: 'Networked Narratives',
    guest: 'Sarah Void',
    description: 'How stories propagate through decentralised mesh networks without central authority.',
    thumbnailUrl: 'https://picsum.photos/800/451?grayscale&blur=2',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    date: '2023-11-02',
  },
  {
    id: 'v3',
    title: 'Incentive Alignment 101',
    guest: 'Proto-DAO Core',
    description: 'Game theory applied to digital organisations.',
    thumbnailUrl: 'https://picsum.photos/800/452?grayscale&blur=2',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    date: '2023-11-15',
  },
  {
    id: 'v4',
    title: 'The Organic Digital',
    guest: 'Moss Architect',
    description: 'Biomimicry in software architecture.',
    thumbnailUrl: 'https://picsum.photos/800/453?grayscale&blur=2',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    date: '2023-12-01',
  },
];

export const MOCK_EVENTS: LiveEvent[] = [
  {
    id: 'e1',
    title: 'Virto Monthly: Community',
    date: '2025-05-20T18:00:00Z',
    description: 'A round table discussion on the state of peer-to-peer protocols.',
    status: 'upcoming',
    locationType: 'online',
    ipfsHash: 'QmHash123...',
  },
  {
    id: 'e2',
    title: 'Workshop: Feather Indexing',
    date: '2025-06-15T14:00:00Z',
    description: 'Technical deep dive into decentralised event indexing.',
    status: 'upcoming',
    locationType: 'online',
    ipfsHash: 'QmHash456...',
  },
  {
    id: 'e4',
    title: 'Block Power Music: Producer Cypher',
    date: '2025-12-05T20:00:00Z',
    description: 'A live sequenced b2b beat cypher for beat makers in or out of the box! Hosted by Kwake Bass',
    status: 'upcoming',
    locationType: 'hybrid',
    ipfsHash: 'QmHashBPM...',
    imageUrl: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: 'e3',
    title: 'Chaos Community Call',
    date: '2025-04-10T10:00:00Z',
    description: 'Monthly sync with the chaos engineers.',
    status: 'ended',
    locationType: 'online',
    ipfsHash: 'QmHash789...',
  },
];

export const MOCK_CONTACTS: Contact[] = [
  { alias: 'Alice (Validator)', address: '0x3F28...1A9B' },
  { alias: 'Bob (Curator)', address: '0x8A10...4C2D' },
  { alias: 'Chaos Treasury', address: '0x0000...CHAOS' },
  { alias: 'Kwake Bass', address: '0x7B12...9F88' },
];
