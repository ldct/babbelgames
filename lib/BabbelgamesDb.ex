defmodule BabbelgamesDb do
	def initDb() do
		# Postgrex.query!(pid, """
		# 	DROP TABLE IF EXISTS users;
		# """, [])
		# Postgrex.query!(pid, """
		# 	DROP TABLE IF EXISTS sessions;
		# """, [])
		# Postgrex.query!(pid, """
		# 	DROP TABLE IF EXISTS correct_pairs;
		# """, [])
		DbWrapper.query!("""
			CREATE OR REPLACE FUNCTION uniq (ANYARRAY) RETURNS ANYARRAY
			LANGUAGE SQL
			AS $body$
			  SELECT ARRAY(
			    SELECT DISTINCT $1[s.i]
			    FROM generate_series(array_lower($1,1), array_upper($1,1)) AS s(i)
			    ORDER BY 1
			  );
			$body$;
		""", [])
		DbWrapper.query!("""
			CREATE TABLE IF NOT EXISTS users (
				uid TEXT,
				user_email TEXT,
				constraint pk_users primary key (user_email)
			)
		""", [])
		DbWrapper.query!("""
			CREATE TABLE IF NOT EXISTS sessions (
				secret TEXT,
				user_email TEXT,
				constraint pk_sessions primary key (user_email)
			)
		""", [])
		DbWrapper.query!("""
			CREATE TABLE IF NOT EXISTS correct_pairs (
				user_email TEXT,
				episode_md5 TEXT,
				pairs TEXT[],
				constraint uc_correct_pairs unique (user_email, episode_md5)
			)
		""", [])
		DbWrapper.query!("""
			CREATE TABLE IF NOT EXISTS episode_pairs (
				uid TEXT,
				user_email TEXT,
				series_name TEXT,
				episode_seqnumber TEXT,
				episode_title TEXT,
				episode_poster_filename TEXT,
				l1_code TEXT,
				l2_code TEXT,
				l1_screenplay_filename TEXT,
				l1_srt_filename TEXT,
				l2_srt_filename TEXT,
				constraint pk_episode_pairs primary key (uid)
			)
		""", [])
		DbWrapper.query!("""
			CREATE TABLE IF NOT EXISTS defined_words (
				l2_word TEXT,
				l2_code TEXT,
				english_translated_word TEXT,
				constraint uc_defined_words unique (l2_word, l2_code)
			)
		""", [])
		DbSeedData.initSeedData()
	end

	def defineWord(l2_word, l2_code) do
		%Postgrex.Result{
			num_rows: num_rows,
			rows: rows
		} = DbWrapper.query!("""
			SELECT english_translated_word FROM defined_words WHERE l2_word = $1 AND l2_code = $2
		""", [l2_word, l2_code])

		case rows do
		   [] -> nil
		   [[english_translated_word]] -> english_translated_word
		end
	end

	def addDefinedWord(l2_word, l2_code, english_translated_word) do
		DbWrapper.query!("""
			INSERT INTO defined_words (l2_word, l2_code, english_translated_word)
			VALUES ($1, $2, $3)
		""", [l2_word, l2_code, english_translated_word])
		english_translated_word
	end

	def insertEpisodePair(sessionToken, series_name, episode_seqnumber, episode_title, episode_poster_filename, l1_code, l2_code, l1_screenplay_filename, l1_srt_filename, l2_srt_filename) do
		%Postgrex.Result{
			num_rows: num_rows,
			rows: rows
		} = DbWrapper.query!("""
			SELECT user_email FROM sessions WHERE secret = $1
		""", [sessionToken])

		if num_rows == 1 do
			[[user_email]] = rows

			uid = UUID.uuid4()
			DbWrapper.query!("""
				INSERT INTO episode_pairs (uid, user_email, series_name, episode_seqnumber, episode_title, episode_poster_filename, l1_code, l2_code, l1_screenplay_filename, l1_srt_filename, l2_srt_filename)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
			""", [
				uid,
				user_email,
				series_name,
				episode_seqnumber,
				episode_title,
				episode_poster_filename,
				l1_code,
				l2_code,
				l1_screenplay_filename,
				l1_srt_filename,
				l2_srt_filename
			])

			{:ok, uid}
		end
	end

	def addSession(user_email, secret) do
		DbWrapper.query!("""
			INSERT INTO SESSIONS (user_email, secret) VALUES ($1, $2)
			ON CONFLICT ON CONSTRAINT pk_sessions DO UPDATE SET secret=$2
		""", [user_email, secret])
	end

	def addUser(email) do
		uid = UUID.uuid4()
		DbWrapper.query!("""
			INSERT INTO users (uid, user_email) VALUES ($1, $2) ON CONFLICT DO NOTHING
		""", [uid, email])
	end

	def markCorrectPair(episodeMD5, sessionToken, lineNumber, tileIdx) do
		%Postgrex.Result{
			num_rows: num_rows,
			rows: rows
		} = DbWrapper.query!("""
			SELECT user_email FROM sessions WHERE secret = $1
		""", [sessionToken])

		if num_rows == 1 do
			[[user_email]] = rows
			IO.inspect(user_email)

			pair = Integer.to_string(lineNumber) <> "-" <> Integer.to_string(tileIdx)

			DbWrapper.query!("""
				INSERT INTO correct_pairs (user_email, episode_md5, pairs) VALUES ($1, $2, $3)
				ON CONFLICT (user_email, episode_md5) DO UPDATE
				SET pairs = uniq(correct_pairs.pairs || $3)
			""", [user_email, episodeMD5, [pair]])
		end
	end

	def getAllEpisodePairs() do
		x = DbWrapper.query!("""
			SELECT * FROM episode_pairs
		""", [])

		%Postgrex.Result{
			columns: columns,
			num_rows: num_rows,
			rows: rows
		} = x

		rows |> Enum.map(fn row ->
			Enum.zip(columns, row)
			|> Enum.into(%{})
		end)
	end

	def getEpisodePairDataOf(uid) do
		x = DbWrapper.query!("""
			SELECT * FROM episode_pairs WHERE uid = $1
		""", [uid])

		%Postgrex.Result{
			columns: columns,
			num_rows: num_rows,
			rows: rows
		} = x

		rows = rows |> Enum.map(fn row ->
			Enum.zip(columns, row)
			|> Enum.into(%{})
		end)

		case rows do
			[row] -> {:ok, row}
			_ -> {:not_found}
		end
	end

	def getCorrectPairs(episodeMD5, sessionToken) do
		%Postgrex.Result{
			num_rows: num_rows,
			rows: rows
		} = DbWrapper.query!("""
			SELECT user_email FROM sessions WHERE secret = $1
		""", [sessionToken])

		case rows do
			[] -> [] # todo: 403
			[[user_email]] ->
				%Postgrex.Result{
					rows: rows
				} = DbWrapper.query!("""
					SELECT pairs FROM correct_pairs WHERE user_email = $1 AND episode_md5 = $2
				""", [user_email, episodeMD5])

				case rows do
					[] -> []
					[[correctPairs]] -> correctPairs
				end
		end

	end

end