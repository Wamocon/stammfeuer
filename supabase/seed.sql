-- =============================================================================
-- seed.sql - Stammfeuer Seed Data
-- Prompt library: 36 questions across 6 categories and life phases
-- =============================================================================

insert into public.prompt_library (category_slug, life_phase, text_de, text_en) values

-- STORIES - childhood
('stories', 'childhood', 'Was ist deine früheste Kindheitserinnerung? Erzähle, wie alt du warst und was du damals gefühlt hast.', 'What is your earliest childhood memory? Tell us how old you were and what you felt at the time.'),
('stories', 'childhood', 'Welches Spiel hast du als Kind am liebsten gespielt, und mit wem?', 'What was your favourite game as a child, and who did you play it with?'),
('stories', 'childhood', 'Wie sah ein typischer Sommertag in deiner Kindheit aus?', 'What did a typical summer day look like during your childhood?'),

-- STORIES - youth
('stories', 'youth', 'Was war dein größter Traum als Teenager, und wie hat sich dieser verändert?', 'What was your biggest dream as a teenager, and how did it change over time?'),
('stories', 'youth', 'Welches Erlebnis in deiner Jugend hat dich am stärksten geprägt?', 'Which experience in your youth shaped you the most?'),
('stories', 'youth', 'Wie hast du deinen ersten Job bekommen, und was hast du dabei gelernt?', 'How did you get your first job, and what did you learn from it?'),

-- STORIES - adulthood
('stories', 'adulthood', 'Was war der schwierigste Moment in deinem Leben, und wie hast du ihn überwunden?', 'What was the hardest moment in your life, and how did you overcome it?'),
('stories', 'adulthood', 'Welche Entscheidung in deinem Leben bereust du am wenigsten, und warum?', 'Which decision in your life do you least regret, and why?'),

-- STORIES - senior
('stories', 'senior', 'Was möchtest du der nächsten Generation unbedingt weitergeben?', 'What is the one thing you most want to pass on to the next generation?'),
('stories', 'senior', 'Wenn du auf dein Leben zurückblickst - was hat dich am meisten überrascht?', 'Looking back on your life - what surprised you the most?'),

-- RECIPES
('recipes', 'any', 'Welches Gericht hat dich immer an Zuhause erinnert? Erzähle uns die Geschichte dahinter.', 'Which dish always reminded you of home? Tell us the story behind it.'),
('recipes', 'any', 'Gibt es ein Familienrezept, das schon von Generation zu Generation weitergegeben wird? Wie lautet es?', 'Is there a family recipe that has been passed down through generations? What is it?'),
('recipes', 'any', 'Was kochst du, wenn du jemanden wirklich verwöhnen möchtest? Was macht dieses Gericht besonders?', 'What do you cook when you want to really spoil someone? What makes this dish special?'),
('recipes', 'any', 'Welches Gericht verbindest du mit einem bestimmten Fest oder Anlass? Erzähle uns davon.', 'Which dish do you associate with a particular celebration or occasion? Tell us about it.'),
('recipes', 'childhood', 'Was hat deine Mutter oder Großmutter gekocht, das du immer noch vermisst?', 'What did your mother or grandmother cook that you still miss today?'),

-- TRADITIONS
('traditions', 'any', 'Welche Familientradition bedeutet dir am meisten, und wie ist sie entstanden?', 'Which family tradition means the most to you, and how did it begin?'),
('traditions', 'any', 'Gibt es eine Tradition in eurer Familie, die von außen vielleicht seltsam wirkt, aber für euch einen tiefen Sinn hat?', 'Is there a family tradition that might seem odd to outsiders but has deep meaning for your family?'),
('traditions', 'any', 'Welche Tradition möchtest du unbedingt an die nächste Generation weitergeben?', 'Which tradition do you most want to pass on to the next generation?'),
('traditions', 'any', 'Wie feiert eure Familie Weihnachten oder ein anderes wichtiges Fest? Was darf dabei auf keinen Fall fehlen?', 'How does your family celebrate Christmas or another important holiday? What must never be missing?'),
('traditions', 'any', 'Gibt es eine Tradition, die eure Familie von anderen Familien unterscheidet?', 'Is there a tradition that sets your family apart from others?'),

-- WISDOM
('wisdom', 'senior', 'Welchen Rat würdest du deinem jüngeren Ich geben?', 'What advice would you give to your younger self?'),
('wisdom', 'senior', 'Was ist der wichtigste Lebensratschlag, den du je erhalten hast, und von wem?', 'What is the most important life advice you have ever received, and from whom?'),
('wisdom', 'any', 'Was hast du in einer schwierigen Zeit gelernt, das dich bis heute trägt?', 'What did you learn during a difficult time that still carries you to this day?'),
('wisdom', 'any', 'Welche Überzeugung hat sich in deinem Leben als besonders wahr erwiesen?', 'Which belief has proven most true throughout your life?'),
('wisdom', 'senior', 'Was bedeutet dir Glück, und hat sich das im Laufe deines Lebens verändert?', 'What does happiness mean to you, and has that changed over the course of your life?'),
('wisdom', 'adulthood', 'Was hast du als Elternteil oder als Kind gelernt, das du nie vergessen wirst?', 'What have you learned as a parent or as a child that you will never forget?'),

-- PLACES
('places', 'any', 'Welcher Ort ist für eure Familie besonders bedeutsam? Was hat ihn so besonders gemacht?', 'Which place holds special meaning for your family? What made it so special?'),
('places', 'childhood', 'Wo bist du aufgewachsen? Wie sah dieser Ort damals aus, und was davon existiert heute noch?', 'Where did you grow up? What did that place look like back then, and what still exists today?'),
('places', 'any', 'Gibt es einen Ort, zu dem eure Familie immer wieder zurückkehrt? Was zieht euch dorthin?', 'Is there a place your family always returns to? What draws you there?'),
('places', 'any', 'Welcher Ort auf der Welt hat dich am meisten beeindruckt, und warum?', 'Which place in the world has impressed you the most, and why?'),

-- PHOTOS
('photos', 'any', 'Welches Foto in eurer Familie erzählt eine Geschichte, die die meisten nicht kennen? Teile es und erkläre den Kontext.', 'Which photo in your family tells a story that most people do not know? Share it and explain the context.'),
('photos', 'any', 'Gibt es ein altes Familienfoto, das du besonders schätzt? Wer ist darauf zu sehen und in welchem Moment?', 'Is there an old family photo you particularly treasure? Who is in it and what moment does it capture?'),
('photos', 'childhood', 'Teile ein Foto aus deiner Kindheit und erzähle, was gerade passiert ist - die Geschichte hinter dem Bild.', 'Share a photo from your childhood and tell us what was happening - the story behind the image.'),
('photos', 'any', 'Welches Bild würdest du als das Foto deiner Familie bezeichnen? Das eine Bild, das alles sagt.', 'Which image would you call the photo of your family? The one picture that says everything.');
