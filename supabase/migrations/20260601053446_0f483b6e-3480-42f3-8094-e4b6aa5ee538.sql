
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Restrict storage.objects listing in our bucket; files are still served via public URL since bucket is public.
DROP POLICY "course_media_public_read" ON storage.objects;
CREATE POLICY "course_media_admin_list" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'course-media' AND public.has_role(auth.uid(), 'admin'));
