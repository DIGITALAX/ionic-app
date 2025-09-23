import { NFTMetadata } from "@/app/components/Common/types/common.types";
import { INFURA_GATEWAY } from "../constants";



export const fetchNFTMetadata = async (tokenURI: string): Promise<NFTMetadata | null> => {
  try {
    if (!tokenURI) return null;

    let metadataUrl = tokenURI;

    if (tokenURI.startsWith('ipfs://')) {
      metadataUrl = tokenURI.replace('ipfs://', `${INFURA_GATEWAY}/ipfs/`);
    }
    
    if (tokenURI.match(/^Qm[1-9A-HJ-NP-Za-km-z]{44}$/)) {
      metadataUrl = `${INFURA_GATEWAY}/ipfs/${tokenURI}`;
    }


    const response = await fetch(metadataUrl);
    if (!response.ok) {
      console.error(`Failed to fetch metadata: ${response.status}`);
      return null;
    }

    const metadata = await response.json();
    
    const processedMetadata: NFTMetadata = {
      title: extractTitle(metadata),
      description: extractDescription(metadata),
      type: "image" 
    };

    const mediaData = extractMediaUrls(metadata);
    
    if (mediaData.video) {
      processedMetadata.video = mediaData.video;
      processedMetadata.type = "video";
    } else if (mediaData.audio) {
      processedMetadata.audio = mediaData.audio;
      processedMetadata.type = "audio";
    } else if (mediaData.text) {
      processedMetadata.text = mediaData.text;
      processedMetadata.type = "text";
    } else if (mediaData.image) {
      processedMetadata.image = mediaData.image;
      processedMetadata.type = "image";
    }

    return processedMetadata;

  } catch (error) {
    console.error('Error fetching NFT metadata:', error);
    return null;
  }
};

const extractTitle = (metadata: any): string => {
  return metadata.name || 
         metadata.title || 
         metadata.properties?.name ||
         metadata.properties?.title ||
         metadata.metadata?.name ||
         metadata.metadata?.title ||
         `NFT`;
};

const extractDescription = (metadata: any): string => {
  return metadata.description || 
         metadata.desc || 
         metadata.properties?.description ||
         metadata.properties?.desc ||
         metadata.metadata?.description ||
         metadata.metadata?.desc ||
         "";
};

const extractMediaUrls = (metadata: any): {
  image?: string;
  video?: string;
  audio?: string;
  text?: string;
} => {
  const result: any = {};

  const possibleImageFields = [
    metadata.image,
    metadata.image_url,
    metadata.imageUrl,
    metadata.image_uri,
    metadata.imageUri,
    metadata.properties?.image,
    metadata.properties?.image_url,
    metadata.properties?.imageUrl,
    metadata.metadata?.image,
    metadata.media?.[0]?.gateway,
    metadata.media?.[0]?.raw,
    metadata.extra_metadata?.image_original_url,
    metadata.extra_metadata?.image,
  ];

  for (const field of possibleImageFields) {
    if (field) {
      result.image = normalizeMediaUrl(field);
      break;
    }
  }

  const possibleVideoFields = [
    metadata.video,
    metadata.video_url,
    metadata.videoUrl,
    metadata.animation_url,
    metadata.animationUrl,
    metadata.properties?.video,
    metadata.properties?.video_url,
    metadata.properties?.animation_url,
    metadata.metadata?.video,
  ];

  for (const field of possibleVideoFields) {
    if (field && determineMediaType(field) === 'video') {
      result.video = normalizeMediaUrl(field);
      break;
    }
  }

  if (!result.video && metadata.animation_url) {
    const animType = determineMediaType(metadata.animation_url);
    if (animType === 'video') {
      result.video = normalizeMediaUrl(metadata.animation_url);
    } else if (animType === 'audio') {
      result.audio = normalizeMediaUrl(metadata.animation_url);
    } else if (!result.image) {
      result.image = normalizeMediaUrl(metadata.animation_url);
    }
  }

  const possibleAudioFields = [
    metadata.audio,
    metadata.audio_url,
    metadata.audioUrl,
    metadata.properties?.audio,
    metadata.properties?.audio_url,
    metadata.metadata?.audio,
  ];

  for (const field of possibleAudioFields) {
    if (field) {
      result.audio = normalizeMediaUrl(field);
      break;
    }
  }

  if (metadata.text || metadata.content || metadata.properties?.text) {
    result.text = metadata.text || metadata.content || metadata.properties?.text;
  }

  const hasHTMLContent = metadata.html || metadata.html_url || metadata.properties?.html;
  if (hasHTMLContent && !result.text) {
    result.text = hasHTMLContent;
  }

  return result;
};

const normalizeMediaUrl = (url: string): string => {
  if (!url) return url;
  
  if (url.startsWith('ipfs://')) {
    return url.replace('ipfs://', `${INFURA_GATEWAY}/ipfs/`);
  }
  
  if (url.match(/^Qm[1-9A-HJ-NP-Za-km-z]{44}$/)) {
    return `${INFURA_GATEWAY}/ipfs/${url}`;
  }

  if (url.startsWith('ar://')) {
    return `https://arweave.net/${url.replace('ar://', '')}`;
  }
  
  return url;
};

const determineMediaType = (url: string): 'image' | 'video' | 'audio' | 'unknown' => {
  const extension = url.split('.').pop()?.toLowerCase();
  
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const videoExtensions = ['mp4', 'webm', 'mov', 'avi', 'mkv'];
  const audioExtensions = ['mp3', 'wav', 'ogg', 'flac', 'm4a'];
  
  if (extension && imageExtensions.includes(extension)) {
    return 'image';
  }
  
  if (extension && videoExtensions.includes(extension)) {
    return 'video';
  }
  
  if (extension && audioExtensions.includes(extension)) {
    return 'audio';
  }
  
  return 'unknown';
};