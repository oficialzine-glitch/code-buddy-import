import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UploadResponse {
  url: string;
  path: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Upload request from user:', user.id);

    const contentType = req.headers.get('content-type') || '';

    let fileData: Uint8Array;
    let fileName: string;
    let mimeType: string;

    // Handle multipart/form-data
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File;
      
      if (!file) {
        return new Response(
          JSON.stringify({ error: 'No file provided in form data' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      fileData = new Uint8Array(await file.arrayBuffer());
      fileName = file.name;
      mimeType = file.type;
    } 
    // Handle base64 JSON payload
    else if (contentType.includes('application/json')) {
      const body = await req.json();
      
      if (!body.file || !body.fileName) {
        return new Response(
          JSON.stringify({ error: 'Missing file or fileName in request body' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Decode base64
      const base64Data = body.file.includes('base64,') 
        ? body.file.split('base64,')[1] 
        : body.file;
      
      const binaryString = atob(base64Data);
      fileData = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        fileData[i] = binaryString.charCodeAt(i);
      }
      
      fileName = body.fileName;
      mimeType = body.mimeType || 'image/jpeg';
    } else {
      return new Response(
        JSON.stringify({ error: 'Unsupported content type. Use multipart/form-data or application/json with base64' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate unique filename with timestamp and UUID
    const timestamp = Date.now();
    const randomId = crypto.randomUUID().slice(0, 8);
    const fileExt = fileName.split('.').pop() || 'jpg';
    const uniqueFileName = `${timestamp}_${randomId}.${fileExt}`;
    const filePath = `${user.id}/${uniqueFileName}`;

    console.log('Uploading file:', filePath);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('user_uploads')
      .upload(filePath, fileData, {
        contentType: mimeType,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return new Response(
        JSON.stringify({ error: `Upload failed: ${uploadError.message}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('File uploaded successfully:', uploadData.path);

    // Generate public URL
    const { data: publicUrlData } = supabase.storage
      .from('user_uploads')
      .getPublicUrl(uploadData.path);

    const response: UploadResponse = {
      url: publicUrlData.publicUrl,
      path: uploadData.path,
    };

    console.log('Generated public URL:', response.url);

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
