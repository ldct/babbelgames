defmodule DbSeedData do
	def initSeedData() do
		{:ok, pid} = Postgrex.start_link(hostname: "localhost", username: "postgres", database: "babbelgames")

		Postgrex.query!(pid, """
			INSERT INTO
				episode_pairs (uid, user_email, series_name, episode_seqnumber, episode_title, episode_poster_filename, l1_code, l2_code, l1_screenplay_filename, l1_srt_filename, l2_srt_filename)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
			ON CONFLICT (uid) DO NOTHING
		""", [
			"e1f985b1-f137-4d07-adc9-a014266981f3",
			"xuanji@gmail.com",
			"Friends",
			"s01e01",
			"The One Where Monica Gets a Roommate",
			"friends-s01e01.jpg",
			"en",
			"fr",
			"friends-s01e01.txt",
			"en-friends-s01e01.srt",
			"fr-friends-s01e01.srt"
		])

		Postgrex.query!(pid, """
			INSERT INTO
				episode_pairs (uid, user_email, series_name, episode_seqnumber, episode_title, episode_poster_filename, l1_code, l2_code, l1_screenplay_filename, l1_srt_filename, l2_srt_filename)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
			ON CONFLICT (uid) DO NOTHING
		""", [
			"db461b27-4c7e-45ae-9d75-9a79ad5a7974",
			"xuanji@gmail.com",
			"Friends",
			"s01e02",
			"The One With the Sonogram at the End",
			"friends-s01e02.jpg",
			"en",
			"fr",
			"friends-s01e02.txt",
			"en-friends-s01e02.srt",
			"fr-friends-s01e02.srt"
		])

		Postgrex.query!(pid, """
			INSERT INTO
				episode_pairs (uid, user_email, series_name, episode_seqnumber, episode_title, episode_poster_filename, l1_code, l2_code, l1_screenplay_filename, l1_srt_filename, l2_srt_filename)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
			ON CONFLICT (uid) DO NOTHING
		""", [
			"0df5e4a8-06b2-44ba-a614-42014856d98e",
			"xuanji@gmail.com",
			"Friends",
			"s01e03",
			"The One With the Thumb",
			"friends-s01e03.jpg",
			"en",
			"fr",
			"friends-s01e03.txt",
			"en-friends-s01e03.srt",
			"fr-friends-s01e03.srt"
		])

		Postgrex.query!(pid, """
			INSERT INTO
				episode_pairs (uid, user_email, series_name, episode_seqnumber, episode_title, episode_poster_filename, l1_code, l2_code, l1_screenplay_filename, l1_srt_filename, l2_srt_filename)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
			ON CONFLICT (uid) DO NOTHING
		""", [
			"e83c315c-f774-4b04-86f5-fad158b3e89a",
			"xuanji@gmail.com",
			"Sherlock",
			"s01e01",
			"A Study in Pink",
			"sherlock-s01e01.jpg",
			"en",
			"fr",
			"sherlock-s01e01.txt",
			"en-sherlock-s01e01.srt",
			"fr-sherlock-s01e01.srt"
		])

		Postgrex.query!(pid, """
			INSERT INTO
				episode_pairs (uid, user_email, series_name, episode_seqnumber, episode_title, episode_poster_filename, l1_code, l2_code, l1_screenplay_filename, l1_srt_filename, l2_srt_filename)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
			ON CONFLICT (uid) DO NOTHING
		""", [
			"80e75429-977e-420e-99d4-d97ae2617842",
			"xuanji@gmail.com",
			"Sherlock",
			"s01e02",
			"The Blind Banker",
			"sherlock-s01e02.jpg",
			"en",
			"fr",
			"sherlock-s01e02.txt",
			"en-sherlock-s01e02.srt",
			"fr-sherlock-s01e02.srt"
		])

		Postgrex.query!(pid, """
			INSERT INTO
				episode_pairs (uid, user_email, series_name, episode_seqnumber, episode_title, episode_poster_filename, l1_code, l2_code, l1_screenplay_filename, l1_srt_filename, l2_srt_filename)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
			ON CONFLICT (uid) DO NOTHING
		""", [
			"48f85024-161f-4475-955f-78c5a4e294cd",
			"xuanji@gmail.com",
			"Game of Thrones",
			"s01e01",
			"Winter is Coming",
			"got-s01e01.jpg",
			"en",
			"pt-br",
			"got-s01e01.txt",
			"en-got-s01e01.srt",
			"ptbr-got-s01e01.srt"
		])

		#
		#
		# b5a2e223-91bc-431d-86fe-f323809100ed
		# 0c7a9189-2811-4e96-ad43-5d90dbe84b38
		# 138e0269-a7d0-42ad-9919-695b12cc5e40
		# c500abf4-983c-4a44-b686-a2d1c6f2d238
	end
end