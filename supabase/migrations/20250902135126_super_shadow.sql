/*
# Create documents table and user management

1. New Tables
  - `documents`
    - `id` (uuid, primary key)
    - `user_id` (uuid, foreign key to auth.users)
    - `action` (text, 'OCR' or 'DOCGEN')
    - `created_at` (timestamp)
    - `prompt` (text, optional for OCR)
    - `ocr_image_path` (text, storage path)
    - `docx_path` (text, storage path)
    - `pdf_path` (text, storage path)
    - `status` (text, 'processing', 'completed', 'failed')
    - `metadata` (jsonb, additional data)

2. Security
  - Enable RLS on `documents` table
  - Add policies for users to read/write their own data
  - Add admin policy for full access to admin user

3. Storage
  - Create storage buckets for uploads and generated files
*/

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action text NOT NULL CHECK (action IN ('OCR', 'DOCGEN')),
  created_at timestamptz DEFAULT now(),
  prompt text,
  ocr_image_path text,
  docx_path text,
  pdf_path text,
  status text DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own data
CREATE POLICY "Users can read own documents"
  ON documents
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for users to insert their own data
CREATE POLICY "Users can insert own documents"
  ON documents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own data
CREATE POLICY "Users can update own documents"
  ON documents
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Admin policy for full access
CREATE POLICY "Admin can access all documents"
  ON documents
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND email = 'khhorem.khan@raqmiyat.com'
    )
  );

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('uploads', 'uploads', false, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('documents', 'documents', false, 52428800, ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies for uploads bucket
CREATE POLICY "Users can upload their own files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'uploads' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can read their own uploads"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'uploads' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Storage policies for documents bucket
CREATE POLICY "Users can read their own documents"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Service role can manage documents"
  ON storage.objects
  FOR ALL
  TO service_role
  USING (bucket_id = 'documents');

-- Admin storage policies
CREATE POLICY "Admin can access all uploads"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (
    bucket_id = 'uploads' AND
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND email = 'khhorem.khan@raqmiyat.com'
    )
  );

CREATE POLICY "Admin can access all documents"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (
    bucket_id = 'documents' AND
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND email = 'khhorem.khan@raqmiyat.com'
    )
  );