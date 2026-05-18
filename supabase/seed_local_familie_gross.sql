-- =============================================================================
-- Testdaten: Familie Bergmann (lokal) - 20 Familienmitglieder, 20 Eintraege
-- Ausfuehren mit: npx supabase db query --file supabase/seed_local_familie_gross.sql
-- Benutzer: erwinmoretz@gmail.com (lokaler Testaccount)
-- =============================================================================

DO $$
DECLARE
  v_user_id     uuid;
  v_vault_id    uuid;

  -- vault_member IDs
  vm_erwin      uuid;
  vm_m1  uuid; vm_m2  uuid; vm_m3  uuid; vm_m4  uuid;
  vm_m5  uuid; vm_m6  uuid; vm_m7  uuid; vm_m8  uuid;
  vm_m9  uuid; vm_m10 uuid; vm_m11 uuid; vm_m12 uuid;
  vm_m13 uuid; vm_m14 uuid; vm_m15 uuid; vm_m16 uuid;
  vm_m17 uuid; vm_m18 uuid; vm_m19 uuid;

  -- family_person IDs (fp_erwin = Initiator)
  fp_erwin uuid;
  fp_p1  uuid; fp_p2  uuid; fp_p3  uuid; fp_p4  uuid;
  fp_p5  uuid; fp_p6  uuid; fp_p7  uuid; fp_p8  uuid;
  fp_p9  uuid; fp_p10 uuid; fp_p11 uuid; fp_p12 uuid;
  fp_p13 uuid; fp_p14 uuid; fp_p15 uuid; fp_p16 uuid;
  fp_p17 uuid; fp_p18 uuid; fp_p19 uuid;

