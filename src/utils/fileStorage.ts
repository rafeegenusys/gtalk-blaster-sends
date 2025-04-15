
import { supabase } from "@/integrations/supabase/client";

// Ensure the chat-files bucket exists
export const ensureChatFilesBucket = async () => {
  try {
    // Check if the bucket exists
    const { data: buckets, error: getBucketsError } = await supabase.storage.listBuckets();
    
    if (getBucketsError) throw getBucketsError;
    
    // If bucket doesn't exist, create it
    if (!buckets.find(bucket => bucket.name === 'chat-files')) {
      const { error: createError } = await supabase.storage.createBucket('chat-files', {
        public: true,
        fileSizeLimit: 5242880, // 5MB limit per file
      });
      
      if (createError) throw createError;
      
      console.log('Created chat-files bucket');
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring chat-files bucket exists:', error);
    return false;
  }
};

// Upload a file to chat-files bucket
export const uploadChatFile = async (
  file: File,
  businessId: string
): Promise<string | null> => {
  try {
    // Ensure bucket exists
    await ensureChatFilesBucket();
    
    // Generate unique filename
    const fileName = `${businessId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9-_\.]/g, '_')}`;
    
    // Upload file
    const { error } = await supabase.storage
      .from('chat-files')
      .upload(fileName, file);
      
    if (error) throw error;
    
    // Get public URL
    const { data } = supabase.storage
      .from('chat-files')
      .getPublicUrl(fileName);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
};

// Delete a file from storage
export const deleteChatFile = async (fileUrl: string): Promise<boolean> => {
  try {
    // Extract path from URL
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split('/');
    const fileName = pathParts.slice(pathParts.indexOf('chat-files') + 1).join('/');
    
    if (!fileName) return false;
    
    const { error } = await supabase.storage
      .from('chat-files')
      .remove([fileName]);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};
