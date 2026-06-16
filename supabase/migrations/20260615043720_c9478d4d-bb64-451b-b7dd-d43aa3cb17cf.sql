
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- updated_at helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Prayer times
CREATE TABLE public.prayer_times (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  fajr_azan TIME, fajr_jamaat TIME,
  sunrise TIME,
  zuhr_azan TIME, zuhr_jamaat TIME,
  asr_azan TIME, asr_jamaat TIME,
  maghrib_azan TIME, maghrib_jamaat TIME,
  isha_azan TIME, isha_jamaat TIME,
  jumuah_1 TIME, jumuah_2 TIME, jumuah_3 TIME,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.prayer_times TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.prayer_times TO authenticated;
GRANT ALL ON public.prayer_times TO service_role;
ALTER TABLE public.prayer_times ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view prayer times" ON public.prayer_times FOR SELECT USING (true);
CREATE POLICY "Admins manage prayer times" ON public.prayer_times FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_prayer_times_updated BEFORE UPDATE ON public.prayer_times
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Announcements
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.announcements TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.announcements TO authenticated;
GRANT ALL ON public.announcements TO service_role;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active announcements" ON public.announcements FOR SELECT USING (active OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage announcements" ON public.announcements FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_announcements_updated BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Events
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.events TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Admins manage events" ON public.events FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_events_updated BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Mosque info
CREATE TABLE public.mosque_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Our Masjid',
  address TEXT,
  phone TEXT,
  email TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  about TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.mosque_info TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.mosque_info TO authenticated;
GRANT ALL ON public.mosque_info TO service_role;
ALTER TABLE public.mosque_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view mosque info" ON public.mosque_info FOR SELECT USING (true);
CREATE POLICY "Admins manage mosque info" ON public.mosque_info FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_mosque_info_updated BEFORE UPDATE ON public.mosque_info
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.mosque_info (name, address, phone, email, about)
VALUES ('Nale-paar Masjid', '123 Crescent Lane, City', '+1 (555) 123-4567', 'info@alnoor.masjid',
'A community masjid serving the local Muslim community with daily prayers, Jumuah, education, and outreach.');

-- Auto-grant admin role to the first user that signs up; subsequent users get 'user'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE existing_count INT;
BEGIN
  SELECT count(*) INTO existing_count FROM public.user_roles;
  IF existing_count = 0 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed some prayer times for current month (rough defaults; admin will edit)
INSERT INTO public.prayer_times (date, fajr_azan, fajr_jamaat, sunrise, zuhr_azan, zuhr_jamaat, asr_azan, asr_jamaat, maghrib_azan, maghrib_jamaat, isha_azan, isha_jamaat, jumuah_1, jumuah_2)
SELECT
  d::date,
  '05:15'::time, '05:30'::time, '06:30'::time,
  '12:30'::time, '12:45'::time,
  '15:45'::time, '16:00'::time,
  '18:15'::time, '18:20'::time,
  '19:45'::time, '20:00'::time,
  '13:15'::time, '14:00'::time
FROM generate_series(date_trunc('month', now())::date, (date_trunc('month', now()) + interval '2 month' - interval '1 day')::date, '1 day') d;

INSERT INTO public.announcements (title, description) VALUES
('Welcome to Nale-paar Masjid', 'Jumuah prayer begins at 1:15 PM every Friday. Please arrive early.'),
('Quran Halaqa', 'Weekly Quran circle every Saturday after Maghrib in the main hall.');

INSERT INTO public.events (title, description, event_date, start_time, end_time, location) VALUES
('Community Iftar', 'Join us for a community iftar dinner.', (now() + interval '7 day')::date, '18:30', '20:30', 'Main Hall'),
('Youth Halaqa', 'Talk for youth on character and faith.', (now() + interval '14 day')::date, '19:30', '21:00', 'Lecture Room');
