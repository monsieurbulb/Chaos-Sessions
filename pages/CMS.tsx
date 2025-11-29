
import React, { useState } from 'react';
import { VideoSession } from '../types';
import { pinToIpfs, mintFeather } from '../services/mockServices';
import { Upload, FileVideo, Feather, CheckCircle, Box, Hash } from 'lucide-react';

interface CMSProps {
  onAddVideo: (video: VideoSession) => void;
  onExit: () => void;
}

export const CMS: React.FC<CMSProps> = ({ onAddVideo, onExit }) => {
  const [formData, setFormData] = useState({
    title: '',
    guest: '',
    description: '',
    videoUrl: '',
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'pinning' | 'minting' | 'success'>('idle');
  const [lastMint, setLastMint] = useState<VideoSession | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thumbnailFile) return;

    setStatus('pinning');
    
    // 1. Pin Asset to IPFS
    const cid = await pinToIpfs(thumbnailFile);
    
    setStatus('minting');

    // 2. Create System Remark (Mint Feather)
    // We use a fake URL creator for the thumbnail preview in this demo, 
    // but in reality we'd use the IPFS gateway URL
    const previewUrl = URL.createObjectURL(thumbnailFile);
    
    const newVideo = await mintFeather({
      ...formData,
      thumbnailUrl: previewUrl,
    }, cid);

    onAddVideo(newVideo);
    setLastMint(newVideo);
    setStatus('success');
    
    // Reset form after delay? No, let them see the success.
  };

  const resetForm = () => {
    setFormData({ title: '', guest: '', description: '', videoUrl: '' });
    setThumbnailFile(null);
    setStatus('idle');
    setLastMint(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between pb-6 border-b border-chaos-border">
        <div>
          <h1 className="text-2xl font-light text-white flex items-center gap-2">
            <Feather className="w-6 h-6 text-chaos-accent" />
            Feather Protocol CMS
          </h1>
          <p className="text-chaos-muted font-mono text-xs mt-2">NETWORK ADMINISTRATION // NODE: ACTIVE</p>
        </div>
        <button onClick={onExit} className="text-xs text-chaos-muted hover:text-white underline">
          Exit Terminal
        </button>
      </div>

      {status === 'success' && lastMint && (
        <div className="bg-chaos-organic/10 border border-chaos-organic p-6 rounded-lg animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-chaos-accent" />
            <h3 className="text-lg text-white">Feather Minted Successfully</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-3 bg-black rounded border border-chaos-organic/30">
              <span className="text-chaos-muted block mb-1">TRANSACTION HASH</span>
              <span className="text-chaos-accent break-all">{lastMint.provenance?.transactionHash}</span>
            </div>
            <div className="p-3 bg-black rounded border border-chaos-organic/30">
              <span className="text-chaos-muted block mb-1">IPFS ASSET CID</span>
              <span className="text-white break-all">{lastMint.provenance?.ipfsCid}</span>
            </div>
            <div className="p-3 bg-black rounded border border-chaos-organic/30">
              <span className="text-chaos-muted block mb-1">BLOCK NUMBER</span>
              <span className="text-white">{lastMint.provenance?.blockNumber}</span>
            </div>
             <div className="p-3 bg-black rounded border border-chaos-organic/30">
              <span className="text-chaos-muted block mb-1">SYSTEM REMARK</span>
              <span className="text-white truncate">feather::create::video::{lastMint.id}</span>
            </div>
          </div>

          <button 
            onClick={resetForm}
            className="mt-6 px-4 py-2 bg-chaos-accent text-black text-sm font-medium rounded hover:bg-white transition-colors"
          >
            Create Another
          </button>
        </div>
      )}

      {status !== 'success' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Side */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6 bg-chaos-panel p-6 rounded-lg border border-chaos-border">
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-chaos-muted mb-1">EPISODE TITLE</label>
                  <input 
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-black/50 border border-chaos-border text-white p-3 rounded focus:border-chaos-accent focus:outline-none"
                    placeholder="e.g. Distributed Consensus Patterns"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-xs font-mono text-chaos-muted mb-1">GUEST SPEAKER</label>
                      <input 
                        type="text"
                        required
                        value={formData.guest}
                        onChange={e => setFormData({...formData, guest: e.target.value})}
                        className="w-full bg-black/50 border border-chaos-border text-white p-3 rounded focus:border-chaos-accent focus:outline-none"
                        placeholder="e.g. Satoshi"
                      />
                  </div>
                   <div>
                     <label className="block text-xs font-mono text-chaos-muted mb-1">DATE</label>
                      <input 
                        type="text"
                        disabled
                        value={new Date().toLocaleDateString()}
                        className="w-full bg-black/30 border border-chaos-border text-chaos-muted p-3 rounded cursor-not-allowed"
                      />
                  </div>
                </div>

                <div>
                   <label className="block text-xs font-mono text-chaos-muted mb-1">SYSTEM DESCRIPTION</label>
                   <textarea 
                      required
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-black/50 border border-chaos-border text-white p-3 rounded h-24 focus:border-chaos-accent focus:outline-none resize-none"
                      placeholder="Context for the indexer..."
                   />
                </div>

                <div>
                  <label className="block text-xs font-mono text-chaos-muted mb-1">LIVEPEER HLS URL</label>
                  <div className="flex gap-2">
                    <div className="p-3 bg-black/30 border border-chaos-border rounded text-chaos-muted">
                      <FileVideo className="w-5 h-5" />
                    </div>
                    <input 
                      type="text"
                      required
                      value={formData.videoUrl}
                      onChange={e => setFormData({...formData, videoUrl: e.target.value})}
                      className="w-full bg-black/50 border border-chaos-border text-white p-3 rounded focus:border-chaos-accent focus:outline-none font-mono text-sm"
                      placeholder="https://livepeer.studio/api/stream/..."
                    />
                  </div>
                </div>
              </div>

              {/* Asset Upload */}
              <div className="pt-6 border-t border-chaos-border">
                <label className="block text-xs font-mono text-chaos-muted mb-2">THUMBNAIL ASSET (IPFS PIN)</label>
                <div className="relative border-2 border-dashed border-chaos-border rounded-lg p-8 hover:bg-black/20 transition-colors text-center cursor-pointer group">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {thumbnailFile ? (
                    <div className="flex flex-col items-center text-chaos-accent">
                      <CheckCircle className="w-8 h-8 mb-2" />
                      <span className="text-sm font-medium">{thumbnailFile.name}</span>
                      <span className="text-xs text-chaos-muted mt-1">Ready to pin</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-chaos-muted group-hover:text-chaos-text">
                      <Upload className="w-8 h-8 mb-2" />
                      <span className="text-sm">Drop image or click to browse</span>
                      <span className="text-xs mt-1">Images will be pinned to IPFS</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={status !== 'idle'}
                className="w-full py-4 bg-chaos-text text-black font-medium text-sm uppercase tracking-widest hover:bg-white transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {status === 'idle' && 'Mint Feather'}
                {status === 'pinning' && (
                  <>
                    <Box className="w-4 h-4 animate-bounce" />
                    Pinning to IPFS...
                  </>
                )}
                {status === 'minting' && (
                   <>
                    <Hash className="w-4 h-4 animate-spin" />
                    Confirming Transaction...
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Info Side */}
          <div className="space-y-6">
             <div className="p-6 border border-chaos-border rounded-lg bg-black/40">
                <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                   <Box className="w-4 h-4 text-chaos-organic" />
                   Provenance Info
                </h3>
                <p className="text-sm text-chaos-muted leading-relaxed mb-4">
                  By minting this feather, you are creating an immutable record on the underlying blockchain. 
                </p>
                <ul className="text-xs text-chaos-muted space-y-2 font-mono">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-chaos-organic"></span>
                    Metadata anchored
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-chaos-organic"></span>
                    Assets pinned (Hot/Cold)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-chaos-organic"></span>
                    Indexable by Feather
                  </li>
                </ul>
             </div>
          </div>

        </div>
      )}
    </div>
  );
};
