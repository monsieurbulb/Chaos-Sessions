
import { supabase } from '../supabaseClient';
import { VideoSession } from '../types';

// Fetch all videos from Supabase
export const fetchVideos = async (): Promise<VideoSession[]> => {
  // Check if Supabase is configured before attempting fetch
  // This prevents "NetworkError" when using the default placeholder URL
  // @ts-ignore - supabaseUrl is available on the client instance
  const url = supabase.supabaseUrl;
  if (!url || url.includes('YOUR_PROJECT_ID')) {
      console.warn('Supabase credentials not configured in supabaseClient.ts. Falling back to local mock data.');
      return [];
  }

  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching videos:', error);
    return [];
  }

  // Map SQL columns to our App Types
  return data.map((row: any) => ({
    id: row.id,
    title: row.title,
    guest: row.guest,
    description: row.description,
    videoUrl: row.video_url,
    thumbnailUrl: row.thumbnail_url,
    date: row.date,
    provenance: {
      ipfsCid: row.ipfs_cid || 'pending...',
      transactionHash: row.tx_hash || 'pending...',
      blockNumber: 18452000, // Hardcoded or fetch latest block
      timestamp: new Date(row.created_at).getTime()
    }
  }));
};

// Upload Thumbnail to Supabase Storage
export const uploadThumbnail = async (file: File): Promise<string | null> => {
  // Check config
  // @ts-ignore
  const url = supabase.supabaseUrl;
  if (!url || url.includes('YOUR_PROJECT_ID')) {
      throw new Error("Supabase not configured. Cannot upload.");
  }

  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
  
  const { data, error } = await supabase.storage
    .from('cms-assets')
    .upload(fileName, file);

  if (error) {
    console.error('Error uploading image:', error);
    return null;
  }

  // Get Public URL
  const { data: { publicUrl } } = supabase.storage
    .from('cms-assets')
    .getPublicUrl(fileName);

  return publicUrl;
};

// "Mint" Video (Save to DB)
export const publishVideo = async (video: Omit<VideoSession, 'id' | 'provenance' | 'date'>, ipfsCid: string): Promise<VideoSession | null> => {
  // Check config
  // @ts-ignore
  const url = supabase.supabaseUrl;
  if (!url || url.includes('YOUR_PROJECT_ID')) {
      throw new Error("Supabase not configured. Cannot save to DB.");
  }

  const id = `v${Date.now()}`;
  const now = new Date();
  const txHash = `0x${Math.random().toString(16).substring(2, 40)}`; // Simulating a hash for now

  const { error } = await supabase
    .from('videos')
    .insert([
      {
        id: id,
        title: video.title,
        guest: video.guest,
        description: video.description,
        video_url: video.videoUrl,
        thumbnail_url: video.thumbnailUrl,
        date: now.toISOString().split('T')[0],
        ipfs_cid: ipfsCid,
        tx_hash: txHash
      }
    ]);

  if (error) {
    console.error('Error creating video:', error);
    return null;
  }

  // Return the constructed object for UI update
  return {
    id,
    ...video,
    date: now.toISOString().split('T')[0],
    provenance: {
      ipfsCid,
      transactionHash: txHash,
      blockNumber: 18452100,
      timestamp: Date.now()
    }
  };
};