BEGIN

  -- Benutzer holen
  SELECT id INTO v_user_id FROM auth.users WHERE email ILIKE 'erwinmoretz@gmail.com' LIMIT 1;
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Benutzer erwinmoretz@gmail.com nicht gefunden.';
  END IF;

  -- Altes Testvault bereinigen (falls vorhanden)
  DELETE FROM public.vaults WHERE name = 'Familie Bergmann' AND owner_id = v_user_id;

  -- ============================================================
  -- VAULT
  -- ============================================================
  INSERT INTO public.vaults (name, description, owner_id, plan)
  VALUES (
    'Familie Bergmann',
    'Das Familienarchiv der Familie Bergmann - vier Generationen, 20 Mitglieder, gemeinsame Erinnerungen seit 1920.',
    v_user_id,
    'family_plus'
  )
  RETURNING id INTO v_vault_id;

  -- Initiator-Mitglied (angelegt durch Trigger on_vault_created)
  SELECT id INTO vm_erwin FROM public.vault_members
    WHERE vault_id = v_vault_id AND user_id = v_user_id;

  -- ============================================================
  -- WEITERE MITGLIEDER (ohne App-Account)
  -- Generation 1: Urgroßeltern (4 Personen)
  -- ============================================================
  INSERT INTO public.vault_members (vault_id, user_id, role, display_name, family_role)
  VALUES (v_vault_id, NULL, 'reader', 'Johann Bergmann', 'Urgrossvater') RETURNING id INTO vm_m1;

  INSERT INTO public.vault_members (vault_id, user_id, role, display_name, family_role)
  VALUES (v_vault_id, NULL, 'reader', 'Margarethe Bergmann', 'Urgrossmutter') RETURNING id INTO vm_m2;

  INSERT INTO public.vault_members (vault_id, user_id, role, display_name, family_role)
  VALUES (v_vault_id, NULL, 'reader', 'Heinrich Schulz', 'Urgrossvater') RETURNING id INTO vm_m3;

  INSERT INTO public.vault_members (vault_id, user_id, role, display_name, family_role)
  VALUES (v_vault_id, NULL, 'reader', 'Elfriede Schulz', 'Urgrossmutter') RETURNING id INTO vm_m4;

  -- Generation 2: Grosseltern (6 Personen)
  INSERT INTO public.vault_members (vault_id, user_id, role, display_name, family_role)
  VALUES (v_vault_id, NULL, 'contributor', 'Klaus Bergmann', 'Grossvater') RETURNING id INTO vm_m5;

  INSERT INTO public.vault_members (vault_id, user_id, role, display_name, family_role)
  VALUES (v_vault_id, NULL, 'contributor', 'Brigitte Bergmann', 'Grossmutter') RETURNING id INTO vm_m6;

  INSERT INTO public.vault_members (vault_id, user_id, role, display_name, family_role)
  VALUES (v_vault_id, NULL, 'contributor', 'Werner Bergmann', 'Grossonkel') RETURNING id INTO vm_m7;

  INSERT INTO public.vault_members (vault_id, user_id, role, display_name, family_role)
  VALUES (v_vault_id, NULL, 'reader', 'Ursula Bergmann', 'Grosstante') RETURNING id INTO vm_m8;

  INSERT INTO public.vault_members (vault_id, user_id, role, display_name, family_role)
  VALUES (v_vault_id, NULL, 'contributor', 'Dieter Schulz', 'Grossvater') RETURNING id INTO vm_m9;

  INSERT INTO public.vault_members (vault_id, user_id, role, display_name, family_role)
  VALUES (v_vault_id, NULL, 'reader', 'Renate Schulz', 'Grossmutter') RETURNING id INTO vm_m10;

  -- Generation 3: Eltern / Tanten / Onkel (6 Personen)
  INSERT INTO public.vault_members (vault_id, user_id, role, display_name, family_role)
  VALUES (v_vault_id, NULL, 'contributor', 'Thomas Bergmann', 'Vater') RETURNING id INTO vm_m11;

  INSERT INTO public.vault_members (vault_id, user_id, role, display_name, family_role)
  VALUES (v_vault_id, NULL, 'contributor', 'Sandra Bergmann', 'Tante') RETURNING id INTO vm_m12;

  INSERT INTO public.vault_members (vault_id, user_id, role, display_name, family_role)
  VALUES (v_vault_id, NULL, 'contributor', 'Markus Bergmann', 'Onkel') RETURNING id INTO vm_m13;

  INSERT INTO public.vault_members (vault_id, user_id, role, display_name, family_role)
  VALUES (v_vault_id, NULL, 'reader', 'Nicole Bergmann', 'Tante') RETURNING id INTO vm_m14;

  INSERT INTO public.vault_members (vault_id, user_id, role, display_name, family_role)
  VALUES (v_vault_id, NULL, 'contributor', 'Stefan Schulz', 'Onkel') RETURNING id INTO vm_m15;

  INSERT INTO public.vault_members (vault_id, user_id, role, display_name, family_role)
  VALUES (v_vault_id, NULL, 'reader', 'Katja Schulz', 'Tante') RETURNING id INTO vm_m16;

  -- Generation 4: Cousins / Geschwister (4 Personen)
  INSERT INTO public.vault_members (vault_id, user_id, role, display_name, family_role)
  VALUES (v_vault_id, NULL, 'contributor', 'Leon Bergmann', 'Bruder') RETURNING id INTO vm_m17;

  INSERT INTO public.vault_members (vault_id, user_id, role, display_name, family_role)
  VALUES (v_vault_id, NULL, 'reader', 'Mia Bergmann', 'Schwester') RETURNING id INTO vm_m18;

  INSERT INTO public.vault_members (vault_id, user_id, role, display_name, family_role)
  VALUES (v_vault_id, NULL, 'reader', 'Felix Schulz', 'Cousin') RETURNING id INTO vm_m19;

  -- ============================================================
  -- STAMMBAUM: 20 Personen
  -- Layout: 5 Generationen, y steigt um 200 pro Generation
  -- Generation 1: y=50  Generation 2: y=250  Gen3: y=450  Gen4: y=650  Gen5: y=850
  -- ============================================================

  -- === GENERATION 1: Urgrossvaeter / Urgrossmutter ===
  INSERT INTO public.family_persons (vault_id, member_id, full_name, birth_year, death_year, gender, bio, pos_x, pos_y, avatar_url)
  VALUES (v_vault_id, vm_m1, 'Johann Bergmann', 1920, 2001, 'male',
    'Gruender der Familie Bergmann in Bayern. Tischlermeister, baute das Familienhaus in Rosenheim eigens haendig.',
    150, 50,
    'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&h=200&fit=crop&crop=face')
  RETURNING id INTO fp_p1;

  INSERT INTO public.family_persons (vault_id, member_id, full_name, birth_year, death_year, gender, bio, pos_x, pos_y, avatar_url)
  VALUES (v_vault_id, vm_m2, 'Margarethe Bergmann', 1923, 2008, 'female',
    'Lehrerin fuer Volksschule. Bekannt fuer ihre Strickarbeiten und die Weihnachtsplaetzchen nach altem Rezept.',
    350, 50,
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&h=200&fit=crop&crop=face')
  RETURNING id INTO fp_p2;

  INSERT INTO public.family_persons (vault_id, member_id, full_name, birth_year, death_year, gender, bio, pos_x, pos_y, avatar_url)
  VALUES (v_vault_id, vm_m3, 'Heinrich Schulz', 1918, 1995, 'male',
    'Kriegsveteran, spaeter Baecker in Hamburg. Hat drei Brotrezepte in der Familie hinterlassen.',
    650, 50,
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face')
  RETURNING id INTO fp_p3;

  INSERT INTO public.family_persons (vault_id, member_id, full_name, birth_year, death_year, gender, bio, pos_x, pos_y, avatar_url)
  VALUES (v_vault_id, vm_m4, 'Elfriede Schulz', 1921, 2010, 'female',
    'Hebamme. Hat ueber 300 Kindern auf die Welt geholfen. Ihre Geschichte vom Krieg ist legendaer.',
    850, 50,
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face')
  RETURNING id INTO fp_p4;

  -- === GENERATION 2: Grosseltern ===
  INSERT INTO public.family_persons (vault_id, member_id, full_name, birth_year, gender, bio, pos_x, pos_y, avatar_url)
  VALUES (v_vault_id, vm_m5, 'Klaus Bergmann', 1948, 'male',
    'Ingenieur bei BMW Muenchen. Hat die Firma Bergmann Holzbau 1980 gegruendet.',
    100, 250,
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face')
  RETURNING id INTO fp_p5;

  INSERT INTO public.family_persons (vault_id, member_id, full_name, birth_year, gender, bio, pos_x, pos_y, avatar_url)
  VALUES (v_vault_id, vm_m6, 'Brigitte Bergmann', 1950, 'female',
    'Tochter von Heinrich und Elfriede. Apothekerin. Heiratete Klaus 1972.',
    300, 250,
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face')
  RETURNING id INTO fp_p6;

  INSERT INTO public.family_persons (vault_id, member_id, full_name, birth_year, gender, bio, pos_x, pos_y, avatar_url)
  VALUES (v_vault_id, vm_m7, 'Werner Bergmann', 1952, 'male',
    'Bruder von Klaus. Segler, lebt in Kiel. Hat den Atlantik zweimal ueberquert.',
    500, 250,
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face')
  RETURNING id INTO fp_p7;

  INSERT INTO public.family_persons (vault_id, member_id, full_name, birth_year, gender, bio, pos_x, pos_y, avatar_url)
  VALUES (v_vault_id, vm_m8, 'Ursula Bergmann', 1955, 'female',
    'Frau von Werner. Lehrerin fuer Deutsch und Musik.',
    700, 250,
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face')
  RETURNING id INTO fp_p8;

  INSERT INTO public.family_persons (vault_id, member_id, full_name, birth_year, gender, bio, pos_x, pos_y, avatar_url)
  VALUES (v_vault_id, vm_m9, 'Dieter Schulz', 1945, 'male',
    'Bruder von Brigitte. Elektriker. Lebt in Nuernberg, besucht die Familie jeden Sommer.',
    900, 250,
    'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&h=200&fit=crop&crop=face')
  RETURNING id INTO fp_p9;

  INSERT INTO public.family_persons (vault_id, member_id, full_name, birth_year, gender, bio, pos_x, pos_y, avatar_url)
  VALUES (v_vault_id, vm_m10, 'Renate Schulz', 1948, 'female',
    'Frau von Dieter. Schneiderin. Hat alle Trachten der Familie selbst genaehlt.',
    1100, 250,
    'https://images.unsplash.com/photo-1592621385612-4d7129426394?w=200&h=200&fit=crop&crop=face')
  RETURNING id INTO fp_p10;

  -- === GENERATION 3: Eltern-Generation ===
  INSERT INTO public.family_persons (vault_id, member_id, full_name, birth_year, gender, bio, pos_x, pos_y, avatar_url)
  VALUES (v_vault_id, vm_m11, 'Thomas Bergmann', 1975, 'male',
    'Sohn von Klaus und Brigitte. Architektur-Ingenieur. Vater von Erwin, Leon und Mia.',
    100, 450,
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face')
  RETURNING id INTO fp_p11;

  INSERT INTO public.family_persons (vault_id, member_id, full_name, birth_year, gender, bio, pos_x, pos_y, avatar_url)
  VALUES (v_vault_id, vm_m12, 'Sandra Bergmann', 1978, 'female',
    'Tochter von Klaus und Brigitte. Aerztin in Muenchen.',
    300, 450,
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face')
  RETURNING id INTO fp_p12;

  INSERT INTO public.family_persons (vault_id, member_id, full_name, birth_year, gender, bio, pos_x, pos_y, avatar_url)
  VALUES (v_vault_id, vm_m13, 'Markus Bergmann', 1972, 'male',
    'Sohn von Werner und Ursula. Meeresbiologe an der Uni Kiel.',
    500, 450,
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face')
  RETURNING id INTO fp_p13;

  INSERT INTO public.family_persons (vault_id, member_id, full_name, birth_year, gender, bio, pos_x, pos_y, avatar_url)
  VALUES (v_vault_id, vm_m14, 'Nicole Bergmann', 1976, 'female',
    'Tochter von Werner und Ursula. Musikerin, spielt Geige im Hamburger Philharmonikorchester.',
    700, 450,
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face')
  RETURNING id INTO fp_p14;

  INSERT INTO public.family_persons (vault_id, member_id, full_name, birth_year, gender, bio, pos_x, pos_y, avatar_url)
  VALUES (v_vault_id, vm_m15, 'Stefan Schulz', 1970, 'male',
    'Sohn von Dieter und Renate. Softwareentwickler in Berlin. Leidenschaftlicher Bergsteiger.',
    900, 450,
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face')
  RETURNING id INTO fp_p15;

  INSERT INTO public.family_persons (vault_id, member_id, full_name, birth_year, gender, bio, pos_x, pos_y, avatar_url)
  VALUES (v_vault_id, vm_m16, 'Katja Schulz', 1974, 'female',
    'Tochter von Dieter und Renate. Grundschullehrerin, drei Kinder.',
    1100, 450,
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face')
  RETURNING id INTO fp_p16;

  -- === GENERATION 4: Kinder-Generation (Erwin + Geschwister/Cousins) ===
  INSERT INTO public.family_persons (vault_id, member_id, full_name, birth_year, gender, bio, pos_x, pos_y, avatar_url)
  VALUES (v_vault_id, vm_erwin, 'Erwin Bergmann', 1978, 'male',
    'Gruender dieses Familienarchivs. Sohn von Thomas. Software-Unternehmer und Hobbyfotograf.',
    0, 650,
    'https://images.unsplash.com/photo-1493231418168-91d02fbadb26?w=200&h=200&fit=crop&crop=face')
  RETURNING id INTO fp_erwin;

  INSERT INTO public.family_persons (vault_id, member_id, full_name, birth_year, gender, bio, pos_x, pos_y, avatar_url)
  VALUES (v_vault_id, vm_m17, 'Leon Bergmann', 1998, 'male',
    'Sohn von Thomas. Jurastudent in Muenchen, begeisterter Fussballspieler.',
    200, 650,
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face')
  RETURNING id INTO fp_p17;

  INSERT INTO public.family_persons (vault_id, member_id, full_name, birth_year, gender, bio, pos_x, pos_y, avatar_url)
  VALUES (v_vault_id, vm_m18, 'Mia Bergmann', 2001, 'female',
    'Tochter von Sandra. Medizinstudentin. Liebt Malen und Klavierspielen.',
    400, 650,
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&fit=crop&crop=face')
  RETURNING id INTO fp_p18;

  INSERT INTO public.family_persons (vault_id, member_id, full_name, birth_year, gender, bio, pos_x, pos_y, avatar_url)
  VALUES (v_vault_id, vm_m19, 'Felix Schulz', 1995, 'male',
    'Sohn von Stefan. Fotograf und Reiseblogger. War schon in 40 Laendern.',
    600, 650,
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face')
  RETURNING id INTO fp_p19;

  -- ============================================================
  -- BEZIEHUNGEN (22 Verbindungen)
  -- ============================================================

  -- === Generation 1: Partner ===
  INSERT INTO public.family_relationships (vault_id, person_a_id, person_b_id, relationship_type)
  VALUES (v_vault_id, fp_p1, fp_p2, 'partner');       -- Johann + Margarethe

  INSERT INTO public.family_relationships (vault_id, person_a_id, person_b_id, relationship_type)
  VALUES (v_vault_id, fp_p3, fp_p4, 'partner');       -- Heinrich + Elfriede

  -- === Generation 1 -> 2: Kinder ===
  INSERT INTO public.family_relationships (vault_id, person_a_id, person_b_id, relationship_type)
  VALUES (v_vault_id, fp_p1, fp_p5, 'parent_child');  -- Johann -> Klaus

  INSERT INTO public.family_relationships (vault_id, person_a_id, person_b_id, relationship_type)
  VALUES (v_vault_id, fp_p1, fp_p7, 'parent_child');  -- Johann -> Werner

  INSERT INTO public.family_relationships (vault_id, person_a_id, person_b_id, relationship_type)
  VALUES (v_vault_id, fp_p3, fp_p6, 'parent_child');  -- Heinrich -> Brigitte

  INSERT INTO public.family_relationships (vault_id, person_a_id, person_b_id, relationship_type)
  VALUES (v_vault_id, fp_p3, fp_p9, 'parent_child');  -- Heinrich -> Dieter

  -- === Generation 2: Partner ===
  INSERT INTO public.family_relationships (vault_id, person_a_id, person_b_id, relationship_type)
  VALUES (v_vault_id, fp_p5, fp_p6, 'partner');       -- Klaus + Brigitte

  INSERT INTO public.family_relationships (vault_id, person_a_id, person_b_id, relationship_type)
  VALUES (v_vault_id, fp_p7, fp_p8, 'partner');       -- Werner + Ursula

  INSERT INTO public.family_relationships (vault_id, person_a_id, person_b_id, relationship_type)
  VALUES (v_vault_id, fp_p9, fp_p10, 'partner');      -- Dieter + Renate

  -- === Generation 2 -> 3: Kinder ===
  INSERT INTO public.family_relationships (vault_id, person_a_id, person_b_id, relationship_type)
  VALUES (v_vault_id, fp_p5, fp_p11, 'parent_child'); -- Klaus -> Thomas

  INSERT INTO public.family_relationships (vault_id, person_a_id, person_b_id, relationship_type)
  VALUES (v_vault_id, fp_p5, fp_p12, 'parent_child'); -- Klaus -> Sandra

  INSERT INTO public.family_relationships (vault_id, person_a_id, person_b_id, relationship_type)
  VALUES (v_vault_id, fp_p7, fp_p13, 'parent_child'); -- Werner -> Markus

  INSERT INTO public.family_relationships (vault_id, person_a_id, person_b_id, relationship_type)
  VALUES (v_vault_id, fp_p7, fp_p14, 'parent_child'); -- Werner -> Nicole

  INSERT INTO public.family_relationships (vault_id, person_a_id, person_b_id, relationship_type)
  VALUES (v_vault_id, fp_p9, fp_p15, 'parent_child'); -- Dieter -> Stefan

  INSERT INTO public.family_relationships (vault_id, person_a_id, person_b_id, relationship_type)
  VALUES (v_vault_id, fp_p9, fp_p16, 'parent_child'); -- Dieter -> Katja

  -- === Generation 3 -> 4: Kinder ===
  INSERT INTO public.family_relationships (vault_id, person_a_id, person_b_id, relationship_type)
  VALUES (v_vault_id, fp_p11, fp_erwin, 'parent_child'); -- Thomas -> Erwin

  INSERT INTO public.family_relationships (vault_id, person_a_id, person_b_id, relationship_type)
  VALUES (v_vault_id, fp_p11, fp_p17, 'parent_child');   -- Thomas -> Leon

  INSERT INTO public.family_relationships (vault_id, person_a_id, person_b_id, relationship_type)
  VALUES (v_vault_id, fp_p12, fp_p18, 'parent_child');   -- Sandra -> Mia

  INSERT INTO public.family_relationships (vault_id, person_a_id, person_b_id, relationship_type)
  VALUES (v_vault_id, fp_p15, fp_p19, 'parent_child');   -- Stefan -> Felix

  -- ============================================================
  -- 20 EINTRAEGE (verteilt auf alle 6 Kategorien)
  -- ============================================================

  -- ---- GESCHICHTEN (5) ----
  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'stories', v_user_id,
    'Johanns Abenteuer als Tischlermeister 1948',
    'Grossvater Johann erzaehlte gerne, wie er 1948 mit nichts als zwei Haenden und einem alten Werkzeugkoffer nach Bayern kam. "Ich hatte keine Werkstatt, kein Material, nur mein Koennen." Sein erster Auftrag: ein Kleiderschrank fuer die Familie Huber in Rosenheim. "Die haben mir Kartoffeln als Bezahlung gegeben - das war damals mehr wert als Geld." Aus diesem ersten Auftrag wurde eine Schreinerei, die 40 Jahre lang bestand.',
    'de', '{"period_start": "1948", "period_end": "1952"}',
    NOW() - INTERVAL '45 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, on_behalf_of, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'stories', v_user_id, vm_m5,
    'Wie Klaus und Brigitte sich kennenlernten',
    'Es war 1969, auf einer Studienparty an der TU Muenchen. Klaus studierte Maschinenbau, Brigitte Pharmazie. "Ich dachte, er sei Architekt - er hatte so einen eleganten Anzug", lacht Brigitte noch heute. Klaus hatte sich fuer die Party geliehen. Drei Jahre Fernbeziehung zwischen Muenchen und Hamburg folgten, bevor sie 1972 heirateten. Das Hochzeitsfest dauerte drei Tage.',
    'de', '{"period_start": "1969", "period_end": "1972"}',
    NOW() - INTERVAL '38 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, on_behalf_of, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'stories', v_user_id, vm_m7,
    'Werners grosse Atlantik-Ueberquerung 1988',
    'Im Juli 1988 stach Werner mit seiner Segelyacht "Margarethe II" von Las Palmas in See - allein. Das Ziel: Barbados. 3.200 Kilometer Ozean. "Am zweiten Tag dachte ich, ich drehe durch vor Stille", schreibt er in sein Logbuch. Am Tag 18 sah er die Kuestenlichter von Barbados. Er weinte. Es war das erste und einzige Mal, dass die Familie ihn weinen sah.',
    'de', '{"period_start": "1988-07", "period_end": "1988-08"}',
    NOW() - INTERVAL '30 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, on_behalf_of, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'stories', v_user_id, vm_m15,
    'Stefans Erstbesteigung des Ortlers 2005',
    'Stefan stand am 15. August 2005 um 5:47 Uhr auf dem Gipfel des Ortlers - mit 3.905 Metern der hoechste Berg Suedtirols. "Die Sonne ging gerade auf und ich konnte die Adria sehen. In diesem Moment hat mich das Leben gehugged." Er hat seitdem 47 alpine Gipfel bestiegen. Der Ortler bleibt sein Lieblingsgipfel.',
    'de', '{"period_start": "2005-08-15"}',
    NOW() - INTERVAL '22 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'stories', v_user_id,
    'Felix und sein erstes Foto das viral ging',
    'Felix war 23 und reiste durch Island, als er das Bild machte: ein einsamer Leuchtturm im Schneesturm, ein Polarfuchs im Vordergrund. Das Foto landete auf Reddit, bekam 400.000 Upvotes, wurde in National Geographic veroeffenlticht. "Ich dachte, mein Handy zeigt mir eine Fehleranzeige, als die Benachrichtigungen kamen." Seitdem fotografiert Felix professionell.',
    'de', '{"period_start": "2018-01"}',
    NOW() - INTERVAL '15 days');

  -- ---- REZEPTE (4) ----
  INSERT INTO public.entries (vault_id, category_slug, author_id, on_behalf_of, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'recipes', v_user_id, vm_m2,
    'Margarethes Roggenbrot nach Urrezept',
    'Dieses Brot wurde jeden Donnerstag gebacken. Heinrich der Baecker hat das Rezept der Familie geschenkt.',
    'de', '{
      "origin": "Hamburg/Bayern, ca. 1950",
      "servings": "1 grosser Laib",
      "ingredients": [
        "500g Roggenmehl Type 1150",
        "150g Weizenmehl Type 1050",
        "400ml lauwarmes Wasser",
        "20g frische Hefe",
        "1 EL Salz",
        "1 TL Kuemmel",
        "1 EL Apfelessig",
        "150g Roggenmehl fuer den Sauerteigansatz",
        "150ml Wasser fuer den Sauerteigansatz"
      ],
      "steps": [
        "Vorabend: 150g Roggenmehl mit 150ml Wasser und 2g Hefe zu einem Vorteig verruehren, abdecken",
        "Naechsten Tag: Hefe in 100ml lauwarmem Wasser aufloesen",
        "Vorteig, restliches Mehl, Wasser, Salz, Kuemmel und Essig zu einem Teig kneten",
        "90 Minuten gehen lassen bis sich das Volumen verdoppelt",
        "Teig formen, in eine bemehlte Kastenform geben",
        "Nochmals 45 Min gehen lassen, Oberflaeche einschneiden",
        "Bei 250 Grad 15 Min anbacken, dann bei 200 Grad 45 Min fertigbacken",
        "Auf Rost abkuehlen lassen - mindestens 4 Stunden warten vor dem Anschneiden"
      ]
    }',
    NOW() - INTERVAL '42 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, on_behalf_of, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'recipes', v_user_id, vm_m6,
    'Brigittes Rehgulasch mit Preiselbeer-Spaetzle',
    'Dieses Gericht gibt es bei der Familie Bergmann jeden Heiligabend als Mittagessen. Brigitte weigert sich die Zutatenmengen anzupassen - es gibt immer fuer 12 Personen.',
    'de', '{
      "origin": "Bayrisches Familienrezept, 1970er Jahre",
      "servings": "12 Personen",
      "ingredients": [
        "2 kg Rehkeule ausgeloest",
        "500ml Rotwein (Spaetburgunder)",
        "300ml Wildfond",
        "3 Zwiebeln",
        "3 Karotten",
        "200g Sellerie",
        "4 Wacholderbeeren",
        "2 Lorbeerblaetter",
        "Salz, Pfeffer, Thymian",
        "4 EL Schmalz",
        "200g Preiselbeerkonfituere",
        "600g Spaetzlemehl",
        "6 Eier",
        "200ml Milch"
      ],
      "steps": [
        "Fleisch in 4cm Wuerfel schneiden, mit Wein und Gewuerzen 24h marinieren",
        "Fleisch trocken tupfen, in Schmalz kraeftig anbraten portionsweise",
        "Gemuese anroesten, Tomatenpaste zugeben, mit Marinade und Fond aufgiessen",
        "Bei 160 Grad 2,5 Stunden schmoren",
        "Spaetzleteig aus Mehl, Eiern, Milch und Salz ruehren bis Blasen entstehen",
        "Teig durch Spaetzlehobel in kochendes Salzwasser druecken",
        "Spaetzle in Butter schwenken, Preiselbeeren unterruehren",
        "Gulaschsauce abschmecken, mit Spaetzle servieren"
      ]
    }',
    NOW() - INTERVAL '35 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, on_behalf_of, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'recipes', v_user_id, vm_m10,
    'Renates Nuernberger Lebkuchen',
    'Renate backt diese Lebkuchen seit 50 Jahren. Das Geheimnis liegt im Oblatenlebkuchen-Boden und der dreifachen Gewuerzmenge.',
    'de', '{
      "origin": "Nuernberg, Familienrezept seit 1974",
      "servings": "ca. 60 Stueck",
      "ingredients": [
        "250g gemahlene Mandeln",
        "250g gemahlene Haselnuesse",
        "200g Puderzucker",
        "3 Eier",
        "2 TL Zimt",
        "1 TL Nelkenpulver",
        "0.5 TL Kardamom",
        "0.5 TL Muskat",
        "Abrieb 1 Orange und 1 Zitrone",
        "60 Backoblaten 70mm",
        "200g dunkle Kuvertuere"
      ],
      "steps": [
        "Nuesse, Mandeln, Puderzucker und Gewuerze gut vermischen",
        "Eier und Zitruskostenabrieb unterarbeiten - Masse soll klebrig sein",
        "Oblaten auf Backblech legen, je 1 EL Masse aufstreichen und formen",
        "Bei 150 Grad 25 Minuten backen - sie sollen weich bleiben",
        "Abkuehlen lassen",
        "Kuvertuere schmelzen, Lebkuchen halb eintauchen oder Streifenmuster ziehen",
        "Mindestens 1 Woche in Blechdose aufbewahren - werden besser"
      ]
    }',
    NOW() - INTERVAL '28 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'recipes', v_user_id,
    'Grossmutters Vanillekipferl',
    'Das einfachste und beste Rezept der Familie. Tres generaciones, eine Schuessel.',
    'de', '{
      "origin": "Oesterreich/Bayern",
      "servings": "ca. 80 Stueck",
      "ingredients": [
        "250g Mehl",
        "200g weiche Butter",
        "100g gemahlene Mandeln",
        "80g Puderzucker",
        "1 Paeckchen Vanillezucker",
        "Puderzucker und Vanillezucker zum Waelzen"
      ],
      "steps": [
        "Mehl, Butter, Mandeln und Puderzucker rasch zu einem glatten Teig verkneten",
        "1 Stunde kuehl stellen",
        "Kleine Rollen formen, zu Hoernchen biegen",
        "Bei 170 Grad 12-14 Minuten backen bis goldgelb",
        "Noch warm in Vanille-Puderzucker-Gemisch waelzen"
      ]
    }',
    NOW() - INTERVAL '20 days');

  -- ---- TRADITIONEN (4) ----
  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'traditions', v_user_id,
    'Das Bergmann-Familientreffen am ersten Mai',
    'Seit 1965 trifft sich die Familie Bergmann am 1. Mai auf dem Bauernhof von Cousin Herbert in Rosenheim. Alle bringen etwas mit: die Frauen Kuchen, die Maenner Bier, die Kinder ihre Spiele. Es beginnt um 10 Uhr und endet wenn der letzte einschlaeft. Rekord: 3 Uhr morgens, Werner 1987.',
    'de', '{"since_year": "1965", "introduced_by": "Johann Bergmann", "frequency": "annual"}',
    NOW() - INTERVAL '40 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'traditions', v_user_id,
    'Advent-Briefkette der Familie',
    'Jedes Jahr im Dezember schreibt jedes Familienmitglied einen Brief an eine andere Person - per Los zugeteilt. Kein Geschenk, nur Worte. Was dir dieser Mensch bedeutet. Was du ihm wuenschst. Margarethe hat diese Tradition 1978 eingefuehrt. Die Briefe werden aufbewahrt. Es gibt Schuhschachteln voll damit.',
    'de', '{"since_year": "1978", "introduced_by": "Margarethe Bergmann", "frequency": "annual"}',
    NOW() - INTERVAL '32 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'traditions', v_user_id,
    'Der Bergmann-Wandertag an Himmelfahrt',
    'Maenner der Familie wandern, Frauen machen was sie wollen. Das war frueher so gemeint. Heute wandern alle - aber getrennt. Die Maenner auf schwere Touren, die Frauen auf schoene. Abends treffen alle im Gasthaus Gruenthal zusammen. Es gibt immer Streit wessen Route besser war.',
    'de', '{"since_year": "1975", "introduced_by": "Klaus Bergmann", "frequency": "annual"}',
    NOW() - INTERVAL '25 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, on_behalf_of, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'traditions', v_user_id, vm_m12,
    'Sandras Sonntagsfruehstueck fuer alle',
    'Jeden ersten Sonntag im Monat laedt Sandra alle ein die in Muenchen wohnen. Beginn 10 Uhr, Ende offen. Keine Entschuldigung akzeptiert ausser Krankenhaus oder Auslandsreise. Es gibt immer: frische Brezeln, selbstgemachte Marmelade und Sandras Eierspeise mit Trueffen.',
    'de', '{"since_year": "2010", "introduced_by": "Sandra Bergmann", "frequency": "monthly"}',
    NOW() - INTERVAL '18 days');

  -- ---- WEISHEITEN (3) ----
  INSERT INTO public.entries (vault_id, category_slug, author_id, on_behalf_of, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'wisdom', v_user_id, vm_m1,
    'Johanns Lebensmotto',
    '"Wer gut arbeitet muss nicht laut reden."
    Johann sagte das zu Klaus, als der gerade sein Unternehmen gruendete und nervoes war wegen der Konkurrenz. Klaus hat es nie vergessen. Er haengte es als Schild in seiner Werkstatt auf. Es haengt heute noch dort.',
    'de', '{"context": "Weitergegeben beim Gruendung von Bergmann Holzbau 1980"}',
    NOW() - INTERVAL '36 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, on_behalf_of, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'wisdom', v_user_id, vm_m9,
    'Dieters Rat fuer das Berufsleben',
    '"Lern deinen Beruf so gut, dass du nicht ersetzt werden kannst. Dann kannst du alles andere vergessen."
    Dieter sagte das zu Stefan, als der Abitur hatte und nicht wusste was er studieren soll. Stefan studierte Informatik. Er sagt heute, das war der beste Rat den er je bekam.',
    'de', '{"context": "Dieter an Stefan, 1989 nach dem Abitur"}',
    NOW() - INTERVAL '24 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, on_behalf_of, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'wisdom', v_user_id, vm_m14,
    'Nicoles Philosophie der Musik',
    '"Musik hoert man nicht mit den Ohren. Man hoert sie mit dem Leben das man gelebt hat."
    Nicole sagt das vor jedem Konzert zu ihren Schuelerinnen. Sie meint: Ein 20-Jaehriger und ein 60-Jaehriger hoeren dasselbe Stueck voellig unterschiedlich. Beide haben Recht.',
    'de', '{"context": "Nicole als Geigenlehrerin, ihre Einfuehrungslektion"}',
    NOW() - INTERVAL '16 days');

  -- ---- ORTE (2) ----
  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'places', v_user_id,
    'Das Bergmann-Haus in Rosenheim',
    'Kufsteiner Strasse 14, Rosenheim. Gebaut 1952 von Johann in 18 Monaten. Ein zweistoeckiges Haus mit grossem Garten, Schreinerwerkstatt im Keller und einem Apfelbaum der aelter ist als das Haus. Vier Generationen der Familie sind hier aufgewachsen. Klaus wohnt noch immer darin.',
    'de', '{"address": "Kufsteiner Strasse 14, 83022 Rosenheim", "coordinates": {"lat": 47.8579, "lng": 12.1218}, "meaning": "Familiendomizil seit 1952, vier Generationen"}',
    NOW() - INTERVAL '44 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, on_behalf_of, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'places', v_user_id, vm_m7,
    'Werners Heimathafen Kiel-Holtenau',
    'Der Yachthafen Kiel-Holtenau war 30 Jahre Werners zweites Wohnzimmer. Seine Yacht Margarethe II lag in Box 47. Jeder in der Familie hat hier mindestens einmal eine Nacht auf dem Boot verbracht. "Der Hafen riecht nach Freiheit", sagt Werner.',
    'de', '{"address": "Yachthafen Kiel-Holtenau, 24159 Kiel", "coordinates": {"lat": 54.3753, "lng": 10.1613}, "meaning": "Werners Heimathafen 1985-2015, Margarethe II lag hier"}',
    NOW() - INTERVAL '29 days');

  -- ---- FOTOS (2) ----
  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'photos', v_user_id,
    'Familientreffen am 1. Mai 1985',
    'Das Foto entstand auf dem Bauernhof in Rosenheim. Von links: Klaus, Brigitte, Werner, Ursula, Dieter, Renate. Die Kinder sind auf dem Boden. Johann fotografierte von der Hollerbaum-Bank aus. Das ist das letzte Foto auf dem alle drei Bruedern gemeinsam sind.',
    'de', '{"description": "Grosses Familientreffen im Freien, Sommer 1985", "year": "1985", "media_url": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop"}',
    NOW() - INTERVAL '43 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, on_behalf_of, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'photos', v_user_id, vm_m19,
    'Felix Foto vom Polarfuchs in Island',
    'Das Foto das alles veraenderte. Aufgenommen im Januar 2018 bei Reykjanes, Island. Der Leuchtturm Reykjanesviti im Schneesturm, ein Polarfuchs der die Kamera anschaut. Blende f/8, ISO 400, 1/500s. Heute haengt es als Druck im Wohnzimmer aller Familienmitglieder.',
    'de', '{"description": "Polarfuchs vor Leuchtturm im islaendischen Schneesturm", "year": "2018", "media_url": "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&fit=crop"}',
    NOW() - INTERVAL '14 days');

  RAISE NOTICE 'Erfolgreich angelegt! Vault-ID: % | 20 Personen | 19 Beziehungen | 20 Eintraege', v_vault_id;
END;
$$;
