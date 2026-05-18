-- =============================================================================
-- Testdaten: Familie Test
-- Ausführen im Supabase Dashboard → SQL Editor
-- =============================================================================

DO $$
DECLARE
  v_user_id     uuid;
  v_vault_id    uuid;
  v_member_id   uuid;

  -- vault_member IDs
  vm_erwin      uuid;
  vm_maria      uuid;
  vm_walter     uuid;
  vm_helga      uuid;
  vm_thomas     uuid;
  vm_petra      uuid;
  vm_michael    uuid;
  vm_sabine     uuid;
  vm_lukas      uuid;
  vm_anna       uuid;

  -- family_person IDs
  fp_erwin      uuid;
  fp_maria      uuid;
  fp_walter     uuid;
  fp_helga      uuid;
  fp_thomas     uuid;
  fp_petra      uuid;
  fp_michael    uuid;
  fp_sabine     uuid;
  fp_lukas      uuid;
  fp_anna       uuid;

  -- category IDs
  cat_stories   uuid;
  cat_recipes   uuid;
  cat_traditions uuid;
  cat_wisdom    uuid;
  cat_places    uuid;
  cat_photos    uuid;

BEGIN

  -- Benutzer per E-Mail suchen
  SELECT id INTO v_user_id FROM auth.users WHERE email ILIKE 'ErwinMoretz@gmail.com' LIMIT 1;
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Benutzer nicht gefunden. Bitte E-Mail in Zeile 16 anpassen.';
  END IF;

  -- ==========================================================================
  -- VAULT
  -- ==========================================================================
  INSERT INTO public.vaults (name, description, owner_id, plan)
  VALUES (
    'Familie Test',
    'Das Familienarchiv der Familie Test - Erinnerungen, Rezepte, Traditionen und Geschichten von vier Generationen.',
    v_user_id,
    'family_plus'
  )
  RETURNING id INTO v_vault_id;

  -- Eigener vault_member (Initiator - wird durch Trigger angelegt, holen wir uns)
  SELECT id INTO vm_erwin FROM public.vault_members WHERE vault_id = v_vault_id AND user_id = v_user_id;

  -- ==========================================================================
  -- WEITERE MITGLIEDER (ohne App-Account, display_name-basiert)
  -- ==========================================================================
  INSERT INTO public.vault_members (vault_id, user_id, role, display_name, family_role)
  VALUES (v_vault_id, NULL, 'contributor', 'Maria Test', 'Mutter') RETURNING id INTO vm_maria;

  INSERT INTO public.vault_members (vault_id, user_id, role, display_name, family_role)
  VALUES (v_vault_id, NULL, 'contributor', 'Walter Test', 'Vater') RETURNING id INTO vm_walter;

  INSERT INTO public.vault_members (vault_id, user_id, role, display_name, family_role)
  VALUES (v_vault_id, NULL, 'reader', 'Helga Test', 'Großmutter') RETURNING id INTO vm_helga;

  INSERT INTO public.vault_members (vault_id, user_id, role, display_name, family_role)
  VALUES (v_vault_id, NULL, 'contributor', 'Thomas Test', 'Onkel') RETURNING id INTO vm_thomas;

  INSERT INTO public.vault_members (vault_id, user_id, role, display_name, family_role)
  VALUES (v_vault_id, NULL, 'reader', 'Petra Test', 'Tante') RETURNING id INTO vm_petra;

  INSERT INTO public.vault_members (vault_id, user_id, role, display_name, family_role)
  VALUES (v_vault_id, NULL, 'contributor', 'Michael Test', 'Bruder') RETURNING id INTO vm_michael;

  INSERT INTO public.vault_members (vault_id, user_id, role, display_name, family_role)
  VALUES (v_vault_id, NULL, 'reader', 'Sabine Test', 'Schwester') RETURNING id INTO vm_sabine;

  INSERT INTO public.vault_members (vault_id, user_id, role, display_name, family_role)
  VALUES (v_vault_id, NULL, 'reader', 'Lukas Test', 'Neffe') RETURNING id INTO vm_lukas;

  INSERT INTO public.vault_members (vault_id, user_id, role, display_name, family_role)
  VALUES (v_vault_id, NULL, 'reader', 'Anna Test', 'Nichte') RETURNING id INTO vm_anna;

  -- ==========================================================================
  -- STAMMBAUM
  -- ==========================================================================
  INSERT INTO public.family_persons (vault_id, member_id, full_name, birth_year, gender, bio, pos_x, pos_y,
    avatar_url)
  VALUES (v_vault_id, vm_erwin, 'Erwin Test', 1978, 'male',
    'Gründer des Familienarchivs. Leidenschaftlicher Hobbyfotograf und Geschichtenerzähler.',
    400, 300,
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face')
  RETURNING id INTO fp_erwin;

  INSERT INTO public.family_persons (vault_id, member_id, full_name, birth_year, gender, bio, pos_x, pos_y,
    avatar_url)
  VALUES (v_vault_id, vm_maria, 'Maria Test', 1950, 'female',
    'Mutter von Erwin. Bekannt für ihre hervorragende Küche und die Weitergabe alter Familienrezepte.',
    200, 150,
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face')
  RETURNING id INTO fp_maria;

  INSERT INTO public.family_persons (vault_id, member_id, full_name, birth_year, death_year, gender, bio, pos_x, pos_y,
    avatar_url)
  VALUES (v_vault_id, vm_walter, 'Walter Test', 1947, 2018, 'male',
    'Vater von Erwin. Tischlermeister. Hat das Familienhaus in München eigenhändig renoviert.',
    600, 150,
    'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&h=200&fit=crop&crop=face')
  RETURNING id INTO fp_walter;

  INSERT INTO public.family_persons (vault_id, member_id, full_name, birth_year, death_year, gender, bio, pos_x, pos_y,
    avatar_url)
  VALUES (v_vault_id, vm_helga, 'Helga Test', 1922, 2001, 'female',
    'Großmutter mütterlicherseits. Hat die Kriegsjahre in Bayern überlebt und die Familie zusammengehalten.',
    100, 50,
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&h=200&fit=crop&crop=face')
  RETURNING id INTO fp_helga;

  INSERT INTO public.family_persons (vault_id, member_id, full_name, birth_year, gender, bio, pos_x, pos_y,
    avatar_url)
  VALUES (v_vault_id, vm_thomas, 'Thomas Test', 1955, 'male',
    'Bruder von Walter. Lebt in Hamburg. Leidenschaftlicher Segler.',
    700, 50,
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face')
  RETURNING id INTO fp_thomas;

  INSERT INTO public.family_persons (vault_id, member_id, full_name, birth_year, gender, bio, pos_x, pos_y,
    avatar_url)
  VALUES (v_vault_id, vm_petra, 'Petra Test', 1958, 'female',
    'Frau von Thomas. Lehrerin für Deutsch und Geschichte.',
    800, 150,
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face')
  RETURNING id INTO fp_petra;

  INSERT INTO public.family_persons (vault_id, member_id, full_name, birth_year, gender, bio, pos_x, pos_y,
    avatar_url)
  VALUES (v_vault_id, vm_michael, 'Michael Test', 1975, 'male',
    'Cousin von Erwin. Ingenieur in Berlin. Spielt Gitarre.',
    750, 300,
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face')
  RETURNING id INTO fp_michael;

  INSERT INTO public.family_persons (vault_id, member_id, full_name, birth_year, gender, bio, pos_x, pos_y,
    avatar_url)
  VALUES (v_vault_id, vm_sabine, 'Sabine Test', 1980, 'female',
    'Schwester von Erwin. Ärztin in München. Mutter von Lukas und Anna.',
    200, 450,
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face')
  RETURNING id INTO fp_sabine;

  INSERT INTO public.family_persons (vault_id, member_id, full_name, birth_year, gender, bio, pos_x, pos_y,
    avatar_url)
  VALUES (v_vault_id, vm_lukas, 'Lukas Test', 2005, 'male',
    'Sohn von Sabine. Schüler, begeisterter Fußballspieler.',
    100, 550,
    'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&h=200&fit=crop&crop=face')
  RETURNING id INTO fp_lukas;

  INSERT INTO public.family_persons (vault_id, member_id, full_name, birth_year, gender, bio, pos_x, pos_y,
    avatar_url)
  VALUES (v_vault_id, vm_anna, 'Anna Test', 2008, 'female',
    'Tochter von Sabine. Schülerin, liebt Malen und Zeichnen.',
    300, 550,
    'https://images.unsplash.com/photo-1592621385612-4d7129426394?w=200&h=200&fit=crop&crop=face')
  RETURNING id INTO fp_anna;

  -- ==========================================================================
  -- BEZIEHUNGEN
  -- ==========================================================================
  -- Helga → Maria (Mutter-Kind)
  INSERT INTO public.family_relationships (vault_id, person_a_id, person_b_id, relationship_type)
  VALUES (v_vault_id, fp_helga, fp_maria, 'parent_child');

  -- Maria + Walter (Partner)
  INSERT INTO public.family_relationships (vault_id, person_a_id, person_b_id, relationship_type)
  VALUES (v_vault_id, fp_maria, fp_walter, 'partner');

  -- Maria → Erwin (Mutter-Kind)
  INSERT INTO public.family_relationships (vault_id, person_a_id, person_b_id, relationship_type)
  VALUES (v_vault_id, fp_maria, fp_erwin, 'parent_child');

  -- Maria → Sabine (Mutter-Kind)
  INSERT INTO public.family_relationships (vault_id, person_a_id, person_b_id, relationship_type)
  VALUES (v_vault_id, fp_maria, fp_sabine, 'parent_child');

  -- Thomas + Petra (Partner)
  INSERT INTO public.family_relationships (vault_id, person_a_id, person_b_id, relationship_type)
  VALUES (v_vault_id, fp_thomas, fp_petra, 'partner');

  -- Thomas → Michael (Vater-Kind)
  INSERT INTO public.family_relationships (vault_id, person_a_id, person_b_id, relationship_type)
  VALUES (v_vault_id, fp_thomas, fp_michael, 'parent_child');

  -- Sabine → Lukas (Mutter-Kind)
  INSERT INTO public.family_relationships (vault_id, person_a_id, person_b_id, relationship_type)
  VALUES (v_vault_id, fp_sabine, fp_lukas, 'parent_child');

  -- Sabine → Anna (Mutter-Kind)
  INSERT INTO public.family_relationships (vault_id, person_a_id, person_b_id, relationship_type)
  VALUES (v_vault_id, fp_sabine, fp_anna, 'parent_child');

  -- ==========================================================================
  -- KATEGORIEN holen
  -- ==========================================================================
  SELECT id INTO cat_stories   FROM public.categories WHERE vault_id = v_vault_id AND slug = 'stories';
  SELECT id INTO cat_recipes   FROM public.categories WHERE vault_id = v_vault_id AND slug = 'recipes';
  SELECT id INTO cat_traditions FROM public.categories WHERE vault_id = v_vault_id AND slug = 'traditions';
  SELECT id INTO cat_wisdom    FROM public.categories WHERE vault_id = v_vault_id AND slug = 'wisdom';
  SELECT id INTO cat_places    FROM public.categories WHERE vault_id = v_vault_id AND slug = 'places';
  SELECT id INTO cat_photos    FROM public.categories WHERE vault_id = v_vault_id AND slug = 'photos';

  -- ==========================================================================
  -- EINTRÄGE: GESCHICHTEN (10)
  -- ==========================================================================
  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'stories', v_user_id,
    'Die Flucht aus Schlesien 1945',
    'Großmutter Helga erzählte oft von der langen Wanderung im Januar 1945. Mit drei Koffern und zwei kleinen Kindern verließ sie das Haus in Breslau, das die Familie seit Generationen bewohnt hatte. "Wir dachten, wir kommen bald zurück", sagte sie immer. Der Schnee war hoch, die Straßen überfüllt. Nach sechs Wochen Fußmarsch erreichten sie Bayern.',
    'de', '{"period_start": "1945-01", "period_end": "1945-03"}',
    NOW() - INTERVAL '30 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, on_behalf_of, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'stories', v_user_id, vm_maria,
    'Wie Walter Maria kennenlernte',
    'Es war auf dem Münchner Oktoberfest 1968. Walter stand mit seinen Freunden am Bierstand, als er Maria im Dirndl lachen sah. Er sagte zu seinem Freund Hans: "Die heirate ich." Drei Jahre später war es so weit. Maria lachte immer wenn sie diese Geschichte erzählte: "Er hat mich erst drei Stunden später angesprochen."',
    'de', '{"period_start": "1968", "period_end": "1971"}',
    NOW() - INTERVAL '25 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'stories', v_user_id,
    'Das alte Haus in Garmisch',
    'Walters Vater baute das Haus in Garmisch-Partenkirchen 1952 eigenhändig. Jeder Stein wurde mit der Hand gemauert. Das Haus stand am Hang mit Blick auf die Zugspitze. Wir Kinder spielten jeden Sommer dort - Verstecken im Heustadl, Forellen fangen im Bach. Das Haus wurde 2010 verkauft als die Eltern zu alt wurden. Ich vermisse den Geruch des alten Holzes.',
    'de', '{"period_start": "1952", "period_end": "2010"}',
    NOW() - INTERVAL '20 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, on_behalf_of, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'stories', v_user_id, vm_walter,
    'Walters Lehrjahre als Tischler',
    'Mit 14 Jahren begann Walter seine Ausbildung bei Meister Huber in Rosenheim. Jeden Morgen um 5 Uhr aufstehen, mit dem Zug fahren, bis 18 Uhr arbeiten. "Meister Huber war streng, aber gerecht", erzählte er. Nach drei Jahren Lehre und vier Jahren Gesellenzeit legte er 1970 die Meisterprüfung ab. Er war der jüngste Tischlermeister im Landkreis.',
    'de', '{"period_start": "1961", "period_end": "1970"}',
    NOW() - INTERVAL '18 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'stories', v_user_id,
    'Mein erster Tag in der Schule',
    'Sabine und ich gingen in dieselbe Grundschule in München-Schwabing. Ich erinnere mich noch genau an meinen ersten Schultag 1984. Die Schultüte war so groß wie ich. Frau Meier war unsere Lehrerin - streng aber lieb. Sabine weinte, ich versuchte tapfer zu sein. Am Mittag haben wir beide geweint vor Erschöpfung.',
    'de', '{"period_start": "1984"}',
    NOW() - INTERVAL '15 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, on_behalf_of, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'stories', v_user_id, vm_thomas,
    'Thomas und die große Segeltour 1985',
    'Thomas segelte 1985 mit drei Freunden von Hamburg nach Portugal - 2.800 Kilometer auf dem Atlantik. Der Sturm bei Biscaya war der schlimmste Moment: "Das Boot lag 45 Grad auf der Seite, wir dachten es wäre vorbei." Aber sie schafften es. In Lissabon haben sie drei Tage gefeiert. Thomas sagt, das war der Moment, in dem er verstand, was Freiheit bedeutet.',
    'de', '{"period_start": "1985-07", "period_end": "1985-09"}',
    NOW() - INTERVAL '12 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'stories', v_user_id,
    'Die Weihnacht 1989 - Mauerfall-Silvester',
    'Weihnachten 1989 war besonders. Onkel Thomas kam aus Hamburg und brachte Bilder mit vom Mauerfall. Wir saßen alle vor dem Fernseher. Großvater Walter weinte - er hatte Verwandte in Dresden. Wir fuhren Silvester nach Berlin und standen am Brandenburger Tor. Ich war elf Jahre alt und verstand nicht ganz was passierte. Aber ich spürte, dass es wichtig war.',
    'de', '{"period_start": "1989-12"}',
    NOW() - INTERVAL '10 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'stories', v_user_id,
    'Lukas erstes Fußballspiel',
    'Lukas spielte sein erstes offizielles Fußballspiel für den TSV München 1860 (Jugend) im September 2012. Er war sieben Jahre alt. Das erste Tor schoss er in der 23. Minute - linker Fuß, Halbvolley. Die ganze Familie war auf der Tribüne. Sabine weinte vor Stolz. Lukas lief zur Eckfahne und machte einen Salto - den er fast nicht schaffte.',
    'de', '{"period_start": "2012-09"}',
    NOW() - INTERVAL '8 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, on_behalf_of, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'stories', v_user_id, vm_sabine,
    'Sabines Entscheidung Ärztin zu werden',
    'Sabine wollte eigentlich Tierärztin werden. Bis sie mit 16 Jahren ihren Großvater Walter im Krankenhaus besuchte. Der Stationsarzt Dr. Fischer nahm sich Zeit und erklärte der Teenagerin die Diagnose verständlich. "In diesem Moment wusste ich: Das will ich machen. Menschen in schwierigen Momenten begleiten." Heute ist Sabine selbst Ärztin in einer Münchener Notaufnahme.',
    'de', '{"period_start": "1996"}',
    NOW() - INTERVAL '6 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'stories', v_user_id,
    'Annas Kunstausstellung in der Schule',
    'Anna hat seit sie klein ist eine Leidenschaft fürs Zeichnen. 2023, mit 15 Jahren, stellte sie zum ersten Mal in der Schulausstellung aus - ein Ölgemälde des alten Hauses in Garmisch, gemalt nach alten Familienfotos. Es hing in der Aula und gewann den ersten Preis. Wir haben alle geweint vor Rührung. Das Bild hängt jetzt bei Maria im Wohnzimmer.',
    'de', '{"period_start": "2023-06"}',
    NOW() - INTERVAL '4 days');

  -- ==========================================================================
  -- EINTRÄGE: REZEPTE (8)
  -- ==========================================================================
  INSERT INTO public.entries (vault_id, category_slug, author_id, on_behalf_of, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'recipes', v_user_id, vm_maria,
    'Helgas Schlesischer Mohnkuchen',
    'Dieses Rezept stammt von Urgroßmutter Helga und wurde aus Schlesien mitgebracht. Es schmeckt nach Kindheit.',
    'de', '{
      "origin": "Schlesien, ca. 1930",
      "servings": "12 Stücke",
      "ingredients": [
        "500g Weizenmehl Type 405",
        "250ml lauwarme Milch",
        "42g frische Hefe",
        "100g Butter",
        "2 Eier",
        "80g Zucker",
        "1 TL Salz",
        "500g gemahlener Mohn",
        "200ml Milch (für Füllung)",
        "150g Zucker (für Füllung)",
        "50g Butter (für Füllung)",
        "2 EL Honig",
        "Abrieb 1 Zitrone"
      ],
      "steps": [
        "Hefe in lauwarmer Milch auflösen, 10 Min gehen lassen",
        "Mehl, Butter, Eier, Zucker, Salz und Hefemilch zu einem glatten Teig kneten",
        "1 Stunde abgedeckt gehen lassen bis sich das Volumen verdoppelt hat",
        "Mohn mit Milch, Zucker, Butter und Honig aufkochen bis eine dickliche Masse entsteht",
        "Zitronenabrieb unterrühren, abkühlen lassen",
        "Teig rechteckig ausrollen, Mohnfüllung gleichmäßig verstreichen",
        "Von der langen Seite aufrollen, in gebutterte Form legen",
        "Nochmals 30 Min gehen lassen",
        "Bei 175°C 45 Minuten backen bis goldbraun"
      ]
    }',
    NOW() - INTERVAL '28 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, on_behalf_of, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'recipes', v_user_id, vm_maria,
    'Marias Bayerischer Schweinebraten',
    'Der Schweinebraten den Maria jeden Sonntag macht. Geheimnis: dunkles Bier statt Brühe.',
    'de', '{
      "origin": "Bayern, Familienrezept seit 1960er",
      "servings": "6 Personen",
      "ingredients": [
        "1,5 kg Schweineschulter mit Schwarte",
        "500ml dunkles Bier (Weißbier oder Märzen)",
        "2 Zwiebeln",
        "3 Knoblauchzehen",
        "2 Karotten",
        "Kümmel, Salz, Pfeffer",
        "1 TL Majoran",
        "2 EL Schmalz"
      ],
      "steps": [
        "Schwarte rautenförmig einschneiden, gut mit Salz, Pfeffer, Kümmel und Majoran einreiben",
        "Schmalz in Bräter erhitzen, Fleisch von allen Seiten kräftig anbraten",
        "Gemüse grob schneiden, dazugeben und mitrösten",
        "Bier angießen, Deckel drauf, bei 160°C 3 Stunden schmoren",
        "Letzte 30 Min ohne Deckel bei 200°C damit die Kruste knusprig wird",
        "Sauce durch Sieb passieren, bei Bedarf mit Stärke binden"
      ]
    }',
    NOW() - INTERVAL '22 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'recipes', v_user_id,
    'Omas Apfelstrudel',
    'Dieser Strudel war Pflicht bei jedem Familientreffen. Der Teig muss so dünn sein, dass man eine Zeitung dadurch lesen kann.',
    'de', '{
      "origin": "Österreich/Bayern",
      "servings": "8 Stücke",
      "ingredients": [
        "250g Mehl",
        "125ml lauwarmes Wasser",
        "3 EL Öl",
        "1 Prise Salz",
        "1 Ei",
        "1,5 kg säuerliche Äpfel",
        "100g Rosinen",
        "100g gehackte Walnüsse",
        "150g Zucker",
        "2 TL Zimt",
        "100g Semmelbrösel",
        "100g Butter"
      ],
      "steps": [
        "Mehl, Wasser, Öl, Salz und Ei zu einem elastischen Teig verkneten",
        "30 Min in Frischhaltefolie ruhen lassen",
        "Semmelbrösel in Butter goldbraun rösten, abkühlen lassen",
        "Äpfel schälen, dünn hobeln, mit Zucker, Zimt, Rosinen und Nüssen mischen",
        "Teig auf bemehltem Tuch dünn ausziehen bis er transparent ist",
        "Brösel auf 2/3 des Teiges verteilen, Apfelfüllung darauf geben",
        "Mit Hilfe des Tuches aufrollen, Enden einschlagen",
        "Bei 200°C 40 Min goldbraun backen, mehrmals mit Butter bestreichen"
      ]
    }',
    NOW() - INTERVAL '17 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, on_behalf_of, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'recipes', v_user_id, vm_petra,
    'Petras Hamburger Labskaus',
    'Petra hat dieses norddeutsche Gericht in die Familie gebracht. Erwin war zunächst skeptisch - jetzt isst er es am liebsten.',
    'de', '{
      "origin": "Hamburg, Norddeutschland",
      "servings": "4 Personen",
      "ingredients": [
        "600g gepökeltes Rindfleisch (Corned Beef)",
        "800g mehlige Kartoffeln",
        "3 mittelgroße Rote Beten (gekocht)",
        "2 Zwiebeln",
        "4 Rollmöpse",
        "4 Spiegeleier",
        "Salz, Pfeffer",
        "2 EL Schmalz"
      ],
      "steps": [
        "Kartoffeln kochen und stampfen",
        "Zwiebeln in Schmalz glasig dünsten",
        "Corned Beef zerfasern und mit Zwiebeln anbraten",
        "Rote Bete würfeln und unterheben",
        "Kartoffelpüree alles vermengen, abschmecken",
        "Spiegeleier braten",
        "Labskaus auf Tellern anrichten, Spiegelei und Rollmops dazu"
      ]
    }',
    NOW() - INTERVAL '14 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'recipes', v_user_id,
    'Weihnachtsplätzchen nach Helgas Art',
    'Jedes Jahr in der Adventszeit machten wir diese Plätzchen gemeinsam. Ein ganzer Tag backen in Großmutters Küche.',
    'de', '{
      "origin": "Schlesien/Bayern, Familienrezept",
      "servings": "ca. 80 Stück",
      "ingredients": [
        "500g Mehl",
        "250g weiche Butter",
        "200g Puderzucker",
        "2 Eier",
        "1 Päckchen Vanillezucker",
        "Abrieb 1 Zitrone",
        "1 Prise Salz",
        "Für die Glasur: 200g Puderzucker, Zitronensaft, bunte Streusel"
      ],
      "steps": [
        "Butter und Puderzucker cremig rühren",
        "Eier, Vanillezucker, Zitronenabrieb und Salz unterrühren",
        "Mehl einkneten bis ein glatter Teig entsteht",
        "1 Stunde kalt stellen",
        "Auf 3mm ausrollen, Formen ausstechen",
        "Bei 175°C 10-12 Min goldgelb backen",
        "Abgekühlt mit Zuckerguss bestreichen und dekorieren"
      ]
    }',
    NOW() - INTERVAL '11 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'recipes', v_user_id,
    'Saure Zipfel fränkische Art',
    'Dieses Rezept brachte Walter von einer Geschäftsreise nach Nürnberg mit. Seitdem gibt es das bei uns zu jedem Oktoberfest.',
    'de', '{
      "origin": "Franken, Nürnberg",
      "servings": "4 Personen",
      "ingredients": [
        "8 Bratwürste (fränkische Art)",
        "500ml Weißweinessig",
        "500ml Wasser",
        "2 Zwiebeln in Ringe",
        "1 Lorbeerblatt",
        "5 Pfefferkörner",
        "3 Wacholderbeeren",
        "1 TL Salz",
        "2 EL Zucker"
      ],
      "steps": [
        "Sud aus Essig, Wasser, Gewürzen und Zucker aufkochen",
        "Zwiebeln dazugeben, 5 Min köcheln",
        "Bratwürste einlegen und bei schwacher Hitze 15 Min ziehen lassen",
        "Mit Bauernbrot und Meerrettich servieren"
      ]
    }',
    NOW() - INTERVAL '9 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, on_behalf_of, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'recipes', v_user_id, vm_sabine,
    'Sabines schnelle Sonntagssuppe',
    'Für die vielbeschäftigte Ärztin muss es manchmal schnell gehen. Diese Suppe macht sie jeden Sonntag.',
    'de', '{
      "origin": "Sabines eigene Kreation",
      "servings": "4 Personen",
      "ingredients": [
        "1 Hühnchen oder 4 Hähnchenschenkel",
        "3 Karotten",
        "2 Stangen Sellerie",
        "1 Petersilienwurzel",
        "1 Zwiebel",
        "Petersilie, Salz, Pfeffer",
        "200g Fadennudeln"
      ],
      "steps": [
        "Hühnchen in kaltem Wasser aufsetzen, langsam zum Kochen bringen",
        "Schaum abschöpfen, Gemüse und ganze Zwiebel dazugeben",
        "2 Stunden auf kleiner Flamme köcheln",
        "Fleisch herausnehmen, Gemüse entfernen",
        "Neue Karotten in Scheiben kochen, Nudeln einkochen",
        "Fleisch zerfasern und zurückgeben, mit Petersilie servieren"
      ]
    }',
    NOW() - INTERVAL '7 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'recipes', v_user_id,
    'Walters geheime Grillsauce',
    'Walter hat dieses Rezept nie vollständig verraten. Ich habe es aus dem Gedächtnis rekonstruiert.',
    'de', '{
      "origin": "Walters Eigenkreation, 1980er Jahre",
      "servings": "für ca. 500g Fleisch",
      "ingredients": [
        "200ml Tomatenketchup",
        "50ml Worcestershire-Sauce",
        "3 EL dunkler Zuckerrübensirup",
        "2 EL Apfelessig",
        "2 Knoblauchzehen (gepresst)",
        "1 TL geräuchertes Paprikapulver",
        "1 TL Senfpulver",
        "Tabasco nach Geschmack",
        "Salz, schwarzer Pfeffer"
      ],
      "steps": [
        "Alle Zutaten in einem Topf vereinen",
        "Bei mittlerer Hitze 15 Min einköcheln lassen",
        "Abschmecken - sollte süß-rauchig-scharf sein",
        "Mindestens 24 Std im Kühlschrank ziehen lassen",
        "Zum Grillen verwenden oder als Dip servieren"
      ]
    }',
    NOW() - INTERVAL '5 days');

  -- ==========================================================================
  -- EINTRÄGE: TRADITIONEN (8)
  -- ==========================================================================
  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'traditions', v_user_id,
    'Oktoberfest - Die Familientradition',
    'Seit 1952 trifft sich die Familie Test jeden zweiten Samstag im Oktober auf dem Oktoberfest. Immer im Hofbräuzelt, Tisch wird Monate vorher reserviert. Alle kommen in Tracht. Selbst als Thomas in Hamburg lebte, ist er jedes Jahr angereist.',
    'de', '{"since_year": "1952", "introduced_by": "Franz Test (Urgroßvater)", "frequency": "annual"}',
    NOW() - INTERVAL '26 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'traditions', v_user_id,
    'Silvesterfeuer am Gartentor',
    'Jedes Silvester zünden wir um Mitternacht gemeinsam ein kleines Feuer am Gartentor an. Diese Tradition begann 1975 als Zeichen für "altes Jahr verbrennen, neues willkommen heißen". Jeder schreibt auf einen Zettel was er loslassen möchte und wirft ihn ins Feuer.',
    'de', '{"since_year": "1975", "introduced_by": "Helga Test", "frequency": "annual"}',
    NOW() - INTERVAL '23 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'traditions', v_user_id,
    'Sonntagsessen bei Maria',
    'Jeden Sonntag um 12:30 Uhr gibt es Mittagessen bei Maria - wer in München ist, kommt. Kein Anruf nötig, kein Voranmelden. Die Tür ist offen, der Topf groß. Das war früher normal und wurde zur Tradition als die Kinder ausgezogen sind.',
    'de', '{"since_year": "1985", "introduced_by": "Maria Test", "frequency": "weekly"}',
    NOW() - INTERVAL '19 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'traditions', v_user_id,
    'Der Familienausflug zu Himmelfahrt',
    'Jedes Jahr an Christi Himmelfahrt fahren wir gemeinsam in die Berge - früher als Kinder nach Garmisch, heute wohin es passt. Rucksack packen, Wandern, Einkehr. Handys bleiben in der Tasche. Diese Tradition hält Walter eingeführt und wir führen sie nach seinem Tod weiter.',
    'de', '{"since_year": "1970", "introduced_by": "Walter Test", "frequency": "annual"}',
    NOW() - INTERVAL '16 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'traditions', v_user_id,
    'Adventskalender für die Kinder',
    'Jedes Jahr bastelt Maria einen selbstgemachten Adventskalender für alle Kinder und Enkelkinder in der Familie. 24 kleine Päckchen, jedes mit einem kleinen Geschenk und einem handgeschriebenen Zettel mit einer Familienerinnerung.',
    'de', '{"since_year": "1983", "introduced_by": "Maria Test", "frequency": "annual"}',
    NOW() - INTERVAL '13 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'traditions', v_user_id,
    'Das Geburtstagslied auf Schlesisch',
    'Helga hat uns ein altes schlesisches Geburtstagslied beigebracht. Es beginnt mit "Auf viele Jahr, auf viele Jahr..." und hat vier Strophen die kaum noch jemand kennt. Wir singen es bei jedem Geburtstag - auch wenn niemand mehr den Text ganz kann.',
    'de', '{"since_year": "1960", "introduced_by": "Helga Test", "frequency": "per_occasion"}',
    NOW() - INTERVAL '9 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'traditions', v_user_id,
    'Karfreitags-Fastenessen',
    'An Karfreitag gibt es seit Generationen kein Fleisch - stattdessen Fischgerichte und Mehlspeisen. Helga bestand darauf, ihre Mutter hatte es so gehalten. Mittlerweile halten wir es mehr als kulinarische Tradition denn als religiöse Pflicht.',
    'de', '{"since_year": "1945", "introduced_by": "Helga Test", "frequency": "annual"}',
    NOW() - INTERVAL '6 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'traditions', v_user_id,
    'Familienfoto an Weihnachten',
    'Jedes Jahr an Weihnachten machen wir ein Familienfoto vor dem Christbaum. Die Sammlung geht zurück bis 1963. Man sieht wie die Familie wächst, wie die Kinder groß werden, wie die Alten weißer werden. Anna hat alle Fotos digitalisiert.',
    'de', '{"since_year": "1963", "introduced_by": "Walter Test", "frequency": "annual"}',
    NOW() - INTERVAL '3 days');

  -- ==========================================================================
  -- EINTRÄGE: WEISHEITEN (8)
  -- ==========================================================================
  INSERT INTO public.entries (vault_id, category_slug, author_id, on_behalf_of, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'wisdom', v_user_id, vm_helga,
    'Helgas Lebensregel Nr. 1',
    '"Brot das du heute hast, teile heute. Morgen ist ein neuer Tag und Gott sorgt."
    Helga sagte das immer wenn jemand zu viel auf einmal sparen wollte. Sie hatte die Kriegsjahre erlebt und wusste: nichts ist sicher. Aber teilen kostet nichts.',
    'de', '{"context": "Weitergegeben nach der Flucht 1945, bezieht sich auf Erfahrungen des Mangels und der Gemeinschaft"}',
    NOW() - INTERVAL '27 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, on_behalf_of, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'wisdom', v_user_id, vm_walter,
    'Walters Handwerkerweisheit',
    '"Messe zweimal, schneide einmal." Walter sagte das nicht nur beim Tischlerhandwerk. Er meinte es für alle Entscheidungen im Leben: erst denken, dann handeln. Er hatte erlebt wie sein Lehrmeister einmal ein teures Stück Eichenholz falsch gesägt hatte - der Fehler war nicht mehr zu reparieren.',
    'de', '{"context": "Aus seiner Zeit als Tischlermeister, 1960er-1990er Jahre"}',
    NOW() - INTERVAL '21 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, on_behalf_of, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'wisdom', v_user_id, vm_maria,
    'Marias Küchen-Philosophie',
    '"Kochen mit Liebe schmeckt man." Das klingt kitschig, aber Maria meinte es ernst: Wenn man gestresst kocht, kocht man schlecht. Sie nahm sich immer Zeit. Auch wenn es Mittwochs abends war und sie müde war - nie gehetzt, nie halbherzig.',
    'de', '{"context": "Maria über ihre Küche und Lebenseinstellung"}',
    NOW() - INTERVAL '18 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, on_behalf_of, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'wisdom', v_user_id, vm_thomas,
    'Thomas über die See',
    '"Auf dem Meer lernst du was Respekt bedeutet. Du kannst nicht gegen das Wasser kämpfen - nur mit ihm."
    Thomas sagt das über das Segeln, aber er meint es auch über das Leben. Manchmal muss man die Kraft annehmen, nicht bekämpfen. Dann kommt man weiter.',
    'de', '{"context": "Nach der Atlantiküberquerung 1985"}',
    NOW() - INTERVAL '14 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, on_behalf_of, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'wisdom', v_user_id, vm_sabine,
    'Sabines Medizin-Weisheit',
    '"Die meisten Menschen wissen selbst was gut für sie ist. Als Ärztin ist meine Aufgabe oft nur zuzuhören bis sie es selbst sagen."
    Sabine arbeitet in der Notaufnahme und hat gelernt: Schmerz ist oft nicht das eigentliche Problem.',
    'de', '{"context": "Aus Sabines Erfahrung als Notaufnahmeärztin, 2010er Jahre"}',
    NOW() - INTERVAL '11 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'wisdom', v_user_id,
    'Was Großvater über Geld sagte',
    '"Geld ist ein guter Diener aber ein schlechter Herr." Walter sagte das oft wenn die Sprache aufs Geld kam. Er hatte genug davon in seinem Leben als Tischlermeister - aber er ließ es nie über seine Entscheidungen bestimmen. Das fand ich als Jugendlicher naiv. Heute verstehe ich es.',
    'de', '{"context": "Walter über Geld und Prioritäten im Leben"}',
    NOW() - INTERVAL '8 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'wisdom', v_user_id,
    'Helgas Rat für die Ehe',
    '"Heirate jemanden der dich zum Lachen bringt. Schönheit verblasst, Geld kommt und geht - aber Lachen hält."
    Helga gab das Maria vor der Hochzeit mit Walter. Maria zitiert es noch heute bei Hochzeiten in der Familie.',
    'de', '{"context": "Helgas Rat vor Marias Hochzeit 1971"}',
    NOW() - INTERVAL '5 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'wisdom', v_user_id,
    'Was ich meinen Kindern mitgeben möchte',
    '"Seid neugierig, seid mutig, seid freundlich - in dieser Reihenfolge."
    Das ist mein persönlicher Leitsatz den ich Anna und Lukas mitgebe, wenn sie fragen wie man ein gutes Leben führt. Neugier öffnet Türen. Mut geht durch sie hindurch. Freundlichkeit hält sie offen.',
    'de', '{"context": "Meine eigene Philosophie, aufgeschrieben 2024"}',
    NOW() - INTERVAL '2 days');

  -- ==========================================================================
  -- EINTRÄGE: ORTE (8)
  -- ==========================================================================
  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'places', v_user_id,
    'Das alte Haus in Garmisch-Partenkirchen',
    'Bergstraße 14, Garmisch-Partenkirchen. Erbaut 1952 von Walters Vater Franz. Ein zweistöckiges Haus mit rotem Dach und einem großen Garten. Blick auf die Zugspitze. Wir verbrachten dort jeden Sommer. 2010 an eine Familie aus München verkauft. Das Haus steht noch.',
    'de', '{"address": "Bergstraße 14, 82467 Garmisch-Partenkirchen", "coordinates": {"lat": 47.4912, "lng": 11.0954}, "meaning": "Familiendomizil von 1952 bis 2010, Mittelpunkt der Sommererlebnisse"}',
    NOW() - INTERVAL '29 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'places', v_user_id,
    'Die Tischlerwerkstatt in Rosenheim',
    'Hier begann Walter seine Ausbildung. Meister Hubers Werkstatt in der Münchener Straße in Rosenheim. Das Gebäude existiert noch, ist heute ein Möbelgeschäft. Walter fuhr immer wenn er in der Nähe war daran vorbei.',
    'de', '{"address": "Münchener Straße 42, 83022 Rosenheim", "coordinates": {"lat": 47.8574, "lng": 12.1281}, "meaning": "Walters Lehrwerkstatt 1961-1964, Ort seiner handwerklichen Ausbildung"}',
    NOW() - INTERVAL '24 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'places', v_user_id,
    'Das Hofbräuzelt auf dem Oktoberfest',
    'Tisch 14, Reihe 6, linkes Seitenschiff - das war unser Stammplatz seit den 1980er Jahren. Der Kellner Fritz kannte uns alle beim Namen. Er ist 2015 in Rente gegangen. Seitdem ist es schwieriger geworden den gleichen Tisch zu bekommen, aber wir versuchen es jedes Jahr.',
    'de', '{"address": "Theresienwiese, 80339 München", "coordinates": {"lat": 48.1319, "lng": 11.5494}, "meaning": "Familien-Stammplatz beim Oktoberfest seit 1952"}',
    NOW() - INTERVAL '20 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, on_behalf_of, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'places', v_user_id, vm_thomas,
    'Der Yachthafen in Hamburg-Blankenese',
    'Thomas hatte sein Segelboot "Helga II" (nach seiner Mutter benannt) 30 Jahre hier liegen. Wir haben das Boot einmal besucht und sind bis nach Helgoland gesegelt. Der Hafen riecht nach Salz, Teer und Freiheit.',
    'de', '{"address": "Strandweg 120, 22587 Hamburg-Blankenese", "coordinates": {"lat": 53.5630, "lng": 9.8196}, "meaning": "Heimathafen von Thomas Boot Helga II, 1983-2013"}',
    NOW() - INTERVAL '17 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'places', v_user_id,
    'Die Grundschule in München-Schwabing',
    'Schwabing-Grundschule, Belgradstraße. Hier gingen Erwin und Sabine zur Schule. Heute gehen Lukas und Anna in dieselbe Schule - drei Generationen an derselben Schule. Der Schulhof hat sich kaum verändert.',
    'de', '{"address": "Belgradstraße 24, 80796 München", "coordinates": {"lat": 48.1617, "lng": 11.5717}, "meaning": "Familientradition: drei Generationen an derselben Schule"}',
    NOW() - INTERVAL '13 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'places', v_user_id,
    'Breslau - die Herkunftsstadt',
    'Heute heißt die Stadt Wrocław und liegt in Polen. Hier lebte die Familie Test bis 1945. Helga ist dort aufgewachsen, hat dort geheiratet, dort ihre ersten Kinder bekommen. 1998 besuchten Maria und ich die Stadt das erste Mal. Das alte Haus existiert noch - eine fremde Familie wohnt darin.',
    'de', '{"address": "Wrocław, Polen", "coordinates": {"lat": 51.1079, "lng": 17.0385}, "meaning": "Herkunftsstadt der Familie vor der Flucht 1945, Wurzeln der Familie Test"}',
    NOW() - INTERVAL '10 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'places', v_user_id,
    'Das Strandbad Starnberger See',
    'Jeden Sommer seit wir Kinder waren. Strandbad Ambach, Starnberger See. Der Geruch von Sonnencreme, Bratwurst und Seewasser. Wir fuhren mit dem alten VW-Bus der Familie. Walter zahlte immer für alle, auch wenn das Geld knapp war.',
    'de', '{"address": "Strandbad Ambach, 82541 Münsing", "coordinates": {"lat": 47.9282, "lng": 11.3815}, "meaning": "Familienausflugsziel seit den 1970er Jahren, Sommertraditionen"}',
    NOW() - INTERVAL '7 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'places', v_user_id,
    'Marias Küche',
    'Die eigentliche Herzkammer der Familie. Keine besondere Adresse - Leopoldstraße 87, München, 3. Stock links. Aber in dieser Küche wurden alle wichtigen Familienentscheidungen getroffen. Über Tassen Kaffee und Kuchenstücken. Manche sagen die Küche riecht noch nach Zimt.',
    'de', '{"address": "Leopoldstraße 87, 80802 München", "coordinates": {"lat": 48.1573, "lng": 11.5812}, "meaning": "Das Familienzentrum - Marias Küche als emotionaler Mittelpunkt der Familie"}',
    NOW() - INTERVAL '4 days');

  -- ==========================================================================
  -- EINTRÄGE: FOTOS (8) - mit echten Unsplash-Bild-URLs
  -- ==========================================================================
  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'photos', v_user_id,
    'Familientreffen Oktoberfest 1978',
    'Das älteste Foto das wir vom Familientreffen auf dem Oktoberfest haben. Von links: Helga, Walter, Maria, Thomas mit Petra. Das Bild wurde von einem Fotografen am Eingang des Hofbräuzelts gemacht.',
    'de', '{"description": "Schwarz-Weiß Aufnahme vom Oktoberfest 1978, alle in Tracht", "year": "1978", "media_url": "https://images.unsplash.com/photo-1504450874802-0ba2bcd9b5ae?w=800&h=600&fit=crop"}',
    NOW() - INTERVAL '29 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'photos', v_user_id,
    'Das Haus in Garmisch im Winter',
    'Ein Winterfoto des alten Hauses in Garmisch aus den 1960er Jahren. Der Garten liegt unter Schnee, die Zugspitze ist im Hintergrund zu sehen. Walter hat das Foto von der Straße aus gemacht.',
    'de', '{"description": "Verschneites Berghaus in Bayern, 1960er Jahre", "year": "1964", "media_url": "https://images.unsplash.com/photo-1491555103944-7c647fd857e6?w=800&h=600&fit=crop"}',
    NOW() - INTERVAL '26 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'photos', v_user_id,
    'Hochzeitsfoto Maria und Walter 1971',
    'Die Hochzeit von Maria und Walter am 14. August 1971 in der Peterskirche München. Maria trug ein selbstgenähtes Kleid. Die Feier dauerte bis 4 Uhr morgens.',
    'de', '{"description": "Hochzeitsportrait von Maria und Walter vor der Kirche", "year": "1971", "media_url": "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop"}',
    NOW() - INTERVAL '23 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'photos', v_user_id,
    'Thomas Boot Helga II im Hafen',
    'Die Helga II im Yachthafen Hamburg-Blankenese, Sommer 1985. Thomas kurz vor der Atlantiküberquerung. Das Boot war damals frisch gestrichen - weiß mit blauem Streifen.',
    'de', '{"description": "Segelboot im Hafen, Sommer 1985, Hamburg", "year": "1985", "media_url": "https://images.unsplash.com/photo-1500514966906-fe245eea9344?w=800&h=600&fit=crop"}',
    NOW() - INTERVAL '20 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'photos', v_user_id,
    'Erwin und Sabine als Kinder am Starnberger See',
    'Sommer 1987 am Strandbad Ambach. Erwin (9) und Sabine (7) im Wasser. Walter fotografierte von der Liegewiese aus. Das war das letzte Foto das er mit seiner alten Konica machte.',
    'de', '{"description": "Zwei Kinder spielen im See, Sommer am Starnberger See 1987", "year": "1987", "media_url": "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&h=600&fit=crop"}',
    NOW() - INTERVAL '16 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'photos', v_user_id,
    'Das Familienweihnachtsfoto 2000',
    'Jahrtausendwende-Weihnachten bei Maria. Alle 9 Familienmitglieder auf einem Bild. Lukas war noch nicht geboren. Sabine ist hochschwanger. Maria hat dieses Foto auf allen Wänden.',
    'de', '{"description": "Große Familiengruppe vor dem Weihnachtsbaum, Jahr 2000", "year": "2000", "media_url": "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&h=600&fit=crop"}',
    NOW() - INTERVAL '12 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, on_behalf_of, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'photos', v_user_id, vm_sabine,
    'Lukas erstes Tor beim TSV 1860',
    'September 2012, Sportanlage Schwabing. Lukas (7) feiert sein erstes offizielles Tor mit dem Salto-Versuch. Sabine hat dieses Foto im Halbdunkel mit dem Handy gemacht - es ist verschwommen aber unbezahlbar.',
    'de', '{"description": "Kleiner Junge in Fußballtrikot jubelt auf dem Spielfeld", "year": "2012", "media_url": "https://images.unsplash.com/photo-1486286701208-1d58e9338013?w=800&h=600&fit=crop"}',
    NOW() - INTERVAL '8 days');

  INSERT INTO public.entries (vault_id, category_slug, author_id, on_behalf_of, title, body, lang, metadata, created_at)
  VALUES (v_vault_id, 'photos', v_user_id, vm_anna,
    'Annas Gemälde vom Haus in Garmisch',
    'Das Ölgemälde das Anna 2023 für die Schulausstellung malte. Basierend auf alten Familienfotos. Das Bild hängt heute bei Maria im Wohnzimmer. Anna hat als einzige das Haus nie selbst gesehen - aber so gemalt als wäre sie dabei gewesen.',
    'de', '{"description": "Ölgemälde eines bayerischen Berghauses im Schnee, gemalt von Anna Test 2023", "year": "2023", "media_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"}',
    NOW() - INTERVAL '2 days');

  RAISE NOTICE 'Testdaten erfolgreich angelegt! Vault-ID: %', v_vault_id;
END;
$$;
