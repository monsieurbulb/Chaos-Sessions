

export interface Ticket {
  eventId: string;
  type: 'online' | 'irl' | 'both';
  accessCode: string;
  qrData: string; // Mock string for QR generation
  timestamp: number;
}

export interface Contact {
  alias: string;
  address: string;
}

export interface Asset {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  status: 'locked' | 'unlocked';
  eventId?: string;
  tokenId?: string;
}

export interface User {
  address: string;
  alias?: string;
  isAuthenticated: boolean;
  subscribedEvents: string[]; // IDs of subscribed events
  tickets: Ticket[];
  assets: Asset[];
  balance: number; // dUSD balance
  points: number; // Network contribution points
  addressBook: Contact[];
}

export interface Provenance {
  ipfsCid: string;
  transactionHash: string;
  blockNumber: number;
  timestamp: number;
}

export interface VideoSession {
  id: string;
  title: string;
  guest: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string; // Direct stream or playback URL
  date: string;
  provenance?: Provenance; // Optional provenance data for Feather/Blockchain tracking
}

export type LocationType = 'online' | 'irl' | 'hybrid';

export interface LiveEvent {
  id: string;
  title: string;
  date: string; // ISO string
  description: string;
  status: 'upcoming' | 'live' | 'ended';
  locationType: LocationType;
  ipfsHash?: string; // Simulating Feather Indexer IPFS pointer
  imageUrl?: string;
}

export type ViewMode = 'home' | 'profile' | 'docs' | 'admin-login' | 'cms' | 'status';

export type ProfileViewMode = 'transactions' | 'relations' | 'seed';
export type PrivacyMode = 'private' | 'public';

export interface ChainTransaction {
  hash: string;
  block: number;
  method: string;
  timestamp: string;
  to?: string;
  value?: string;
  from?: string;
}

export type Language = 'en' | 'fr' | 'es' | 'zh';
export type Theme = 'light' | 'dark';

export interface Translations {
  nav: {
    stream: string;
    docs: string;
    connect: string;
    exit: string;
  };
  auth: {
    title: string;
    description: string;
    browser_wallet: string;
    wallet_connect: string;
    learn_more: string;
    connect_btn: string;
  };
  home: {
    upcoming: string;
    archives: string;
    select_session: string;
    restricted: string;
    restricted_desc: string;
    connect_seed: string;
    provenance: string;
  };
  profile: {
    identity_not_found: string;
    identity_desc: string;
    subscriptions: string;
    tickets: string;
    assets: string;
    balance: string;
    reputation: string;
    node_status: string;
    perspective: string;
    data_layer: string;
    private: string;
    public: string;
    transactions: string;
    relations: string;
    identity: string;
    upcoming_header: string;
    no_subs: string;
    digital_collectibles: string;
    locked: string;
    event_package: string;
    related_assets: string;
    your_ticket: string;
    view_ticket: string;
    unlock_condition: string;
    how_to_unlock: string;
    asset_teaser: string;
    close: string;
    rep_participation_desc: string;
    rep_network_desc: string;
    rep_sybil_desc: string;
    rep_curation_desc: string;
  };
  wallet: {
    title: string;
    send: string;
    receive: string;
    deposit: string;
    withdraw: string;
    redeem: string;
    points_desc: string;
  };
}